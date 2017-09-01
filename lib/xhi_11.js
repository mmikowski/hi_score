/*jslint node : true */
// == BEGIN PUBLIC METHOD /buildFn/ =================================
function buildFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,
    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str,

    postObj, childProcObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  function onCloseFn ( exit_code ) {
    process.chdir( xhiObj.fqProjDirname );
    if ( exit_code === 0 ) {
      stageStatusMap[ aliasStr ] = true;
      logFn( prefixStr + 'Success' );
      return xhiObj.nextFn();
    }
    xhiObj.catchFn( prefixStr + 'Fail' );
  }
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn() {
    var file_list;
    logFn( prefixStr + 'Start' );
    process.chdir( xhiObj.fqProjDirname + '/config' );
    postObj   = xhiObj.makePostObj();
    file_list = postObj.shellJsObj.ls( '*.buildify' );
    file_list.sort();

    childProcObj = xhiObj.makeSpawnObj(
      xhiObj.fqBinDirname + '/buildify', file_list,
      { stdio : 'inherit' }
    );
    childProcObj.on( 'close', onCloseFn );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /buildFn/ ====================================
module.exports = buildFn;

