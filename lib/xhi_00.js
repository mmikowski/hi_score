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
    prefixStr  = xhiObj.makePrefixStr( commandMap ),

    fieldKey   = doVerbose ? 'long_str' : 'short_str',

    maxWidth   = 0,
    delimStr   = ': ',

    endStr, startStr,

    charCount, rangeList, rangeCount, rangeIdx, stageMap
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN MAIN ====================================================
  // Show list help if directed or show general help
  function mainFn() {
    rangeList = xhiObj.doListShow ? stageList.slice( 0 ) : [];
    if ( rangeList.length === 0 ) {
      rangeList[ 0 ] = xhiObj.getCommandMap( 0 );
    }

    // Set verbose strings
    endStr   = 'END   ' + prefixStr;
    startStr = 'START ' + prefixStr;

    // Find max field width
    rangeCount = rangeList.length;
    for ( rangeIdx = 0; rangeIdx < rangeCount; rangeIdx++ ) {
      stageMap  = rangeList[ rangeIdx ];
      charCount = stageMap.alias_list[ 0 ].length + 1;
      maxWidth  = charCount > maxWidth ? charCount : maxWidth;
    }

    // Begin display help list
    logFn( startStr );
    for ( rangeIdx = 0; rangeIdx < rangeCount; rangeIdx++ ) {
      stageMap = rangeList[ rangeIdx ];
      logFn(
        stageMap.id + ' '
        + xhiObj.makeRightPadStr( stageMap.alias_list[ 0 ], maxWidth )
        + delimStr + stageMap[ fieldKey ]
      );
    }
    // . End display help list

    // Cleanup and return to xhi
    logFn( endStr );
    nextFn();
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /helpFn/ ====================================
module.exports = helpFn;
