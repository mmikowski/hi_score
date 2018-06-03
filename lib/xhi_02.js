/*
 * lib/xhi_02.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
// == BEGIN PUBLIC METHOD /setupFn/ ===================================
// Purpose   : Setup project development environment using package.json
// Example   : xhi setup
// Returns   :
//   Runs ctx_obj.catchFn on failure.
//   Runs ctx_obj.nextFn  on success.
// Throws    : none
// Steps     :
//   1. Delete all vendor directories as directed by config.
//      directories in bin, css, font, img, and js
//   2. Copy assets from node_modules to vendor directories with the
//      npm version appended to the names.
//   3. Apply any patches in
//   4. Install the commit hook if git is detected
//
//
function setupFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,

    PromiseObj     = xhiObj.PromiseObj,
    catchFn        = xhiObj.catchFn,
    commandMap     = xhiObj.commandMap,
    fsObj          = xhiObj.fsObj,
    logFn          = xhiObj.logFn,
    nextFn         = xhiObj.nextFn,
    packageMatrix  = xhiObj.packageMatrix,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    promisifyFn    = xhiObj.promisifyFn,
    stageStatusMap = xhiObj.stageStatusMap,
    warnFn         = xhiObj.warnFn,

    setupMatrix    = packageMatrix.xhi_02_SetupMatrix,
    aliasStr       = commandMap.alias_str,

    postObj, shellJsObj, makeStatPromFn
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN UTILITY METHODS =========================================
  // BEGIN utility /failFn/
  // Purpose: Wrap catchFn to store failure and finish
  //
  function failFn () {
    stageStatusMap[ aliasStr ] = false;
    catchFn( arguments );
  }
  // . END utility /failFn/

  // BEGIN utility /successFn/
  // Purpose: Wrap nextFn to store success and finish
  function successFn () {
    stageStatusMap[ aliasStr ] = true;
    logFn( prefixStr + 'Success' );
    nextFn();
  }
  // . END utility /successFn/

  // BEGIN utility /_01_checkBinListFn/
  function _01_checkBinListFn () {
    var
      ctx_obj      = this,
      exe_list     = [ 'git', 'patch' ],
      exe_count    = exe_list.length,

      idx, bin_str
      ;

    // Assign executable path vars
    for ( idx = 0; idx < exe_count; idx++ ) {
      bin_str  = exe_list[ idx ];
      if ( ! shellJsObj.which( bin_str ) ) {
        return ctx_obj.catch_fn( '  Executable not found: ' + bin_str );
      }
    }
    ctx_obj.then_fn();
  }
  // . END utility /_01_checkBinListFn/

  // BEGIN utility /_02_rmVendorDirsFn/
  function _02_rmVendorDirsFn () {
    var
      ctx_obj            = this,
      asset_group_table  = setupMatrix.asset_group_table,
      asset_group_count  = asset_group_table.length,

      idx, asset_group_map, fq_dest_dirname
    ;

    for ( idx = 0; idx < asset_group_count; idx++ ) {
      asset_group_map = asset_group_table[ idx ] || {};
      fq_dest_dirname = xhiObj.fqProjDirname
        + '/' + asset_group_map.dest_dirname;
      if ( shellJsObj.test( '-d', fq_dest_dirname ) ) {
        try {
          shellJsObj.rm( '-r', fq_dest_dirname );
        }
        catch ( error_obj ) { return ctx_obj.catch_fn( error_obj ); }
      }
    }
    ctx_obj.then_fn();
  }
  // . END utility /_02_rmVendorDirsFn/

  // BEGIN utility /_03_copyVendorFilesFn/
  function _03_copyVendorFilesFn () {
    var
      ctx_obj      = this,
      asset_matrix = xhiObj.makeAssetMatrix(),
      type_list    = Object.keys( asset_matrix ),
      type_count   = type_list.length,

      type_idx, type_key,
      asset_list, asset_count,
      asset_idx, row_list,
      src_pathname, dest_pathname,
      do_dircopy, dest_dirname
      ;

    for ( type_idx = 0; type_idx < type_count; type_idx++ ) {
      type_key = type_list[ type_idx ];

      asset_list  = asset_matrix[ type_key ];
      asset_count = asset_list.length;

      ASSET: for ( asset_idx = 0; asset_idx < asset_count; asset_idx++ ) {
        row_list = asset_list[ asset_idx ];
        src_pathname  = row_list[ 0 ];
        dest_pathname = row_list[ 1 ];
        do_dircopy    = row_list[ 2 ];

        dest_dirname = xhiObj.pathObj.dirname( dest_pathname );
        try {
          shellJsObj.mkdir( '-p', dest_dirname );
        }
        catch ( error_obj ) { return ctx_obj.catch_fn( error_obj ); }

        // Directory copy
        if ( do_dircopy ) {
          try {
            shellJsObj.cp( '-r', src_pathname, dest_pathname );
          }
          catch ( error_obj ) { return ctx_obj.catch_fn( error_obj ); }
          continue ASSET;
        }

        // File copy
        try {
          shellJsObj.cp( src_pathname, dest_pathname );
        }
        catch ( error_obj ) { ctx_obj.catch_fn( error_obj ); }
      }
    }

    ctx_obj.then_fn();
  }
  // . END utility /_03_copyVendorFilesFn/

  // BEGIN utility /patchIfNeededFn/
  function patchIfNeededFn ( match_list ) {
    var ctx_obj = this;
    if ( match_list.length > 0 ) {
      logFn( '    Patch ' + ctx_obj.relative_name + ' already applied.' );
    }
    else {
      postObj.applyPatchFn( ctx_obj.relative_name );
      logFn( '    Applied patch ' + ctx_obj.relative_name );
    }
  }
  // . END utility /patchIfNeededFn/

  // BEGIN utility /_04_patchFilesFn/
  // This function requires CWD to be fqProjDirname
  function _04_patchFilesFn () {
    var
      ctx_obj          = this,
      patch_matrix     = setupMatrix.patch_matrix   || {},
      patch_dirname    = patch_matrix.patch_dirname || '',
      patch_map_list   = patch_matrix.patch_map_list|| [],
      patch_map_count  = patch_map_list.length,
      promise_list     = [],
      idx, patch_map, promise_obj,
      check_filename, patch_filename,
      bound_fn
    ;

    for ( idx = 0; idx < patch_map_count; idx++ ) {
      patch_map      = patch_map_list[ idx ];
      check_filename = patch_map.check_filename;
      patch_filename = patch_map.patch_filename;
      patch_map.relative_name = patch_dirname + '/' + patch_filename;

      promise_obj    = postObj.grepFileFn(
        check_filename, patch_map.pattern_str
      );
      bound_fn       = patchIfNeededFn.bind( patch_map );
      promise_obj.then( bound_fn ).catch( failFn );
      promise_list.push( promise_obj );
    }

    PromiseObj.all( promise_list )
      .then(  ctx_obj.then_fn  ).catch( ctx_obj.catch_fn )
    ;
  }
  // . END utility /_04_patchFilesFn/

  // BEGIN utility /_05_checkGitInstallFn/
  function _05_checkGitInstallFn () {
    var
      ctx_obj = this,
      git_dirname = xhiObj.fqProjDirname + '/.git',
      promise_obj = makeStatPromFn( git_dirname )
    ;

    promise_obj
      .then( function () {
        logFn( '    Git directory ' + git_dirname + ' found.');
        ctx_obj.then_fn();
      })
      .catch( function () {
        warnFn( '    Git directory ' + git_dirname + ' NOT found.\n'
          + '      Exiting without installing git commit hook.\n'
          + '      Please run this step again if you add git.\n'
        );
        ctx_obj.catch_fn();
      });
  }
  // . END utility /_05_checkGitInstallFn/

  // BEGIN utility /_06_unlinkHookFn/
  // Purpose: Unlink git commit hook
  // This function ignores any error
  function _06_unlinkHookFn () {
    var ctx_obj = this;
    fsObj.unlink( xhiObj.fqHookFilename, ctx_obj.then_fn );
  }
  // . END utility /_06_unlinkHookFn/

  // BEGIN utility /_07_linkHookFn/
  // Purpose: Link git commit hook
  // This function requires CWD to be fqProjDirname
  function _07_linkHookFn () {
    var ctx_obj = this;
    fsObj.symlink(
      '../../bin/git-hook_pre-commit',
      xhiObj.fqHookFilename,
      function ( error_data ) {
        if ( error_data ) { failFn( error_data ); }
        ctx_obj.then_fn();
      }
    );
  }
  // . END utility /_07_linkHookFn/

  // == . END UTILITY METHODS =========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    // Get post-install libs and define utils
    logFn( prefixStr + 'Start' );

    // Invalidate all these stages
    xhiObj.xhiUtilObj._clearMap_(
      stageStatusMap, [
        'dev_test', 'dev_lint', 'dev_cover', 'build'
      ]
    );

    // Load post-install libs
    xhiObj.loadLibsFn();
    postObj    = xhiObj.makePostObj();
    shellJsObj = postObj.shellJsObj;

    // Make promise-returning function
    makeStatPromFn  = promisifyFn( xhiObj.fsObj.stat );

    // Use flow to execute steps
    postObj.flowObj.exec(
      function _step01Fn () {
        logFn( '  01: Init variables...' );
        _01_checkBinListFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _step02Fn () {
        logFn( '  02: Remove vendor directories...' );
        _02_rmVendorDirsFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _step03Fn () {
        logFn( '  03: Deploy vendor assets...' );
        _03_copyVendorFilesFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _step04Fn () {
        logFn( '  04: Apply patches...' );
        _04_patchFilesFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _step05Fn () {
        logFn( '  05: Check for git installation...' );
        _05_checkGitInstallFn.call( { then_fn : this, catch_fn : successFn } );
      },
      function _step05Fn () {
        logFn( '  06: Remove prior commit hook...' );
        _06_unlinkHookFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _step07Fn () {
        logFn( '  07: Add latest commit hook...' );
        _07_linkHookFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _step08Fn () {
        logFn( ' 08: Rename vendor symbols to avoid conflicts...' )
        shellJsObj.exec( xhiObj.fqBinDirname + '/rename-vendor-symbols' ),
        logFn( prefixStr + 'End' );
        successFn();
        this();
      }
    );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /setupFn/ ===================================
module.exports = setupFn;

