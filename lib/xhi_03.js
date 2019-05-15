/*
 * lib/xhi_03.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
/*global module */
'use strict';
// == BEGIN METHOD /printDocFn/ =======================================
function printDocFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  var
    xhiObj         = this,

    commandMap     = xhiObj.commandMap,
    fsObj          = xhiObj.fsObj,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str
    ;

  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  // BEGIN event handler /onReadFileFn/
  function onReadFileFn ( error_obj, file_str ) {
    // Store failure and finish
    if ( error_obj ) {
      stageStatusMap[ aliasStr ] = false;
      logFn( prefixStr + 'Fail' );
      return xhiObj.catchFn( error_obj );
    }

    // Store success and finish
    stageStatusMap[ aliasStr ] = true;
    logFn( '\n' + file_str );
    logFn( prefixStr + 'Success' );
    xhiObj.nextFn();
  }
  // . END event handler /onReadFileFn/
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    logFn( prefixStr + 'Start' );

    fsObj.readFile(
      xhiObj.fqProjDirname + '/doc/spa-arch.md',
      'utf8', onReadFileFn, xhiObj.catchFn
    );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /printDocFn/ ================================
module.exports = printDocFn;
