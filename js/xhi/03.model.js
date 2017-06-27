/*
 * 03.model.js
 *
 * Use     : xhi._makeModel_( app_map );
 * Synopsis: Add _model_ capabilities to app_map
 * Provides: Business logic methods
 *
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
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

// == BEGIN MODULE __NS._makeModel_ ====================================
__NS._makeModel_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    aKey    = aMap._aKey_,
    vMap    = aMap._vMap_,
    nMap    = aMap._nMap_,
    __util  = aMap._util_,

    __0     = nMap._0_,
    __1     = nMap._1_,
    __blank = vMap._blank_,

    __logObj = __util._getLogObj_(),
    __logMsg  = __logObj._logMsg_,

    topCmap = {},
    topSmap = {}
    ;
  // == . END MODULE SCOPE VARIABLES ===================================

  // == BEGIN UTILITY METHODS ==========================================
  // == . END UTILITY METHODS ==========================================

  // == BEGIN PRIVATE METHODS ==========================================
  // == . END PRIVATE METHODS ==========================================

  // == BEGIN EVENT HANDLERS ===========================================
  // == . END EVENT HANDLERS ===========================================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN Public method /initModule/
  function initModule () {
    __logMsg( '_info_', $,
      '\n  __0     === ' + __0,
      '\n  __1     === ' + __1,
      '\n  __blank === ' + __blank,
      '\n  aKey    === ' + aKey,
      '\n  aMap    === ' + JSON.stringify( aMap ),
      '\n  topCmap === ' + JSON.stringify( topCmap ),
      '\n  topSmap === ' + JSON.stringify( topSmap )
    );
  }
  // . END Public method /initModule/

  aMap._model_ = { _initModule_ : initModule };
  // == . END PUBLIC METHODS ===========================================
};
// == . END MODULE __NS._makeModel_ ====================================

