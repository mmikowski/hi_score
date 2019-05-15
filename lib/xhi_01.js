/*
 * lib/xhi_01.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
/*global module */
'use strict';
// == BEGIN PUBLIC METHOD /installFn/ =================================
// Purpose : Wrap 'npm install' for xhi tool
// Example : xhi install
// Returns : none
//   Runs xhiObj.catchFn on failure.
//   Runs xhiObj.nextFn  on success.
// Throws  : none
//
function installFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
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

    // Invalidate all these stages
    xhiObj.xhiUtilObj._clearMap_(
      stageStatusMap, [
        'setup', 'dev_test', 'dev_lint', 'dev_cover', 'build'
      ]
    );
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
