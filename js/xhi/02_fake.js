/*
 * 02_fake.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._02_fake_._makeInstanceFn_( app_map, option_map );
 * Synopsis : Add _02_fake_ capabilities to app_map
 * Provides : Fake shared data transfer methods (AJAX, Websockets)
 * Requires : aMap (app map) with symbols from 00_root._makeInstanceFn_()
 *
 * Vision   : This module should be replaced by 02_data.ajax-fake.js
 *            and 02_data.wsockets-fake.js, and similar.
 *            At present it is a placeholder.
*/
/*global xhi */

// == BEGIN MODULE xhi._02_fake_ ======================================
xhi._02_fake_ = (function () {
  'use strict';
  // == BEGIN public method /makeInstanceFn/ ==========================
  function makeInstanceFn ( aMap, argOptionMap ) {
    // == BEGIN MODULE SCOPE VARIABLES ================================
    var
      subName  = '_02_fake_',
      aKey     = aMap._aKey_,
      vMap     = aMap._vMap_,
      nMap     = aMap._nMap_,

      __util   = aMap._01_util_,
      __logObj = __util._getLogObj_(),
      __logMsg = __logObj._logMsg_,

      instanceMap, optionMap
    ;
    // == . END MODULE SCOPE VARIABLES ================================

    // == BEGIN UTILITY METHODS =======================================
    // == . END UTILITY METHODS =======================================

    // == BEGIN DOM METHODS ===========================================
    // == . END DOM METHODS ===========================================

    // == BEGIN PUBLIC METHODS ========================================
    function fetchExampleMap () {
      __logMsg( '_warn_', '_place_mock_fetch_here_' );
    }

    function configModule () {
      __logMsg( '_warn_', '_place_mock_config_here_' );
    }

    function logInfo () {
      __logMsg( '_info_', aKey, vMap, nMap );
    }

    instanceMap = {
      _logInfo_         : logInfo,
      _fetchExampleMap_ : fetchExampleMap,
      _configModule_    : configModule
    };

    optionMap = __util._castMap_( argOptionMap, {} );
    if ( optionMap._dont_autoadd_ !== vMap._true_ ) {
      aMap[ subName ] = instanceMap;
    }

    return instanceMap;
    // == . END PUBLIC METHODS ========================================
  }
  // == . END public method /makeInstanceFn/ ==========================
  return { _makeInstanceFn_ : makeInstanceFn };
}());
// == . END MODULE xhi._02_fake_ ======================================
