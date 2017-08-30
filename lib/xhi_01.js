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
      xhiObj.catchFn(
        prefixStr + 'Fail'
        + '\nPlease run "npm install" to diagnose.'
      );
    }
  }
  // == . END EVENT HANLDERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    // Spawn npm install process
    logFn( prefixStr + 'Start' );
    process.chdir( xhiObj.fqProjDirname );
    childProcObj = xhiObj.makeSpawnObj(
      'npm', [ 'install' ], { stdio : 'inherit'}
    );
    childProcObj.on( 'close', onCloseFn );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /installFn/ =================================
module.exports = installFn;

