/*jslint node : true */
/*global Promise */
// == BEGIN PUBLIC METHOD /lintFn/ ====================================
function lintFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj     = this,
    catchFn    = xhiObj.catchFn,
    commandMap = xhiObj.commandMap,
    jsList     = [],
    logFn      = xhiObj.logFn,
    nextFn     = xhiObj.nextFn,
    prefixStr  = '  ' + xhiObj.makePrefixStr( commandMap ),
    whiteList  = [ /^bin\/xhi$/ ],
    whiteCount = whiteList.length,

    PromiseObj = Promise,

    jsCount, postObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    logFn( prefixStr + 'Start' );
    xhiObj.loadLibsFn();            // Load post-install libs
    postObj = xhiObj.makePostObj();  // Load post-install methods

    // Use flow to execute steps
    postObj.flowObj.exec(
      function _01GetChangeList () {
        var
          then_fn = this,
          local_str = '    01: Get changed js files: ',
          stream_obj;

        // stream filter for stdin and stdout
        function filter_fn ( data ) {
          var
            ctx_str = this,
            data_str = data.toString(),
            line_list = data_str.split( '\n' ),
            line_count = line_list.length,

            i, line_str, clean_str, j, white_rx
          ;

          process[ ctx_str ].write( data_str );

          LINE: for ( i = 0; i < line_count; i++ ) {
            line_str = line_list[ i ];
            if ( !line_str.match( /^\s*(modified|new):/ ) ) {
              continue LINE;
            }
            clean_str = line_str.replace( /^.*:\s*/, '' );

            for ( j = 0; j < whiteCount; j++ ) {
              white_rx = whiteList[ j ];
              if ( clean_str.match( white_rx ) ) {
                jsList.push( clean_str );
                continue LINE;
              }
            }
            if ( clean_str.match( /vendor/ ) ) { continue LINE; }
            jsList.push( clean_str );
          }
        }

        // stream close function
        function close_fn ( exit_code ) {
          if ( exit_code === 0 ) {
            logFn( local_str + 'Success' );
            jsCount = jsList.length;
            then_fn();
          }
          else {
            catchFn( local_str + 'Fail' );
          }
        }

        // Execute stream
        logFn( local_str + 'Start' );
        process.chdir( xhiObj.fqProjDirname );
        stream_obj = xhiObj.makeSpawnObj( 'git', [ 'status' ] );
        stream_obj.stdout.on( 'data', filter_fn.bind( 'stdout' ) );
        stream_obj.stderr.on( 'data', filter_fn.bind( 'stderr' ) );
        stream_obj.on( 'close', close_fn );
      },

      function _02JSLintFiles () {
        var
          then_fn = this,
          js_list_str = jsList.join( ' ' ),
          local_str = '    02: Check files with JSLint: ',
          stream_obj
        ;

        function filter_fn ( data ) {
          var ctx_str = this;
          process[ ctx_str ].write( data.toString() );
        }

        function close_fn ( exit_code ) {
          process.chdir( xhiObj.fqOrigDirname );
          if ( exit_code === 0 ) {
            logFn( local_str + 'Success' );
            then_fn();
          }
          else {
            catchFn( local_str + 'Fail' );
          }
        }

        logFn( local_str + 'Start' );
        if ( !js_list_str ) {
          logFn( '    No JS files changed.' );
          logFn( local_str + 'Success' );
          then_fn();
        }

        stream_obj = xhiObj.makeSpawnObj(
          postObj.fqModuleDirname + '/.bin/jslint', [
            '--config', xhiObj.fqProjDirname + '/config/jslint.conf',
            js_list_str
          ]
        );
        stream_obj.stdout.on( 'data', filter_fn.bind( 'stdout' ) );
        stream_obj.stderr.on( 'data', filter_fn.bind( 'stderr' ) );
        stream_obj.on( 'close', close_fn );
      },

      function _03CheckWhiteSpace () {
        var
          then_fn      = this,
          local_str    = '    03: Check whitespace: ',
          promise_list = [],
          error_list   = [],

          idx, filename, promise_obj
          ;

        function on_grep_fn ( match_list ) {
          if ( match_list.length > 0 ) {
            error_list.push(
              '    File |' + filename
              + '| has trailing whitespace or tab characters.'
            );
          }
        }

        function on_all_fn () {
          if ( error_list.length === 0 ) {
            logFn( local_str + 'Success' );
            then_fn();
          }
          else {
            error_list.sort();
            console.log( error_list.join( prefixStr ) );
            catchFn( local_str + 'Fail' );
          }
        }

        logFn( local_str + 'Start' );
        for ( idx = 0; idx < jsCount; idx++ ) {
          filename = jsList[ idx ];
          promise_obj = postObj.grepFileFn( filename, /\t|\s+$/ );
          promise_obj.then( on_grep_fn ).catch( catchFn );
          promise_list.push( promise_obj );
        }

        PromiseObj.all( promise_list ).then( on_all_fn ).catch( catchFn );
      },

      function _04ConcludeLint () {
        var then_fn = this;
        process.chdir( xhiObj.fqOrigDirname );
        logFn( prefixStr + 'Success' );
        // Execute next xhi function, then exit flow closure with then_fn
        nextFn();
        then_fn();
      }
    );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /lintFn/ ====================================
module.exports = lintFn;

