/*
 * 02.data.js
 *
 * Use     : xhi._makeData_( app_map );
 * Synopsis: Add _data_ capabilities to app_map
 * Provides: Shared data transfer methods (AJAX, Websockets)
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

// == BEGIN MODULE __NS._makeData_ ====================================
__NS._makeData_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    aKey    = aMap._aKey_,
    vMap    = aMap._vMap_,
    nMap    = aMap._nMap_,
    __util  = aMap._util_,

    __j2str = vMap._JSON_[ vMap._stringify_ ],

    __0     = nMap._0_,
    __1     = nMap._1_,
    __Num   = vMap._Number_,
    __blank = vMap._blank_,
    __false = vMap._false_,
    __n1    = nMap._n1_,
    __null  = vMap._null_,
    __true  = vMap._true_,
    __undef = vMap._undef_,

    __logObj = __util._getLogObj_(),
    __logMsg  = __logObj._logMsg_,

    configMap = {},
    stateMap  = {}
    ;
  // == . END MODULE SCOPE VARIABLES ===================================

  // == BEGIN UTILITY METHODS ==========================================
  function encodeUriComp ( str ) { return encodeURIComponent( str ); }
  // == . END UTILITY METHODS ==========================================

  // == BEGIN PRIVATE METHODS ==========================================
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
    jqxhr_list[ vMap._splice_ ]( list_idx, 1 );
  }

  function cancelJqxhrList () {
    var
      jqxhr_list = stateMap._active_jqxhr_list_,
      jqxhr;

    while ( jqxhr_list[ vMap._length_ ] > __0 ) {
      jqxhr = jqxhr_list[ vMap._pop_ ]();
      try { jqxhr[ vMap._cancel_ ](); }
      catch ( error_obj ) { __logMsg( '_no_cancel_' ); }
    }
  }
  // . END private method /delJqxhrFromList/

  // BEGIN private and public method /handleNoauth/
  function handleNoauth () {
    cancelJqxhrList();
    return $.gevent[ vMap._publish_ ](
      aKey + '-_data_', { '_use_str_' : '_noauth_' }
    );
  }
  // . END private public method /handleNoauth/

  // BEGIN private method /onFailJqxhr/
  function onFailJqxhr ( jqxhr, status_type, error_data ) {
    var smap = this;

    delJqxhrFromList( jqxhr );
    if ( error_data === 'Unauthorized' ) {
      return handleNoauth();
    }
    return smap._fail_fn_ && smap._fail_fn_( error_data, status_type );
  }
  // . END private method /onFailJqxhr/

  // BEGIN private method /onDoneJqxhr/
  function onDoneJqxhr ( arg_data, status_type, jqxhr ) {
    var
      smap       = this,
      data       = arg_data || {},
      status_int = __Num( jqxhr[ vMap._status_] ) || 200;

    delJqxhrFromList( jqxhr );
    if ( status_int < 300 ) {
      return smap._done_fn_ && smap._done_fn_( data );
    }

    // Despite successful transmission, status_int says we have a problem
    onFailJqxhr( jqxhr, status_type, arg_data );
  }
  // . END private method /onDoneJqxhr/

  // BEGIN private method /sendHttpRequest/
  function sendHttpRequest ( arg_map ) {
    var
      data         = arg_map._data_ === __undef ? __blank : arg_map._data_,
      full_url     = arg_map._full_url_,
      auth_key     = stateMap._auth_key_,
      content_type = __blank,

      do_data_encode, jqxhr_obj,
      context_map,    done_jqxhr_fn,
      fail_jqxhr_fn;

    // content_type and do_data_encode (data encoding) are only required
    // for posting json data
    if ( arg_map._content_type_ ) {
      content_type   = arg_map._content_type_;
      do_data_encode = __false;
    }
    else {
      // content_type = 'application/x-www-form-urlencoded;charset=UTF-8';
      do_data_encode = __true;
    }

    // TODO 2016-06-13 mikem info:
    // The done callback of ajax can now take an array of functions,
    // which will be executed in order.  Real cool!
    //
    // TODO 2016-06-13 mikem warn:
    // Consider auth signature as shown here
    // beforeSend  : function (jqxhr_obj) {
    //  prepareXhrSignature(jqxhr_obj, arg_map._full_url_);
    // }
    //
    jqxhr_obj = $.ajax( full_url, {
      headers : {
        Authentication: auth_key,
        Pragma:'no-cache',
        'Cache-Control': 'no-cache',
        Version:'1.0'
      },
      dataType    : 'json',
      cache       : __true,
      contentType : content_type,
      processData : do_data_encode,
      type        : arg_map._request_type_ || 'GET',
      data        : data
    });

    addJqxhrToList( jqxhr_obj );

    context_map = {
      _done_fn_ : arg_map._done_fn_ || __null,
      _fail_fn_ : arg_map._fail_fn_ || __null
    };

    done_jqxhr_fn = onDoneJqxhr[ vMap._bind_ ]( context_map );
    fail_jqxhr_fn = onFailJqxhr[ vMap._bind_ ]( context_map );

    jqxhr_obj[ vMap._then_ ]( done_jqxhr_fn, fail_jqxhr_fn );
  }
  // . END private method /sendHttpRequest/

  // BEGIN private methods for Delete, Get, Post, and Put
  function sendHttpGet ( arg_map ) {
    arg_map._request_type_ = 'GET';
    sendHttpRequest( arg_map );
  }
  function sendHttpDelete ( arg_map ) {
    arg_map._request_type_ = 'DELETE';
    sendHttpRequest( arg_map );
  }
  function sendHttpPost ( arg_map ) {
    arg_map._request_type_ = 'POST';
    sendHttpRequest( arg_map );
  }
  function sendHttpPut ( arg_map ) {
    arg_map._request_type_ = 'PUT';
    sendHttpRequest( arg_map );
  }
  // . END private methods for Delete, Get, Post, and Put
  // == . END PRIVATE METHDS ===========================================

  // == BEGIN EVENT HANDLERS ===========================================
  // == . END EVENT HANDLERS ===========================================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN Public method /initModule/
  function initModule () {
    __logMsg( '_info_', $,
      '\n  __0       === ' + __0,
      '\n  __1       === ' + __1,
      '\n  __blank   === ' + __blank,
      '\n  aKey      === ' +   aKey,
      '\n  aMap      === ' + __j2str( aMap      ),
      '\n  configMap === ' + __j2str( configMap ),
      '\n  stateMap  === ' + __j2str( stateMap  ),
      encodeUriComp,
      sendHttpGet,  sendHttpDelete,
      sendHttpPost, sendHttpPut
    );
  }
  // . END Public method /initModule/

  aMap._data_ = { _initModule_ : initModule };
  // == . END PUBLIC METHODS ===========================================
};
// == . END MODULE __NS._makeData_ =====================================
