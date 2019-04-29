/*
 * 02_01_data_mock.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._02_01_data_mock_._makeInstanceFn_( aMap, argOptionMap );
 * Synopsis : Add _02_01_data_mock_ to the app map.
 * Provides : Mock data resources used by aMap.02_data.js
 * Requires : aMap (app map) with symbols from 00_root._makeInstanceFn_()
 * Important: We suggest creating your own 02_01_data_mock for each app.
 *   There is little benefit of using an instance of this module.
 *   Notice appMap.02_01_data_mock is listed before and should be 
 *   loaded before the appMap.02_data. Thus it is a resource for 02_data
 *   and should not rely on or expect 02_data to exist.
 *
*/
/*global xhi */

// == BEGIN MODULE xhi._02_01_data_mock_ ==============================
xhi._02_01_mock_ = (function () {
  'use strict';
  // == BEGIN public method /makeInstanceFn/ ==========================
  function makeInstanceFn ( aMap, argOptionMap ) {
    // == BEGIN MODULE SCOPE VARIABLES ================================
    var
      aKey     = aMap._aKey_,
      nMap     = aMap._nMap_,
      subName  = '_02_fake_',
      vMap     = aMap._vMap_,

      utilObj   = aMap._01_util_,
      logObj = utilObj._getLogObj_(),
      logFn = logObj._logMsg_,

      instanceMap, optionMap
    ;
    // == . END MODULE SCOPE VARIABLES ================================

    // == BEGIN UTILITY METHODS =======================================
    // == . END UTILITY METHODS =======================================

    // == BEGIN DOM METHODS ===========================================
    // == . END DOM METHODS ===========================================

    // == BEGIN PUBLIC METHODS ========================================
    function fetchExampleMap () {
      logFn( '_warn_', '_place_mock_fetch_here_' );
    }

    function configModule () {
      logFn( '_warn_', '_place_mock_config_here_' );
    }

    function logInfo () {
      logFn( '_info_', aKey, vMap, nMap );
    }

    instanceMap = {
      _logInfo_         : logInfo,
      _fetchExampleMap_ : fetchExampleMap,
      _configModule_    : configModule
    };

    optionMap = utilObj._castMap_( argOptionMap, {} );
    if ( optionMap._dont_autoadd_ !== vMap._true_ ) {
      aMap[ subName ] = instanceMap;
    }

    return instanceMap;
    // == . END PUBLIC METHODS ========================================
  }
  // == . END public method /makeInstanceFn/ ==========================
  return { _makeInstanceFn_ : makeInstanceFn };
}());
// == . END MODULE xhi._02_01_data_mock_ ==============================
