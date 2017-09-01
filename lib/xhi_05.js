/*jslint node : true */
// == BEGIN PUBLIC METHOD /upgradeFn/ =================================
function upgradeFn () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
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

  function failFn () {
    stageStatusMap[ aliasStr ] = false;
    catchFn( arguments );
  }

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

        // TODO: 2017-08-30 mmikowski error: run xhi install, setup here
        // Hack to invalidate the install and setup
        stageStatusMap[ aliasStr ] = true;
        stageStatusMap.install     = false;
        stageStatusMap.setup       = false;

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
