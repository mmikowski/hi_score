/*
 * lib/xhi_13.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
/*global*/
'use strict';
// == BEGIN PUBLIC METHOD /stopHttpFn/ ================================
// Purpose   : Stop http server
// Example   : xhi dev_stop
// Returns   :
//   Runs ctx_obj.catchFn on failure.
//   Runs ctx_obj.nextFn  on success.
// Throws    : none
//
function stopHttpFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  var
    xhiObj         = this,

    PromiseObj     = xhiObj.PromiseObj,
    argStr         = xhiObj.fqProjDirname + '/server/index.js',
    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str,
    postObj, psObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN UTILITY METHODS =========================================
  // BEGIN utility /makeKillPromFn/
  function makeKillPromFn ( proc_map ) {
    return new PromiseObj ( function ( resolve_fn, catch_fn ) {
      psObj.kill( proc_map.pid,
        function ( error_obj ) {
          if ( error_obj ) { return catch_fn( error_obj ); }
          logFn( prefixStr + '  Killed PID ', proc_map.pid );
          resolve_fn();
        }
      );
    });
  }
  // . END utility /makeKillPromFn/
  // == . END UTILITY METHODS =========================================

  // == BEGIN EVENT HANDLERS ==========================================
  // BEGIN event handler /onErrorFn/
  function onFailFn ( error_obj ) {
    // Store failure and finish
    stageStatusMap[ aliasStr ] = false;
    xhiObj.warnFn( String( error_obj ) );
    xhiObj.catchFn( prefixStr + 'Fail' );
  }
  // . END event handler /onErrorFn/

  // BEGIN event handler /onSuccessFn/
  function onSuccessFn () {
    // Store success and finish
    stageStatusMap[ aliasStr ] = true;
    xhiObj.logFn( prefixStr + 'Success' );
    xhiObj.nextFn();
  }
  // . END event handler /onSuccessFn/

  // BEGIN event handler /onPsListFn/
  function onPsListFn ( error_obj, proc_list ) {
    var
      proc_count   = proc_list.length,
      promise_list = [],
      idx, proc_map, promise_obj
      ;

    if ( error_obj ) {
      stageStatusMap[ aliasStr ] = false;
      xhiObj.warnFn( String( error_obj ) );
      return xhiObj.catchFn( prefixStr + 'Fail' );
    }

    if ( proc_count === 0 ) {
      stageStatusMap[ aliasStr ] = true;
      logFn( prefixStr + '  No running server' );
      logFn( prefixStr + 'Success' );
      return xhiObj.nextFn();
    }

    logFn( prefixStr + '  Killing '
      + String( proc_list.length ) + ' processes...'
    );

    for ( idx = 0; idx < proc_count; idx++ ) {
      proc_map    = proc_list[ idx ];
      promise_obj = makeKillPromFn( proc_map );
      promise_list.push( promise_obj );
    }
    PromiseObj.all( promise_list )
      .then( onSuccessFn ).catch( onFailFn );
  }
  // . END event handler /onPsListFn/
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    logFn( prefixStr + 'Start' );
    xhiObj.loadLibsFn();

    // Set up post-install libs and promises
    postObj      = xhiObj.makePostObj();
    psObj        = postObj.psObj;

    // Look up server processes
    postObj.psObj.lookup(
      { command : 'node', arguments: [ argStr ] }, onPsListFn
    );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /stopHttpFn/ ===============================
module.exports = stopHttpFn;
