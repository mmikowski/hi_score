/*
 * lib/xhi_05.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
/*global*/
'use strict';
// == BEGIN PUBLIC METHOD /upgradeFn/ =================================
function upgradeFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  var
    xhiObj         = this,

    catchFn        = xhiObj.catchFn,
    commandMap     = xhiObj.commandMap,
    logFn          = xhiObj.logFn,
    nextFn         = xhiObj.nextFn,
    packageMatrix  = xhiObj.packageMatrix,
    prefixStr      = xhiObj.makePrefixStr( commandMap ),
    stageStatusMap = xhiObj.stageStatusMap,

    aliasStr       = commandMap.alias_str,
    postObj
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN UTILITY METHODS =========================================
  // BEGIN utility /failFn/
  // Purpose: Wrap catchFn to store failure and finish
  //
  function failFn () {
    stageStatusMap[ aliasStr ] = false;
    catchFn( arguments );
  }
  // . END utility /failFn/
  // == . END UTILITY METHODS =========================================

  // == BEGIN EVENT HANDLERS ==========================================
  // BEGIN event handler /onOutdatedFn/
  function onOutdatedFn ( error_data, update_table ) {
    var
      solve_map    = {},
      update_count = update_table.length,

      idx, row_list,
      package_name, current_str, target_str
      ;

    if ( error_data ) { return failFn( error_data ); }

    if ( update_count === 0 ) {
      stageStatusMap[ aliasStr ] = true;
      logFn( prefixStr + 'No package changes' );
      logFn( prefixStr + 'Success' );
      nextFn();
    }

    // Invalidate all these stages
    xhiObj.xhiUtilObj._clearMap_( stageStatusMap, [
      'install', 'setup', 'dev_test', 'dev_lint',
      'dev_cover', 'dev_commit', 'build'
    ]);

    // Load post-install methods
    xhiObj.loadLibsFn();
    postObj = xhiObj.makePostObj();

    // Begin aggregate changes and merge
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
    Object.assign( packageMatrix.devDependencies, solve_map );
    // . End Aggregate changes an merge

    // Save to package file
    postObj.writePkgFileFn(
      function _onWriteFn ( error_data ) {
        if ( error_data ) { return failFn( error_data ); }

        // Mark install and setup as 'out of date'
        stageStatusMap.install     = false;
        stageStatusMap.setup       = false;

        // Store success and finish
        // A successful update invalidates all prior stages
        xhiObj.xhiUtilObj._clearMap_( stageStatusMap );
        stageStatusMap[ aliasStr ] = true;
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
    logFn( prefixStr + 'Start' );
    xhiObj.npmObj.load( xhiObj.fqPkgFilename, onLoadFn );
  }
  // == . END MAIN ====================================================
  mainFn();
}
// == . END PUBLIC METHOD /upgradeFn/ =================================
module.exports = upgradeFn;
