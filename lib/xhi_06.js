/*
 * lib/xhi_06.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
// == BEGIN PUBLIC METHOD /startHttpFn/ ===============================
function startHttpFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,

    commandMap     = xhiObj.commandMap,
    execStr        = xhiObj.fqModuleDirname + '/.bin/http-server',
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str,
    postObj, childProcObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  // BEGIN event handler /onErrorFn/
  function onErrorFn ( error_obj ) {
    // Store failure and finish
    stageStatusMap[ aliasStr ] = false;
    xhiObj.warnFn( String( error_obj ) );
    xhiObj.catchFn( prefixStr + 'Fail' );
  }
  // . END event handler /onErrorFn/

  // BEGIN event handler /onCleanupFn/
  function onCleanupFn () {
    childProcObj.unref();

    // Store success and finish
    stageStatusMap[ aliasStr ] = true;
    logFn( prefixStr + 'Success' );
    xhiObj.nextFn();
  }
  // . END event handler /onCleanupFn/

  // BEGIN event handler /onPsListFn/
  function onPsListFn ( error_obj, proc_list ) {
    if ( error_obj ) {
      stageStatusMap[ aliasStr ] = false;
      xhiObj.warnFn( String( error_obj ) );
      return xhiObj.catchFn( prefixStr + 'Fail' );
    }

    if ( proc_list.length > 0 ) {
      logFn( prefixStr + '  http-server already started' );
      logFn( prefixStr + '  ('
        + String( proc_list.length ) + ' processes)'
      );
      stageStatusMap[ aliasStr ] = true;
      logFn( prefixStr + 'Success' );
      return xhiObj.nextFn();
    }

    // See https://stackoverflow.com/questions/12871740
    childProcObj = xhiObj.makeSpawnObj(
      execStr, [], { stdio : 'ignore', detached : true }
    );

    // Add stream handlers
    childProcObj.on( 'error', onErrorFn );
    setTimeout( onCleanupFn, 1000 );
  }
  // . END event handler /onPsListFn/
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    logFn( prefixStr + 'Start' );
    xhiObj.loadLibsFn();
    postObj = xhiObj.makePostObj();
    postObj.psObj.lookup(
      { command : 'node', arguments: [ execStr ] }, onPsListFn );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /startHttpFn/ ===============================
module.exports = startHttpFn;
