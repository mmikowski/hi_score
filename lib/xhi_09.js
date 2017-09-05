/*jslint node : true */
// == BEGIN PUBLIC METHOD /coverFn/ ===================================
function coverFn () {
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
    buildDirname, buildMap
    ;

  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  function onCloseFn ( exit_code ) {
    // Store failure and finish
    if ( exit_code !== 0 ) {
      stageStatusMap[ aliasStr ] = false;
      xhiObj.warnFn( exit_code );
      return xhiObj.catchFn( prefixStr + 'Fail' );
    }

    // Notify user of build status
    xhiObj.logFn( prefixStr + '  Coverage stored with ' + buildId + ':' );
    xhiObj.logFn( prefixStr + '    ' + buildDirname );
    if ( buildMap ) {
      xhiObj.logFn( prefixStr + '  This is the most recent build.' );
    }
    else {
      xhiObj.warnFn( prefixStr + '  Build is not yet complete.' );
    }

    // Store success and finish
    stageStatusMap[ aliasStr ] = true;
    logFn( prefixStr + 'Success' );
    xhiObj.nextFn();
  }
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    buildDirname = xhiObj.fqProjDirname + '/build/' + buildId;

    logFn( prefixStr + 'Start' );
    buildMap = xhiObj.xhiUtilObj._getListAttrMap_(
      buildTable, 'build_id', buildId
    );
    // Load post-install libs and create build dir if needed
    xhiObj.loadLibsFn();
    postObj = xhiObj.makePostObj();
    postObj.mkdirpFn.sync( buildDirname );

    // Spawn Instanbul process
    childProcObj = xhiObj.makeSpawnObj(
      xhiObj.fqModuleDirname + '/.bin/istanbul',
      [ 'cover', '-x', '**/vendor/**',
        '--dir', buildDirname + '/coverage',
        xhiObj.fqModuleDirname + '/.bin/nodeunit',
        xhiObj.fqProjDirname + '/test.d'
      ],
      { stdio : 'inherit'}
    );
    childProcObj.on( 'close', onCloseFn );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /coverFn/ ===================================
module.exports = coverFn;
