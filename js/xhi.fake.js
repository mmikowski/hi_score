/**
 *    xhi.fake.js
 *    Fake data for unit tests
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true, todo    : true, unparam  : true
*/
/*global $ */

var __ns = 'xhi', __NS;
/* istanbul ignore next */
try          { __NS = global[ __ns ]; }
catch ( e1 ) { __NS = window[ __ns ]; }

// == BEGIN MODULE _makeFake_ =========================================
__NS._fake_ = function ( aMap ) {
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
  // == END MODULE SCOPE VARIABLES =====================================

  // == BEGIN UTILITY METHODS ==========================================
  // == END UTILITY METHODS ============================================

  // == BEGIN DOM METHODS ==============================================
  // == END DOM METHODS ================================================

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
  // == END PUBLIC METHODS =============================================
};
// == END MODULE _makeFake_ ===========================================
