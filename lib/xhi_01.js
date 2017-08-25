/*jslint node : true */
// == BEGIN PUBLIC METHOD /installFn/ =================================
// Purpose   : Wrap the 'npm install' process for xhi tool
// Example   : xhi install
// Returns   :
//   Runs ctx_obj.catchFn on failure.
//   Runs ctx_obj.nextFn  on success.
// Throws    : none
//
function installFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj      = this,
    commandMap = xhiObj.commandMap,
    logFn      = xhiObj.logFn,
    prefixStr  = '  ' + xhiObj.makePrefixStr( commandMap ),

    streamObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    // Spawn npm install process
    logFn( prefixStr + 'Start' );
    process.chdir( xhiObj.fqProjDirname );
    streamObj = xhiObj.makeSpawnObj( 'npm', [ 'install' ] );
    process.chdir( xhiObj.fqOrigDirname );

    // Add stream handlers
    streamObj.stdout.on( 'data', function ( data ) {
        process.stdout.write( data.toString() );
      }
    );
    streamObj.stderr.on( 'data', function ( data ) {
        process.stderr.write( data.toString() );
      }
    );
    streamObj.on( 'close',
      function ( exit_code ) {
        if ( exit_code === 0 ) {
          logFn( prefixStr + 'Success' );
          xhiObj.nextFn();
        }
        else {
          xhiObj.catchFn(
            prefixStr + 'Fail'
            + '\nFailed to install npm assets.\n'
            + 'Please run "npm install" to diagnose.'
          );
        }
      }
    );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /installFn/ =================================
module.exports = installFn;

