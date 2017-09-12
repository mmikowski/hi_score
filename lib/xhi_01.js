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
    xhiObj         = this,

    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr = commandMap.alias_str,
    childProcObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANLDERS ==========================================
  function onCloseFn ( exit_int ) {
    // Store failure and finish
    if ( exit_int !== 0 ) {
      stageStatusMap[ aliasStr ] = false;
      return xhiObj.catchFn(
        prefixStr + 'Fail'
        + '\nPlease run "npm install" to diagnose.'
      );
    }

    // Store success and finish
    stageStatusMap[ aliasStr ] = true;
    logFn( prefixStr + 'Success' );
    xhiObj.loadLibsFn();
    xhiObj.nextFn();
  }
  // == . END EVENT HANLDERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    logFn( prefixStr + 'Start' );
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