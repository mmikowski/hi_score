/*jslint node : true */
function buildFn () {
  'use strict';
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  var
    xhiObj         = this,

    PromiseObj     = xhiObj.PromiseObj,
    buildId        = xhiObj.buildId,
    catchFn        = xhiObj.catchFn,
    commandMap     = xhiObj.commandMap,
    fqBuildDirname = xhiObj.fqBuildDirname,
    logFn          = xhiObj.logFn,
    nextFn         = xhiObj.nextFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,
    warnFn         = xhiObj.warnFn,

    aliasStr       = commandMap.alias_str,
    // app_id, file_js_list, file_css_list, deploy_path_list
    appManifestTable   = [],
    appManifestIdx    = 0,

    fqIdDirname    = fqBuildDirname + '/' + buildId,
    fqDistDirname  = fqIdDirname    + '/dist',
    fqMetaDirname  = fqIdDirname    + '/meta',

    // TODO 2017-09-06 mmikowski alert: these will be needed soon
    // buildTable     = xhiObj.buildTable,
    // fsObj          = xhiObj.fsObj,
    // packageMatrix  = xhiObj.packageMatrix,

    shellJsObj,  postObj,
    uglyJsMap,   uglyCssStr
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN UTILITY METHODS =========================================
  // BEGIN utility /failFn/
  // Purpose: Wrap catchFn to store failure and finish
  //
  function failFn () {
    stageStatusMap[ aliasStr ] = false;
    warnFn( arguments );
    catchFn( prefixStr + 'Fail' );
  }
  // . END utility /failFn/

  // BEGIN utility /  _00_makePathListsFn/
  function   _00_makePathListsFn () {
    var ctx_obj = this;
    // TODO 2017-09-07 mmikowski warn: merge deploy_path_list?
    appManifestTable.push( {
      app_id           : 'ex01',
      file_js_list     : [
        'js/vendor/taffy-2.7.3.js',
        'js/vendor/pcss-1.4.2.js',
        'js/vendor/pcss.cfg-1.4.2.js',
        'js/vendor/jquery-3.2.1.js',
        'js/plugin/jquery.deferred.whenAll-1.0.0.js',
        'js/vendor/jquery.event.dragscroll-1.0.0.js',
        'js/vendor/jquery.event.gevent-1.1.6.js',
        'js/vendor/jquery.event.ue-1.3.2.js',
        'js/vendor/jquery.scrolli-1.0.1.js',
        'js/vendor/jquery.urianchor-1.3.5.js',
        'js/xhi/00.js',
        'js/xhi/01.util.js',
        'js/xhi/02.data.js',
        'js/xhi/02.fake.js',
        'js/xhi/03.model.js',
        'js/xhi/04.utilb.js',
        'js/xhi/05.css_base.js',
        'js/xhi/05.css_lb.js',
        'js/xhi/05.css_shell.js',
        'js/xhi/06.css.js',
        'js/xhi/06.lb.js',
        'js/xhi/07.shell.js',
        'js/xhi/08.app.js',
        'js/ex01-build.js'
      ],
      file_css_list    : [
        'css/xhi-fonts.css',
        'css/vendor/font-awesome-4.7.0.css'
      ],
      deploy_path_list : [
        // src_pathname, tgt_pathname, is_dircopy
        [ 'font/vendor/font-awesome-4.7.0', null, true ],
        [ 'font/vendor/open-sans-fontface-1.4.0/Regular', null, true ],
        [ 'tmplt/ex01.html', '/' ],
        [ 'img/hi_score.png', 'img/' ]
      ]
    });

    appManifestTable.push( {
      app_id           : 'ex02',
      file_js_list     : [
        'js/vendor/taffy-2.7.3.js',
        'js/vendor/pcss-1.4.2.js',
        'js/vendor/pcss.cfg-1.4.2.js',
        'js/vendor/jquery-3.2.1.js',
        'js/plugin/jquery.deferred.whenAll-1.0.0.js',
        'js/vendor/jquery.event.dragscroll-1.0.0.js',
        'js/vendor/jquery.event.gevent-1.1.6.js',
        'js/vendor/jquery.event.ue-1.3.2.js',
        'js/vendor/jquery.scrolli-1.0.1.js',
        'js/vendor/jquery.urianchor-1.3.5.js',
        'js/xhi/00.js',
        'js/xhi/01.util.js',
        'js/xhi/02.data.js',
        'js/xhi/02.fake.js',
        'js/xhi/03.model.js',
        'js/xhi/04.utilb.js',
        'js/xhi/05.css_base.js',
        'js/xhi/05.css_lb.js',
        'js/xhi/05.css_shell.js',
        'js/xhi/06.css.js',
        'js/xhi/06.lb.js',
        'js/xhi/07.shell.js',
        'js/xhi/08.app.js',
        'js/ex02-build.js'
      ],
      file_css_list    : [
        'css/xhi-fonts.css',
        'css/vendor/font-awesome-4.7.0.css'
      ],
      deploy_path_list : [
        // src_pathname, tgt_pathname, is_dircopy
        [ 'font/vendor/font-awesome-4.7.0', null, true ],
        [ 'font/vendor/open-sans-fontface-1.4.0/Regular', null, true ],
        [ 'tmplt/ex02.html', '/' ],
        [ 'img/hi_score.png', 'img/' ]
      ]
    });
    ctx_obj.then_fn();
  }

  function _01_makeDirsFn () {
    var ctx_obj = this;
    if ( appManifestIdx > 0 ) { return ctx_obj.then_fn(); }
    try {
      shellJsObj.mkdir( '-p', fqBuildDirname );
      shellJsObj.mkdir( '-p', fqIdDirname    );
      shellJsObj.mkdir( '-p', fqDistDirname  );
      shellJsObj.mkdir( '-p', fqMetaDirname  );
      shellJsObj.mkdir( '-p', fqDistDirname + '/js'  );
      shellJsObj.mkdir( '-p', fqDistDirname + '/css' );
    }
    catch ( error_obj ) {
      ctx_obj.catch_fn( error_obj );
    }
    ctx_obj.then_fn();
  }

  function _01_prepFileSysFn () {
    var ctx_obj = this;
    if ( shellJsObj.test( '-d', fqDistDirname ) ) {
      return xhiObj.askFn(
        'Distribtion directory exists. Wipe and recreate? (Y/n) ',
        function ( str ) {
          if ( str.match( /^[n]/i ) ) {
            return ctx_obj.catch_fn( 'Exiting at user request' );
          }
          shellJsObj.rm( '-rf', fqDistDirname );
          if ( shellJsObj.test( '-d', fqMetaDirname ) ) {
            shellJsObj.rm( '-rf', fqMetaDirname );
          }
          _01_makeDirsFn.call( ctx_obj );
        }
      );
    }
    _01_makeDirsFn.call( ctx_obj );
  }

  function _02_makeUglyMapsFn () {
    var
      ctx_obj      = this,
      manifest_map = appManifestTable[ appManifestIdx ],
      js_concat_str, css_concat_str
      ;

    js_concat_str  = shellJsObj.cat( manifest_map.file_js_list  );
    css_concat_str = shellJsObj.cat( manifest_map.file_css_list );
    js_concat_str  = js_concat_str.replace( /\\n/g, '' );
    uglyJsMap      = postObj.uglifyJsObj.minify(
      js_concat_str,
      { mangle : {
          toplevel   : false,
          properties : false
        },
        sourceMap : true
      }
    );

    if ( uglyJsMap.error ) {
      warnFn( uglyJsMap.error );
      ctx_obj.catch_fn( prefixStr + 'Fail' );
    }

    try {
      uglyCssStr = postObj.uglifyCssObj.processString( css_concat_str );
    }
    catch ( error_obj ) {
      warnFn( uglyJsMap.error );
      ctx_obj.catch_fn( prefixStr + 'Fail' );
    }
    ctx_obj.then_fn();
  }

  function _03_saveUglyFilesFn () {
    var
      ctx_obj      = this,
      manifest_map = appManifestTable[ appManifestIdx ],
      app_id       = manifest_map.app_id,
      write_list = [
        [ fqMetaDirname + '/'     + app_id + '-min.js',  uglyJsMap.code ],
        [ fqDistDirname + '/css/' + app_id + '-min.css', uglyCssStr     ]
      ],
      write_count = write_list.length,
      promise_list = [],

      idx, row_list, promise_obj
      ;

    for ( idx = 0; idx < write_count; idx++ ) {
      row_list = write_list[ idx ];
      promise_obj = xhiObj.makeWritePromFn.apply( null, row_list );
      promise_list.push( promise_obj );
    }

    PromiseObj.all( promise_list )
      .then(  ctx_obj.then_fn  )
      .catch( ctx_obj.catch_fn )
      ;
  }

  function _04_superpackFn () {
    var
      ctx_obj      = this,
      manifest_map = appManifestTable[ appManifestIdx ],
      app_id       = manifest_map.app_id,
      diag_str     = '',
      child_proc_obj
      ;

    function ondata_fn ( data ) {
      diag_str += data.toString();
    }

    function onclose_fn ( exit_int ) {
      var promise_obj;
      if ( exit_int === 0 ) {
        promise_obj = xhiObj.makeWritePromFn(
          fqMetaDirname + '/' + app_id + '-sp.diag', diag_str
        );
        return promise_obj.then( ctx_obj.then_fn ).catch( ctx_obj.catch_fn );
      }
      ctx_obj.catch_fn();
    }

    child_proc_obj = xhiObj.makeSpawnObj(
      xhiObj.fqBinDirname + '/superpack',
      [ '-i', fqMetaDirname + '/'   + app_id + '-min.js',
        '-o', fqDistDirname + '/js/' + app_id + '-sp.js',
        '-l', fqMetaDirname + '/'   + app_id + '-sp.log'
      ]
    );
    child_proc_obj.stdout.on( 'data', ondata_fn );
    child_proc_obj.stderr.on( 'data', ondata_fn );
    child_proc_obj.on( 'close', onclose_fn );
  }

  function _05_copyPathsFn () {
    var
      ctx_obj          = this,
      manifest_map     = appManifestTable[ appManifestIdx ],
      deploy_path_list = manifest_map.deploy_path_list,
      row_count        = deploy_path_list.length,

      idx, row_list, is_failed, do_dircopy,
      src_pathname,    tgt_pathname,
      fq_src_pathname, fq_tgt_dirname
      ;

    PATH: for ( idx = 0; idx < row_count; idx++ ) {
      is_failed    = false;
      row_list     = deploy_path_list[ idx ];
      src_pathname = row_list[ 0 ];
      tgt_pathname = row_list[ 1 ];
      do_dircopy   = row_list[ 2 ];

      fq_src_pathname = xhiObj.fqProjDirname + '/' + src_pathname;
      if ( ! tgt_pathname ) {
        tgt_pathname = xhiObj.pathObj.dirname( src_pathname );
      }
      fq_tgt_dirname = fqDistDirname + '/' + tgt_pathname;

      if ( do_dircopy ) {
        if ( ! shellJsObj.test( '-d', fq_src_pathname ) ) {
          warnFn( '  Dir copy fail: Source > ' + fq_src_pathname
            + ' < is not a directory.'
          );
          is_failed = true;
        }
        if ( is_failed ) { continue PATH; }

        shellJsObj.mkdir( '-p', fq_tgt_dirname );
        shellJsObj.cp(    '-r', fq_src_pathname, fq_tgt_dirname );
        continue PATH;
      }

      if ( ! shellJsObj.test( '-f', fq_src_pathname ) ) {
        warnFn( '  File copy fail: Source > ' + fq_src_pathname
          + ' < is not a file.'
        );
        continue PATH;
      }
      shellJsObj.mkdir( '-p', fq_tgt_dirname );
      shellJsObj.cp( fq_src_pathname, fq_tgt_dirname );
    }
    ctx_obj.then_fn();
  }

  function _06_cleanupFn () {
    var ctx_obj = this;
    process.chdir( xhiObj.fqBuildDirname );
    shellJsObj.rm( '-f',  'latest' );
    shellJsObj.ln( '-sf', buildId, 'latest' );
    logFn( prefixStr + 'Success' );
    nextFn();
    ctx_obj.then_fn();
  }
  // == . END UTILITY METHODS =========================================

  // == BEGIN MAIN ====================================================
  // This is a little hacky as we call it recursively when we have
  // multiple app manifests. However, it will do for now.
  //
  function mainFn () {
    // Load post-install libs (only first run though)
    if ( appManifestIdx === 0 ) {
      logFn( prefixStr + 'Start' );
      xhiObj.loadLibsFn();
      postObj = xhiObj.makePostObj();
      shellJsObj = postObj.shellJsObj;
    }

    // Execute steps
    postObj.flowObj.exec(
      function _step00Fn () {
        if ( appManifestIdx > 0 ) { return this(); }
        logFn( '  00: Make build path lists...' );
        _00_makePathListsFn.call({ then_fn: this, catch_fn : failFn });
      },
      function _step01Fn () {
        if ( appManifestIdx > 0 ) { return this(); }
        logFn( '  01: Prep build directory...' );
        _01_prepFileSysFn.call({ then_fn: this, catch_fn : failFn });
      },
      function _step02Fn () {
        logFn( '  02: Uglify JS and CSS...' );
        _02_makeUglyMapsFn.call({ then_fn: this, catch_fn : failFn });
      },
      function _step03Fn () {
        logFn( '  03: Save uglified JS and CSS...' );
        _03_saveUglyFilesFn.call({ then_fn: this, catch_fn : failFn });
      },
      function _step04Fn () {
        logFn( '  04: Superpack JS symbols...' );
        _04_superpackFn.call({ then_fn: this, catch_fn : failFn });
      },
      function _step05Fn () {
        logFn( '  05: Copy subtrees...' );
        _05_copyPathsFn.call({ then_fn: this, catch_fn : failFn });
      },
      function _step06Fn () {
        var manifest_map = appManifestTable[ appManifestIdx ];

        logFn( '  Built app ' + manifest_map.app_id
          + ' idx ' + appManifestIdx + '\n'
        );

        appManifestIdx++;
        if ( appManifestIdx < appManifestTable.length ) { return mainFn(); }

        logFn( '  06: Cleanup...' );
        _06_cleanupFn.call({ then_fn: this, catch_fn : failFn });
      }
    );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /setupFn/ ===================================
module.exports = buildFn;

// See bin/xhi help all for all stages (~20)
// Name        : buildify
// Synopsis    : buildify <build-id> "manifest1" [ "manifest2" ... ]
// Description :
//   Builds a production-ready web site from manifests listed
//   in the package.json file
//   The output files are placed in build/<serial_num>
//   and the latest build is linked to build/latest
//
//      build/
//        latest -> build/<serial_num>
//        <serial_num>/
//          dist/
//          meta/
//
// Examples   :
//   IN PACKAGE.JSON
//   { "devDependencies" : { "taffydb": "2.7.3", .... },
//     "xhi_02_SetupMatrix"  : {
//       "asset_group_table": [
//        { "asset_type" : "js",
//           "asset_list": [
//             {
//               "dest_name": "taffy",
//               "src_asset_name": "taffy.js",
//               "src_pkg_name": "taffydb"
//             }
//           ]
//       }
//       "dest_dirname": "js/vendor",
//       "dest_ext_str": "js"
//     },
//     "xhi_10_BuildTable": [
//       {
//         "app_id": "ex01",
//         "do_isolate": false,
//         "asset_make_map: {
//           copy_list : [
//             "font/vendor/font-awesome-4.7.0",
//             "font/vendor/open-sans-fontface-1.4.0/Regular"
//           ]
//         }
//         "css_make_map": {
//           "do_compress": true,
//           "do_vendor": true,
//           "target_file": "ex01.css - should be reundant"
//         },
//         "js_make_map": {
//           "asset_list": [
//             "js/xhi/00.js",
//             "js/xhi/01.util.js",
//             "js/xhi/02.data.js",
//             "js/xhi/02.fake.js",
//             "js/xhi/03.model.js",
//             "js/xhi/04.utilb.js",
//             "js/xhi/05.css_base.js",
//             "js/xhi/05.css_lb.js",
//             "js/xhi/05.css_shell.js",
//             "js/xhi/06.css.js",
//             "js/xhi/06.lb.js",
//             "js/xhi/07.shell.js",
//             "js/xhi/08.app.js",
//             "js/ex01-build.js"
//           ],
//           "do_compress": true,
//           "do_vendor": true,
//           "target_file": "ex01.js - should be redundant"
//         },
//         // TODO 2017-07-24 mmikowski warn: Add tmplt reqs
//         "tmplt_make_list": []
//       }
//     ]
//   }
//
//       ==============
//       source:js
//       js/foo.js
//       ==============
//
//   Then running the following ...
//
//       $ ${_appName} ./ex01.${_appName}
//
//   ... results in the following files in ${_metaDir}:
//
//       js/ex01-min.js  # uglified JS
//       js/ex01-raw.js  # concatenated JS
//       js/ex01-sp.diag # superpack diagnostics
//       js/ex01-sp.js   # superpacked JS
//
//
//   (2) If the file ex02.${_appName} looks like so:
//       ==============
//       source:js
//       js/foo.js
//
//       source:css
//       css/foo.css
//       ==============
//
//   Then running the following ...
//
//       $ ${_appName} ./ex02.${_appName}
//
//   results in the following files in ${_metaDir}:
//       js/ex02-min.js  # uglified JS
//       js/ex02-raw.js  # concatenated JS
//       js/ex02-sp.diag # superpack diagnostics
//       js/ex02-sp.js   # superpacked JS
//
//       css/ex02-min.css # uglified CSS
//       css/ex02-raw.css # concatenated CSS
//
// ARGUMENTS
//   manifest_1, manifest_2, ... (REQUIRED)
//     Manifests to process.  Each manifest lists the source files to
//     process. It may have multiple sections delineated by a source-type header.
//     ${_appName} expects all paths to be relative to the referencing
//     manifest file path.
//
//        sourcetype:js   # for javascript files, and
//        # ... js files here ...
//        sourcetype:css # for css and source files
//        # ... css files here .... (relative to manifest path)
//
//     Blank lines, comment lines, and trailing comments are ignored.
//
// OPTIONS
//   * -h | --help | --usage (OPTIONAL)
//     Sends short help text to STDERR (usually the terminal) and exits.
//     When combined with the -v option, long help is presented.
//
//   * -n | --nocompress (OPTIONAL)
//     By default ${_appName} concatenates and minifies CSS and JS files.
//     It also SuperPacks JS files.  This option turns off this behavior.
//
//   * -v | --verbose (OPTIONAL)
//     Be noisy when processing
//
// REQUIRED PATCH
//   Buildify uses Superpack symbol compression.  Superpack requires a patch
//   to UglifyJS.  If you have installed **hi\_score** this patch will have
//   been applied when running 'npm run setup' which is the safest means
//   to apply the patch.  If you need to do so manually, this should also work:
//
//     \$ cd ${_modDir}
//     \$ patch -p0 < ../patch/uglifyjs-2.4.10.patch

