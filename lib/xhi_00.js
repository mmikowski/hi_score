/*jslint node : true */
// == BEGIN PUBLIC METHOD /helpFn/ ====================================
// Purpose   : xhi help tool
// Example   : xhi help
// Returns   :
//   Ingnores ctx_obj.catchFn.
//   Runs     ctx_obj.nextFn when finished.
// Throws    : none
//
function helpFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj     = this,
    commandMap = xhiObj.commandMap,
    logFn      = xhiObj.logFn,
    nextFn     = xhiObj.nextFn,
    paramMap   = xhiObj.paramMap,

    doVerbose  = paramMap.do_verbose,
    stageList  = paramMap.stage_list,
    prefixStr  = '  ' + xhiObj.makePrefixStr( commandMap ),

    helpKey    = doVerbose ? 'long_str' : 'short_str',
    helpList
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN MAIN ====================================================
  // Show list help if directed or show general help
  function mainFn() {
    logFn( prefixStr + 'Start' );
    helpList = xhiObj.doListShow ? stageList.slice( 0 ) : [];
    if ( helpList.length === 0 ) {
      helpList[ 0 ] = xhiObj.getCommandMap( 0 );
    }

    // Process help list
    helpList.forEach( function ( stage_map, ignore_idx ) {
      logFn( '  ' + stage_map.id + ': '
        + xhiObj.makeRightPadStr( stage_map.alias_list[ 0 ], 12 )
        + ' | ' + stage_map[ helpKey ]
      );
    } );
    logFn( prefixStr + 'Success' );
    nextFn();
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /helpFn/ ====================================
module.exports = helpFn;

