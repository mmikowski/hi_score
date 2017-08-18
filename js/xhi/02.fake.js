/*
 * 02.fake.js
 *
 * Use     : xhi._makeFake_( app_map );
 * Synopsis: Add mock _data_ capabilities to app_map
 * Provides: Shared mock data transfer methods (AJAX, Websockets)
 *
 * JSLint settings found in config/jslint.conf
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint browser : true */
/*global xhi */

// == BEGIN MODULE xhi._makeFake_ =====================================
xhi._fake_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  //noinspection MagicNumberJS
  var
    aKey    = aMap._aKey_,
    vMap    = aMap._vMap_,
    nMap    = aMap._nMap_,
    __util  = aMap._util_,

    __logObj = __util._getLogObj_(),
    __logMsg  = __logObj._logMsg_
    ;
  // == . END MODULE SCOPE VARIABLES ===================================

  // == BEGIN UTILITY METHODS ==========================================
  // == . END UTILITY METHODS ==========================================

  // == BEGIN DOM METHODS ==============================================
  // == . END DOM METHODS ==============================================

  // == BEGIN PUBLIC METHODS ===========================================
  function fetchExampleMap () {
    __logMsg( '_warn_', '_place_mock_fetch_here_' );
  }
  function configModule () {
    __logMsg( '_warn_', '_place_mock_config_here_' );
  }
  function logInfo () {
    __logMsg( '_info_', aKey, vMap, nMap );
  }
  aMap._fake_ = {
    _logInfo_         : logInfo,
    _fetchExampleMap_ : fetchExampleMap,
    _configModule_    : configModule
  };
  // == . END PUBLIC METHODS ===========================================
};
// == . END MODULE xhi._makeFake_ ======================================
