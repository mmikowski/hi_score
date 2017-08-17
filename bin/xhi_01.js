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
    prefix_str  = ctx_obj.makePrefixStr( command_map ),

    stream_obj
    ;

  log_fn( 'Begin ' + prefix_str );
  process.chdir( ctx_obj.fqProjDirname );
  stream_obj = ctx_obj.makeSpawnObj( 'npm', ['install'] );
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
        log_fn(  'Success ' + prefix_str );
        ctx_obj.nextFn();
      }
      else {
        ctx_obj.catchFn(
          'Fail ' + prefix_str
          + '\nFailed to install npm assets.\n'
          + 'Please run "npm install" to diagnose.'
        );
      }
    }
  );
}
// == . END PUBLIC METHOD /installFn/ =================================
module.exports = installFn;

