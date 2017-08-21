/*jslint node : true */
// == BEGIN PUBLIC METHOD /upgradeFn/ =================================
function upgradeFn () {
  'use strict';
  var
    ctx_obj     = this,
    catch_fn    = ctx_obj.catchFn,
    command_map = ctx_obj.commandMap,
    log_fn      = ctx_obj.logFn,
    next_fn     = ctx_obj.nextFn,
    prefix_str  = '  ' + ctx_obj.makePrefixStr( command_map ),

    xhi_obj
   ;

  // Spawn git pull process
  log_fn( prefix_str + 'Start' );
  ctx_obj.loadLibsFn();            // Load post-install libs
  xhi_obj = ctx_obj.makeXhiObj();  // Load post-install methods

  // Update all packages
  xhi_obj.ncuObj.run({
    packageFile: ctx_obj.fqProjDirname + '/package.json',
    // Any command-line option can be specified here.
    // These are set by default:
    silent: true,
    jsonUpgraded: true
  }).then( function ( upgrade_data ) {
    log_fn( prefix_str + 'Success' );
    log_fn( upgrade_data );
    next_fn();
  }).catch( function ( error_data ) {
    catch_fn( error_data );
  })
  ;

  // TODO investigate failure
}
// == . END PUBLIC METHOD /upgradeFn/ =================================
module.exports = upgradeFn;
