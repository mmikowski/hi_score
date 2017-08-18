/*jslint node : true */
/* vim: set ft=javascript: */
// == BEGIN PUBLIC METHOD /installFn/ =================================
// Purpose   : Wrap the 'npm install' process for xhi tool
// Example   : xhi install
// Returns   :
//   Runs ctx_obj.catchFn on failure.
//   Runs ctx_obj.nextFn  on success.
// Throws    : none
//
function installFn () {
  var
    ctx_obj     = this,
    command_map = ctx_obj.commandMap,
    log_fn      = ctx_obj.logFn,
    prefix_str  = '  ' + ctx_obj.makePrefixStr( command_map ),

    stream_obj
    ;

  // Spawn npm install process
  log_fn( prefix_str + 'Start' );
  process.chdir( ctx_obj.fqProjDirname );
  stream_obj = ctx_obj.makeSpawnObj( 'npm', ['install'] );
  process.chdir( ctx_obj.fqOrigDirname );

  // Add stream handlers
  stream_obj.stdout.on( 'data', function ( data ) {
    process.stdout.write( data.toString() ); }
  );
  stream_obj.stderr.on( 'data', function ( data ) {
    process.stderr.write( data.toString() ); }
  );
  stream_obj.on( 'close',
    function ( exit_code ) {
      if ( exit_code === 0 ) {
        log_fn( prefix_str + 'Success' );
        ctx_obj.nextFn();
      }
      else {
        ctx_obj.catchFn(
          prefix_str + 'Fail'
          + '\nFailed to install npm assets.\n'
          + 'Please run "npm install" to diagnose.'
        );
      }
    }
  );
}
// == . END PUBLIC METHOD /installFn/ =================================
module.exports = installFn;

