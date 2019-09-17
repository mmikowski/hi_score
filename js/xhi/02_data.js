/*
 * 02_data.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._02_data_._makeInstanceFn_( app_map, option_map );
 * Synopsis : Add _02_data_ capabilities to app_map
 * Provides : Shared data transfer methods (AJAX, Websockets)
 * Requires : aMap (app map) with symbols from 00_root._makeInstanceFn_()
*/
/*global xhi, xhiJQ*/
// == BEGIN MODULE xhi._02_data_ ======================================
xhi._02_data_ = ( function ( $ ) {
  'use strict';
  // == BEGIN public method /makeInstanceFn/ ==========================
  function makeInstanceFn ( aMap, argOptionMap ) {
    // == BEGIN MODULE SCOPE VARIABLES ================================
    var
      // Set app symbols (use aMap._aKey_ when needed here)
      nMap    = aMap._nMap_,
      subName = '_02_data_',
      vMap    = aMap._vMap_,

      // Set object symbols
      utilObj = aMap._01_util_,
      logObj  = utilObj._getLogObj_(),

      // Set function symbols
      logFn   = logObj._logMsg_,

      // Set number symbols
      __n1 = nMap._n1_,
      __0  = nMap._0_,
      __1  = nMap._1_,

      // Set scalar symbols
      __Deferred = vMap._Deferred_,
      __null     = vMap._null_,
      __true     = vMap._true_,
      __undef    = vMap._undef_,

      // Set config and state maps
      configMap = {
        _200_int_ : 200,
        _300_int_ : 300
      },

      stateMap  = {
        _active_jqxhr_list_ : [],
        _auth_key_          : __undef,
        _base_url_          : __undef
      },

      instanceMap, optionMap
      ;
    // == . END MODULE SCOPE VARIABLES ================================

    // == BEGIN UTILITY METHODS =======================================
    function encUriCompFn ( str ) { return encodeURIComponent( str ); }
    // == . END UTILITY METHODS =======================================

    // == BEGIN PRIVATE METHODS =======================================
    // BEGIN private method /addJqxhrToList/
    function addJqxhrToList ( jqxhr_obj ) {
      var
        jqxhr_list = stateMap._active_jqxhr_list_,
        list_idx   = jqxhr_list[ vMap._indexOf_ ]( jqxhr_obj );

      if ( list_idx > __n1 ) { return; }
      jqxhr_list[ vMap._push_ ]( jqxhr_obj );
    }
    // . END private method /addJqxhrToList/

    // BEGIN private method /delJqxhrFromList/
    function delJqxhrFromList ( jqxhr_obj ) {
      var
        jqxhr_list = stateMap._active_jqxhr_list_,
        list_idx   = jqxhr_list[ vMap._indexOf_ ]( jqxhr_obj );

      if ( list_idx === __n1 ) { return; }
      jqxhr_list[ vMap._splice_ ]( list_idx, __1 );
    }
    // . END private method /delJqxhrFromList/

    // BEGIN private method /cancelJqxhrList/
    function cancelJqxhrList () {
      var
        jqxhr_list = stateMap._active_jqxhr_list_,
        jqxhr;

      while ( jqxhr_list[ vMap._length_ ] > __0 ) {
        jqxhr = jqxhr_list[ vMap._pop_ ]();
        try { jqxhr[ vMap._cancel_ ](); }
        catch ( ignore ) { logFn( '_no_cancel_' ); }
      }
    }
    // . END private method /cancelJqxhrList/

    // BEGIN private method /onFailJqxhr/
    function onFailJqxhr ( jqxhr, status_type, error_data ) {
      var smap = this;

      delJqxhrFromList( jqxhr );
      if ( error_data === 'Unauthorized' ) {
        cancelJqxhrList();
      }
      if ( smap && smap._fail_fn_ ) {
        return smap._fail_fn_( error_data, status_type );
      }
      logFn( '_error_', '_unhandled_xhr_failed_', error_data );
    }
    // . END private method /onFailJqxhr/

    // BEGIN private method /onDoneJqxhr/
    function onDoneJqxhr ( arg_data, status_type, jqxhr ) {
      var
        smap       = this,
        data       = arg_data || {},
        status_int = utilObj._castInt_(
          jqxhr[ vMap._status_ ], configMap._200_int_
        );

      delJqxhrFromList( jqxhr );

      if ( status_int < configMap._300_int_ ) {
        if ( smap && smap._done_fn_ ) {
          smap._done_fn_( null, data );
        }
        return;
      }
      // Despite successful transmission, status_int says we have a problem
      onFailJqxhr( jqxhr, status_type, arg_data );
    }
    // . END private method /onDoneJqxhr/

    // BEGIN private method /sendHttpRequest/
    function sendHttpRequest ( arg_req_map, arg_option_map ) {
      var
        req_map    = utilObj._castMap_( arg_req_map    ),
        option_map = utilObj._castMap_( arg_option_map, {} ),
        $defer_obj, context_map
        ;

      if ( ! req_map ) {
        return logFn( '_warn_', '_req_map_required_' );
      }
      try {
        $defer_obj = $.ajax( req_map );
      }
      catch ( error_data ) {
        $defer_obj = $[ __Deferred ]();
        $defer_obj.fail( error_data, __null );
        return $defer_obj;
      }

      addJqxhrToList( $defer_obj );

      context_map = {
        _done_fn_ : option_map._done_fn_ || __null,
        _fail_fn_ : option_map._fail_fn_ || __null
      };

      $defer_obj[ vMap._then_ ](
        onDoneJqxhr[ vMap._bind_ ]( context_map ),
        onFailJqxhr[ vMap._bind_ ]( context_map )
      );
      return $defer_obj;
    }
    // . END private method /sendHttpRequest/
    // == . END PRIVATE METHDS ========================================

    // == BEGIN EVENT HANDLERS ========================================
    // == . END EVENT HANDLERS ========================================

    // == BEGIN PUBLIC METHODS ========================================
    // BEGIN Public method /getMapFn/
    function getMapFn ( type_str ) {
      if ( type_str === '_configMap_' ) {
        return configMap;
      }
      if ( type_str === '_stateMap_' ) {
        return stateMap;
      }
      logFn( '_warn_', '_requested_map_not_available_', type_str );
    }
    // . END Public method /getMapFn/

    // BEGIN Public method /setConfigMapFn/
    function setConfigMapFn ( arg_set_map ) {
      return utilObj._setConfigMap_( {
        _input_map_    : arg_set_map,
        _settable_map_ : { _auth_key_ : __true },
        _config_map_   : configMap
      } );
    }
    // . END Public method /setConfigMapFn/

    // BEGIN Public method /initModuleFn/
    function initModuleFn () { }
    // . END Public method /initModuleFn/

    instanceMap = {
      _encUriCompFn_   : encUriCompFn,
      _getMapFn_       : getMapFn,
      _initModuleFn_   : initModuleFn,
      _sendHttpRequest_: sendHttpRequest,
      _setConfigMapFn_ : setConfigMapFn
    };
    // == . END PUBLIC METHODS ========================================
    optionMap = utilObj._castMap_( argOptionMap, {} );
    if ( optionMap._dont_autoadd_ !== __true ) {
      aMap[ subName ] = instanceMap;
    }
    return instanceMap;
  }
  // == . END public method /makeInstanceFn/ ==========================
  return { _makeInstanceFn_ : makeInstanceFn };
}( xhiJQ ));
// == . END MODULE xhi._xhi_02_data_ ==================================
