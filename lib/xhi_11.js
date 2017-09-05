/*jslint node : true */
// == BEGIN PUBLIC METHOD /buildFn/ =================================
function buildFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,
    buildTable     = xhiObj.buildTable,
    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,
    stateMatrix    = xhiObj.stateMatrix,

    aliasStr       = commandMap.alias_str,
    postObj, childProcObj, buildMap
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  function onCloseFn ( exit_code ) {
    process.chdir( xhiObj.fqProjDirname );
    if ( exit_code === 0 ) {

      // Add record to build table and increment build_idx
      // TODO 2017-09-05 mmikowski info: we may wish to add comment_str
      buildMap.time_ms = Date.now();
      buildTable.push( buildMap );
      stateMatrix.build_idx += 1;

      // Store success and finish
      stageStatusMap[ aliasStr ] = true;
      logFn( prefixStr + 'Success' );
      return xhiObj.nextFn();
    }
    stageStatusMap[ aliasStr ] = false;
    xhiObj.catchFn( prefixStr + 'Fail' );
  }
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn() {
    var
      build_idx = stateMatrix.build_idx,
      build_id  = xhiObj.xhiUtilObj._makePadNumStr_( build_idx, 7 ),

      file_list, param_list;

    logFn( prefixStr + 'Start' );

    // Start build map for record
    buildMap = { build_id : build_id };

    // Get list of config files
    // TODO 2017-09-05 mmikowski alert: Create manifests from package.json
    //
    process.chdir( xhiObj.fqProjDirname + '/config' );
    postObj   = xhiObj.makePostObj();
    file_list = postObj.shellJsObj.ls( '*.buildify' );
    file_list.sort();

    // Execute buildify command
    param_list = [ '-i', build_id ].concat( file_list );
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

