/*jslint node : true   */
/* vim: set ft=javascript: */
// == BEGIN PUBLIC METHOD /lintFn/ ====================================
function lintFn () {
  'use strict';
  var
    ctx_obj     = this,
    catch_fn    = ctx_obj.catchFn,
    command_map = ctx_obj.commandMap,
    js_list     = [],
    log_fn      = ctx_obj.logFn,
    next_fn     = ctx_obj.nextFn,
    prefix_str  = '  ' + ctx_obj.makePrefixStr( command_map ),

    xhi_obj
    ;

  log_fn( prefix_str + 'Start' );
  ctx_obj.loadLibsFn();            // Load post-install libs
  xhi_obj = ctx_obj.makeXhiObj();  // Load post-install methods

  // Use flow to execute steps
  xhi_obj.flowObj.exec(
    function _01GetChangeList () {
      var
        then_fn     = this,
        local_str   = '  step 01: Get changed js files: ',
        stream_obj;

      // stream filter for stdin and stdout
      function filter_fn ( data ) {
        var
          ctx_str   = this,
          data_str  = data.toString(),
          line_list = data_str.split('\n')
          ;

        process[ ctx_str ].write( data_str );

        line_list.forEach( function ( line_str, ignore_idx ) {
          if ( line_str.match( /vendor/ ) ) { return; }
          if ( line_str.match( /^\s*(modified|new):/ ) ) {
            js_list.push( line_str.replace( /^.*:\s*/, '' ) );
          }
        } );

      }

      // stream close function
      function close_fn ( exit_code ) {
        if ( exit_code === 0 ) {
          log_fn( local_str + 'Success' );
          then_fn();
        }
        else {
          catch_fn( local_str + 'Fail' );
        }
      }

      // Execute stream
      log_fn(  local_str + 'Start' );
      process.chdir( ctx_obj.fqProjDirname );
      stream_obj = ctx_obj.makeSpawnObj( 'git', [ 'status' ] );
      stream_obj.stdout.on( 'data', filter_fn.bind( 'stdout' ) );
      stream_obj.stderr.on( 'data', filter_fn.bind( 'stderr' ) );
      stream_obj.on( 'close', close_fn );
    },

    function _02JSLintFiles () {
      var
        then_fn     = this,
        js_list_str = js_list.join(' '),
        local_str   = '  step 02: Check files with JSLint: ',
        stream_obj
        ;

      function filter_fn ( data ) {
        var ctx_str = this;
        process[ ctx_str ].write( data.toString() );
      }

      function close_fn ( exit_code ) {
        process.chdir( ctx_obj.fqOrigDirname );
        if ( exit_code === 0 ) {
          log_fn( local_str + 'Success' );
          then_fn();
        }
        else {
          catch_fn( local_str + 'Fail' );
        }
      }

      log_fn( local_str + 'Start' );
      if ( ! js_list_str ) {
        log_fn( '  No JS files changed.' );
        log_fn( local_str + 'Success' );
        then_fn();
      }

      stream_obj = ctx_obj.makeSpawnObj(
        xhi_obj.fqModuleDirname + '/.bin/jslint', [
          '--config', ctx_obj.fqProjDirname + '/config/jslint.conf',
          js_list_str
        ]
      );
      stream_obj.stdout.on( 'data', filter_fn.bind( 'stdout' ) );
      stream_obj.stderr.on( 'data', filter_fn.bind( 'stderr' ) );
      stream_obj.on( 'close', close_fn );
    },

    function _03CheckWhiteSpace () {
      var
        then_fn     = this,
        local_str = '  step 03: Check whitespace: '
        ;

      log_fn( local_str + 'Start' );
      // TODO see grepFileFn
      // Consider grepAllFn to check all files at once
      log_fn( local_str + 'Success' );
      then_fn();
    },

    function _04ConcludeLint () {
      var then_fn = this;
      process.chdir( ctx_obj.fqOrigDirname );
      log_fn( prefix_str + 'Success' );
      // Execute next xhi function, then exit flow closure with then_fn
      next_fn();
      then_fn();
    }
  );
}
// == . END PUBLIC METHOD /lintFn/ ====================================
module.exports = lintFn;
