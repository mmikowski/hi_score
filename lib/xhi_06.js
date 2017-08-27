/*jslint node : true */
// == BEGIN PUBLIC METHOD /startHttpFn/ ===============================
function startHttpFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj     = this,
    catchFn    = xhiObj.catchFn,
    commandMap = xhiObj.commandMap,
    logFn      = xhiObj.logFn,
    nextFn     = xhiObj.nextFn,
    prefixStr  = xhiObj.makePrefixStr( commandMap ),

    streamObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  // BEGIN event handler /onCloseSpawnFn/
  function onCloseSpawnFn ( exit_code ) {
    if ( exit_code === 0 ) {
      logFn( prefixStr + 'Success' );
      nextFn();
    }
    else {
      catchFn( prefixStr + 'Fail' );
    }
  }
  // . END event handler /onCloseSpawnFn/
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    // Spawn git pull process
    logFn( prefixStr + 'Start' );

    // See https://stackoverflow.com/questions/12871740
    process.chdir( xhiObj.fqProjDirname );
    streamObj = xhiObj.makeSpawnObj(
      xhiObj.fqModuleDirname + '/.bin/http-server', [],
      {
        detached : true,
        stdio    : [ 'ignore', 'ignore', 'ignore' ]
      }
    );
    process.chdir( xhiObj.fqOrigDirname );

    // Add stream handlers
    streamObj.on( 'close',onCloseSpawnFn );
    streamObj.unref();

    // TODO this is a hack to proceed
    logFn( prefixStr + 'Success' );
    nextFn();
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /startHttpFn/ ===============================
module.exports = startHttpFn;
