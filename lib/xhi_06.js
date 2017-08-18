/*jslint node : true */
/* vim: set ft=javascript: */
// == BEGIN PUBLIC METHOD /lintFn/ ====================================
function lintFn () {
  var
    ctx_obj     = this,
    catch_fn    = ctx_obj.catchFn,
    command_map = ctx_obj.commandMap,
    js_list     = [],
    log_fn      = ctx_obj.logFn,
    next_fn     = ctx_obj.nextFn,
    prefix_str  = '  ' + ctx_obj.makePrefixStr( command_map ),

    xhi_obj, stream_obj
    ;

  log_fn( prefix_str + 'Start' );
  ctx_obj.loadLibsFn();            // Load post-install libs
  xhi_obj = ctx_obj.makeXhiObj();  // Load post-install methods

  // Use flow to execute steps
  xhi_obj.flowObj.exec(
    function _01GetChangeList () {
      var then_fn = this;
      log_fn( '  step 01: Get changed js files' );
      process.chdir( ctx_obj.fqProjDirname );
      xhi_obj.makeChangedJSList.call(
        { then_fn : then_fn, catch_fn : catch_fn },
        js_list
      );
    },

    function _02JSLintFiles () {
      var
        then_fn     = this,
        js_list_str = js_list.join(' ')
        ;

      log_fn( '  step 02: Run JSLint on all change JS files' );
      if ( js_list_str ) {
        log_fn( '  No JS files changed.' );
        then_fn();
      }

      stream_obj = ctx_obj.makeSpawnObj(
        xhi_obj.fqModuleDirname + '/.bin/jslint', [
          '--config' + ctx_obj.fqProjDirname + '/cfg/jslint.conf',
          js_list_str
        ]
      );
      process.chdir( ctx_obj.fqOrigDirname );

      stream_obj.stdout.on( 'data', function ( data ) {
        process.stdout.write( data.toString() ); }
      );
      stream_obj.stderr.on( 'data', function ( data ) {
        process.stderr.write( data.toString() ); }
      );
      stream_obj.on( 'close',
        function ( exit_code ) {
          if ( exit_code === 0 ) {
            log_fn( '  step 02: JSLint Success' );
            then_fn();
          }
          else {
            catch_fn( '  step 02: JSLint Fail' );
          }
        }
      );
    },

    function _03CheckWhiteSpace () {
      var
        then_fn     = this,
        js_list_str = js_list.join(' ')
        ;

      log_fn( '  step 02: Run JSLint on all change JS files' );
      if ( js_list_str ) { then_fn(); }

      log_fn( '  step 03: Check whitespace and strict on all files' );
      // TODO slurp-in files and review line-by-line
      // xhi_obj.rmVendorDirsFn.call({ then_fn : this, catch_fn : catch_fn });
    },

    function _04ConcludeLint () {
      var then_fn = this;
      process.chdir( ctx_obj.fqOrigDirname );
      log_fn( prefix_str + 'Fail' );
      // Execute next xhi function, then exit flow closure with then_fn
      next_fn();
      then_fn();
    }
  );
}
// == . END PUBLIC METHOD /lintFn/ ====================================
module.exports = lintFn;
