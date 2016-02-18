/**
 *   hi.util.js - utilities which do not require a browser
 *
 *   Michael S. Mikowski - mike.mikowski@gmail.com
 *   These are routines I have created and updated
 *   since 1998, with inspiration from around the web.
 *   MIT License.
 *
*/

/*jslint         browser : true, continue : true,
   devel : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
   white : true,    todo : true,  unparam : true
*/
/*global sprintf, hi*/

hi._util_ = (function () {
  'use strict';
  // ================= BEGIN MODULE SCOPE VARIABLES ===================
  //noinspection MagicNumberJS
  var
    vMap      = hi._vMap_,
    nMap      = hi._nMap_,

    __Num     = vMap._Number_,
    __Str     = vMap._String_,
    __blank   = vMap._blank_,
    __false   = vMap._false_,
    __null    = vMap._null_,
    __true    = vMap._true_,
    __undef   = vMap._undef_,

    __0       = nMap._0_,
    __1       = nMap._1_,

    mathFloor = Math.floor,
    topCmap = {
      _offset_yr_ : 1900,
      _tmplt_rx_  : /%!%([^%]+)%!%/g,
      _10k_   : 10000
    },
    logUtilObj,

    deleteAllObjKeys, fillTmplt,
    getClockStr,      getDateStr,
    getListAttrIdx,   getListDiff,
    getLogUtilObj,
    getNumSign,       getVarType,
    makeArgList,      makeCommaNumStr,
    makeError,        makeGuidStr,
    makeListPlus,     makeMapUtilObj,
    makeSeenMap,      makeTimeStamp,
    makeUcFirstStr,   setConfigMap
    ;
  // ================== END MODULE SCOPE VARIABLES ====================

  // ===================== BEGIN UTILITY METHODS ======================
  // BEGIN define logUtilObj singleton
  logUtilObj = (function () {
    var
      levelXCmdMap = {
        _emerg_  : 'error',
        _alert_  : 'error',
        _crit_   : 'error',
        _error_  : 'error',
        _warn_   : 'warn',
        _notice_ : 'log',
        _info_   : 'info',
        _debug_  : 'info'
      },
      levelXIdxMap = {
        _emerg_  : __0,
        _alert_  : __1,
        _crit_   : nMap._2_,
        _error_  : nMap._3_,
        _warn_   : nMap._4_,
        _notice_ : nMap._5_,
        _info_   : nMap._6_,
        _debug_  : nMap._7_
      },

      levelKey = '_warn_',
      levelIdx   = levelXIdxMap[ levelKey ],

      consoleRef,
      setLogLevel, getLogLevel, logIt;

    // favor node console if available
    //noinspection UnusedCatchParameterJS
    try { consoleRef = global.console; }
    catch ( error ) {
      if ( window ) {
        consoleRef = window.console;
      }
      else {
        throw '_cannot_find_console_function_';
      }
    }

    setLogLevel = function ( level_key ) {
      if ( ! levelXIdxMap[ level_key ] ) { return __false; }

      levelKey = level_key;
      levelIdx = levelXIdxMap[ level_key ];
      return __true;
    };

    getLogLevel = function () {
      return levelKey;
    };

    // This follows syslog level conventions
    logIt = function ( ) {
      var
        arg_list = [],
        arg_count, level_key, level_cmd;

      // convert argument list to an array (yeah!)
      arg_list  = arg_list[ vMap._slice_ ][ vMap._call_ ]( arguments, __0 );
      arg_count = arg_list[ vMap._length_ ];

      if ( arg_count < nMap._2_ ) { return __false; }

      level_key = arg_list[ __0 ];

      if ( ( levelXIdxMap[ level_key ] || __0 ) > levelIdx ) {
        return __false;
      }

      level_cmd = levelXCmdMap[ level_key ];

      // Some safety precautions
      //
      if ( ! consoleRef ) { return __false; }
      if ( ! level_cmd  ) { return __false;  }
      if ( ! consoleRef[ level_cmd ] ) {
        level_cmd = levelXCmdMap._info_;
        if ( ! consoleRef[ level_cmd ] ) { return __false; }
      }

      // Try to log the best we know how
      //noinspection UnusedCatchParameterJS
      try {
        consoleRef[ level_cmd ][ vMap._apply_ ]( consoleRef, arg_list );
      }
      // The only problem that cause a failure is that the log
      // command cant handle more than a single argument or will not
      // allow the apply method (think: IE).
      // We try our best to share something ...
      //
      catch ( error0 ) {
        //noinspection UnusedCatchParameterJS
        try  {
          consoleRef[ level_cmd ]( arg_list[ __1 ] );
        }

        // Everything failed.  We give up.
        //
        catch ( error1 ) {
          return __false;
        }
      }
      return __true;
    };

    return {
      _setLogLevel_ : setLogLevel,
      _getLogLevel_ : getLogLevel,
      _logIt_       : logIt
    };
  }());
  // END define logUtilObj singleton
  // ====================== END UTILITY METHODS =======================

  // ===================== BEGIN PUBLIC METHODS =======================
  // BEGIN public method /compileDustMap/
  //// For compiling dust templates
  //compileDustMap = function ( template_map ){
  //  var tmplt_name, dust_compilation;
  //  // compile all the templates
  //  for ( tmplt_name in template_map ) {
  //    if ( template_map[ vMap._hasOwnProp_ ]( tmplt_name ) ) {
  //      dust_compilation = dust.compile( template_map[tmplt_name],
  //        tmplt_name );
  //      dust.loadSource( dust_compilation );
  //    }
  //  }
  //};
  // END public method /compileDustMap/
  //
  // BEGIN public method /_deleteAllObjKeys_/
  deleteAllObjKeys = function ( ref_obj ) {
    var
      key_list  = vMap._getKeys_( ref_obj ),
      key_count = key_list[ vMap._length_ ],
      i, key;

    for ( i = __0; i < key_count; i++ ) {
      key = key_list[ i ];
      delete ref_obj[ key ];
    }
  };
  // END public method /_deleteAllObjKeys_/

  // BEGIN public utility /_fillTmplt_/
  fillTmplt = function ( arg_map ) {
    var
      input_str  = arg_map._input_str_,
      lookup_map = arg_map._lookup_map_,
      tmplt_rx   = arg_map._tmplt_rx_ || topCmap._tmplt_rx_,
      lookup_fn;

    /*jslint unparam: true*/
    lookup_fn = function ( match, name ) {
      var rv = name && lookup_map;
      name[ vMap._split_ ]('.').forEach(
        function( ename /*idx*/ ) { rv = rv && rv[ename]; }
      );
      return ( rv === __undef ) ? __blank : rv;
    };
    /*jslint unparam: false*/

    return input_str.replace( tmplt_rx, lookup_fn );
  };
  // END public utility /_fillTmplt_/

  // BEGIN public utility /_getClockStr_/
  // Given seconds, returns a HH:MM:SS clock
  getClockStr = function ( sec ) {
    var
      min_sec        = topCmap.min_sec,
      secs_int       = sec % min_sec,
      min_int        = mathFloor( sec / min_sec ),
      min_disp_int   = min_int % min_sec,
      hr_int         = mathFloor( min_int / min_sec ),
      clock_str
      ;

    clock_str = sprintf('%02d:%02d:%02d',hr_int, min_disp_int, secs_int);
    return clock_str;
  };
  // END public utility /_getClockStr_/

  // BEGIN public utility /_getDateStr_/
  getDateStr = function ( date_data, do_time ) {
    var
      data_type = getVarType( date_data ),
      date_obj, year_int, mon_int,
      day_int, hr_int, min_int, sec_int;

    switch ( data_type ) {
      case '_Number_' : date_obj = new Date( date_data ); break;
      case '_Object_' : date_obj = date_data; break;
      default : return __blank;
    }

    //noinspection NestedFunctionCallJS
    year_int   = __Num( date_obj.getYear() ) + topCmap._offset_yr_;
    //noinspection NestedFunctionCallJS
    mon_int    = __Num( date_obj.getMonth() ) + __1;
    //noinspection NestedFunctionCallJS
    day_int    = __Num( date_obj.getDate() );

    // no time requested
    if ( ! do_time ) {
      return sprintf( '%4d-%02d-%02d', year_int, mon_int, day_int);
    }

    // time requested
    //noinspection NestedFunctionCallJS
    hr_int   = __Num( date_obj.getHours()   );
    //noinspection NestedFunctionCallJS
    min_int  = __Num( date_obj.getMinutes() );
    //noinspection NestedFunctionCallJS
    sec_int  = __Num( date_obj.getSeconds() );

    return sprintf(
      '%4d-%02d-%02d %02d:%02d:%02d',
      year_int, mon_int, day_int,
      hr_int, min_int, sec_int
    );
  };
  // END public utility /_getDateStr_/

  // BEGIN public utility /_getListAttrIdx_/
  getListAttrIdx = function ( list, key_name, key_val ) {
    var
      attr_count = list[ vMap._length_ ],
      found_idx  = nMap._n1_,
      i, list_obj
      ;

    for ( i = __0; i < attr_count; i++ ) {
      list_obj = list[ i ];
      if ( list_obj[ key_name ] === key_val ) {
        found_idx = i;
        break;
      }
    }
    return found_idx;
  };
  // END public utility /_getListAttrIdx_/

  // BEGIN public utility /_getListDiff_/
  getListDiff = function ( first_list, second_list ){
    return first_list.filter(
      function ( idx ) {
        return second_list[ vMap._indexOf_ ]( idx ) === nMap._n1_;
      }
    );
  };
  // END public utility /_getListDiff_/

  // BEGIN public utility /getLogUtilObj/
  getLogUtilObj = function () {
    return logUtilObj;
  };
  // END public utility /getlogUtilObj/

  // BEGIN public utility /_getNumSign_/
  getNumSign = function ( n ){
    if ( isNaN(n) ){ return NaN; }
    if ( n < __0 ){ return nMap._n1_; }
    return __1;
  };
  // END public utility /_getNumSign_/

  // BEGIN public utility /_getVarType_/
  // Returns '_Function_', '_Object_', '_Array_',
  // '_String_', '_Number_', '_Null_', '_Boolean_', or '_Undefined_'
  //
  getVarType = (function () {
    var
      get_type_fn,
      typeof_map = {
        'boolean'       : '_Boolean_',
        'number'        : '_Number_',
        'string'        : '_String_',
        'function'      : '_Function_',
        'object'        : '_Object_',
        'undefined'     : '_Undefined_',

        'Array'          : '_Array_',
        'Boolean'        : '_Boolean_',
        'Function'       : '_Function_',
        'Null'           : '_Null_',
        'Number'         : '_Number_',
        'Object'         : '_Object_',
        'String'         : '_String_',
        'Undefined'      : '_Undefined_'
      };

    get_type_fn = function ( data ) {
      var type_key, type_str;

      if ( data === __null  ) { return '_Null_'; }
      if ( data === __undef ) { return '_Undefined_'; }

      type_key = typeof data;
      type_str = typeof_map[ type_key ];

      if ( type_str && type_str !== '_Object_' ) { return type_str; }
      type_key = {}[ vMap._toString_ ][ vMap._call_ ](
        data )[ vMap._slice_ ]( nMap._8_, nMap._n1_ );

      //noinspection NestedConditionalExpressionJS
      return typeof_map[ type_key ] ||  type_key;
    };

    return get_type_fn;
  }());
  // END public utility /_getVarType_/

  // BEGIN public utility /_makeArgList_/
  // Converts an argument object into a real array...
  //
  makeArgList = function ( arg_obj ) {
    // The following technique is around 3x faster than
    //   return Array.prototype.slice.call( arg_obj );
    // See https://github.com/petkaantonov/bluebird/wiki/\
    //   Optimization-killers#3-managing-arguments
    var arg_list = [], i;
    for ( i = 0; i < arguments.length; i++ ) {
      arg_list[i] = arguments[i];
    }
    return arg_list;
  };
  // END public utility /_makeArgList_/

  // BEGIN public utility /_makeCommaNumStr_/
  makeCommaNumStr = function ( num ){
    var s_num;
    if ( num > topCmap._10k_ ){
      //noinspection NestedFunctionCallJS
      return __Str(parseInt( (num / nMap._1000_ ), nMap._10_ )) + 'K';
    }
    //noinspection NestedFunctionCallJS
    s_num = __Str(parseInt( num, nMap._10_ ));
    return s_num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  };
  // END public utility /_makeCommaNumStr_/

  // BEGIN public method /_makeError_/
  // Purpose: a convenience wrapper to create an error object
  // Arguments:
  //   * name_text - the error name
  //   * msg_text  - long error message
  //   * data      - optional data attached to error object
  // Returns  : newly constructed error object
  // Throws   : none
  //
  makeError = function ( name_text, msg_text, data ) {
    var error = new Error();
    error.name = 'sl:' + name_text;
    if ( msg_text ) { error.description = msg_text; }
    if ( data ){ error.data = data; }

    return error;
  };
  // END public method /_makeError_/

  // BEGIN public method /_makeGuidStr_/
  makeGuidStr = (function (){
    var makePart, mainFn;

    /*jslint bitwise: true*/
    makePart = function() {
      //noinspection NonShortCircuitBooleanExpressionJS,MagicNumberJS
      return (((__1+Math.random())*0x10000)|0).toString(16).substring(__1);
    };
    /*jslint bitwise: false*/

    mainFn = function () {
      return makePart() + makePart()
        + '-' + makePart()
        + '-' + makePart()
        + '-' + makePart()
        + '-' + makePart() + makePart() + makePart()
        ;
    };

    return mainFn;
  }());
  // END public method /_makeGuidStr_/

  // BEGIN public method /_makeListPlus_/
  // Returns an array with much desired methods:
  //   * remove_val(value) : remove element that matches
  //     the provided value. Returns number of elements
  //     removed.
  //   * match_val(value)  : shows if a value exists
  //   * push_uniq(value)  : pushes a value onto the stack
  //     iff it does not already exist there
  // The reason I need this is to compare objects to
  //   primary utility.
  makeListPlus = (function () {
    var checkMatchVal, removeListVal, pushUniqVal, mainFn;

    checkMatchVal = function ( data ){
      var match_count = __0, idx;
      for ( idx = this[ vMap._length_]; idx; __0 ){
        //noinspection IncrementDecrementResultUsedJS
        if ( this[--idx] === data ){ match_count++; }
      }
      return match_count;
    };
    removeListVal = function ( data ){
      var removed_count = __0, idx;
      for ( idx = this[ vMap._length_ ]; idx; __0 ){
        //noinspection IncrementDecrementResultUsedJS
        if ( this[--idx] === data ){
          this.splice(idx, __1 );
          removed_count++;
          idx++;
        }
      }
      return removed_count;
    };
    pushUniqVal = function ( data ){
      if ( checkMatchVal.call(this, data ) ){ return false; }
      this.push( data );
      return __true;
    };
    mainFn = function ( input_list ) {
      var return_list;
      if ( input_list && Array.isArray( input_list ) ){
        if ( input_list.remove_val ){
          console.warn('The array appears to already have listPlus capabilities');
          return input_list;
        }
        return_list = input_list;
      }
      else {
        return_list = [];
      }
      return_list.remove_val = removeListVal;
      return_list.match_val  = checkMatchVal;
      return_list.push_uniq  = pushUniqVal;

      return return_list;
    };
    return mainFn;
  }());
  // END public method /_makeListPlus_/

  // BEGIN public method /_makeSeenMap_/
  // Purpose: Convert an array into a map keyed by the array values.
  // Assign value to all keys.
  makeSeenMap = function ( list, value ){
    var i, key, seen_map = {};
    for ( i = __0; i < list[ vMap._length_ ]; i++ ){
      key = list[ i ];
      seen_map[ key ] = value;
    }
    return seen_map;
  };
  // END public method /_makeSeenMap_/

  // BEGIN public method /_makeTimeStamp_/
  makeTimeStamp = function () { return +new Date(); };
  // END public method /_makeTimeStamp_/

  // BEGIN public method /_makeUcFirstStr_/
  makeUcFirstStr = function ( s_input_in ) {
    var
      s_input = __Str(s_input_in),
      f   = s_input.charAt(__0).toUpperCase()
      ;

    return f + s_input.substr( __1 );
  };
  // END public method /_makeUcFirstStr_/

  // BEGIN public utility object /makeMapUtilObj/
  // Purpose: Creates a thread-safe map utility object
  //   useful to streamling list.map() functions and
  //   avoiding nested functions.
  //
  // Example:
  // 1. Create a map_util object:
  // var map_util_obj = makeMapUtilObj();
  //
  // 2. (optional) Set any data your map function will use.
  //   map_util_obj._setArgList_ = [ name_list ];
  //
  // 3. Create a function that for element of the array.
  // mapUtil_renameFn = function ( field_data, idx, list, setArgList ) {
  //   var
  //     name_list  = setArgList[ __0 ],
  //     field_key = name_list[ idx ];
  //
  //   // return key, value
  //   return [ field_key, field_data ];
  //
  //   // return nothing to not add to the map
  // };
  //
  // 3. Set the function in the utility
  //   map_util_obj._setMapFn_( mapUtil_renameFn );
  //
  // 4. Initialize the result map.  You need this pointer.
  //   result_map = {};
  //   map_util_obj._setResultMap_( result_map );
  //
  // 5. Invoke the map function:
  //   my_list.map( map_util_obj._invokeFn_ );
  //
  // 6. result_map will now contain the results!
  //
  // This is an excellent example of how a closure creates
  // unique private variables in each instance returned, such
  // as the stored argList, resultMap, and mapFn.
  //
  //
  makeMapUtilObj = function () {
    var
      resultMap, argList, mapFn,
      getArgList, setArgList, setMapFn, setResultMap,
      invokeFn;

    getArgList   = function (            ) { return argList;         };
    setArgList   = function ( arg_list   ) { argList = arg_list;     };
    setMapFn     = function ( map_fn     ) { mapFn = map_fn;         };
    setResultMap = function ( result_map ) { resultMap = result_map; };

    invokeFn = function ( field_data, idx, list ) {
      var ret_list, ret_key, ret_data;

      ret_list = mapFn( field_data, idx, list, argList );
      if ( ! ret_list ) { return; }
      ret_key  = ret_list[ __0 ];
      ret_data = ret_list[ __1 ];

      resultMap[ ret_key ] = ret_data;
    };

    return {
      _getArgList_   : getArgList,
      _setResultMap_ : setResultMap,
      _setArgList_   : setArgList,
      _setMapFn_     : setMapFn,
      _invokeFn_     : invokeFn
    };
  };
  // END public utility object /makeMapUtilObj/

  // BEGIN Public method /_setConfigMap_/
  // Purpose: Common code to set configs in feature modules
  // Arguments:
  //   * _input_map_   - map of key-values to set in config
  //   * settable_map - map of allowable keys to set
  //   * config_map   - map to apply settings to
  // Returns: undef
  // Throws : Exception if input key not allowed
  //
  setConfigMap = function ( arg_map ){
    var
      input_map    = arg_map._input_map_,
      settable_map = arg_map._settable_map_,
      config_map   = arg_map._config_map_,

      key_list     = vMap._getKeys_( input_map ),
      key_count    = key_list[ vMap._length_ ],

      i, key, error
      ;

    for ( i = __0; i < key_count; i++ ) {
      key = key_list[ i ];
      if ( input_map[ vMap._hasOwnProp_ ]( key ) ){
        if ( settable_map[ vMap._hasOwnProp_ ]( key ) ){
          config_map[ key ] = input_map[ key ];
        }
        else {
          error = makeError( 'Bad Input',
            'Setting config key |' + key + '| is not supported'
          );
          logUtilObj._logIt_( '_error_', error);
          throw error;
        }
      }
    }
  };
  // END Public method /_setConfigMap_/
  // ======================= END PUBLIC METHODS =======================

  return {
    _deleteAllObjKeys_ : deleteAllObjKeys,
    _fillTmplt_        : fillTmplt,
    _getClockStr_      : getClockStr,
    _getDateStr_       : getDateStr,
    _getListAttrIdx_   : getListAttrIdx,
    _getListDiff_      : getListDiff,
    _getLogUtilObj_    : getLogUtilObj,
    _getNumSign_       : getNumSign,
    _getVarType_       : getVarType,
    _makeArgList_      : makeArgList,
    _makeCommaNumStr_  : makeCommaNumStr,
    _makeError_        : makeError,
    _makeGuidStr_      : makeGuidStr,
    _makeListPlus_     : makeListPlus,
    _makeMapUtilObj_   : makeMapUtilObj,
    _makeSeenMap_      : makeSeenMap,
    _makeTimeStamp_    : makeTimeStamp,
    _makeUcFirstStr_   : makeUcFirstStr,
    _setConfigMap_     : setConfigMap
  };
}());

