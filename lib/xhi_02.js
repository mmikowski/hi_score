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

    postObj, shellJsObj, makeRmDirPromFn, makeStatPromFn
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

  // BEGIN utility /_01_rmVendorDirsFn/
  function _01_rmVendorDirsFn () {
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
  // . END utility /_01_rmVendorDirsFn/

  // BEGIN utility /_02_copyFilesFn/
  function _02_copyFilesFn () {
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
  // . END utility /_02_copyFilesFn/

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

  // BEGIN utility /_03_patchFilesFn/
  // This function requires CWD to be fqProjDirname
  function _03_patchFilesFn () {
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
  // . END utility /_03_patchFilesFn/

  // BEGIN utility /_04_appendRcPathFn/
  // Add path to .bashrc if not there yet
  function _04_appendRcPathFn () {
    var
      ctx_obj     = this,
      rc_filename = '~/.bashrc',
      grep_str;

    if ( shellJsObj.test( '-f', rc_filename )
      && pathEnvStr.indexOf( xhiObj.fqBinDirname ) === -1
    ) {
      grep_str = shellJsObj.grep( xhiObj.fqBinDirname, rc_filename );
      grep_str = grep_str.replace( /[\s\r\n]/g, '' );

      if ( ! grep_str ) {
        try {
          postObj.shellJsObj.echo(
            'export PATH=' + xhiObj.fqBinDirname + ':$PATH;\n'
          ).toEnd( '~/.bashrc' );
        }
        catch ( error_obj ) {
          warnFn( 'Could not add patch to .bashrc', error_obj );
        }
      }
    }
    ctx_obj.then_fn();
  }
  // . END utility /_04_appendRcPathFn/

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

    // Load post-install libs
    xhiObj.loadLibsFn();
    postObj    = xhiObj.makePostObj();
    shellJsObj = postObj.shellJsObj;

    // Make promise-returning function
    makeRmDirPromFn = promisifyFn( postObj.rmDirFn );
    makeStatPromFn  = promisifyFn( xhiObj.fsObj.stat );

    // Use flow to execute steps
    postObj.flowObj.exec(
      function _step00Fn () {
        logFn( '  00: Init variables...' );
        postObj.checkBinListFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _step01Fn () {
        logFn( '  01: Remove vendor directories...' );
        _01_rmVendorDirsFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _step02Fn () {
        logFn( '  02: Deploy vendor assets...' );
        _02_copyFilesFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _step03Fn () {
        logFn( '  03: Apply patches...' );
        _03_patchFilesFn.call( { then_fn : this, catch_fn : failFn } );
      },
      function _step04Fn () {
        logFn( '  04: Update path in bashrc' );
        _04_appendRcPathFn.call( { then_fn : this, catch_fn : failFn } );
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
        logFn( ' 08: Finish...' );
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

