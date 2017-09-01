/*jslint node : true */
// == BEGIN PUBLIC METHOD /runTestFn/ =================================
function runTestFn () {
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
  // function onStdoutFn ( data ) {
  //   process.stdout.write( data.toString() );
  // }
  // function onStderrFn ( data ) {
  //   process.stderr.write( data.toString() );
  // }
  function onCloseFn ( exit_code ) {
    if ( exit_code === 0 ) {
      stageStatusMap[ aliasStr ] = true;
      logFn( prefixStr + 'Success' );
      return xhiObj.nextFn();
    }

    stageStatusMap[ aliasStr ] = true;
    xhiObj.catchFn( prefixStr + 'Fail' );
  }
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn() {
    logFn( prefixStr + 'Start' );
    xhiObj.loadLibsFn();

    childProcObj = xhiObj.makeSpawnObj(
      xhiObj.fqModuleDirname + '/.bin/nodeunit',
      [ xhiObj.fqProjDirname   + '/test.d' ],
      { stdio : 'inherit' }
    );
    childProcObj.on( 'close', onCloseFn );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /runTestFn/ =================================
module.exports = runTestFn;
