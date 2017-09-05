/*jslint node : true */
// == BEGIN PUBLIC METHOD /buildFn/ =================================
function buildFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,

    buildId        = xhiObj.buildId,
    buildTable     = xhiObj.buildTable,
    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str,

    postObj, childProcObj,
    buildMapIdx, buildMap
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  function onCloseFn ( exit_code ) {
    process.chdir( xhiObj.fqProjDirname );

    // Store failure and finish
    if ( exit_code !== 0 ) {
      stageStatusMap[ aliasStr ] = false;
      return xhiObj.catchFn( prefixStr + 'Fail' );
    }

    // Update, and if needed, add record to build table
    //  (if already in-table, buildMap is changed "in-place").
    buildMap.time_ms = Date.now();
    if ( buildMapIdx === -1 ) {
      buildTable.push( buildMap );
    }

    // Store success and finish
    stageStatusMap[ aliasStr ] = true;
    logFn( prefixStr + 'Success' );
    xhiObj.nextFn();
  }
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn() {
    var file_list, param_list;

    logFn( prefixStr + 'Start' );

    // Get existing or start build map for record
    buildMapIdx = xhiObj.xhiUtilObj._getListAttrIdx_(
      buildTable, 'build_id', buildId
    );
    if ( ! buildMap ) {
      buildMap = { build_id : buildId };
    }

    // Get list of config files
    // TODO 2017-09-05 mmikowski alert: Create manifests from package.json
    //
    process.chdir( xhiObj.fqProjDirname + '/config' );
    postObj   = xhiObj.makePostObj();
    file_list = postObj.shellJsObj.ls( '*.buildify' );
    file_list.sort();

    // Execute buildify command
    param_list = [ '-i', buildId ].concat( file_list );
    childProcObj = xhiObj.makeSpawnObj(
      xhiObj.fqBinDirname + '/buildify', param_list,
      { stdio : 'inherit' }
    );
    childProcObj.on( 'close', onCloseFn );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /buildFn/ ====================================
module.exports = buildFn;

