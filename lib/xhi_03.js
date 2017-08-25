/*jslint node : true */
// == BEGIN METHOD /printDocFn/ =======================================
// Purpose   : Setup project using package.json as manifest.
// Example   : xhi setup
// Returns   :
//   Runs ctx_obj.catchFn on failure.
//   Runs ctx_obj.nextFn  on success.
// Throws    : none
// Steps     :
//   1. Delete all vendor directories as directed by config.
//      directories in bin, css, font, img, and js
//   2. Copy assets from node_modules to vendor directories with the
//      npm version appended to the names.
//   3. Applies any patches (uglifyjs)
//   4. Install the commit hook if git is detected
//

function printDocFn () {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    xhiObj     = this,
    catchFn    = xhiObj.catchFn,
    commandMap = xhiObj.commandMap,
    fsObj      = xhiObj.fsObj,
    logFn      = xhiObj.logFn,
    nextFn     = xhiObj.nextFn,
    prefixStr  = '  ' + xhiObj.makePrefixStr( commandMap )
    ;

  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  // BEGIN event handler /onReadFileFn/
  function onReadFileFn ( error_obj, file_str ) {
    if ( error_obj ) {
      logFn( prefixStr + 'Fail' );
      return catchFn(  error_obj );
    }
    logFn( '\n' + file_str );
    logFn( prefixStr + 'Success' );
    nextFn();
  }
  // . END event handler /onReadFileFn/
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    logFn( prefixStr + 'Start' );

    fsObj.readFile(
      xhiObj.fqProjDirname + '/doc/spa-arch.md',
      'utf8', onReadFileFn, catchFn
    );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /printDocFn/ ================================
module.exports = printDocFn;

