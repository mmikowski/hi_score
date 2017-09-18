/*
 * lib/xhi_04.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
// == BEGIN PUBLIC METHOD /pullFn/ ===================================
function pullFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,

    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str,
    childProcObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANLDERS ==========================================
  function onCloseFn ( exit_int ) {
    // Store failure and finish
    if ( exit_int !== 0 ) {
      stageStatusMap[ aliasStr ] = false;
      return xhiObj.catchFn( prefixStr + 'Fail'
        + '\nPlease run "git pull" to diagnose.'
      );
    }

    // Store success and finish
    stageStatusMap[ aliasStr ] = true;

    logFn( prefixStr + 'Success' );
    xhiObj.nextFn();
  }
  // == . END EVENT HANLDERS ==========================================


  // == BEGIN MAIN ====================================================
  function mainFn () {
    logFn( prefixStr + 'Start' );

    // Invalidate all these stages
    xhiObj.xhiUtilObj._clearMap_( stageStatusMap, [
      'dev_test', 'dev_lint', 'dev_cover', 'build'
    ]);
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
