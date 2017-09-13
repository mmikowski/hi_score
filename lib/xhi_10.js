/*
 * lib/xhi_10.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use JSLint settings config/jslint.conf
*/
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
    stateMatrix.build_idx += 1;
    stageStatusMap[ aliasStr ] = true;
    logFn( prefixStr + 'Success' );
    xhiObj.nextFn();
  }
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    childProcObj = xhiObj.makeSpawnObj(
      'git', [ 'commit','-an' ], { stdio : 'inherit'}
    );
    childProcObj.on( 'close', onCloseFn );
  }
  // childProcObj.stdout.on( 'data',  onStdoutFn );
  // childProcObj.stderr.on( 'data',  onStderrFn );
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /commitFn/ ==================================
module.exports = commitFn;

