/*jslint node : true */
// == BEGIN PUBLIC METHOD /coverFn/ ===================================
function coverFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    xhiObj     = this,
    catchFn    = xhiObj.catchFn,
    commandMap = xhiObj.commandMap,
    logFn      = xhiObj.logFn,
    nextFn     = xhiObj.nextFn,
    prefixStr  = '  ' + xhiObj.makePrefixStr( commandMap ),

    postObj, streamObj
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
  // == . END EVENT HANDLERS ==========================================

  function mainFn () {
    logFn( prefixStr + 'Start' );
    xhiObj.loadLibsFn(); // Load post-install libs
    postObj = xhiObj.makePostObj();

    // Spawn Instanbul process
    process.chdir( xhiObj.fqProjDirname );
    streamObj = xhiObj.makeSpawnObj(
      postObj.fqModuleDirname + '/.bin/istanbul',
      [ 'cover', '-x', '**/vendor/**',
        postObj.fqModuleDirname + '/.bin/nodeunit',
        xhiObj.fqProjDirname + '/test/xhi_level_0.js'
      ]
    );
    process.chdir( xhiObj.fqOrigDirname );

    // Add stream handlers
    streamObj.stdout.on( 'data', onStdoutFn );
    streamObj.stderr.on( 'data', onStderrFn );
    streamObj.on( 'close', onCloseFn );
  }
  mainFn();
}
// == . END PUBLIC METHOD /coverFn/ ===================================
module.exports = coverFn;

