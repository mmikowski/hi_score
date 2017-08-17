/*jslint node : true */
/* vim: set ft=javascript: */
// == BEGIN PUBLIC METHOD /pullFn/ ===================================
function pullFn () {
  var
    ctx_obj     = this,
    catch_fn    = ctx_obj.catchFn,
    command_map = ctx_obj.commandMap,
    log_fn      = ctx_obj.logFn,
    next_fn     = ctx_obj.nextFn,
    prefix_str  = ctx_obj.makePrefixStr( command_map ),

    stream_obj
    ;

  // Load post-install libs
  ctx_obj.loadLibsFn();
  log_fn( prefix_str + 'Start git pull.' );
  process.chdir( ctx_obj.fqProjDirname );

  // Run git pull.
  // If prereqs are run this is better: xhi_obj.binPathMap[ 'git' ],
  stream_obj = ctx_obj.makeSpawnObj( 'git', [ 'pull' ] );
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
        log_fn( 'Success ' + prefix_str );
        next_fn();
      }
      else {
        catch_fn( 'Fail ' + prefix_str );
      }
    }
  );
}
// == . END PUBLIC METHOD /pullFn/ ===================================
module.exports = pullFn;
