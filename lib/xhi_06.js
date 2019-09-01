/*
 * lib/xhi_06.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
/*global*/
'use strict';
// == BEGIN PUBLIC METHOD /startHttpFn/ ===============================
// Purpose   : Start http server
// Example   : xhi dev_start
// Returns   :
//   Runs ctx_obj.catchFn on failure.
//   Runs ctx_obj.nextFn  on success.
// Throws    : none
//
function startHttpFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  var
    xhiObj         = this,

    argStr         = xhiObj.fqProjDirname + '/server/index.js',
    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str,
    postObj, cleanupToid, childProcObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN PRIVATE METHODS =========================================
  // BEGIN private method /cleanupFn/
  function cleanupFn ( src_str ) {
    if ( ! src_str ) {
      logFn( prefixStr + 'No error in 2s. Server should work.' );
    }
    else if ( cleanupToid ) {
      clearTimeout( cleanupToid );
      cleanupToid = '';
    }
    childProcObj.unref();

    // Store success and finish
    stageStatusMap[ aliasStr ] = true;
    logFn( prefixStr + 'Success' );
    xhiObj.nextFn();
  }
  // . END pivate method /cleanupFn/
  // == . END PRIVATE METHODS =========================================

  // == BEGIN EVENT HANDLERS ==========================================
  // BEGIN event handler /onErrorFn/
  function onErrorFn ( error_obj ) {
    // Store failure and finish
    stageStatusMap[ aliasStr ] = false;
    xhiObj.warnFn( String( error_obj ) );
    xhiObj.catchFn( prefixStr + 'Fail' );
  }
  // . END event handler /onErrorFn/

  // BEGIN event handler /onExitFn/
  function onExitFn ( code ) {
    // Set to error handler if non-zero
    if ( String( code ) !== '0' ) {
      return onErrorFn( 'Non-zero exit' );
    }
    cleanupFn( '_from_exit_' );
  }
  // . END event handler /onExitFn/

  // BEGIN event handler /onPsListFn/
  function onPsListFn ( error_obj, proc_list ) {
    if ( error_obj ) {
      stageStatusMap[ aliasStr ] = false;
      xhiObj.warnFn( String( error_obj ) );
      return xhiObj.catchFn( prefixStr + 'Fail' );
    }

    if ( proc_list.length > 0 ) {
      logFn( prefixStr + '  server already started' );
      logFn( prefixStr + '  ('
        + String( proc_list.length ) + ' processes)'
      );
      stageStatusMap[ aliasStr ] = true;
      logFn( prefixStr + 'Success' );
      return xhiObj.nextFn();
    }

    // See https://stackoverflow.com/questions/12871740
    childProcObj = xhiObj.makeSpawnObj(
      'node', [ argStr ], { stdio : 'ignore', detached : true }
    );

    // Add stream handlers
    childProcObj.on( 'error', onErrorFn );
    childProcObj.on( 'exit' , onExitFn  );

    // Add timeout
    cleanupToid = setTimeout( cleanupFn, 2000 );
  }
  // . END event handler /onPsListFn/
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    logFn( prefixStr + 'Start' );
    xhiObj.loadLibsFn();
    postObj = xhiObj.makePostObj();
    postObj.psObj.lookup(
      { command : 'node', arguments: [ argStr ] }, onPsListFn );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /startHttpFn/ ===============================
module.exports = startHttpFn;
