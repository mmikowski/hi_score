/*
 * lib/xhi_12.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
// == BEGIN PUBLIC METHOD /commitFn/ ==================================
function coverFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj         = this,

    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,
    stateMatrix    = xhiObj.stateMatrix,

    aliasStr       = commandMap.alias_str,
    childProcObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  function onCloseFn ( exit_int ) {
    // Store failure and finish
    if ( exit_int !== 0 ) {
      stageStatusMap[ aliasStr ] = false;
      return xhiObj.catchFn( prefixStr + 'Fail' );
    }

    // Increment build index, store success, and finish
    stateMatrix.build_idx++;
    stageStatusMap[ aliasStr ] = true;
    logFn( prefixStr + 'Success' );
    xhiObj.nextFn();
  }
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  // "cat build/latest/coverage/lcov.info | node_modules/.bin/coveralls",
  // See https://stackoverflow.com/questions/28968662
  function mainFn () {
    logFn( prefixStr + 'Start' );
    process.chdir( xhiObj.fqProjDirname );
    childProcObj = xhiObj.makeSpawnObj(
      'sh',
      [ '-c', 'cat build/latest/coverage/lcov.info '
        + '| node_modules/.bin/coveralls'
      ],
      { stdio : 'inherit'}
    );
    childProcObj.on( 'close', onCloseFn );
  }
  // childProcObj.stdout.on( 'data',  onStdoutFn );
  // childProcObj.stderr.on( 'data',  onStderrFn );
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /commitFn/ ==================================
module.exports = coverFn;

