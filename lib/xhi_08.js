/*jslint node : true */
// == BEGIN PUBLIC METHOD /lintFn/ ====================================
function lintFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,

    PromiseObj     = xhiObj.PromiseObj,
    catchFn        = xhiObj.catchFn,
    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    nextFn         = xhiObj.nextFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr   = commandMap.alias_str,
    jsList     = [],
    todoList   = [],
    whiteList  = [ /^bin\/xhi$/ ],
    whiteCount = whiteList.length,

    jsCount, postObj
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
  // == . END UTILITY METHODS =========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    logFn( prefixStr + 'Start LINT' );
    xhiObj.loadLibsFn();            // Load post-install libs
    postObj = xhiObj.makePostObj();  // Load post-install methods

    // Use flow to execute steps
    postObj.flowObj.exec(
      function _01GetChangeList () {
        var
          then_fn = this,
          local_str = '    01: Get changed js files: ',
          child_obj;

        // Handler for stdin and stderr input
        function onstdin_fn ( data ) {
          var
            ctx_str    = this,
            data_str   = data.toString(),
            line_list  = data_str.split( '\n' ),
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

            if ( clean_str.match( /\.js$/ )
              && ! clean_str.match( /vendor/ )
            ) {
              jsList.push( clean_str );
            }
          }
        }

        // Handler for close
        function onclose_fn ( exit_int ) {
          if ( exit_int === 0 ) {
            logFn( local_str + 'Success' );
            jsCount = jsList.length;
            then_fn();
          }
          else {
            failFn( local_str + 'Fail' );
          }
        }

        logFn( local_str + 'Start' );
        child_obj = xhiObj.makeSpawnObj( 'git', [ 'status' ] );
        child_obj.stdout.on( 'data', onstdin_fn.bind( 'stdout' ) );
        child_obj.stderr.on( 'data', onstdin_fn.bind( 'stderr' ) );
        child_obj.on( 'close', onclose_fn );
      },

      function _JSLintFilesFn () {
        var
          then_fn     = this,
          local_str   = '    02: Check files with JSLint: ',
          child_obj, jslint_arg_list
          ;

        function filter_fn ( data ) {
          var ctx_str = this;
          process[ ctx_str ].write( data.toString() );
        }

        function close_fn ( exit_int ) {
          if ( exit_int === 0 ) {
            logFn( local_str + 'Success' );
            return then_fn();
          }
          failFn( local_str + 'Fail' );
        }

        logFn( local_str + 'Start' );
        if ( jsList.length === 0 ) {
          logFn( '    No JS files changed.' );
          logFn( local_str + 'Success' );
          return then_fn();
        }
        jslint_arg_list = [
          '--config', xhiObj.fqProjDirname + '/config/jslint.conf'
        ].concat( jsList );

        child_obj = xhiObj.makeSpawnObj(
          xhiObj.fqModuleDirname + '/.bin/jslint', jslint_arg_list
        );
        child_obj.stdout.on( 'data', filter_fn.bind( 'stdout' ) );
        child_obj.stderr.on( 'data', filter_fn.bind( 'stderr' ) );
        child_obj.on( 'close', close_fn );
      },

      function _checkSpacingFn () {
        var
          then_fn      = this,
          local_str    = '    03: Check whitespace: ',
          promise_list = [],
          error_list   = [],

          idx, filename, bound_fn, promise_obj
          ;

        // Begin found line handler
        function ongrep_fn ( match_list ) {
          var ctx_obj = this;
          if ( match_list.length > 0 ) {
            error_list.push(
              '    File || ' + ctx_obj.filename
              + ' || has trailing whitespace or tab characters.'
            );
          }
        }
        // . End found line handler

        // Begin on conclusion handler
        function oncomplete_fn () {
          if ( error_list.length === 0 ) {
            logFn( local_str + 'Success' );
            then_fn();
          }
          else {
            error_list.sort();
            console.log( error_list.join( prefixStr ) );
            failFn( local_str + 'Fail' );
          }
        }

        logFn( local_str + 'Start' );
        for ( idx = 0; idx < jsCount; idx++ ) {
          filename = jsList[ idx ];
          bound_fn = ongrep_fn.bind( { filename : filename } );
          promise_obj = postObj.grepFileFn( filename, /\t|\s+$/ );
          promise_obj.then( bound_fn ).catch( failFn );
          promise_list.push( promise_obj );
        }

        PromiseObj.all( promise_list )
          .then( oncomplete_fn )
          .catch( failFn );
      },

      function _makeTodoListFn () {
        var then_fn = this;

        // TODO 2017-08-29 mmikowski info: This is very unix specific
        xhiObj.childProcObj.exec(
          'grep -n \'//\\s* TODO\' $(find ./ -type f -name *.js '
          + '| egrep -v "node_modules|/vendor/|/build/" ) |sort -u',
          function ( error_obj, stdout ) {
            if ( error_obj ) {
              xhiObj.warnFn( '    Error getting TO-DO list' );
              return failFn();
            }

            todoList = stdout
              .replace( /(:\d+:).*TODO /g, '$1\n  ' )
              .split( '\n' );

            then_fn();
          }
        );
      },

      function _checkTodoFn () {
        var
          next_fn = this,
          line_list = [
            '    04: Check to-do comments: ',
            '===== Please review the list of outstanding TO-DOs =====',
            'The format should be as follows:',
            '  TODO <YYYY-MM-DD> <username> <urgency>: <comment>',
            '  <YYYY-MM-DD> = Last modified date    ex. 2018-05-25',
            '  <username>   = User name as in SCMS  ex. mmikowski',
            '  <urgency>    = Syslog level          ex. warn',
            '======================================================='
          ];

        logFn(
           line_list.join( '\n  ' )
          + '\n  '
          + todoList.join( '\n  ' )
        );

        xhiObj.askFn( 'Is this acceptable? (Y/n) ', function ( str ) {
          if ( str.match( /^[n]/i ) ) {
            return failFn( 'Exiting at user request' );
          }
          next_fn();
        });
      },

      function _endLintStageFn () {
        var then_fn = this;

        // Store success and finish
        stageStatusMap[ aliasStr ] = true;
        logFn( prefixStr + 'Success' );
        nextFn();  // run next xhi stage
        then_fn(); // exit flow closure
      }
    );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /lintFn/ ====================================
module.exports = lintFn;
