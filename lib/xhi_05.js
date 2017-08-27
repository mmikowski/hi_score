/*jslint node : true */
// == BEGIN PUBLIC METHOD /upgradeFn/ =================================
function upgradeFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    ctxObj      = this,
    catchFn    = ctxObj.catchFn,
    commandMap = ctxObj.commandMap,
    logFn      = ctxObj.logFn,
    nextFn     = ctxObj.nextFn,
    prefixStr  = ctxObj.makePrefixStr( commandMap ),
    writeFn    = require( 'write-file-atomic' )
   ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN EVENT HANDLERS ==========================================
  // BEGIN event handler /onOutdatedFn/
  function onOutdatedFn ( error_data, update_table ) {
    var
      solve_map = {},

      update_count, idx, row_list,
      package_name, current_str, target_str,
      package_str
    ;

    if ( error_data ) { return catchFn( error_data ); }

    update_count = update_table.length;
    for ( idx = 0; idx < update_count; idx++ ) {
      row_list = update_table[ idx ];
      package_name = row_list[ 1 ];
      current_str  = row_list[ 2 ];
      target_str   = row_list[ 4 ];
      solve_map[ package_name ] = target_str;
      logFn(
        'Update ' + package_name + ' from '
        + current_str  + ' to ' + target_str
      );
    }
    // Merge new values to package definition
    Object.assign( ctxObj.pkgMatrix.devDependencies, solve_map );
    // Pretty print
    package_str = JSON.stringify( ctxObj.pkgMatrix, null, '  ' );

    // write-file-atomic for safety!
    writeFn(
      ctxObj.fqPkgFilename,
      package_str,
      function ( error_data ) {
        if ( error_data ) { return catchFn( error_data ); }
        logFn( prefixStr + 'Success' );
        nextFn();
      }
    );
  }
  // . END event handler /onOutdatedFn/

  // BEGIN event handler /onLoadFn/
  function onLoadFn ( error_data, localNpmObj ) {
    if ( error_data ) { return catchFn( error_data ); }
    localNpmObj.outdated( onOutdatedFn );
  }
  // . END event handler /onLoadFn/
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN MAIN ====================================================
  function mainFn () {
    ctxObj.npmObj.load( ctxObj.fqPkgFilename, onLoadFn );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /upgradeFn/ =================================
module.exports = upgradeFn;

