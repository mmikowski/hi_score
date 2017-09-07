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

    pathEnvStr     = process.env.PATH,
    setupMatrix    = packageMatrix.xhi_02_SetupMatrix,

    aliasStr       = commandMap.alias_str,

    postObj, makeRmDirPromFn, makeStatPromFn
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

  // BEGIN utility /copyVendorFilesFn/
  function copyVendorFilesFn () {
    var
      ctx_obj            = this,
      setup_matrix       = packageMatrix.xhi_02_SetupMatrix || {},
      asset_group_table  = setup_matrix.asset_group_table   || [],
      dev_dependency_map = packageMatrix.devDependencies    || {},
      asset_group_count  = asset_group_table.length,
      promise_list       = [],

      idx, asset_group_map, asset_list, asset_count,
      fq_dest_dirname, dest_ext_str, do_dir_copy,

      idj, asset_map, src_asset_name, src_dirname,
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
      fq_dest_dirname  = xhiObj.fqProjDirname + '/'
        + asset_group_map.dest_dirname;

      postObj.mkdirpFn.sync( fq_dest_dirname );
      ASSET_MAP: for ( idj = 0; idj < asset_count; idj++ ) {
        asset_map      = asset_list[ idj ];
        src_asset_name = asset_map.src_asset_name;
        src_dirname    = asset_map.src_dirname || '';
        src_pkg_name   = asset_map.src_pkg_name;

        dest_vers_str  = dev_dependency_map[ src_pkg_name ];

        if ( ! dest_vers_str ) {
          logFn( 'WARN: package ' + src_pkg_name + ' not found.');
          continue ASSET_MAP;
        }
        dest_name = asset_map.dest_name || src_pkg_name;

        fq_dest_path_str = fq_dest_dirname
          + '/' + dest_name + '-' + dest_vers_str;
        fq_src_path_list = [
          xhiObj.fqModuleDirname, src_pkg_name, src_asset_name
        ];
        if ( src_dirname ) { fq_src_path_list.splice( 2, 0, src_dirname ); }

        fq_src_path_str = fq_src_path_list.join( '/' );

        if ( ! do_dir_copy ) {
          fq_dest_path_str += '.' + dest_ext_str;
        }
        promise_obj = postObj.copyPathFn(
          fq_src_path_str, fq_dest_path_str, do_dir_copy
        );
        promise_list.push( promise_obj );
      }
    }

    PromiseObj.all( promise_list )
      .then(  ctx_obj.then_fn  ).catch( ctx_obj.catch_fn );
  }
  // . END utility /copyVendorFilesFn/

  // BEGIN utility /unlinkHookFn/
  // This ignores any error
  function unlinkHookFn () {
    var ctx_obj = this;
    fsObj.unlink( xhiObj.fqHookFilename, ctx_obj.then_fn );
  }
  // . END utility /unlinkHookFn/

  // BEGIN utility /linkHookFn/
  // This function requires CWD to be fqProjDirname
  function linkHookFn () {
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
  // . END utility /linkHookFn/

  // BEGIN utility /rmVendorDirsFn/
  function rmVendorDirsFn () {
    var
      ctx_obj            = this,
      asset_group_table  = setupMatrix.asset_group_table,
      asset_group_count  = asset_group_table.length,
      promise_list       = [],

      idx, asset_group_map, fq_dest_dirname, promise_obj
      ;

    for ( idx = 0; idx < asset_group_count; idx++ ) {
      asset_group_map = asset_group_table[ idx ] || {};
      fq_dest_dirname = xhiObj.fqProjDirname
        + '/' + asset_group_map.dest_dirname;
      postObj.mkdirpFn.sync( fq_dest_dirname );

      promise_obj = makeRmDirPromFn( fq_dest_dirname );
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
  // . END utility /patchFilesFn/

  // BEGIN utility /checkGitInstallFn/
  function checkGitInstallFn () {
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

    // Load post-install libs
    xhiObj.loadLibsFn();
    postObj = xhiObj.makePostObj();

    // Make promise-returning function
    makeRmDirPromFn = promisifyFn( postObj.rmDirFn );
    makeStatPromFn  = promisifyFn( xhiObj.fsObj.stat );

    // TODO 2017-08-23 mmikowski info: Add export PATH to .bashrc file
    if ( pathEnvStr.indexOf( xhiObj.fqBinDirname ) === -1 ) {
      xhiObj.warnFn( 'Run to add the bin path' );
      xhiObj.warnFn(
        'export PATH=' + xhiObj.fqBinDirname + ':' + pathEnvStr
      );
    }

    // 2017-09-06 mmikowski warn: disabled patch from package.json
    // "patch_map_list": [
    //   { "check_filename": "node_modules/uglify-js/lib/scope.js",
    //     "patch_filename": "uglify-js-3.0.21.patch",
    //     "pattern_str": "^// BEGIN hi_score patch line 324",
    //     "relative_name": "patch/uglify-js-3.0.21.patch"
    //   }
    // ]
    // Use flow to execute steps
    postObj.flowObj.exec(
      function _02_00_InitVarsFn () {
        logFn( '  00: Init variables...' );
        postObj.checkBinListFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _02_01_RmVendorDirsFn () {
        logFn( '  01: Remove vendor directories...' );
        rmVendorDirsFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _02_02_CopyVendorFilesFn () {
        logFn( '  02: Deploy vendor assets...' );
        copyVendorFilesFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _02_03_PatchFilesFn () {
        logFn( '  03: Apply patches...' );
        patchFilesFn.call( { then_fn : this, catch_fn : failFn } );
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
            stageStatusMap[ aliasStr ] = true;
            logFn( prefixStr + 'Success' );
            nextFn();
          }
        } );
      },
      function _02_05_UnlinkHookFn () {
        logFn( '  05: Remove prior commit hook...' );
        unlinkHookFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _02_06_LinkHookFn () {
        logFn( '  06: Add latest commit hook...' );
        linkHookFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _02_07_FinishRunFn () {
        stageStatusMap[ aliasStr ] = true;
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

