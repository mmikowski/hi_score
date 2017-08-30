/*jslint node : true */
/*global Promise */
// == BEGIN PUBLIC METHOD /setupFn/ ===================================
// Purpose   : Setup project using package.json as manifest.
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
function setupFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj      = this,
    catchFn     = xhiObj.catchFn,
    commandMap  = xhiObj.commandMap,
    logFn       = xhiObj.logFn,
    nextFn      = xhiObj.nextFn,
    warnFn      = xhiObj.warnFn,

    pathEnvStr  = process.env.PATH,
    prefixStr   = xhiObj.makePrefixStr( commandMap ),
    promisifyFn = xhiObj.promisifyFn,
    pkgMatrix   = xhiObj.pkgMatrix,
    setupMatrix = pkgMatrix.xhi_02_SetupMatrix,

    mkdirpFn    = require( 'mkdirp' ),
    PromiseObj  = Promise,

    postObj, makeRmDirProm, makeStatProm
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN UTILITY METHODS =========================================
  // BEGIN utility /rmVendorDirsFn/
  function rmVendorDirsFn () {
    var
      ctx_obj            = this,
      asset_group_table  = setupMatrix.asset_group_table,
      asset_group_count  = asset_group_table.length,
      promise_list       = [],

      idx, asset_group_map, fq_dest_dir_str, promise_obj
      ;

    for ( idx = 0; idx < asset_group_count; idx++ ) {
      asset_group_map = asset_group_table[ idx ] || {};
      fq_dest_dir_str = xhiObj.fqProjDirname
        + '/' + asset_group_map.dest_dir_str;
      mkdirpFn.sync( fq_dest_dir_str );

      promise_obj = makeRmDirProm( fq_dest_dir_str );
      promise_list.push( promise_obj );
    }

    PromiseObj.all( promise_list )
      .then(  ctx_obj.then_fn  ).catch( ctx_obj.catch_fn );
  }
  // . END utility /rmVendorDirsFn/

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

  // BEGIN utility /patchFilesFn/
  // This function requires CWD to be fqProjDirname
  function patchFilesFn () {
    var
      ctx_obj          = this,
      patch_matrix     = setupMatrix.patch_matrix   || {},
      patch_dir_str    = patch_matrix.patch_dir_str || '',
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
      patch_map.relative_name = patch_dir_str + '/' + patch_filename;

      promise_obj    = postObj.grepFileFn(
        check_filename, patch_map.pattern_str
      );
      bound_fn       = patchIfNeededFn.bind( patch_map );
      promise_obj.then( bound_fn ).catch( xhiObj.catchFn );
      promise_list.push( promise_obj );
    }

    PromiseObj.all( promise_list )
      .then(  ctx_obj.then_fn  ).catch( ctx_obj.catch_fn )
    ;
  }
  // . END utility /patchFilesFn/

  // BEGIN utility /checkGitInstallFn/
  function checkGitInstallFn () {
    var
      ctx_obj = this,
      git_dirname = xhiObj.fqProjDirname + '/.git',
      promise_obj = makeStatProm( git_dirname )
      ;

    promise_obj
      .then( function () {
        logFn( '    Git directory ' + git_dirname + ' found.');
        ctx_obj.then_fn();
      })
      .catch( function () {
        logFn( '    Git directory ' + git_dirname + ' NOT found.');
        ctx_obj.catch_fn();
      });
  }
  // . END utility /checkGitInstallFn/

  // == . END UTILITY METHODS =========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    // Get post-install libs and define utils
    logFn( prefixStr + 'Start' );
    xhiObj.loadLibsFn();

    postObj       = xhiObj.makePostObj();
    makeRmDirProm = promisifyFn( postObj.rmDirFn );
    makeStatProm  = promisifyFn( xhiObj.fsObj.stat );

    // TODO 2017-08-23 mmikowski info: Add export PATH to .bashrc file
    if ( pathEnvStr.indexOf( xhiObj.fqBinDirname ) === -1 ) {
      xhiObj.warnFn( 'Run to add the bin path' );
      xhiObj.warnFn(
        'export PATH=' + xhiObj.fqBinDirname + ':' + pathEnvStr
      );
    }

    // Use flow to execute steps
    postObj.flowObj.exec(
      function _02_00_InitVarsFn () {
        logFn( '  00: Init variables...' );
        postObj.checkBinListFn.call( { then_fn : this, catch_fn : catchFn } );
      },
      function _02_01_RmVendorDirsFn () {
        logFn( '  01: Remove vendor directories...' );
        rmVendorDirsFn.call( { then_fn : this, catch_fn : catchFn } );
      },
      function _02_02_CopyVendorFilesFn () {
        logFn( '  02: Deploy vendor assets...' );
        postObj.copyVendorFilesFn.call(
          { then_fn : this, catch_fn : catchFn } );
      },
      function _02_03_PatchFilesFn () {
        logFn( '  03: Apply patches...' );
        patchFilesFn.call( { then_fn : this, catch_fn : catchFn } );
      },
      function _02_04_CheckGitInstallFn () {
        logFn( '  04: Check for git installation...' );
        checkGitInstallFn.call( {
          then_fn  : this,
          catch_fn : function _catch_fn () {
            warnFn(
              '\nExiting without installing git commit hook.\n'
              + 'Please run this step again if you add git.'
            );
            logFn( prefixStr + 'Success' );
            nextFn();
          }
        } );
      },
      function _02_05_UnlinkHookFn () {
        logFn( '  05: Remove prior commit hook...' );
        postObj.unlinkHookFn.call( { then_fn : this, catch_fn : catchFn } );
      },
      function _02_06_LinkHookFn () {
        logFn( '  06: Add latest commit hook...' );
        postObj.linkHookFn.call( { then_fn : this, catch_fn : catchFn } );
      },
      function _02_07_FinishRunFn () {
        logFn( prefixStr + 'Success' );
        nextFn();
      }
    );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /setupFn/ ===================================
module.exports = setupFn;

