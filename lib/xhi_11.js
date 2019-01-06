/*
 * lib/xhi_11.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
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
    paramMap       = xhiObj.paramMap,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    packageMatrix  = xhiObj.packageMatrix,
    stageStatusMap = xhiObj.stageStatusMap,
    warnFn         = xhiObj.warnFn,

    aliasStr       = commandMap.alias_str,

    appManifestTable  = [],
    appManifestIdx    = 0,
    doHeadless        = paramMap.do_headless,

    fqIdDirname    = fqBuildDirname + '/' + buildId,
    fqDistDirname  = fqIdDirname    + '/dist',
    fqMetaDirname  = fqIdDirname    + '/meta',

    // TODO 2017-09-06 mmikowski warn: Add update to xhiObj.buildTable
    shellJsObj, postObj, uglyJsMap, uglyCssStr
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
    var
      ctx_obj = this,
      build_matrix  = packageMatrix.xhi_11_BuildMatrix,
      bundle_map    = build_matrix.bundle_map,
      app_table     = build_matrix.app_table,
      app_count     = app_table.length,
      asset_key_map = {
        css : {
          make_key        : 'css_make_matrix',
          output_key      : 'file_css_list',
          vendor_list_key : 'css_list'
        },
        'js' : {
          make_key        : 'js_make_matrix',
          output_key      : 'file_js_list',
          vendor_list_key : 'js_list'
        },
        'path' : {
          make_key   : 'path_copy_matrix',
          output_key : 'path_copy_list'
        }
      },

      vendor_asset_matrix = xhiObj.makeAssetMatrix(),

      asset_type_list  = Object.keys( asset_key_map ),
      asset_type_count = asset_type_list.length,

      extend_list_fn   = xhiObj.xhiUtilObj._extendList_,
      clone_data_fn    = xhiObj.xhiUtilObj._cloneData_,
      get_vartype_fn   = xhiObj.xhiUtilObj._getVarType_,

      app_idx, app_matrix, solve_map, type_idx, solve_asset_list,
      type_key, make_matrix, key_map, make_key, output_key,
      vendor_list_key, vendor_list,

      asset_list, row_idx, row_count, row_data,

      bundle_key_list, bundle_key_count, j, bundle_key, append_list
      ;

    // Begin process each app provided
    for ( app_idx = 0; app_idx < app_count; app_idx++ ) {
      app_matrix = app_table[ app_idx ];
      solve_map = { app_id : app_matrix.app_id };

      // Begin process css_/js_/path_ make_matrix
      for ( type_idx = 0; type_idx < asset_type_count; type_idx++ ) {
        solve_asset_list = [];

        type_key        = asset_type_list[ type_idx ];
        key_map         = asset_key_map[ type_key ];
        output_key      = key_map.output_key;
        make_key        = key_map.make_key;
        vendor_list_key = key_map.vendor_list_key;

        make_matrix  = app_matrix[ make_key ];
        if ( ! make_matrix ) { continue; }

        if ( make_matrix.do_vendor && vendor_list_key ) {
          vendor_list = vendor_asset_matrix[ vendor_list_key ];
          for ( j = 0; j < vendor_list.length; j++ ) {
            solve_asset_list.push( vendor_list[ j ][ 1 ] );
          }
        }

        // Begin process asset list
        asset_list = make_matrix.asset_list || [];
        row_count  = asset_list.length;
        ASSET: for ( row_idx = 0; row_idx < row_count; row_idx++ ) {
          row_data = asset_list[ row_idx ];
          // Begin expand bundles
          if ( get_vartype_fn( row_data ) === '_Object_' ) {
            bundle_key_list  = row_data.bundle_key_list || [];
            bundle_key_count = bundle_key_list.length;
            for ( j = 0; j < bundle_key_count; j++ ) {
              bundle_key  = bundle_key_list[ j ];
              append_list = bundle_map[ bundle_key ];
              if ( append_list ) {
                extend_list_fn( solve_asset_list,
                  clone_data_fn( append_list )
                );
              }
            }
            continue ASSET;
          }
          // . End expand bundles
          solve_asset_list.push( clone_data_fn( row_data ) );
        }
        // . End process asset list
        solve_map[ output_key ] = solve_asset_list;
      }
      // . End process css_/js_/path_ make_matrix
      appManifestTable.push( solve_map );
    }
    // . End process each app provided
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
    catch ( error_obj ) { return ctx_obj.catch_fn( error_obj ); }
    ctx_obj.then_fn();
  }

  function _01_prepFileSysFn () {
    var ctx_obj = this;

    function rmDistDirFn () {
      shellJsObj.rm( '-rf', fqDistDirname );
      if ( shellJsObj.test( '-d', fqMetaDirname ) ) {
        shellJsObj.rm( '-rf', fqMetaDirname );
      }
      _01_makeDirsFn.call( ctx_obj );
    }

    if ( shellJsObj.test( '-d', fqDistDirname ) ) {
      if ( doHeadless ) { return rmDistDirFn() }
      return xhiObj.askFn(
        'Distribtion directory exists. Wipe and recreate? (Y/n) ',
        function ( str ) {
          if ( str.match( /^[n]/i ) ) {
            return ctx_obj.catch_fn( 'Exiting at user request' );
          }
          rmDistDirFn();
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

    if ( manifest_map.file_js_list ) {
      js_concat_str  = shellJsObj.cat( manifest_map.file_js_list  );
      js_concat_str  = js_concat_str.replace( /\\n/g, '' );
    }
    if ( manifest_map.file_css_list ) {
      css_concat_str = shellJsObj.cat( manifest_map.file_css_list );
    }

    if ( js_concat_str ) {
      uglyJsMap = postObj.uglifyJsObj.minify( js_concat_str, {
        mangle : { toplevel : false, properties : false },
        sourceMap : true
      });

      if ( uglyJsMap.error ) {
        return ctx_obj.catch_fn( uglyJsMap.error );
      }
    }

    if ( css_concat_str ) {
      try {
        uglyCssStr = postObj.uglifyCssObj.processString( css_concat_str );
      }
      catch ( error_obj ) { return ctx_obj.catch_fn( error_obj ); }
    }
    ctx_obj.then_fn();
  }

  function _03_saveUglyFilesFn () {
    var
      ctx_obj      = this,
      manifest_map = appManifestTable[ appManifestIdx ],
      app_id       = manifest_map.app_id,
      write_list   = [],
      promise_list = [],

      write_count, idx, row_list, promise_obj
      ;

    if ( uglyJsMap ) {
      write_list.push(
        [ fqMetaDirname + '/' + app_id + '-min.js',   uglyJsMap.code ]
      );
      write_list.push(
        [ fqMetaDirname + '/' + app_id + '-min.map',  uglyJsMap.map  ]
      );
    }

    if ( uglyCssStr ) {
      write_list.push(
        [ fqDistDirname + '/css/' + app_id + '-min.css', uglyCssStr     ]
      );
    }

    write_count = write_list.length;
    for ( idx = 0; idx < write_count; idx++ ) {
      row_list = write_list[ idx ];
      promise_obj = xhiObj.makeWritePromFn.apply( null, row_list );
      promise_list.push( promise_obj );
    }

    PromiseObj.all( promise_list )
      .then(  ctx_obj.then_fn  )
      .catch( ctx_obj.catch_fn );
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
      [ '-i', fqMetaDirname + '/'    + app_id + '-min.js',
        '-o', fqDistDirname + '/js/' + app_id + '-sp.js',
        '-l', fqMetaDirname + '/'    + app_id + '-sp.log'
      ]
    );
    child_proc_obj.stdout.on( 'data', ondata_fn );
    child_proc_obj.stderr.on( 'data', ondata_fn );
    child_proc_obj.on( 'close', onclose_fn );
  }

  function _05_copyPathsFn () {
    var
      ctx_obj        = this,
      manifest_map   = appManifestTable[ appManifestIdx ],
      path_copy_list = manifest_map.path_copy_list,
      row_count      = path_copy_list.length,

      idx, row_list, is_failed, do_dircopy,
      src_pathname,    tgt_pathname,
      fq_src_pathname, fq_tgt_dirname
      ;

    PATH: for ( idx = 0; idx < row_count; idx++ ) {
      is_failed    = false;
      row_list     = path_copy_list[ idx ];
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

