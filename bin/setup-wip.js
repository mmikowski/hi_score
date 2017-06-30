#!/usr/bin/node
/*
 * setup.js
 *
 * Use      : $ ./setup.js
 * Synopsis : Setup NodeJS script for hi_score
 * Provides : Copies, patches, and links files for development
 *   1. Delete all vendor directories as directed by
 *      package.json:xhiVendorAssetList
 *      We expect vendor assets directories in bin, css, font, img, and js
 *   2. Copy assets from node_modules to vendor directories with the
 *      npm version appended to the names.
 *   2. Install the commit hook if git is detected
 *   3. Applies any patches (uglifyjs)
 *
 * Planned:
 *   1. Use package.json for build process (buildify and superpack)
 *   2. Integrate more deeply to npm build process (avoid reinvention)
 *   3. Auto-update links files using version numbers.  This may be accomplished
 *      using xhi utils templates and read file techniques as shown below.
 *      This would be similar to using
 *       sed -e 's/"<old_vrs_path>"/"<new_vrs_path>"/ index.html'
 *
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*global Promise */
/*jslint         node   : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true, todo    : true, unparam  : true
*/

// == BEGIN SCRIPT setup.js ==============================================
  // == BEGIN MODULE SCOPE VARIABLES =====================================
  'use strict';
  var
    // Import capabilities
    EventEmitter = require( 'events'   ).EventEmitter,
    fsObj        = require( 'fs'       ),
    mkdirpFn     = require( 'mkdirp'   ),
    ncpFn        = require( 'ncp'      ).ncp,
    pathObj      = require( 'path'     ),
    utilObj      = require( 'util'     ),
    whichFn      = require( 'which'    ),

    promiseObj   = Promise,

    // Convert to promises using magic
    promisifyFn      = utilObj.promisify,
    makeWhichProm    = promisifyFn( whichFn ),
    eventObj         = new EventEmitter(),

    // Assign nodejs builtins
    fqAppFilename = __filename,
    fqBinDirStr   = __dirname,

    appName       = pathObj.basename( fqAppFilename, '.js' ),
    fqOrigDirStr  = process.cwd,
    versList      = process.versions.node.split('.'),

    // Initialize
    versReqInt  = 8,
    exePathMap  = {},
    // patchStr = '// BEGIN hi_score patch line 324',

    // Declare
    fqAppDirStr,     fqModuleDirStr,
    fqNpmDirStr,     fqPatchFilename, fqPkgFileStr,
    fqScopeFileStr,  fqUglyDirStr,    pkgMap
    // gitDir, versionStr
    ;

  // == . END MODULE SCOPE VARIABLES =====================================

  // == BEGIN UTILITY METHODS ============================================
  // BEGIN utility /abortFn/
  function abortFn ( error_data ) {
    console.warn( error_data );
    process.exit( 1 );
  }
  // . END utility /abortFn/

  // BEGIN utility /logFn/
  function logFn() {
    var arg_list = Array.from( arguments );
    arg_list.unshift( '>>' );
    console.log.apply( null, arg_list );
  }
  // . END utility /logFn/

  function makeRejectFuncFn ( reject_fn ) {
    return function ( error_data ) { reject_fn( error_data ); };
  }
  function makeResolveFuncFn ( resolve_fn ) {
    return function () { resolve_fn(); };
  }
  // BEGIN utility /makeEmitFuncFn/
  function makeEmitFuncFn ( event_str ) {
    return function () { eventObj.emit( event_str ); };
  }
  // . END utility /makeEmitFuncFn/

  // BEGIN utility /copyPathFn/
  function copyPathFn( fq_src_path_str, fq_dest_path_str, do_dir_copy ) {
    if ( do_dir_copy ) {
      return new Promise( function ( resolve_fn, reject_fn ) {
        ncpFn( fq_src_path_str, fq_dest_path_str,
          function ( error_data ) {
            if ( error_data ) { return reject_fn(); }
            resolve_fn();
          }
        );
      });
    }

    return new Promise( function ( resolve_fn, reject_fn ) {
      var
        read_obj         = fsObj.createReadStream(  fq_src_path_str  ),
        write_obj        = fsObj.createWriteStream( fq_dest_path_str ),
        full_reject_fn  = makeRejectFuncFn(  reject_fn  ),
        full_resolve_fn = makeResolveFuncFn( resolve_fn )
        ;

      read_obj.on(  'error', full_reject_fn  );
      write_obj.on( 'error', full_reject_fn  );
      write_obj.on( 'close', full_resolve_fn );
      read_obj.pipe( write_obj );
    });
  }
  // . END utility /copyPathFn/

  // BEGIN utility /storePathFn/
  function storePathFn ( path_str ) {
    var
      smap    = this || {},
      exe_key = smap._exe_key_;

    if ( ! exe_key ) {
      abortFn( 'No key provided for ' + path_str );
    }
    exePathMap[ exe_key ] = path_str;
  }
  // . END utility /storePathFn/

  // BEGIN utility /initModuleVarsFn/
  function initModuleVarsFn () {
    var
      exe_list     = [ 'git', 'patch' ],
      exe_count    = exe_list.length,
      promise_list = [],
      idx, exe_key, bound_fn, promise_obj;

    // Bail if node version < versReqInt
    if ( Number( versList[0] ) < versReqInt ) {
      logFn( 'As of hi_score 1.2+ NodeJS v'
        + versReqInt + ' is required.'
      );
      logFn( 'NodeJS Version ' + versList.join('.') + ' is installed.' );
      logFn( 'Please upgrade NodeJS and try again.'                    );
      process.exit( 1 );
    }

    // Assign npm module vars
    fqNpmDirStr     = pathObj.dirname( fqBinDirStr );

    fqAppDirStr     = fqNpmDirStr;
    fqModuleDirStr  = fqNpmDirStr    + '/node_modules';
    fqPkgFileStr    = fqNpmDirStr    + '/package.json';
    fqPatchFilename = fqNpmDirStr    + '/patch/uglify-js-3.0.21.patch';

    fqUglyDirStr    = fqModuleDirStr + '/uglifyjs';
    fqScopeFileStr  = fqUglyDirStr   + '/lib/scope.js';

    // Assign executable path vars
    for ( idx = 0; idx < exe_count; idx++ ) {
      exe_key = exe_list[ idx ];
      bound_fn = storePathFn.bind( { _exe_key_ : exe_key });
      promise_obj = makeWhichProm( exe_key );
      promise_obj.then( bound_fn ).catch( abortFn );
      promise_list.push( promise_obj );
    }

    promiseObj.all( promise_list )
      .then( function () { eventObj.emit( '01ReadPkgFile' ); } )
      .catch( abortFn );
  }
  // . END utility /initModuleVarsFn/

  // BEGIN utility /storePkgMapFn/
  function storePkgMapFn ( error_obj, json_str ) {
    if ( error_obj ) { return abortFn( error_obj ); }
    pkgMap = JSON.parse( json_str );
    eventObj.emit( '02DeployAssets' );
  }
  // . END utility /storePkgMapFn/

  // BEGIN utility /readPkgFileFn/
  function readPkgFileFn () {
    fsObj.readFile( fqPkgFileStr, 'utf8', storePkgMapFn, abortFn );
  }
  // END utility /readPkgFileFn/

  // BEGIN utility /deployAssetsFn/
  function deployAssetsFn () {
    var
      asset_group_table = pkgMap.xhiVendorAssetGroupTable || [],
      asset_group_count = asset_group_table.length,
      promise_list      = [],

      idx, asset_group_map, asset_list, asset_count,
      fq_dest_dir_str, dest_ext_str, do_dir_copy,

      idj, asset_map, src_asset_name, src_dir_str,
      src_pkg_name, dest_vers_str, dest_name,
      fq_src_path_list, fq_src_path_str,
      fq_dest_path_str, promise_obj
      ;

    for ( idx = 0; idx < asset_group_count; idx++ ) {
      asset_group_map = asset_group_table[ idx ];

      asset_list  = asset_group_map.asset_list || [];
      asset_count = asset_list.length;


      dest_ext_str     = asset_group_map.dest_ext_str;
      do_dir_copy      = asset_group_map.do_dir_copy;
      fq_dest_dir_str  = fqAppDirStr + '/' + asset_group_map.dest_dir_str;
      mkdirpFn.sync( fq_dest_dir_str );

      ASSET_MAP: for ( idj = 0; idj < asset_count; idj++ ) {
        asset_map = asset_list[ idj ];
        src_asset_name = asset_map.src_asset_name;
        src_dir_str    = asset_map.src_dir_str || '';
        src_pkg_name   = asset_map.src_pkg_name;
        dest_vers_str  = pkgMap.devDependencies[ src_pkg_name ];

        if ( ! dest_vers_str ) {
          logFn( 'WARN: package ' + src_pkg_name + ' not found.');
          continue ASSET_MAP;
        }
        dest_name = asset_map.dest_name || src_pkg_name;

        fq_dest_path_str = fq_dest_dir_str
          + '/' + dest_name + '-' + dest_vers_str;
        fq_src_path_list = [ fqModuleDirStr, src_pkg_name, src_asset_name ];
        if ( src_dir_str ) { fq_src_path_list.splice( 2, 0, src_dir_str ); }

        fq_src_path_str = fq_src_path_list.join( '/' );

        if ( ! do_dir_copy ) {
          fq_dest_path_str += '.' + dest_ext_str;
        }
        promise_obj = copyPathFn( fq_src_path_str, fq_dest_path_str, do_dir_copy );
        promise_list.push( promise_obj );
      }
    }

    promiseObj.all( promise_list )
      .then( function () { eventObj.emit( '03ApplyPatches' ); } )
      .catch( abortFn );
  }
  // . END utility /deployAssetsFn/
  // == END UTILITY METHODS ============================================

  // == BEGIN EVENT HANDLERS ===========================================
  function on00InitVarsFn () {
    logFn( 'Initializing variable' );
    initModuleVarsFn();
  }
  function on01ReadPkgFileFn () {
    logFn( 'Reading package file' );
    readPkgFileFn();
  }
  function on02DeployAssetsFn () {
    logFn( 'Deploying assets' );
    deployAssetsFn();
  }
  function on03ApplyPatchesFn () {
    logFn( 'Applying patches' );
    eventObj.emit( '04AddCommitHook' );
  }
  function on04AddCommitHookFn () {
    logFn( 'Add commit hook' );
    process.exit( 0 );
  }
  // == . END EVENT HANDLERS ===========================================

  // == BEGIN Main =====================================================
  function mainFn () {
    // Layout flow control
    eventObj.on( '00InitVars',       on00InitVarsFn      );
    eventObj.on( '01ReadPkgFile',    on01ReadPkgFileFn   );
    eventObj.on( '02DeployAssets',   on02DeployAssetsFn  );
    eventObj.on( '03ApplyPatches',   on03ApplyPatchesFn  );
    eventObj.on( '04AddCommitHook',  on04AddCommitHookFn );

    // Start execution
    eventObj.emit( '00InitVars' );
  }
  // == . END Main =======================================================

  mainFn();
