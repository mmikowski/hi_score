/*jslint node : true */
// == BEGIN PUBLIC METHOD /coverFn/ ===================================
function coverFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj     = this,
    commandMap = xhiObj.commandMap,
    logFn      = xhiObj.logFn,
    prefixStr  = xhiObj.makePrefixStr( commandMap ),

    childProcObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  function onCloseFn ( exit_code ) {
    if ( exit_code === 0 ) {
      logFn( prefixStr + 'Success' );
      return xhiObj.nextFn();
    }
    xhiObj.warnFn( exit_code );
    xhiObj.catchFn( prefixStr + 'Fail' );
  }
  // == . END EVENT HANDLERS ==========================================

  function mainFn () {
    logFn( prefixStr + 'Start' );
    xhiObj.loadLibsFn(); // Load post-install libs

    // Spawn Instanbul process
    childProcObj = xhiObj.makeSpawnObj(
      xhiObj.fqModuleDirname + '/.bin/istanbul',
      [ 'cover', '-x', '**/vendor/**',
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
