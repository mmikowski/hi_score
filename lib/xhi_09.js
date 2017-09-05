/*jslint node : true */
// == BEGIN PUBLIC METHOD /coverFn/ ===================================
function coverFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,
    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stateMatrix    = xhiObj.stateMatrix,
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str,
    postObj, childProcObj
    ;

  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  function onCloseFn ( exit_code ) {
    if ( exit_code === 0 ) {
      stageStatusMap[ aliasStr ] = true;
      logFn( prefixStr + 'Success' );
      return xhiObj.nextFn();
    }
    stageStatusMap[ aliasStr ] = false;
    xhiObj.warnFn( exit_code );
    xhiObj.catchFn( prefixStr + 'Fail' );
  }
  // == . END EVENT HANDLERS ==========================================

  function mainFn () {
    var
      build_idx     = stateMatrix.build_idx,
      build_id      = xhiObj.xhiUtilObj._makePadNumStr_( build_idx, 7 ),
      build_dirname = xhiObj.fqProjDirname + '/build/' + build_id
      ;

    logFn( prefixStr + 'Start' );

    // TODO 2017-09-05 mmikowski warn: check if build is done
    //  and searching for build_id in table. If not there, warn user
    //  ("Build not yet complete").
    // buildTable = xhiObj.buildTable;
    // (use xhiObj.xhiUtilObj.... routine

    // Load post-install libs and create build dir if needed
    xhiObj.loadLibsFn();
    postObj = xhiObj.makePostObj();
    postObj.mkdirpFn.sync( build_dirname );

    // Spawn Instanbul process
    childProcObj = xhiObj.makeSpawnObj(
      xhiObj.fqModuleDirname + '/.bin/istanbul',
      [ 'cover', '-x', '**/vendor/**',
        '--dir', build_dirname + '/coverage',
        xhiObj.fqModuleDirname + '/.bin/nodeunit',
        xhiObj.fqProjDirname + '/test.d'
      ],
      { stdio : 'inherit'}
    );
    childProcObj.on( 'close', onCloseFn );
  }
  mainFn();
}
// == . END PUBLIC METHOD /coverFn/ ===================================
module.exports = coverFn;
