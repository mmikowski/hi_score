/*jslint node : true */
// == BEGIN PUBLIC METHOD /startHttpFn/ ====================================
function startHttpFn () {
  'use strict';
  var
    ctx_obj     = this,
    catch_fn    = ctx_obj.catchFn,
    command_map = ctx_obj.commandMap,
    log_fn      = ctx_obj.logFn,
    next_fn     = ctx_obj.nextFn,
    prefix_str  = '  ' + ctx_obj.makePrefixStr( command_map ),

    xhi_obj, stream_obj
  ;

  // Spawn git pull process
  log_fn( prefix_str + 'Start' );
  ctx_obj.loadLibsFn(); // Load post-install libs
  xhi_obj = ctx_obj.makeXhiObj();

  // See https://stackoverflow.com/questions/12871740
  process.chdir( ctx_obj.fqProjDirname );
  stream_obj = ctx_obj.makeSpawnObj(
    xhi_obj.fqModuleDirname + '/.bin/http-server', [],
    { detached: true,
      stdio: ['ignore', 'ignore', 'ignore' ]
    }
  );
  process.chdir( ctx_obj.fqOrigDirname );

  // Add stream handlers
  stream_obj.on( 'close',
    function ( exit_code ) {
      if ( exit_code === 0 ) {
        log_fn( prefix_str + 'Success' );
        next_fn();
      }
      else {
        catch_fn( prefix_str + 'Fail' );
      }
    }
  );
  stream_obj.unref();
}
// == . END PUBLIC METHOD /startHttpFn/ ====================================
module.exports = startHttpFn;
