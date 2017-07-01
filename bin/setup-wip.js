#!/usr/bin/node
/*
 * setup.js
 *
 * Use      : $ ./setup.js
 * Synopsis : Setup NodeJS script for hi_score
 * Provides : Copies, patches, and links files for development
 *   1. Delete all vendor directories as directed by
 *      package.json:xhiVendorAssetList. We expect vendor assets
 *      directories in bin, css, font, img, and js
 *   2. Copy assets from node_modules to vendor directories with the
 *      npm version appended to the names.
 *   3. Applies any patches (uglifyjs)
 *   4. Install the commit hook if git is detected
 *
 * Planned:
 *   0. List xhi dependency in core file.
 *      Load in browser use head.append( '<script src="...">'.
 *      Load in NodeJS use require( '...' );
 *   1. Use package.json for build process (buildify and superpack)
 *   2. Integrate more deeply to npm build process (avoid reinvention)
 *   3. Auto-update <script src="..."> links using xhi.util templates
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
    EventEmitter = require( 'events'        ).EventEmitter,
    LineReader   = require( 'line-by-line'  ),

    applyPatchFn = require( 'apply-patch'   ).applyPatch,

    execFn       = require( 'child_process' ).exec,
    fsObj        = require( 'fs'            ),
    mkdirpFn     = require( 'mkdirp'        ),
    ncpFn        = require( 'ncp'           ).ncp,
    pathObj      = require( 'path'          ),
    utilObj      = require( 'util'          ),
    whichFn      = require( 'which'         ),
    promiseObj   = Promise,

    // Convert to promises using magic
    promisifyFn      = utilObj.promisify,
    makeWhichProm    = promisifyFn( whichFn ),
    eventObj         = new EventEmitter(),

    // Assign nodejs builtins
    fqAppFilename = __filename,
    fqBinDirStr   = __dirname,

    appName       = pathObj.basename( fqAppFilename, '.js' ),
    fqOrigDirStr  = process.cwd(),
    versList      = process.versions.node.split('.'),

    // Initialize
    exePathMap  = {},
    versReqInt  = 8,
    // patchStr = '// BEGIN hi_score patch line 324',

    // Declare
    fqHookFilename,  fqModuleDirStr,
    fqProjDirStr,    fqPatchFilename,
    fqPkgFileStr,    fqScopeFileStr,
    fqUglyDirStr,    pkgMatrix
    ;

  // == . END MODULE SCOPE VARIABLES =====================================

  // == BEGIN UTILITY METHODS ============================================
  // BEGIN utility /abortFn/
  function abortFn ( error_data ) {
    console.warn( 'error', error_data );
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

  // BEGIN utlity /grepFileFn/
  function grepFileFn ( filename, match_str ) {
    return new Promise( function ( resolve_fn ) {
      var
        is_matched    = false,
        line_read_obj = new LineReader( filename, {skipEmptyLines:true })
        ;

      line_read_obj.on( 'error', abortFn );
      line_read_obj.on( 'line',  function ( line_str ) {
        if ( line_str.indexOf( match_str ) > -1 ) {
          is_matched = true;
          line_read_obj.close();
        }
      });
      line_read_obj.on( 'end', function () {
        resolve_fn( is_matched );
      });
    });
  }
  // . END utility /grepFileFn/

  function makeRejectFuncFn ( reject_fn ) {
    return function ( error_data ) { reject_fn( error_data ); };
  }

  function makeResolveFuncFn ( resolve_fn ) {
    return function () { resolve_fn(); };
  }

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
      context_map = this,
      exe_key = context_map.exe_key;

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
    fqProjDirStr    = pathObj.dirname( fqBinDirStr );

    fqModuleDirStr  = fqProjDirStr   + '/node_modules';
    fqPkgFileStr    = fqProjDirStr   + '/package.json';
    fqPatchFilename = fqProjDirStr   + '/patch/uglify-js-3.0.21.patch';

    fqUglyDirStr    = fqModuleDirStr + '/uglifyjs';
    fqScopeFileStr  = fqUglyDirStr   + '/lib/scope.js';

    // Assign executable path vars
    for ( idx = 0; idx < exe_count; idx++ ) {
      exe_key = exe_list[ idx ];
      bound_fn = storePathFn.bind( { exe_key : exe_key });
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
    pkgMatrix = JSON.parse( json_str );
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
      asset_group_table  = pkgMatrix.xhiVendorAssetGroupTable || [],
      dev_dependency_map = pkgMatrix.devDependencies          || {},
      asset_group_count  = asset_group_table.length,
      promise_list       = [],

      idx, asset_group_map, asset_list, asset_count,
      fq_dest_dir_str, dest_ext_str, do_dir_copy,

      idj, asset_map, src_asset_name, src_dir_str,
      src_pkg_name, dest_vers_str, dest_name,
      fq_src_path_list, fq_src_path_str,
      fq_dest_path_str, promise_obj
      ;

    for ( idx = 0; idx < asset_group_count; idx++ ) {
      asset_group_map = asset_group_table[ idx ] || {};

      asset_list  = asset_group_map.asset_list   || [];
      asset_count = asset_list.length;

      dest_ext_str     = asset_group_map.dest_ext_str;
      do_dir_copy      = asset_group_map.do_dir_copy;
      fq_dest_dir_str  = fqProjDirStr + '/' + asset_group_map.dest_dir_str;
      mkdirpFn.sync( fq_dest_dir_str );

      ASSET_MAP: for ( idj = 0; idj < asset_count; idj++ ) {
        asset_map = asset_list[ idj ];
        src_asset_name = asset_map.src_asset_name;
        src_dir_str    = asset_map.src_dir_str || '';
        src_pkg_name   = asset_map.src_pkg_name;

        dest_vers_str  = dev_dependency_map[ src_pkg_name ];

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
      .then( function () { eventObj.emit( '03PatchFiles' ); } )
      .catch( abortFn );
  }
  // . END utility /deployAssetsFn/

  // BEGIN utility /patchIfNeededFn/
  function patchIfNeededFn ( is_check_found ) {
    var context_map = this;
    if ( is_check_found ) {
      logFn( 'Patch ' + context_map.relative_name + ' already applied.' );
    }
    else {
      applyPatchFn( context_map.relative_name );
      logFn( 'Applied patch ' + context_map.relative_name );
    }
  }
  // . END utility /patchIfNeededFn/

  // BEGIN utility /patchFilesFn/
  function patchFilesFn () {
    var
      patch_matrix     = pkgMatrix.xhiPatchMatrix || {},
      patch_dir_str    = patch_matrix.patch_dir_str,
      patch_map_list   = patch_matrix.patch_map_list,
      patch_map_count  = patch_map_list.length,
      promise_list     = [],
      idx, patch_map, promise_obj,
      check_filename, patch_filename,
      bound_fn
      ;
    process.chdir( fqProjDirStr );

    for ( idx = 0; idx < patch_map_count; idx++ ) {
      patch_map      = patch_map_list[ idx ];
      check_filename = patch_map.check_filename;
      patch_filename = patch_map.patch_filename;
      patch_map.relative_name = patch_dir_str + '/' + patch_filename;

      promise_obj    = grepFileFn( check_filename, patch_map.match_str );
      bound_fn       = patchIfNeededFn.bind( patch_map );
      promise_obj.then( bound_fn ).catch( abortFn );
      promise_list.push( promise_obj );
    }

    Promise.all( promise_list )
      .then( function () {
        process.chdir( fqOrigDirStr );
        eventObj.emit( '04UnlinkHook' );
      })
      .catch( abortFn );
  }
  // . END utility /patchFilesFn/

  // BEGIN utility /unlinkHookFn/
  function unlinkHookFn () {
    fqHookFilename = fqProjDirStr + '/.git/hooks/pre-commit';
    fsObj.unlink( fqHookFilename, function ( error_data ) {
      if ( error_data ) { abortFn( error_data ); }
      eventObj.emit( '05LinkHook' );
    });
  }
  // . END utility /unlinkHookFn/

  // BEGIN utility /linkHookFn/
  function linkHookFn () {
    process.chdir( fqProjDirStr );
    fsObj.symLink(
      '../../bin/git-hook_pre-commit',
      fqHookFilename,
      function ( error_data ) {
        if ( error_data ) { abortFn( error_data ); }
        process.chdir( fqOrigDirStr );
        eventObj.emit( '99FinishRun');
      }
    );
  }
  // . END utility /linkHookFn/
  // == END UTILITY METHODS ============================================

  // == BEGIN EVENT HANDLERS ===========================================
  function on00InitVarsFn () {
    logFn( appName, 'Started.' );
    logFn( 'Initializing variables...' );
    initModuleVarsFn();
  }
  function on01ReadPkgFileFn () {
    logFn( 'Reading package file...' );
    readPkgFileFn();
  }
  function on02DeployAssetsFn () {
    logFn( 'Deploying assets...' );
    deployAssetsFn();
  }
  function on03PatchFilesFn () {
    logFn( 'Applying patches...' );
    patchFilesFn();
  }
  function on04UnlinkHookFn () {
    logFn( 'Remove any old commit hook...' );
    unlinkHookFn();
  }
  function on05LinkHookFn () {
    logFn( 'Linking commit hook...' );
    linkHookFn();
  }
  function on99FinishRunFn () {
    logFn( appName, 'Finished.' );
    process.exit( 0 );
  }
  // == . END EVENT HANDLERS ===========================================

  // == BEGIN Main =====================================================
  function mainFn () {
    // Layout flow control
    eventObj.on( '00InitVars',       on00InitVarsFn      );
    eventObj.on( '01ReadPkgFile',    on01ReadPkgFileFn   );
    eventObj.on( '02DeployAssets',   on02DeployAssetsFn  );
    eventObj.on( '03PatchFiles',     on03PatchFilesFn    );
    eventObj.on( '04UnlinkHook',     on04UnlinkHookFn    );
    eventObj.on( '99FinishRun',      on99FinishRunFn     );

    // Start execution
    // Timeout prevents race condition
    setTimeout( function () { eventObj.emit( '00InitVars' ); }, 0 );
  }
  // == . END Main =======================================================

  mainFn();
