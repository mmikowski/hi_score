/*
 * lib/xhi_19.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
/*global*/
'use strict';
// == BEGIN PUBLIC METHOD /runTestFn/ =================================
function fetchInfoFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  var
    xhiObj         = this,

    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn() {
    logFn( prefixStr + 'Start' );
    logFn( prefixStr + 'This is a placeholder. Edit as desired.' );
    delete stageStatusMap[ aliasStr ]; // Set this on success
    logFn( prefixStr + 'Success' );
    xhiObj.nextFn();
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /runTestFn/ =================================
module.exports = fetchInfoFn;

