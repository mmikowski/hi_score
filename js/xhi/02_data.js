/*
 * 02_data.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._02_data_._makeInstanceFn_( app_map, option_map );
 * Synopsis : Add _02_data_ capabilities to app_map
 * Provides : Shared data transfer methods (AJAX, Websockets)
 * Requires : aMap (app map) with symbols from 00_root._makeInstanceFn_()
 *
 * Vision   : We should be able to load a base 02_data module and then
 *            add capabilities such as web sockets, ajax, local storage,
 *            mock ajax, mock web sockets, ...
*/
/*global $, xhi */
// == BEGIN MODULE xhi._02_data_ ======================================
xhi._02_data_ = ( function () {
  'use strict';
  // == BEGIN public method /makeInstanceFn/ ==========================
  function makeInstanceFn ( aMap, argOptionMap ) {
    // == BEGIN MODULE SCOPE VARIABLES ================================
    var
      subName = '_02_data_',
      aKey    = aMap._aKey_,
      vMap    = aMap._vMap_,
      nMap    = aMap._nMap_,

      // __data2strFn = vMap._data2strFn_,
      // __blank  = vMap._blank_,
      // __false  = vMap._false_,

      __n1     = nMap._n1_,
      __0      = nMap._0_,
      __1      = nMap._1_,

      __Num    = vMap._Number_,
      __null   = vMap._null_,
      __true   = vMap._true_,
      __undef  = vMap._undef_,

      __util   = aMap._01_util_,
      __logObj = __util._getLogObj_(),
      __logMsg = __logObj._logMsg_,

      configMap    = {},
      stateMap     = {
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
        catch ( ignore ) { __logMsg( '_no_cancel_' ); }
      }
    }
    // . END private method /cancelJqxhrList/

    // BEGIN public method /handleNoauth/
    function handleNoauth () {
      cancelJqxhrList();
      return $.gevent[ vMap._publish_ ](
        aKey + '-_data_', { '_use_str_' : '_noauth_' }
      );
    }
    // . END public method /handleNoauth/

    // BEGIN private method /onFailJqxhr/
    function onFailJqxhr ( jqxhr, status_type, error_data ) {
      var smap = this;

      delJqxhrFromList( jqxhr );
      if ( error_data === 'Unauthorized' ) {
        return handleNoauth();
      }
      if ( smap && smap._fail_fn_ ) {
        smap._fail_fn_( error_data, status_type );
      }
      __logMsg( '_error_', '_xhr_failed_', error_data );
    }
    // . END private method /onFailJqxhr/

    // BEGIN private method /onDoneJqxhr/
    function onDoneJqxhr ( arg_data, status_type, jqxhr ) {
      var
        smap       = this,
        data       = arg_data || {},
        status_int = __Num( jqxhr[ vMap._status_ ] ) || 200;

      delJqxhrFromList( jqxhr );

      if ( status_int < 300 ) {
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
        req_map    = __util._castMap_( arg_req_map    ),
        option_map = __util._castMap_( arg_option_map, {} ),
        $defer_obj, context_map
        ;

      if ( ! req_map ) {
        return __logMsg( '_warn_', '_req_map_required_' );
      }
      try {
        $defer_obj = $.ajax( req_map );
      }
      catch ( error_data ) {
        $defer_obj = $.Deferred();
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

    // BEGIN private method /sendHttpRequest/
    // function sendHttpRequest ( arg_map ) {
    //   var
    //     data         = arg_map._data_ === __undef ? __blank : arg_map._data_,
    //     full_url     = arg_map._full_url_,
    //     auth_key     = stateMap._auth_key_,
    //     content_type = __blank,

    //     do_data_encode, jqxhr_obj,
    //     context_map, done_jqxhr_fn,
    //     fail_jqxhr_fn;

    //   // content_type and do_data_encode (data encoding) are only required
    //   // for posting json data
    //   if ( arg_map._content_type_ ) {
    //     content_type   = arg_map._content_type_;
    //     do_data_encode = __false;
    //   }
    //   else {
    //     // content_type = 'application/x-www-form-urlencoded;charset=UTF-8';
    //     do_data_encode = __true;
    //   }

    //   // Callback can be a list executed in-order. Could be useful.
    //   // TODO 2016-06-13 mmikowski warn: Add auth signature as shown here
    //   // beforeSend  : function (jqxhr_obj) {
    //   //  prepareXhrSignature(jqxhr_obj, arg_map._full_url_);
    //   // }
    //   //
    //   jqxhr_obj = $.ajax( full_url, {
    //     headers     : {
    //       Authentication  : auth_key,
    //       Pragma          : 'no-cache',
    //       'Cache-Control' : 'no-cache',
    //       Version         : '1.0'
    //     },
    //     dataType    : 'json',
    //     cache       : __true,
    //     contentType : content_type,
    //     processData : do_data_encode,
    //     type        : arg_map._request_type_ || 'GET',
    //     data        : data
    //   } );

    //   addJqxhrToList( jqxhr_obj );

    //   context_map = {
    //     _done_fn_ : arg_map._done_fn_ || __null,
    //     _fail_fn_ : arg_map._fail_fn_ || __null
    //   };

    //   done_jqxhr_fn = onDoneJqxhr[ vMap._bind_ ]( context_map );
    //   fail_jqxhr_fn = onFailJqxhr[ vMap._bind_ ]( context_map );

    //   jqxhr_obj[ vMap._then_ ]( done_jqxhr_fn, fail_jqxhr_fn );
    // }
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
      __logMsg( '_warn_', '_requested_map_not_available_', type_str );
    }
    // . END Public method /getMapFn/

    // BEGIN Public method /setConfigMapFn/
    function setConfigMapFn ( arg_set_map ) {
      return __util._setConfigMap_( {
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
    optionMap = __util._castMap_( argOptionMap, {} );
    if ( optionMap._dont_autoadd_ !== __true ) {
      aMap[ subName ] = instanceMap;
    }
    return instanceMap;
  }
  // == . END public method /makeInstanceFn/ ==========================
  return { _makeInstanceFn_ : makeInstanceFn }
}());
// == . END MODULE xhi._xhi_02_data_ ==================================
