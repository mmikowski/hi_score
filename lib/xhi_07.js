/*
 * lib/xhi_07.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use JSLint settings config/jslint.conf
*/
/*jslint node : true */

// == BEGIN PUBLIC METHOD /runTestFn/ =================================
function runTestFn () {
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

  // == BEGIN EVENT HANDLERS ==========================================
  function onCloseFn ( exit_int ) {
    // Store failure and finish
    if ( exit_int !== 0 ) {
      stageStatusMap[ aliasStr ] = true;
      return xhiObj.catchFn( prefixStr + 'Fail' );
    }

    // Store success and finish
    stageStatusMap[ aliasStr ] = true;
    logFn( prefixStr + 'Success' );
    xhiObj.nextFn();
  }
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn() {
    logFn( prefixStr + 'Start' );
    xhiObj.loadLibsFn();

    childProcObj = xhiObj.makeSpawnObj(
      xhiObj.fqModuleDirname + '/.bin/nodeunit',
      [ xhiObj.fqProjDirname   + '/test.d' ],
      { stdio : 'inherit' }
    );
    childProcObj.on( 'close', onCloseFn );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /runTestFn/ =================================
module.exports = runTestFn;
