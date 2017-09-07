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

    fqIdDirname    = fqBuildDirname + '/' + buildId,
    fqDistDirname  = fqIdDirname    + '/dist',
    fqMetaDirname  = fqIdDirname    + '/meta',

    // TODO 2017-09-06 mmikowski alert: these will be needed soon
    // buildTable     = xhiObj.buildTable,
    // fsObj          = xhiObj.fsObj,
    // packageMatrix  = xhiObj.packageMatrix,

    shellJsObj, postObj,
    fileJsList, fileCssList,
    subtreeList, copyList,
    uglyJsMap, uglyCssStr
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

  // BEGIN utility /makePathListsFn/
  function makePathListsFn () {
    var ctx_obj = this;
    // TODO: 2017-09-06 mmikowski warn: Create from package.json
    // This is test data only.
    fileJsList = [
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
    ];

    fileCssList = [
      'css/xhi-fonts.css',
      'css/vendor/font-awesome-4.7.0.css'
    ];

    subtreeList = [
      'font/vendor/font-awesome-4.7.0',
      'font/vendor/open-sans-fontface-1.4.0/Regular'
    ];

    copyList = [
      [ 'tmplt/ex01.html',  '/'    ],
      [ 'img/hi_score.png', 'img/' ]
    ];
    ctx_obj.then_fn();
  }

  function makeUglyMapsFn () {
    var
      ctx_obj = this,
      js_concat_str, css_concat_str
      ;

    js_concat_str  = shellJsObj.cat( fileJsList  );
    css_concat_str = shellJsObj.cat( fileCssList );
    js_concat_str  = js_concat_str.replace( /\\n/g, '' );
    uglyJsMap      = postObj.uglifyJsObj.minify(
      js_concat_str,
      { mangle : {
          toplevel  : true,
          properties : {
            regex : /^_[a-zA-Z0-9_$]+_/
          }
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

  function makeDirsFn () {
    var ctx_obj = this;
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

  function prepFileSysFn () {
    var ctx_obj = this;
    if ( shellJsObj.test( '-d', fqIdDirname ) ) {
      xhiObj.askFn(
        'Build directory exists. Wipe and recreate? (Y/n) ',
        function ( str ) {
          if ( str.match( /^[n]/i ) ) {
            return ctx_obj.catch_fn( 'Exiting at user request' );
          }
          return makeDirsFn.call( ctx_obj );
        }
      );
    }
    else {
      makeDirsFn.call( ctx_obj );
    }
  }

  function saveUglyFilesFn () {
    var
      ctx_obj    = this,
      write_list = [
        [ fqDistDirname + '/js/ex01-min.js',   uglyJsMap.code ],
        [ fqDistDirname + '/css/ex01-min.css', uglyCssStr     ]
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

  function copySubtreesFn () {
    var ctx_obj = this;
    ctx_obj.then_fn();
  }

  function copyFilesFn () {
    var ctx_obj = this;
    ctx_obj.then_fn();
  }

  function cleanupFn () {
    var ctx_obj = this;
    process.chdir( xhiObj.fqBuildDirname );
    shellJsObj.ln( '-sf', buildId, 'latest' );
    logFn( subtreeList, copyList );
    logFn( prefixStr + 'Success' );
    nextFn();
    ctx_obj.then_fn();
  }
  // == . END UTILITY METHODS =========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    logFn( prefixStr + 'Start' );

    // Load post-install libs
    xhiObj.loadLibsFn();
    postObj = xhiObj.makePostObj();
    shellJsObj = postObj.shellJsObj;

    // Execute steps
    postObj.flowObj.exec(
      function _11_00_makeFileListsFn () {
        logFn( '  00: Make build path lists...' );
        makePathListsFn.call({ then_fn: this, catch_fn : failFn });
      },
      function _11_01_makeUglyMapsFn () {
        logFn( '  01: Uglify JS and CSS...' );
        makeUglyMapsFn.call({ then_fn: this, catch_fn : failFn });
      },
      function _11_02_prepBuildDirFn () {
        logFn( '  02: Prep build directory...' );
        prepFileSysFn.call({ then_fn: this, catch_fn : failFn });
      },
      function _11_03_saveUglyFilesFn () {
        logFn( '  03: Save uglified JS and CSS...' );
        saveUglyFilesFn.call({ then_fn: this, catch_fn : failFn });
      },
      function _11_04_copySubtreesFn () {
        logFn( '  04: Copy subtrees...' );
        copySubtreesFn.call({ then_fn: this, catch_fn : failFn });
      },
      function _11_05_copySubtreesFn () {
        logFn( '  05: Copy files...' );
        copyFilesFn.call({ then_fn: this, catch_fn : failFn });
      },
      function _11_06_cleanupFn () {
        logFn( '  06: Cleanup...' );
        cleanupFn.call({ then_fn: this, catch_fn : failFn });
      }
    );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /setupFn/ ===================================
module.exports = buildFn;

// ## Function to echo to STDERR
// ## Function to print usage
// ## Function to log output
// ## Function to clean up temp files
// ## Function to abort processing
// ## BEGIN MAIN
//   ## Get options
//   ## Set global log to start
//   ## Find SuperPack
//   ## Confirm SuperPack has correct modules installed
//   ## Find UglifyJS
//   ## Find UglifyCSS
//   ## Validiate input files
//   ## Validate and create build dir and move global log to it
//   ## BEGIN process each manifest in turn
//     ## Get path of manifest and determine output names
//     ## Read manifest and append sources to arrays copy / css / js / copy_dir
//     ## Determine paths
//     ## Process javascript files
//     ## Compress javascript file if specified
//     ## Superpack javascript file if specified
//     ## Process css files
//     ## Compress css file if specified
//     ## Put these under a build number in builddir
//     ## Link latest build builddir/xxx -> last
//     ## Move over remaining files
//     ## Deployment (WIP)
//   ## . END process each manifest in turn
//   ## Cleanup

// See bin/xhi help all for all stages (~20)
// Name        : buildify
// Synopsis    : buildify <build-id> "manifest1" [ "manifest2" ... ]
// Description :
//   Builds a production-ready web site from manifests listed
//   in the package.json file
//   The output files are placed in build/<serial_num>
//   and the latest build is linked to build/last
//
//      build/
//        last -> build/<serial_num>
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
//         "build_id": "ex01",
//         "do_isolate": false,
//         "asis_make_map": {
//           "do_include_vendor": true
//         },
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
//             "js/ex02-build.js"
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
//
// SEE ALSO
//   * UglifyJS
//   * UglifyCSS
//
// AUTHOR and COPYRIGHT
//   Michael S. Mikowski (c) 2008-2016
//
// ## Function to echo to STDERR
// ## Function to print usage
// ## Function to log output
// ## Function to clean up temp files
// ## Function to abort processing
// ## BEGIN MAIN
//   ## Get options
//   ## Set global log to start
//   ## Find SuperPack
//   ## Confirm SuperPack has correct modules installed
//   ## Find UglifyJS
//   ## Find UglifyCSS
//   ## Validiate input files
//   ## Validate and create build dir and move global log to it
//   ## BEGIN process each manifest in turn
//     ## Get path of manifest and determine output names
//     ## Read manifest and append sources to arrays copy / css / js / copy_dir
//     ## Determine paths
//     ## Process javascript files
//     ## Compress javascript file if specified
//     ## Superpack javascript file if specified
//     ## Process css files
//     ## Compress css file if specified
//     ## Put these under a build number in builddir
//     ## Link latest build builddir/xxx -> last
//     ## Move over remaining files
//     ## Deployment (WIP)
//   ## . END process each manifest in turn
//   ## Cleanup
// ## . END MAIN
