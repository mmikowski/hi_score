/*jslint node : true */
/* vim: set ft=javascript: */
// == BEGIN PUBLIC METHOD /helpFn/ ====================================
// Purpose   : xhi help tool
// Example   : xhi help
// Returns   :
//   Ingnores ctx_obj.catchFn.
//   Runs     ctx_obj.nextFn when finished.
// Throws    : none
//
function helpFn () {
  'use strict';
  var
    ctx_obj     = this,
    command_map = ctx_obj.commandMap,
    log_fn      = ctx_obj.logFn,
    next_fn     = ctx_obj.nextFn,
    param_map   = ctx_obj.paramMap,

    do_verbose  = param_map.do_verbose,
    stage_list  = param_map.stage_list,
    prefix_str  = '  ' + ctx_obj.makePrefixStr( command_map ),

    help_key    = do_verbose ? 'long_str' : 'short_str',
    help_list
    ;

  // Show list help if directed or show general help
  log_fn( prefix_str + 'Start' );
  help_list = ctx_obj.doListShow ? stage_list.slice( 0 ) : [];
  if ( help_list.length === 0 ) {
    help_list[ 0 ] = ctx_obj.getCommandMap( 0 );
  }

  // Process help list
  help_list.forEach( function ( stage_map, ignore_idx ) {
    log_fn ( '  ' + stage_map.id + ': '
      + ctx_obj.makeRightPadStr( stage_map.alias_list[ 0 ], 14 )
      + ' | ' + stage_map[ help_key ]
    );
  });
  log_fn( prefix_str + 'Success' );
  next_fn();
}
// == . END PUBLIC METHOD /helpFn/ ====================================
module.exports = helpFn;
