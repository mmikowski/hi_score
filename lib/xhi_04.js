/*jslint node : true */
// == BEGIN PUBLIC METHOD /pullFn/ ===================================
function pullFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj     = this,
    commandMap = xhiObj.commandMap,
    logFn      = xhiObj.logFn,
    prefixStr  = xhiObj.makePrefixStr( commandMap ),
    childProcObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANLDERS ==========================================
  function onCloseFn ( exit_code ) {
    process.chdir( xhiObj.fqOrigDirname );
    if ( exit_code === 0 ) {
      logFn( prefixStr + 'Success' );
      xhiObj.nextFn();
    }
    else {
      xhiObj.catchFn( prefixStr + 'Fail'
        + '\nPlease run "git pull" to diagnose.'
      );
    }
  }
  // == . END EVENT HANLDERS ==========================================


  // == BEGIN MAIN ====================================================
  function mainFn () {
    logFn( prefixStr + 'Start' );
    process.chdir( xhiObj.fqProjDirname );
    childProcObj = xhiObj.makeSpawnObj(
      'git', [ 'pull' ], { stdio : 'inherit' }
    );
    childProcObj.on( 'close', onCloseFn );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /pullFn/ ===================================
module.exports = pullFn;
