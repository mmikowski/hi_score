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
    prefixStr  = '  ' + xhiObj.makePrefixStr( commandMap ),

    streamObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  function onStdoutFn ( data ) {
    process.stdout.write( data.toString() );
  }

  function onStderrFn ( data ) {
    process.stderr.write( data.toString() );
  }
  function onCloseFn ( exit_code ) {
    if ( exit_code === 0 ) {
      logFn( prefixStr + 'Success' );
      return nextFn();
    }
    catchFn( prefixStr + 'Fail' );
  }
  function onResponseFn ( response_str ) {
    process.chdir( xhiObj.fqProjDirname );
    streamObj = xhiObj.makeSpawnObj(
      'git', [ 'commit','-an', '-m', response_str ] );
    process.chdir( xhiObj.fqOrigDirname );
    streamObj.stdout.on( 'data',  onStdoutFn );
    streamObj.stderr.on( 'data',  onStderrFn );
    streamObj.on(        'close', onCloseFn  );

  }
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    // We must determine how this is being run.
    // Git commit should not include the commit hook.
    logFn( prefixStr + 'Start' );
    xhiObj.loadLibsFn();
    xhiObj.askFn(
      'Please provide your commit message',
      onResponseFn
    );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /commitFn/ ==================================
module.exports = commitFn;

