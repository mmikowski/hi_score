/*
 * lib/xhi_14.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use JSLint settings config/jslint.conf
*/
/*jslint node : true */

// == BEGIN METHOD /wrapFn/ ===========================================
function restartHttpFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,

    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str
    ;
  // == . end module scope variables ==================================

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
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    var
      start_map     = xhiObj.getCommandMapFn( 'dev_start' ),
      stop_map      = xhiObj.getCommandMapFn( 'dev_stop'  ),
      start_xhi_obj = xhiObj.xhiUtilObj._makeExtractMap_( xhiObj ),
      stop_xhi_obj  = xhiObj.xhiUtilObj._makeExtractMap_( xhiObj ),
      start_fn      = require(
        xhiObj.fqLibDirname + '/xhi_' + start_map.id + '.js'
      ),
      stop_fn       = require(
        xhiObj.fqLibDirname + '/xhi_' + stop_map.id  + '.js'
      )
      ;

    logFn( prefixStr + 'Start' );

    start_xhi_obj.commandMap  = start_map;
    start_xhi_obj.nextFn      = onSuccessFn;
    start_xhi_obj.catchFn     = onFailFn;

    stop_xhi_obj.commandMap   = stop_map;
    stop_xhi_obj.nextFn       = start_fn.bind( start_xhi_obj );
    stop_xhi_obj.catchFn      = onFailFn;

    stop_fn.call( stop_xhi_obj );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /printDocFn/ ================================
module.exports = restartHttpFn;
