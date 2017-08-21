/*jslint node : true */
// == BEGIN PUBLIC METHOD /designDocFn/ ==============================
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

function catFn () {
  'use strict';
  var
    ctx_obj     = this,
    catch_fn    = ctx_obj.catchFn,
    command_map = ctx_obj.commandMap,
    fs_obj      = ctx_obj.fsObj,
    log_fn      = ctx_obj.logFn,
    next_fn     = ctx_obj.nextFn,
    prefix_str  = '  ' + ctx_obj.makePrefixStr( command_map )
    ;

  function print_fn ( error_obj, file_str ) {
    if ( error_obj ) {
      log_fn( prefix_str + 'Fail' );
      return catch_fn(  error_obj );
    }
    log_fn( '\n' + file_str );
    log_fn( prefix_str + 'Success' );
    next_fn();
  }

  log_fn( prefix_str + 'Start' );

  fs_obj.readFile(
    ctx_obj.fqProjDirname + '/doc/spa-arch.md',
    'utf8', print_fn, catch_fn
  );
  log_fn( prefix_str + 'Start' );
}
// == . END PUBLIC METHOD /setupFn/ ==============================
module.exports = catFn;
