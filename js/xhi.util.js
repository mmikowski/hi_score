/**
 *   xhi.util.js
 *   Utilities which do not require jQuery or a browser
 *   Michael S. Mikowski - mike.mikowski@gmail.com
 *
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
/*global xhi */

xhi._util_ = (function () {
  'use strict';
  // ================= BEGIN MODULE SCOPE VARIABLES ===================
  //noinspection MagicNumberJS
  var
    vMap      = xhi._vMap_,
    nMap      = xhi._nMap_,

    __j2str   = vMap._JSON_[ vMap._stringify_],
    __jparse  = vMap._JSON_[ vMap._parse_ ],

    __Num     = vMap._Number_,
    __Str     = vMap._String_,
    __blank   = vMap._blank_,
    __false   = vMap._false_,
    __length  = vMap._length_,
    __null    = vMap._null_,
    __push    = vMap._push_,
    __true    = vMap._true_,
    __undef   = vMap._undef_,

    __0       = nMap._0_,
    __1       = nMap._1_,
    __2       = nMap._2_,
    __n1      = nMap._n1_,

    __floor   = vMap._fnGetFloor_,
    __random  = vMap._fnGetRandom_,
    __setTo  = vMap._fnSetTimeout_,

    topSmap = {
      _date_obj_     : __undef,
      _tz_offset_ms_ : __undef
    },

    topCmap = {
      _10k_       : 10000,

      _sec_ms_    : 1000,
      _min_sec_   : 60,
      _hrs_min_   : 60,
      _day_hrs_   : 24,

      _min_ms_    : 60000,
      _hrs_ms_    : 3600000,
      _day_ms_    : 86400000,

      _offset_yr_ : 1900,
      _tmplt_rx_  : /\{([^\{\}]+[^\\])\}/g,

      _unit_ms_list_ : [
        { _str_ : '2.5s', _ms_ :     2500, _show_idx_ : __0 },
        { _str_ : '5s',   _ms_ :     5000, _show_idx_ : __0 },
        { _str_ : '10s',  _ms_ :    10000, _show_idx_ : __0 },
        { _str_ : '15s',  _ms_ :    15000, _show_idx_ : __0 },
        { _str_ : '30s',  _ms_ :    30000, _show_idx_ : __0 },
        { _str_ : '1m',   _ms_ :    60000, _show_idx_ : __1 },
        { _str_ : '2.5m', _ms_ :   150000, _show_idx_ : __0 },
        { _str_ : '5m',   _ms_ :   300000, _show_idx_ : __1 },
        { _str_ : '10m',  _ms_ :   600000, _show_idx_ : __1 },
        { _str_ : '15m',  _ms_ :   900000, _show_idx_ : __1 },
        { _str_ : '30m',  _ms_ :  1800000, _show_idx_ : __1 },
        { _str_ : '1hr',  _ms_ :  3600000, _show_idx_ : __1 },
        { _str_ : '2hr',  _ms_ :  7200000, _show_idx_ : __1 },
        { _str_ : '4hr',  _ms_ : 14400000, _show_idx_ : __1 },
        { _str_ : '6hr',  _ms_ : 21600000, _show_idx_ : __1 },
        { _str_ : '8hr',  _ms_ : 28800000, _show_idx_ : __1 },
        { _str_ : '12hr', _ms_ : 43200000, _show_idx_ : __2 },
        { _str_ : '1day', _ms_ : 86400000, _show_idx_ : __2 }
      ]
    },

    getVarType,  logUtilObj,
    makeGuidStr, makeListPlus,
    makeTmpltStr
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
        _crit_   : __2,
        _error_  : nMap._3_,
        _warn_   : nMap._4_,
        _notice_ : nMap._5_,
        _info_   : nMap._6_,
        _debug_  : nMap._7_
      },

      levelKey = '_warn_',
      levelIdx   = levelXIdxMap[ levelKey ],

      consoleRef
      ;

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

    function setLogLevel ( level_key ) {
      if ( ! levelXIdxMap[ level_key ] ) { return __false; }

      levelKey = level_key;
      levelIdx = levelXIdxMap[ level_key ];
      return __true;
    }

    function getLogLevel () {
      return levelKey;
    }

    // This follows syslog level conventions
    function logIt () {
      var
        arg_list = [],
        arg_count, level_key,
        level_idx, level_cmd,
        error_key
        ;

      // convert argument list to an array (yeah!)
      arg_list  = arg_list[ vMap._slice_ ][ vMap._call_ ]( arguments, __0 );
      arg_count = arg_list[ __length ];

      if ( arg_count < __2 ) { return __false; }

      level_key = arg_list[ __0 ];
      level_idx = levelXIdxMap[ level_key ];
      if ( level_idx === __undef ) {
        level_key = '_error_';
        error_key   = arg_list[ vMap._shift_ ]();
        arg_list[ vMap._unshift_ ]( error_key + ': _log_level_not_found_' );
        arg_list[ vMap._unshift_ ]( level_key );
      }

      if ( level_idx > levelIdx ) {
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
    }

    return {
      _setLogLevel_ : setLogLevel,
      _getLogLevel_ : getLogLevel,
      _logIt_       : logIt
    };
  }());
  // END define logUtilObj singleton

  // BEGIN Public method /makePadNumStr/
  function makePadNumStr( num, count ) {
    var
      str = __Str( num ),
      zero_count = count - str.length
      ;

    while ( zero_count > __0 ) {
      str = '0' + str;
      zero_count--;
    }
    return str;
  }
  // END Public method /makePadNumStr/
  // ====================== END UTILITY METHODS =======================

  // ===================== BEGIN PUBLIC METHODS =======================
  // BEGIN Public method /cloneData/
  function cloneData ( data ) {
    return __jparse( __j2str( data ) );
  }
  // END Public method /cloneData/

  // BEGIN Public method /getDateObj/
  // Purpose   : Returns a date object singleton
  function getDateObj () {
    if ( ! topSmap._date_obj_) {
      topSmap._date_obj_ = new Date();
    }
    return topSmap._date_obj_;
  }

  // BEGIN Public method /getDeepMapVal/
  // Purpose   : Get a deep map attribute value
  // Example   : _getDeepMapVal_( { foo : { bar : 1 }}, [ 'foo','bar' ] );
  //             Returns '1'
  // Arguments :
  //   * base_map  - A map to add a value
  //   * path_list - A list of keys in order of depth
  // Returns   :
  //   * Success - Requested value
  //   * Failure - undefined
  //
  function getDeepMapVal ( base_map, path_list ) {
    var
      walk_map  = base_map,
      is_good   = __true,
      key;

    while ( __true ) {
      key = path_list[ vMap._shift_ ]();
      if ( key === __undef ){ break; }

      if ( ! walk_map[ vMap._hasOwnProp_ ]( key ) ){
        is_good = __false; break;
      }
      walk_map = walk_map[ key ];
    }
    if ( is_good ) { return walk_map; }
    return __undef;
  }
  // END Public method /getDeepMapVal/

  // BEGIN Public method /getListAttrIdx/
  function getListAttrIdx ( list, key_name, key_val ) {
    var
      attr_count = list[ __length ],
      found_idx  = __n1,
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
  }
  // END Public method /getListAttrIdx/

  // BEGIN Public method /getListDiff/
  function getListDiff ( first_list, second_list ){
    return first_list[ vMap._filter_ ](
      function ( idx ) {
        return second_list[ vMap._indexOf_ ]( idx ) === __n1;
      }
    );
  }
  // END Public method /getListDiff/

  // BEGIN Public method /getLogUtilObj/
  function getLogUtilObj () { return logUtilObj; }
  // END Public method /getlogUtilObj/

  // BEGIN Public method /getNumSign/
  function getNumSign ( n ){
    if ( isNaN(n) ){ return NaN; }
    if ( n < __0 ){ return __n1; }
    return __1;
  }
  // END Public method /getNumSign/

  // BEGIN Public method /getTzOffsetMs/
  function getTzOffsetMs ( do_force ) {
    var date_obj = getDateObj();
    if ( ! topSmap._tz_offset_ms_ || do_force ) {
      topSmap._tz_offset_ms_ = date_obj.getTimezoneOffset() * 60000;
    }
    return topSmap._tz_offset_ms_;
  }
  // END Public method /getTzOffsetMs/

  // BEGIN Public method /getTzCode/
  function getTzCode () {
    var
      date_obj = getDateObj(),
      date_str = date_obj[ vMap._toString_ ](),
      match_list = date_str[ vMap._match_ ]( /\(([A-Za-z\s].*)\)/ )
      ;
    if ( match_list && match_list[ __1 ] ) {
      return match_list[ __1 ];
    }
    return __blank;
  }
  // END Public method /getTzCode/

  // BEGIN Public method /getVarType/
  // Returns '_Function_', '_Object_', '_Array_',
  // '_String_', '_Number_', '_Null_', '_Boolean_', or '_Undefined_'
  //
  getVarType = (function () {
    var
      typeof_map = {
        'boolean'   : '_Boolean_',
        'number'    : '_Number_',
        'string'    : '_String_',
        'function'  : '_Function_',
        'object'    : '_Object_',
        'undefined' : '_Undefined_',

        'Array'     : '_Array_',
        'Boolean'   : '_Boolean_',
        'Function'  : '_Function_',
        'Null'      : '_Null_',
        'Number'    : '_Number_',
        'Object'    : '_Object_',
        'String'    : '_String_',
        'Undefined' : '_Undefined_'
      };

    function get_type_fn ( data ) {
      var type_key, type_str;

      if ( data === __null  ) { return '_Null_'; }
      if ( data === __undef ) { return '_Undefined_'; }

      type_key = typeof data;
      type_str = typeof_map[ type_key ];

      if ( type_str && type_str !== '_Object_' ) { return type_str; }
      type_key = {}[ vMap._toString_ ][ vMap._call_ ](
        data )[ vMap._slice_ ]( nMap._8_, __n1 );

      //noinspection NestedConditionalExpressionJS
      return typeof_map[ type_key ] || type_key;
    }
    return get_type_fn;
  }());
  // END Public method /getVarType/

  // BEGIN Public method /makeArgList/
  // Converts provided argument object into a real array
  //
  function makeArgList ( arg_obj ) {
    // The following technique is around 3x faster than
    //   return Array.prototype.slice.call( arg_obj );
    // See https://github.com/petkaantonov/bluebird/wiki/\
    //   Optimization-killers#3-managing-arguments
    var arg_list = [], arg_count = arg_obj[ __length ], i;
    for ( i = __0; i < arg_count; i++ ) {
      arg_list[i] = arg_obj[i];
    }
    return arg_list;
  }
  // END Public method /makeArgList/

  // BEGIN Public method /makeClockStr/
  // Purpose   : Create HH:MM:SS time string from UTC time integer in ms
  // Example   : clock_str = makeClockStr( 1465621376000 ); // '05:02:56'
  // Arguments : (positional)
  //   0 - int (required) time_ms  UTC time in milliseconds
  //   1 - int (optional) show_idx Precision.
  //     0 === show HH:MM:SS
  //     1 === show HH:MM
  //     2 === show HH
  // Returns   : String
  // Cautions  :
  //   Remember to use your local timezone offset if you want to
  //   show local time. Example:
  //       date_obj     = xhi._util_._getDateObj_(),
  //       tz_offset_ms = date_obj.getTimezoneOffset() * 60000,
  //       local_ms     = raw_utc_ms - tz_offset_ms;
  //
  function makeClockStr ( arg_time_ms, arg_show_idx ) {
    var
      show_idx  = __Num( arg_show_idx ) || 0,
      sec_ms    = topCmap._sec_ms_,
      min_sec   = topCmap._min_sec_,
      hrs_min   = topCmap._hrs_min_,
      day_hrs   = topCmap._day_hrs_,

      raw_sec_int = __floor( arg_time_ms / sec_ms + 0.5 ),
      sec_int     = raw_sec_int % min_sec,

      raw_min_int = __floor( raw_sec_int / min_sec ),
      min_int     = raw_min_int % hrs_min,

      raw_hrs_int = __floor( raw_min_int / hrs_min ),
      hrs_int     = raw_hrs_int % day_hrs,

      mns         = makePadNumStr,
      time_list
      ;

    time_list = [ mns( hrs_int, __2 ) ];
    if ( show_idx < __2 ) {
      time_list[ __push ]( mns( min_int, __2 ) );
    }
    if ( show_idx < __1 ) {
      time_list[ __push ]( mns( sec_int, __2 ) );
    }
    return time_list[ vMap._join_ ](':');
  }
  // END Public method /makeClockStr/

  // BEGIN Public method /makeCommaNumStr/
  function makeCommaNumStr ( num ){
    var s_num;
    if ( num > topCmap._10k_ ){
      //noinspection NestedFunctionCallJS
      return __Str(parseInt( (num / nMap._1000_ ), nMap._10_ )) + 'K';
    }
    //noinspection NestedFunctionCallJS
    s_num = __Str(parseInt( num, nMap._10_ ));
    return s_num[ vMap._replace_ ](/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }
  // END Public method /makeCommaNumStr/

  // BEGIN Public method /makeDateStr/
  function makeDateStr ( date_data, do_time ) {
    var
      data_type = getVarType( date_data ),
      mns       = makePadNumStr,

      date_obj, yrs_int, mon_int, day_int,
      hrs_int, min_int, sec_int,

      date_list, date_str,
      time_list, time_str
      ;

    if ( data_type === '_Object_' ) {
      date_obj = date_data;
    }
    else if ( data_type === '_Number_' ) {
      date_obj = new Date(); // new Date( ms ) does not work in node 4.4.3
      date_obj.setTime( date_data );
    }
    else { return __blank; }

    yrs_int = __Num( date_obj.getYear()  ) + topCmap._offset_yr_;
    mon_int = __Num( date_obj.getMonth() ) + __1;
    day_int = __Num( date_obj.getDate()  );

    date_list = [
      mns( yrs_int, nMap._4_ ),
      mns( mon_int, __2 ),
      mns( day_int, __2 )
    ];
    date_str = date_list[ vMap._join_ ]('-');

    // no time requested
    if ( ! do_time ) { return date_str; }

    // time requested
    hrs_int  = __Num( date_obj.getHours()   );
    min_int  = __Num( date_obj.getMinutes() );
    sec_int  = __Num( date_obj.getSeconds() );

    time_list = [
      mns( hrs_int, __2 ),
      mns( min_int, __2 ),
      mns( sec_int, __2 )
    ];
    time_str = time_list[ vMap._join_ ](':');

    return date_str + ' ' + time_str;
  }
  // END Public method /makeDateStr/

  // BEGIN Public method /makeErrorObj/
  // Purpose: a convenience wrapper to create an error object
  // Arguments:
  //   * name_text - the error name
  //   * msg_text  - long error message
  //   * data      - optional data attached to error object
  // Returns  : newly constructed error object
  // Throws   : none
  //
  function makeErrorObj ( name_text, msg_text, data ) {
    var error_obj = new Error();
    error_obj.name = 'sl:' + name_text;
    if ( msg_text ) { error_obj.description = msg_text; }
    if ( data ){ error_obj.data = data; }
    return error_obj;
  }
  // END Public method /makeErrorObj/

  // BEGIN Public method /makeGuidStr/
  makeGuidStr = (function (){
    /*jslint bitwise: true*/
    function makePart () {
      //noinspection NonShortCircuitBooleanExpressionJS,MagicNumberJS
      return ((( __1+__random() ) * 0x10000 )|__0
      )[ vMap._toString_ ](16).substring(__1);
    }
    /*jslint bitwise: false*/

    function mainFn () {
      return makePart() + makePart()
        + '-' + makePart()
        + '-' + makePart()
        + '-' + makePart()
        + '-' + makePart() + makePart() + makePart()
        ;
    }
    return mainFn;
  }());
  // END Public method /makeGuidStr/

  // BEGIN Public method /makeListPlus/
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
    function checkMatchVal ( data ){
      var match_count = __0, idx;
      for ( idx = this[ __length]; idx; __0 ){
        //noinspection IncrementDecrementResultUsedJS
        if ( this[--idx] === data ){ match_count++; }
      }
      return match_count;
    }
    function removeListVal ( data ){
      var removed_count = __0, idx;
      for ( idx = this[ __length ]; idx; __0 ){
        //noinspection IncrementDecrementResultUsedJS
        if ( this[--idx] === data ){
          this.splice(idx, __1 );
          removed_count++;
          idx++;
        }
      }
      return removed_count;
    }
    function pushUniqVal ( data ){
      if ( checkMatchVal.call(this, data ) ){ return false; }
      this.push( data );
      return __true;
    }
    function mainFn ( input_list ) {
      var return_list;
      if ( input_list && Array.isArray( input_list ) ){
        if ( input_list.remove_val ){
          logUtilObj._logIt_(
            '_warn_',
            'The array appears to already have listPlus capabilities'
          );
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
    }
    return mainFn;
  }());
  // END Public method /makeListPlus/

  // BEGIN Public method /makeMapUtilObj/
  // Purpose: Creates a thread-safe map utility object
  //   useful to streamlining list.map() functions and
  //   avoiding nested functions.
  // Example:
  // 1. Create a map_util object:
  // var map_util_obj = makeMapUtilObj();
  // 2. (optional) Set any data your map function will use.
  //   map_util_obj._setArgList_ = [ name_list ];
  // 3. Create a function that for element of the array.
  // function mapUtil_renameFn ( field_data, idx, list, setArgList ) {
  //   var
  //     name_list  = setArgList[ __0 ],
  //     field_key = name_list[ idx ];
  //
  //   // return key, value
  //   return [ field_key, field_data ];
  //
  //   // return nothing to not add to the map
  // }
  //
  // 3. Set the function in the utility
  //   map_util_obj._setMapFn_( mapUtil_renameFn );
  // 4. Initialize the result map.  You need this pointer.
  //   result_map = {};
  //   map_util_obj._setResultMap_( result_map );
  // 5. Invoke the map function:
  //   my_list.map( map_util_obj._invokeFn_ );
  // 6. result_map will now contain the results!
  //
  // This is an excellent example of how a closure creates
  // unique private variables in each instance returned, such
  // as the stored argList, resultMap, and mapFn.
  //
  //
  function makeMapUtilObj () {
    var resultMap, argList, mapFn;

    function getArgList   (            ) { return argList;         }
    function setArgList   ( arg_list   ) { argList = arg_list;     }
    function setMapFn     ( map_fn     ) { mapFn = map_fn;         }
    function setResultMap ( result_map ) { resultMap = result_map; }

    function invokeFn ( field_data, idx, list ) {
      var ret_list, ret_key, ret_data;

      ret_list = mapFn( field_data, idx, list, argList );
      if ( ! ret_list ) { return; }
      ret_key  = ret_list[ __0 ];
      ret_data = ret_list[ __1 ];

      resultMap[ ret_key ] = ret_data;
    }

    return {
      _getArgList_   : getArgList,
      _setResultMap_ : setResultMap,
      _setArgList_   : setArgList,
      _setMapFn_     : setMapFn,
      _invokeFn_     : invokeFn
    };
  }
  // END Public method /makeMapUtilObj/

  // BEGIN Public method /makePctStr/
  // Purpose   : Convert a decimal ratio into a readable % string
  // Example   :
  //   my_pct = makePctStr( 0.529863, 1 );
  // Arguments : (positional)
  //   0 : (required) A ratio, usually less than 1.
  //   1 : (optional) Number of decimal points to return.
  //       Default value is 0.
  //
  function makePctStr ( arg_ratio, arg_dec_count ) {
    var
      ratio     = arg_ratio     || 0,
      dec_count = arg_dec_count || 0
      ;
    return ( ratio * 100 )[ vMap._toFixed_ ]( dec_count ) + '%';
  }
  // END Public method /makePctStr/

  // BEGIN Public method /makeSeenMap/
  // Purpose: Convert an array into a map keyed by the array values.
  // Assign value to all keys.
  //
  function makeSeenMap ( list, value ){
    var i, key, seen_map = {};
    for ( i = __0; i < list[ __length ]; i++ ){
      key = list[ i ];
      seen_map[ key ] = value;
    }
    return seen_map;
  }
  // END Public method /makeSeenMap/

  // BEGIN Public method /makeStrFromMap/
  // Purpose: Concatenate a number of key-values
  // into a single string
  function makeStrFromMap ( map, key_list, arg_delim_str ) {
    var
      key_count  = key_list[ __length ],
      solve_list = [],
      delim_str  = arg_delim_str || ' ',

      idx, key, val_data;

    for ( idx = __0; idx < key_count; idx++ ) {
      key      = key_list[ idx ];
      val_data = map[ key ];
      if ( val_data || val_data === __0 ) {
        solve_list[ __push ]( __Str( val_data ) );
      }
    }
    return solve_list[ vMap._join_ ]( delim_str );
  }
  // END Public method /makeStrFromMap/

  // BEGIN Public method /makeRegexObj/
  // Purpose   : Create a regular expression object
  // Example   : makeRegexObj( '\s*hello\s*', 'i' );
  function makeRxObj ( pattern_str, option_str ) {
    if ( option_str ) {
      return new RegExp( pattern_str, option_str );
    }
    return new RegExp( pattern_str );
  }
  // END Public method /makeRegexObj/

  // BEGIN Public method /makeSeriesMap/
  // Purpose   : Create a list of time labels quantitized to match
  //   standard time intervales
  // Example   :
  //    series_map = makeSeriesMap({
  //      _max_ms_    : 1465459980000,
  //      _min_ms_    : 1465452840000,
  //      _tgt_count_ : 12
  //    });
  // Arguments : (required)
  //   _max_ms_    : int start UTC time in milliseconds
  //   _min_ms_    : int end UTC time in milliseconds
  //   _tgt_count_ : int desired number of divisions (+/- 50%)
  //
  // Returns:
  //   A map useful for plotting a quantitized time series like so:
  //      +-----+------+-----+
  //      |     |      |     |
  //    00:06 00:10  00:15 00:19
  //
  //    { _offset_ratio_ : 0.3428,
  //      _unit_name_    : '10min',
  //      _unit_ms_      : 600 000,
  //      _unit_ratio_   : 0.4615,
  //      _unit_count_   : 2
  //    }
  //
  //    min_ms   = 6 * 60k     =  360 000
  //    max_ms   = 19 * 60k    = 1140 000
  //    span_ms  = 1140 - 360k =  780 000
  //    unit_ms  = 10 * 60k    =  600 000
  //
  //    mod_unit_ms = min_ms % unit_ms = 360k
  //    offset for first unit: 600k - 360k - 240k (4 minutes)
  //    offset_ms = unit_ms - mod_unit_ms
  //
  //    Calculate ratio
  //
  //    offset_ratio = offset_ms / span_ms
  //      = 240k / 780k  = .3428 ( ~34.28% )
  //
  //    unit_ratio   = unit_ms / span_ms
  //      = 360k / 780k  = .4615 ( ~46.15% )
  //
  // Throws    :
  // Cautions  :
  //   Remember to use your local timezone offset if you want to
  //   show local time. See example on makeClockStr, above.
  //
  function makeSeriesMap( arg_map ) {
    // Normalize times to remove date.
    var
      max_ms    = arg_map._max_ms_    %  topCmap._day_ms_,
      min_ms    = arg_map._min_ms_    %  topCmap._day_ms_,
      tgt_count = arg_map._tgt_count_,

      span_ms,
      unit_list, unit_count,
      btm_idx,   top_idx,
      btm_count, top_count,

      jdx, idx,     check_idx,
      check_map,    check_count,
      mod_unit_ms,  offset_ms,
      offset_ratio, solve_map,
      solve_list,   solve_ms,
      solve_str
      ;

    // Ensure end time is after the start time after normalizing
    if ( max_ms < min_ms ) { max_ms += topCmap._day_ms_; }

    // Get the time span and a list of available units
    //
    span_ms    = max_ms - min_ms;
    unit_list  = topCmap._unit_ms_list_;
    unit_count = unit_list[ __length ];

    // Init for solve loop
    //
    btm_idx    = __0;
    top_idx    = unit_count - __1;
    btm_count  = tgt_count * 0.75;
    top_count  = tgt_count * 1.25;

    // Back off limits to resolve
    //
    BACKOFF: for ( jdx = __0; jdx < nMap._10_; jdx ++ ) {
      // Solve for unit size through interpolation
      idx = __0;
      INTERPOLATE: while ( idx < unit_count ) {
        // Calculate ranges
        check_idx   = btm_idx
          + __floor( ( ( top_idx - btm_idx ) / __2 ) + nMap._d5_ );
        check_map   = unit_list[ check_idx ];
        check_count = __floor( ( span_ms / check_map._ms_ ) + nMap._d5_);

        // Continue loop if out of range
        if ( check_count < btm_count ) {
          top_idx = check_idx;
          idx++;
          continue INTERPOLATE;
        }
        if ( check_count > top_count ) {
          btm_idx = check_idx;
          idx++;
          continue INTERPOLATE;
        }
        solve_map = {
          _show_idx_   : check_map._show_idx_,
          _unit_count_ : check_count,
          _unit_ms_    : check_map._ms_,
          _unit_name_  : check_map._str_
        };
        idx = unit_count;
      }

      if ( solve_map ) { break BACKOFF;}

      // No solution found; Increase range and try again
      btm_count = btm_count * 0.9;
      top_count = btm_count * 1.1;
    }
    if ( ! solve_map ) { return; }

    // Store values to solve_map
    //
    mod_unit_ms  = min_ms % solve_map._unit_ms_;
    offset_ms    = solve_map._unit_ms_ - mod_unit_ms;
    offset_ratio = ( offset_ms / span_ms );

    solve_map._offset_ratio_ = offset_ratio;
    solve_map._unit_ratio_   = solve_map._unit_ms_ / span_ms;


    solve_list = [];
    while ( offset_ratio < __1 ) {
      solve_ms  = __floor( offset_ratio * span_ms ) + min_ms;
      solve_str = makeClockStr( solve_ms, solve_map._show_idx_ );
      solve_list[ __push ]( solve_str );
      offset_ratio += solve_map._unit_ratio_;
    }
    solve_map._time_list_ = solve_list;

    return solve_map;
  }
  // END Public function /makeSeriesMap/

  // BEGIN Public method /makeTimeStamp/
  // TODO: consider using Date.now()
  function makeTimeStamp () {
    return +new Date();
  }
  // END Public method /makeTimeStamp/

  // BEGIN Public method /makeTmpltStr/
  makeTmpltStr = (function () {
    //noinspection JSUnusedLocalSymbols
    function lookupFn ( match_str, lookup_name ) {
      var
        lookup_map  = this,
        return_data = lookup_name && lookup_map
        ;
      lookup_name[ vMap._split_ ]('.')[ vMap._forEach_ ](
        function ( key_name ) {
          return_data = return_data && return_data[ key_name ];
        }
      );
      return ( return_data === __undef ) ? __blank : return_data;
    }

    function mainFn ( arg_map ) {
      var
        input_str  = arg_map._input_str_,
        lookup_map = arg_map._lookup_map_,
        tmplt_rx   = arg_map._tmplt_rx_ || topCmap._tmplt_rx_,
        bound_fn   = lookupFn.bind( lookup_map )
        ;
      return input_str[ vMap._replace_ ]( tmplt_rx, bound_fn );
    }

    return mainFn;
  }());
  // END Public method /makeTmpltStr/

  // BEGIN Public method /makeUcFirstStr/
  function makeUcFirstStr ( s_input_in ) {
    var
      s_input = __Str(s_input_in),
      f   = s_input.charAt(__0).toUpperCase()
      ;

    return f + s_input.substr( __1 );
  }
  // END Public method /makeUcFirstStr/

  // BEGIN Public method /mergeMaps/
  function mergeMaps( base_map, extend_map ) {
    var
      tmp_map   = cloneData( extend_map ),
      key_list  = vMap._fnGetKeyList_( tmp_map ),
      key_count = key_list[ __length ],
      i, tmp_key;
    for ( i = __0; i < key_count; i++ ) {
      tmp_key = key_list[ i ];
      base_map[ tmp_key ] = tmp_map[ tmp_key ];
    }
    return base_map;
  }
  // END Public method /mergeMaps/

  // BEGIN Public method /pollFunction/
  // Purpose: Run the <arg_fn> function every <arg_ms> milliseconds
  //   either <arg_count> number of times or until the function
  //   returns false, whichever comes first.
  // Arguments
  //   arg_fn    : function to poll, return false to stop polling
  //   arg_ms    : time between function invocation
  //   arg_count : (optional) Maximum number of times to run the function.
  //
  //
  function pollFunction ( arg_fn, arg_ms, arg_count ) {
    var count;

    count = arg_count || null;

    function pollIt () {
      __setTo(function() {
        var continue_poll = arg_fn();
        if ( continue_poll === false ) { return; }
        if ( count === null ) {
          pollIt();
          return;
        }
        if ( count > __0 ) {
          count -= __1;
          pollIt();
        }
      }, arg_ms );
    }

    pollIt();
  }
  // END Public method /pollFunction/

  // BEGIN Public method /rmAllObjKeys/
  function rmAllObjKeys ( ref_obj ) {
    var
      key_list  = vMap._fnGetKeyList_( ref_obj ),
      key_count = key_list[ __length ],
      i, key;

    for ( i = __0; i < key_count; i++ ) {
      key = key_list[ i ];
      delete ref_obj[ key ];
    }
  }
  // END Public method /rmAllObjKeys/

  // BEGIN Public method /setCmap/
  // Purpose: Common code to set config map in feature modules
  // Arguments:
  //   * _input_map_     - map of key-values to set in config
  //   * _settable_list_ - map of allowable keys to set
  //   * _target_map_    - map to apply settings to
  // Returns: undef
  // Throws : Exception if input key not allowed
  //
  function setCmap ( arg_map ) {
    var
      input_map     = arg_map._input_map_,
      settable_list = arg_map._settable_list_,
      target_map    = arg_map._target_map_,

      key_list     = vMap._fnGetKeyList_( input_map ),
      key_count    = key_list[ __length ],

      idx, key, error
      ;

    for ( idx = __0; idx < key_count; idx++ ) {
      key = key_list[ idx ];
      if ( settable_list[ vMap._indexOf_ ]( key ) > __n1 ) {
        target_map[ key ] = input_map[ key ];
      }
      else {
        error = makeErrorObj( 'Bad Input',
          'Setting config key |' + key + '| is not supported'
        );
        logUtilObj._logIt_( '_error_', error);
        throw error;
      }
    }
  }
  // END Public method /setCmap/

  // BEGIN Public method /setDeepMapVal/
  // Purpose   : Set a deep map attribute value
  // Example   : _setDeepMapVal_( {}, [ 'foo','bar' ], 'hello' );
  // Arguments :
  //   * base_map  - A map to add a value
  //   * path_list - A list of keys in order of depth
  //   * val_data  - Value to set for the path
  // Returns   :
  //   * Success - Updated object
  //   * Failure - undefined
  //
  function setDeepMapVal ( base_map, path_list, value ) {
    var
      walk_map  = base_map,
      is_good   = __false,
      key;

    while ( __true ) {
      key = path_list.shift();
      if ( key === undefined ){ break; }

      if ( ! walk_map[ vMap._hasOwnProp_ ]( key ) ){
        walk_map[ key ] = {};
      }
      if ( ! path_list[ __0 ] ){
        walk_map[ key ]  = value;
        is_good = __true;
        break;
      }
      walk_map = walk_map[ key ];
    }
    if ( is_good ){ return base_map; }
    return __undef;
  }
  // END Public method /setDeepMapVal/
  // ======================= END PUBLIC METHODS =======================

  return {
    _cloneData_       : cloneData,
    _getDateObj_      : getDateObj,
    _getDeepMapVal_   : getDeepMapVal,
    _getListAttrIdx_  : getListAttrIdx,
    _getListDiff_     : getListDiff,
    _getLogUtilObj_   : getLogUtilObj,
    _getNumSign_      : getNumSign,
    _getTzOffsetMs_   : getTzOffsetMs,
    _getTzCode_       : getTzCode,
    _getVarType_      : getVarType,
    _makeArgList_     : makeArgList,
    _makeClockStr_    : makeClockStr,
    _makeCommaNumStr_ : makeCommaNumStr,
    _makeDateStr_     : makeDateStr,
    _makeErrorObj_    : makeErrorObj,
    _makeGuidStr_     : makeGuidStr,
    _makeListPlus_    : makeListPlus,
    _makeMapUtilObj_  : makeMapUtilObj,
    _makePadNumStr_   : makePadNumStr,
    _makePctStr_      : makePctStr,
    _makeRxObj_       : makeRxObj,
    _makeSeenMap_     : makeSeenMap,
    _makeSeriesMap_   : makeSeriesMap,
    _makeStrFromMap_  : makeStrFromMap,
    _makeTimeStamp_   : makeTimeStamp,
    _makeTmpltStr_    : makeTmpltStr,
    _makeUcFirstStr_  : makeUcFirstStr,
    _mergeMaps_       : mergeMaps,
    _pollFunction_    : pollFunction,
    _rmAllObjKeys_    : rmAllObjKeys,
    _setCmap_         : setCmap,
    _setDeepMapVal_   : setDeepMapVal
  };
}());
