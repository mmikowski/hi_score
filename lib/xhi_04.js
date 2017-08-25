/*jslint node : true */
// == BEGIN PUBLIC METHOD /pullFn/ ===================================
function pullFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj     = this,
    catchFn    = xhiObj.catchFn,
    commandMap = xhiObj.commandMap,
    logFn      = xhiObj.logFn,
    nextFn     = xhiObj.nextFn,
    prefixStr  = '  ' + xhiObj.makePrefixStr( commandMap ),
    streamObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    // Spawn git pull process
    logFn( prefixStr + 'Start' );
    process.chdir( xhiObj.fqProjDirname );
    streamObj = xhiObj.makeSpawnObj( 'git', [ 'pull' ] );
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
          nextFn();
        }
        else {
          catchFn( prefixStr + 'Fail' );
        }
      }
    );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /pullFn/ ===================================
module.exports = pullFn;

