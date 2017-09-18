/*
 * lib/xhi_00.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
// == BEGIN PUBLIC METHOD /helpFn/ ====================================
// Purpose   : xhi help tool
// Example   : xhi help
// Returns   : none
//   Ingnores xhiObj.catchFn.
//   Runs     xhiObj.nextFn when finished.
// Throws    : none
//
function helpFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,
    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    nextFn         = xhiObj.nextFn,
    paramMap       = xhiObj.paramMap,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr  = commandMap.alias_str,
    doVerbose = paramMap.do_verbose,
    stageList = paramMap.stage_list,

    fieldKey  = doVerbose ? 'long_str' : 'short_str',
    maxWidth  = 0,
    delimStr  = ': ',

    endStr, startStr,

    charCount, rangeList, rangeCount, rangeIdx, stageMap
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN MAIN ====================================================
  // Show list help if directed or show general help
  function mainFn() {
    rangeList = xhiObj.doListShow ? stageList.slice( 0 ) : [];
    if ( rangeList.length === 0 ) {
      rangeList[ 0 ] = xhiObj.getCommandMapFn( 0 );
    }

    // Set verbose strings
    endStr   = 'END   ' + prefixStr;
    startStr = 'START ' + prefixStr;

    // Find max field width
    rangeCount = rangeList.length;
    for ( rangeIdx = 0; rangeIdx < rangeCount; rangeIdx++ ) {
      stageMap  = rangeList[ rangeIdx ];
      charCount = stageMap.alias_str.length + 1;
      maxWidth  = charCount > maxWidth ? charCount : maxWidth;
    }

    // Begin display help list
    logFn( startStr );
    for ( rangeIdx = 0; rangeIdx < rangeCount; rangeIdx++ ) {
      stageMap = rangeList[ rangeIdx ];
      logFn(
        stageMap.id + ' '
        + xhiObj.makeRightPadStr( stageMap.alias_str, maxWidth )
        + delimStr + stageMap[ fieldKey ]
      );
    }
    // . End display help list

    // Cleanup and return to xhi
    logFn( endStr );
    stageStatusMap[ aliasStr ] = true;
    nextFn();
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /helpFn/ ====================================
module.exports = helpFn;
