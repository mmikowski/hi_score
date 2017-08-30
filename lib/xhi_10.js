/*jslint node : true */
// == BEGIN PUBLIC METHOD /commitFn/ ==================================
function commitFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj     = this,
    catchFn    = xhiObj.catchFn,
    commandMap = xhiObj.commandMap,
    logFn      = xhiObj.logFn,
    nextFn     = xhiObj.nextFn,
    prefixStr  = xhiObj.makePrefixStr( commandMap ),

    childProcObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  function onCloseFn ( exit_code ) {
    if ( exit_code === 0 ) {
      logFn( prefixStr + 'Success' );
      return nextFn();
    }
    catchFn( prefixStr + 'Fail' );
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

