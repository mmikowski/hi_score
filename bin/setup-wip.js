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
    pathObj      = require( 'path'     ),
    utilObj      = require( 'util'     ),
    whichFn      = require( 'which'    ),
    promiseObj   = Promise,

    // Convert to promises using magic
    promisifyFn      = utilObj.promisify,
    makeWhichProm    = promisifyFn( whichFn ),
    eventObj         = new EventEmitter(),

    // Assign nodejs builtins
    appLink    = __filename,
    appName    = pathObj.basename( appLink, '.js' ),
    binDir     = __dirname,
    origDir    = process.cwd,

    // Initialize
    exePathMap = {},
    // patchStr    = '// BEGIN hi_scope patch line 249',

    // Declare
    appFqDir,
    pkgMap,     moduleFqDir,
    npmDir,     patchFile, pkgFile,
    scopeFile,  uglyDir
    // gitDir, versionStr
    ;

  // == . END MODULE SCOPE VARIABLES =====================================

  // == BEGIN UTILITY METHODS ============================================
  // BEGIN utility /makeEmitFunctionFn/
  function makeEmitFunctionFn ( event_str ) {
    return function () { eventObj.emit( event_str ); };
  }
  // . END utility /makeEmitFunctionFn/

  // BEGIN utility /storePathFn/
  function storePathFn ( path_str ) {
    var
      smap    = this || {},
      exe_key = smap._exe_key_;

    exePathMap[ exe_key ] = path_str;
  }
  // . END utility /storePathFn/

  // BEGIN utility /abortFn/
  function abortFn ( error_data ) {
    console.warn( error_data );
    process.exit( 1 );
  }
  // . END utility /abortFn/

  // BEGIN utility /initModuleVarsFn/
  function initModuleVarsFn () {
    var
      exe_list     = [ 'git', 'patch' ],
      exe_count    = exe_list.length,
      promise_list = [],
      idx, exe_key, bound_fn, promise_obj;

    // Assign npm module vars
    npmDir      = pathObj.dirname( binDir );

    appFqDir    = npmDir;
    moduleFqDir = npmDir      + '/node_modules';
    pkgFile     = npmDir      + '/package.json';
    uglyDir     = moduleFqDir + '/uglifyjs';
    scopeFile   = uglyDir     + '/lib/scope.js';
    patchFile   = npmDir      + '/patch/uglifyjs-2.4.10.patch';

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
    fsObj.readFile( pkgFile, 'utf8', storePkgMapFn, abortFn );
  }
  // END utility /readPkgFileFn/

  // == END UTILITY METHODS ============================================

  // == BEGIN EVENT HANDLERS ===========================================
  function on00InitVarsFn () {
    console.log( '>> Initializing variable' );
    initModuleVarsFn();
  }
  function on01ReadPkgFileFn () {
    console.log( '>> Reading package file' );
    readPkgFileFn();
  }
  function on02DeployAssetsFn () {
    console.log( '>> Deploying assets' );
    console.log( '>> See xhiVendorAssetList' );
    eventObj.emit( '03ApplyPatches' );
  }
  function on03ApplyPatchesFn () {
    console.log( '>> Applying patches' );
    eventObj.emit( '04AddCommitHook' );
  }
  function on04AddCommitHookFn () {
    console.log( '>> Add commit hook' );
    console.log( pkgMap );
    process.exit( 0 );
  }
  // == . END EVENT HANDLERS ===========================================

  // == BEGIN Main =====================================================
  function mainFn () {
    console.log( 'Welcome to ' + appName + '!' );

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
