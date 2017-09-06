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
//          stage/
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
//   ... results in the following files in ${_stageDir}:
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
//   results in the following files in ${_stageDir}:
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
//   ##  TODO 2017-07-21 mmikowski warn:
//   ##    1. Put these under a build number in builddir
//   ##    2. Link latest build builddir/xxx -> last
//   ## BEGIN process each manifest in turn
//     ## Get path of manifest and determine output names
//     ## Read manifest and append sources to arrays copy / css / js / copy_dir
//     ## Determine paths
//     ## Process javascript files
//     ## Compress javascript file if specified
//     ## Superpack javascript file if specified
//     ## Process css files
//     ## Compress css file if specified
//     ## Move over remaining files
//     ## Deployment (WIP)
//   ## . END process each manifest in turn
//   ## Cleanup
// ## . END MAIN
