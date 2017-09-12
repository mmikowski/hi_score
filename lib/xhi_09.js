/*jslint node : true */
// == BEGIN PUBLIC METHOD /coverFn/ ===================================
function coverFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,

    buildId        = xhiObj.buildId,
    buildRecTable  = xhiObj.buildRecTable,
    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str,
    postObj, shellJsObj, childProcObj,
    buildDirname, buildMap
    ;

  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  function onCloseFn ( exit_int ) {
    // Store failure and finish
    if ( exit_int !== 0 ) {
      stageStatusMap[ aliasStr ] = false;
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
    buildDirname = 'build/' + buildId;

    logFn( prefixStr + 'Start' );
    buildMap = xhiObj.xhiUtilObj._getListAttrMap_(
      buildRecTable, 'build_id', buildId
    );

    // Load post-install libs and create build dir if needed
    xhiObj.loadLibsFn();
    postObj    = xhiObj.makePostObj();
    shellJsObj = postObj.shellJsObj;
    shellJsObj.mkdir( '-p', buildDirname );

    // Spawn Instanbul process
    childProcObj = xhiObj.makeSpawnObj(
      'node_modules/.bin/istanbul',
      [ 'cover', '-x', '**/vendor/**',
        '--dir', buildDirname + '/coverage',
        'node_modules/.bin/nodeunit',
        'test.d'
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
