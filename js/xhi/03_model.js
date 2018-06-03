/*
 * 03_model.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._03_model_._makeInstanceFn_( app_map );
 * Synopsis : Add _03_model_ capabilities to app_map
 * Provides : Business logic methods
 * Requires : aMap (app map) with symbols from 00_root._makeInstanceFn_()
 *
 * At present this is mostly just a placeholder.
 * We *may* add TAFFYDB and pub-sub routines here.
 *
*/
/*global xhi */
// == BEGIN MODULE xhi._03_model_ =====================================
xhi._03_model_ = (function () {
  'use strict';
  // == BEGIN public method /makeInstanceFn/ ==========================
  function makeInstanceFn ( aMap, argOptionMap ) {
    // == BEGIN MODULE SCOPE VARIABLES ================================
    var
      subName   = '_03_model_',
      // aKey   = aMap._aKey_,
      vMap      = aMap._vMap_,

      __true    = vMap._true_,
      __util    = aMap._01_util_,
      __logObj  = __util._getLogObj_(),
      __logMsg  = __logObj._logMsg_,

      configMap = {},
      stateMap  = {},

      instanceMap, optionMap
    ;
    // == . END MODULE SCOPE VARIABLES ================================

    // == BEGIN PUBLIC METHODS ========================================
    // BEGIN Public method /getMapFn/
    function getMapFn ( type_str ) {
      if ( type_str === '_configMap_' ) {
        return configMap;
      }
      if ( type_str === '_stateMap_' ) {
        return stateMap;
      }
      __logMsg( '_warn_', '_requested_map_not_available_', type_str );

    }
    // . END Public method /getMapFn/

    // BEGIN Public method /setConfigMapFn/
    function setConfigMapFn ( arg_set_map ) {
      return __util._setConfigMap_({
        _input_map_    : arg_set_map,
        _settable_map_ : { _auth_key_ : __true },
        _config_map_   : configMap
      });
    }
    // . END Public method /setConfigMapFn/

    // BEGIN Public method /initModuleFn/
    function initModuleFn () {
      return __true;
    }
    // . END Public method /initModuleFn/


    instanceMap = {
      _getMapFn_       : getMapFn,
      _initModuleFn_   : initModuleFn,
      _setConfigMapFn_ : setConfigMapFn
    };

    optionMap = __util._castMap_( argOptionMap, {} );
    if ( optionMap._dont_autoadd_ !== __true ) {
      aMap[ subName ] = instanceMap;
    }

    return instanceMap;
    // == . END PUBLIC METHODS ========================================
  }
  // == . END public method /makeInstanceFn/ ==========================
  return { _makeInstanceFn_ : makeInstanceFn };
}());
// == . END MODULE xhi._03_model_ ======================================
