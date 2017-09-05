/*jslint node : true */
// == BEGIN PUBLIC METHOD /commitFn/ ==================================
function commitFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,
    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str,

    childProcObj
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
    xhiObj.catchFn( prefixStr + 'Fail' );
  }
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    childProcObj = xhiObj.makeSpawnObj(
      'git', [ 'commit','-an' ],
      { stdio : 'inherit'}
    );
    // childProcObj.stdout.on( 'data',  onStdoutFn );
    // childProcObj.stderr.on( 'data',  onStderrFn );
    childProcObj.on(        'close', onCloseFn  );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /commitFn/ ==================================
module.exports = commitFn;

