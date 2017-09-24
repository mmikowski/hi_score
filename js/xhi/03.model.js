/*
 * 03.model.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use     : xhi._makeModel_( app_map );
 * Synopsis: Add _model_ capabilities to app_map
 * Provides: Business logic methods
 *
*/
/*global xhi */

// == BEGIN MODULE xhi._makeModelFn_ ===================================
xhi._makeModelFn_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    aKey    = aMap._aKey_,
    vMap    = aMap._vMap_,
    nMap    = aMap._nMap_,
    __util  = aMap._util_,

    __data2strFn = vMap._data2strFn_,

    __0     = nMap._0_,
    __1     = nMap._1_,
    __blank = vMap._blank_,

    __logObj = __util._getLogObj_(),
    __logMsg = __logObj._logMsg_,

    configMap = {},
    stateMap  = {}
    ;
  // == . END MODULE SCOPE VARIABLES ===================================

  // == BEGIN UTILITY METHODS ==========================================
  // == . END UTILITY METHODS ==========================================

  // == BEGIN PRIVATE METHODS ==========================================
  // == . END PRIVATE METHODS ==========================================

  // == BEGIN EVENT HANDLERS ===========================================
  // == . END EVENT HANDLERS ===========================================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN Public method /initModuleFn/
  function initModuleFn () {
    __logMsg( '_info_',
      '\n  __0       === ' + __0,
      '\n  __1       === ' + __1,
      '\n  __blank   === ' + __blank,
      '\n  aKey      === ' +   aKey,
      '\n  aMap      === ' + __data2strFn( aMap      ),
      '\n  configMap === ' + __data2strFn( configMap ),
      '\n  stateMap  === ' + __data2strFn( stateMap  )
    );
  }
  // . END Public method /initModuleFn/

  aMap._model_ = { _initModuleFn_ : initModuleFn };
  // == . END PUBLIC METHODS ===========================================
};
// == . END MODULE xhi._makeModelFn_ ===================================

