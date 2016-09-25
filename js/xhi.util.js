/**
 *    xhi.util.js
 *    Utilities which do not require jQuery or a browser
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
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

    __Array   = vMap._Array_,
    __Date    = vMap._Date_,
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
    __3       = nMap._3_,
    __n1      = nMap._n1_,

    __floor   = vMap._fnGetFloor_,
    __random  = vMap._fnGetRandom_,
    __setTo   = vMap._fnSetTimeout_,
    __typeof  = vMap._fnTypeof_,

    topSmap, topCmap, // State and config maps are set in initModule

    getNowMs,     getVarType,  getBasename,
    getDirname,   logUtilObj,  makeGuidStr,
    makeListPlus, makeTmpltStr
    ;
  // ================== END MODULE SCOPE VARIABLES ====================

  // ===================== BEGIN PRIVATE METHODS ======================
  // BEGIN private method /getTzDateObj/
  // Purpose   : Returns a date object singleton for use by Tz methods
  //
  function getTzDateObj () {
    if ( ! topSmap._date_obj_) {
      topSmap._date_obj_ = new __Date();
    }
    return topSmap._date_obj_;
  }
  // END private method /getTzDateObj/
  // ====================== END PRIVATE METHODS =======================

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
      // The only problem that may cause a failure is if the log
      // command can not handle more than a single argument or will not
      // allow the apply method (think: IE). We try our best...
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
  // ====================== END UTILITY METHODS =======================

  // ===================== BEGIN PREREQ METHODS =======================
  // BEGIN Public prereq method /clearMap/
  function clearMap ( arg_map ) {
    var key_list, key_count, idx, key;

    if ( getVarType( arg_map ) !== '_Object_' ) { return; }

    key_list  = vMap._fnGetKeyList_( arg_map );
    key_count = key_list[ __length ];

    for ( idx = __0; idx < key_count; idx++ ) {
      key = key_list[ idx ];
      if ( arg_map[ vMap._hasOwnProp_ ]( key ) ) {
        delete arg_map[ key ];
      }
    }
    return arg_map;
  }
  // END Public prereq method /clearMap/

  // BEGIN Public prereq method /cloneData/
  // Purpose: Deep clones non-recursive data structures fastest
  //
  function cloneData ( data ) {
    if ( data === __undef ) { return data; }
    return __jparse( __j2str( data ) );
  }
  // END Public prereq method /cloneData/

  // BEGIN Public prereq method /getNumSign/
  // Purpose : Provided an argument, will attempt to convert it into
  //   a number.  If it is a negative number, a -1 will be returned.
  //   In all other cases, a positive 1 is returned.
  //
  function getNumSign ( n ) {
    var num = __Num( n );
    return ( ! isNaN( num ) && num < __0 )
      ? __n1 : __1;
  }
  // END Public prereq method /getNumSign/

  // BEGIN Public prereq method /getNowMs/
  // Purpose: Returns the current timestamp in milliseconds
  //   The Date.now() method is 3x faster than the +new Date()
  //   in NodeJS, and I have confirmed this provides almost the
  //   the same performance in that env as a raw Date.now() call.
  //
  getNowMs = (function () {
    var return_fn;
    if ( __Date[ vMap._hasOwnProp_ ]( vMap._now_ ) ) {
      return_fn = function () { return __Date[ vMap._now_ ](); };
    }
    else {
      return_fn = function () { return +new __Date(); };
    }
    return return_fn;
  }());
  // END Public prereq method /getNowMs/

  // BEGIN Public prereq method /makePadNumStr/
  function makePadNumStr( arg_num, arg_count ) {
    var
      num   = __Num( arg_num ),
      count = __Num( arg_count ),

      sign_int, num_str, zero_count;

    if ( isNaN( num ) || isNaN( count ) || count <= __0 ) {
      return __blank;
    }

    sign_int = getNumSign( num );
    num_str  = __Str( vMap._fnGetAbs_( num ) );
    zero_count = count - num_str[ __length ]
      - ( sign_int === __n1 ? __1 : __0 );

    while ( zero_count > __0 ) {
      num_str = '0' + num_str;
      zero_count--;
    }
    if ( sign_int === __n1 ) {
      num_str = '-' + num_str;
    }

    return num_str;
  }
  // END Public method /makePadNumStr/

  // BEGIN Public method /makeRxObj/
  // Purpose   : Create a regular expression object
  // Example   : makeRxObj( '\s*hello\s*', 'i' );
  function makeRxObj ( arg_pattern_str, arg_option_str ) {
    var
      pattern_str = __typeof( arg_pattern_str ) === vMap._string_
        ? arg_pattern_str : __blank,
      option_str  = __typeof( arg_pattern_str ) === vMap._string_
        ? arg_option_str : __blank
      ;

    if ( option_str ) {
      return new RegExp( pattern_str, option_str );
    }
    return new RegExp( pattern_str );
  }
  // END Public method /makeRxObj/

  // BEGIN Public prereq method /mergeMaps/
  // Purpose : Merge properties of extend_map into base_map
  //
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
  // END Public prereq method /mergeMaps/
  // ====================== END PREREQ METHODS ========================

  // ===================== BEGIN PUBLIC METHODS =======================
  // BEGIN utilities /getBasename/ and /getDirname/
  // Purpose   : Returns the last bit of a path
  // Example   : getBasename('/Common/_demo99/192.168.11_97_demo1')
  //             returns '192.168.11.97_demo1'
  // Arguments : (positional)
  //   1 - (required) Path string
  //   2 - (optional) Delimeter string (default is /)
  //
  function getBaseDirname( arg_path_str, arg_delim_str ) {
    var context_str = this,
      path_str, delim_str, rx_obj, match_list
      ;

    if ( arg_path_str === __undef || arg_path_str === __null
      || arg_path_str === __blank
    ) { return __blank; }

    path_str   = __Str( arg_path_str );
    delim_str  = arg_delim_str || '/';
    rx_obj     = context_str === '_base_'
      ? makeRxObj( '([^'  + delim_str + ']*)$' )
      : makeRxObj( '^(.*' + delim_str + ')[^' + delim_str + ']*$' )
      ;

    match_list = path_str[ vMap._match_ ]( rx_obj );
    return ( match_list && match_list[ __1 ] ) || __blank;
  }
  getBasename = getBaseDirname[ vMap._bind_ ]( '_base_' );
  getDirname  = getBaseDirname[ vMap._bind_ ]( '_dir_'  );
  // END utilities /getBasename/ and /getDirname/


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
  // Cautions  : The recursion limit is set to 100. If this
  //   is met, a warning is logged.
  //
  function getDeepMapVal ( base_map, path_list ) {
    var
      walk_map  = base_map,
      is_good   = __true,
      idx, key
      ;

    if ( ! ( walk_map && getVarType( walk_map ) === '_Object_' ) ) {
      return __undef;
    }

    for ( idx = __0; idx < 100; idx++ ) {
      key = path_list[ vMap._shift_ ]();
      if ( key === __undef ) { break; }

      if ( ! walk_map[ vMap._hasOwnProp_ ]( key ) ) {
        is_good = __false; break;
      }
      walk_map = walk_map[ key ];
    }
    if ( is_good ) { return walk_map; }
    if ( idx === 100 ) {
      logUtilObj._logIt_( '_warn_', '_maximum_recursion_limit_' );
    }
    return __undef;
  }
  // END Public method /getDeepMapVal/

  // BEGIN Public method /getListAttrIdx/
  function getListAttrIdx ( arg_map_list, key_name, key_val ) {
    var
      map_list  = __Array.isArray( arg_map_list ) ? arg_map_list : [],
      map_count = map_list[ __length ],
      found_idx  = __n1,
      idx, row_map
      ;

    for ( idx = __0; idx < map_count; idx++ ) {
      row_map = map_list[ idx ];
      if ( __typeof( row_map ) !== 'object' ) { continue; }
      if ( ! row_map[ vMap._hasOwnProp_ ]( key_name ) ) { continue; }
      if ( row_map[ key_name ] === key_val ) {
        found_idx = idx;
        break;
      }
    }
    return found_idx;
  }
  // END Public method /getListAttrIdx/

  // BEGIN Public methd /getListAttrMap/
  function getListAttrMap ( list, key_name, key_val ) {
    var list_idx = getListAttrIdx( list, key_name, key_val );
    return list_idx > __n1 ? list[ list_idx ] : __undef;
  }
  // END Public method /getListAttrMap/

  // BEGIN Public method /getListDiff/
  // Purpose: Finds all elements common between two lists.
  //   Does _not_ do a deep comparison; two similar lists or maps
  //   will be reported as different unless they point the the same
  //   data structure.
  //
  // Returns: A list of elements in the order of unique
  //   elements found in the first list followed by unique
  //   elements found in the second.
  //
  function getListDiff ( first_list, second_list ) {
    var list_1, list_2;

    list_1 = first_list[ vMap._filter_ ](
      function ( data ) {
        return second_list[ vMap._indexOf_ ]( data ) === __n1;
      }
    );
    list_2 = second_list[ vMap._filter_ ](
      function ( data ) {
        return first_list[ vMap._indexOf_ ]( data ) === __n1;
      }
    );
    return list_1[ vMap._concat_ ]( list_2 );
  }
  // END Public method /getListDiff/

  // BEGIN Public method /getLogUtilObj/
  function getLogUtilObj () { return logUtilObj; }
  // END Public method /getlogUtilObj/

  // BEGIN Public method /getTzOffsetMs/
  function getTzOffsetMs ( do_force ) {
    var date_obj = getTzDateObj();
    if ( ! topSmap._tz_offset_ms_ || do_force ) {
      topSmap._tz_offset_ms_
        = date_obj.getTimezoneOffset() * topCmap._min_ms_;
    }
    return topSmap._tz_offset_ms_;
  }
  // END Public method /getTzOffsetMs/

  // BEGIN Public method /getTzCode/
  function getTzCode () {
    var
      date_obj = getTzDateObj(),
      date_str = date_obj[ vMap._toString_ ](),
      match_list = date_str[ vMap._match_ ]( topCmap._tzcode_rx_ )
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
      if ( __Array.isArray( data ) ) { return '_Array_'; }

      type_key = __typeof( data );
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
  //     0 === show HH:MM:SS << default
  //     1 === show HH:MM
  //     2 === show HH
  // Returns   : String
  // Cautions  :
  //   Remember to use your local timezone offset if you want to
  //   show local time. Example:
  //       tz_offset_ms = xhi._util_._getTzOffsetMs_(),
  //       local_ms     = raw_utc_ms - tz_offset_ms;
  //
  function makeClockStr ( arg_time_ms, arg_show_idx ) {
    var
      show_idx  = __Num( arg_show_idx ) || __0,
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
  // Purpose: Converts a number into a string optimized for readability
  // Example   : makeCommaNumStr({ _input_num_ : 1999 })
  //             Returns '2.0k'
  // Arguments :
  //   * _input_num_       - (req) The number to format, e.g. 123598
  //   * _round_limit_exp_ - (opt) The size (10^exp) of number after which
  //                         a rounded unit value will be returned.
  //                         DEFAULT = 3 (1000's)
  //   * _round_unit_exp_  - (opt) The size (10^exp) of number to group as
  //                         a unit. DEFAULT = 3 (1000's)
  //   * _round_unit_str_  - (opt) The unit name. DEFAULT = k
  //   * _round_dec_count_ - (opt) Number of decimal places to keep
  //                         in the mantisa when rounding to units.
  //                         DEFAULT = 1.
  // Returns   :
  //   * Success - Returns formated string
  //   * Failure - Blank string
  //
  // Example: str =
  function makeCommaNumStr ( arg_map ) {
    var
      input_num       = arg_map._input_num_        || __0,
      round_limit_exp = arg_map._round_limit_exp_  || __3,  // round limit
      round_unit_exp  = arg_map._round_unit_exp_   || __3,  // round unit
      round_unit_str  = arg_map._round_unit_str_   || 'k',  // unit suffix
      round_dec_count = arg_map._round_dec_count_  || __1,  // decimal #

      round_limit_num = vMap._Math_.pow( 10, round_limit_exp  ),
      round_unit_num  = vMap._Math_.pow( 10, round_unit_exp   ),

      solve_suffix = __blank,

      solve_num, solve_str, solve_list, list_count, idx
      ;

    if ( vMap._fnGetAbs_( input_num ) >= round_limit_num ) {
      solve_num    = input_num / round_unit_num;
      solve_suffix = round_unit_str;
      solve_str    = round_dec_count
        ? solve_num[ vMap._toFixed_]( round_dec_count )
        : __Str( solve_num );
    }
    else {
      solve_str = __Str( input_num );
    }

    solve_list = solve_str[ vMap._split_ ]( '.' );
    list_count = solve_list[ __length ];
    for ( idx = __0; idx < list_count; idx++ ) {
      solve_list[ idx ] = solve_list[ idx ][
        vMap._replace_ ]( topCmap._comma_rx_, "$1," );
    }

    return solve_list[ vMap._join_]('.') + solve_suffix;
  }
  // END Public method /makeCommaNumStr/

  // BEGIN Public method /makeDateStr/
  // Purpose: Creates a string from data_data in the form of a date object
  //   or a UTC time number (in milliseconds).
  // Examples:
  // 1. makeDateStr({ _date_obj_ : new Date() });
  //    Returns a string like '2016-09-18'
  // 2. makeDateStr({ _date_obj_ : new Date(), do_time : true });
  //    Returns a string like '2016-09-18 12:45:52'
  // 3. makeDateStr({ _date_ms_ : 1474311626050 })
  //    Returns '2016-09-19'
  //
  // Arguments:
  //   * _date_obj_ : A valid date object.
  //   * _date_ms_  : A date time in ms.
  //     If neither date_obj or date_ms is provided, will use the
  //       current date.
  //     If BOTH are provided, _date_ms_ will be used in
  //       preference to date_obj.
  //   * do_time_ : (opt) A boolean.  Default is false.
  //
  function makeDateStr ( arg_map ) {
    var
      mns     = makePadNumStr,
      do_time = arg_map._do_time_ === __true,
      date_obj, yrs_int, mon_int, day_int,
      hrs_int, min_int, sec_int,

      date_list, date_str,
      time_list, time_str
      ;

    if ( arg_map._date_ms_ ) {
      // new Date( ms ) does not work in node 4.4.3
      date_obj = new Date();
      date_obj.setTime( arg_map._date_ms_ );
    }
    else {
      date_obj = getVarType( arg_map._date_obj_ ) === 'Date'
        ? arg_map._date_obj_ : __undef;
    }
    if ( ! date_obj ) { return __blank; }

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

  // BEGIN Public method /scrubHtmlTags/
  function scrubHtmlTags ( arg_str ) {
    var str = ( arg_str && String( arg_str ) ) || __blank;
    return str[ vMap._replace_ ]( topCmap._tag_rx_, __blank );
  }
  // END Public method /scrubHtmlTags/

  // BEGIN Public method /makeEllipsisStr/
  // Purpose: Shorten a string to a maximum length and append ellipsis
  //   if it is exceeded.
  // Example: makeEllipsisStr({
  //    _input_str_      : 'hee haw and the boys',
  //    _char_limit_int_ : 10,
  //    _do_word_break_  : true
  //  });
  //  // returns 'hee haw ...'
  //
  // Arguments:
  // _input_str_      : (req) The string to shorten if required
  // _char_limit_int_ : (opt, default 0) the maxiumum allowed chars
  // _do_word_break_  : (opt, default true) break at word boundries
  //
  // Returns: A string
  //
  function makeEllipsisStr( arg_map ) {
    var
      scrub_str       = scrubHtmlTags( arg_map._input_str_ ),
      char_limit_int  = arg_map._char_limit_int_ || __0,
      do_word_break   = arg_map._do_word_break_  === __undef
        ? __true : !! arg_map._do_word_break_,
      scrub_count     = scrub_str[ __length ],

      word_list,   word_count,
      solve_count, solve_list,
      idx,         solve_word
      ;

    if ( ! ( char_limit_int && char_limit_int > __3 )
       ) { return __blank; }

    if ( scrub_count <= char_limit_int ) { return scrub_str; }

    if ( do_word_break ) {
      word_list   = scrub_str[ vMap._split_ ]( ' ' );
      word_count  = word_list[ __length ];
      solve_count = __0;
      solve_list  = [];

      WORD: for ( idx = __0; idx < word_count; idx++ ) {
        solve_word  = word_list[ idx ];
        solve_count += solve_word[ __length ] + __1;
        if ( solve_count >= char_limit_int - __3 ) {
          solve_list[ vMap._push_ ]( '...' );
          break WORD;
        }
        solve_list[ vMap._push_ ]( solve_word );
      }
      return __blank + solve_list[ vMap._join_ ]( ' ' );
    }

    return scrub_str.substr(__0, char_limit_int - __3 ) + '...';
  }
  // END Public method /makeEllipsisStr/

  // BEGIN Public method /makeErrorObj/
  // Purpose: A convenient method to create an error object
  // Arguments:
  //   * name_text - the error name
  //   * msg_text  - long error message
  //   * data      - optional data attached to error object
  // Returns  : newly constructed error object
  // Throws   : none
  //
  function makeErrorObj ( arg_name, arg_msg, arg_data ) {
    var
      name = ( arg_name && __Str( arg_name ) ) || 'error',
      msg  = ( arg_msg  && __Str( arg_msg  ) ) || __blank,
      data = arg_data || __undef,
      error_obj = new Error();

    error_obj.name        = 'xhi:' + name;
    error_obj.description = msg;
    error_obj.data        = data;
    return error_obj;
  }
  // END Public method /makeErrorObj/

  // BEGIN Public method /makeGuidStr/
  makeGuidStr = (function () {
    /*jslint bitwise: true*/
    function makePart () {
      //noinspection NonShortCircuitBooleanExpressionJS,MagicNumberJS
      return ((( __1+__random() ) * 0x10000 )|__0
      )[ vMap._toString_ ](16)[ vMap._substr_ ]( __1 );
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
    function checkMatchVal ( data ) {
      var match_count = __0, idx;
      for ( idx = this[ __length]; idx; __0 ) {
        //noinspection IncrementDecrementResultUsedJS
        if ( this[--idx] === data ) { match_count++; }
      }
      return match_count;
    }
    function removeListVal ( data ) {
      var removed_count = __0, idx;
      for ( idx = this[ __length ]; idx; __0 ) {
        //noinspection IncrementDecrementResultUsedJS
        if ( this[--idx] === data ) {
          this.splice(idx, __1 );
          removed_count++;
          idx++;
        }
      }
      return removed_count;
    }
    function pushUniqVal ( data ) {
      if ( checkMatchVal.call(this, data ) ) { return __false; }
      this.push( data );
      return __true;
    }
    function mainFn ( input_list ) {
      var return_list;
      if ( input_list && __Array.isArray( input_list ) ) {
        if ( input_list.remove_val ) {
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
  // 4. Set the function in the utility
  //   map_util_obj._setMapFn_( mapUtil_renameFn );
  // 5. Initialize the result map.  You need this pointer.
  //   result_map = {};
  //   map_util_obj._setResultMap_( result_map );
  // 6. Invoke the map function:
  //   my_list.map( map_util_obj._invokeFn_ );
  // 7. result_map will now contain the results!
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

      //noinspection JSUnusedAssignment
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
  function makePctStr ( arg_ratio, arg_dcount ) {
    var
      ratio  = __Num( arg_ratio  ) || __0,
      dcount = __Num( arg_dcount ) || __0
      ;

    dcount = dcount < __0 ? __0 : __floor( dcount );
    return ( ratio * 100 )[ vMap._toFixed_ ]( dcount ) + '%';
  }
  // END Public method /makePctStr/

  // BEGIN Public method /makeSeenMap/
  // Purpose: Convert arg_key_list into a map with each key assigned
  // the value of arg_seen_data.  If not provided, arg_seen_data === true
  //
  function makeSeenMap ( arg_key_list, arg_seen_data ) {
    var
      key_list  = __Array.isArray( arg_key_list ) ? arg_key_list : [],
      key_count = key_list[ vMap._length_ ],

      solve_data = arg_seen_data === __undef ? __true : arg_seen_data,
      solve_map = {},
      key, idx
      ;

    for ( idx = __0; idx < key_count; idx++ ) {
      key = key_list[ idx ];
      solve_map[ key ] = solve_data;
    }
    return solve_map;
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

  // BEGIN Public method /makeSeriesMap/
  // Purpose   : Create a list of time labels quantitized to match
  //   standard time intervales
  // Example   :
  //    series_map = makeSeriesMap({
  //      _max_ms_       : 1465459980000,
  //      _min_ms_       : 1465452840000,
  //      _tgt_count_    : 12,
  //      _tz_offset_ms_ : 25200000
  //    });
  // Arguments : (required)
  //   _max_ms_       : (req) int start UTC time in milliseconds
  //   _min_ms_       : (req) int end UTC time in milliseconds
  //   _tgt_count_    : (req) int desired number of divisions (+/- 50%)
  //   _tz_offset_ms_ : (req) int UTC offset for timezone
  //
  // Returns:
  //   A map useful for plotting a quantized time series like so:
  //      +-----+------+-----+
  //      |     |      |     |
  //    00:06 00:10  00:15 00:19
  //
  //    { _time_list_    : [...],
  //      _date_list_    : [...],
  //      _offset_ratio_ : 0.3428,
  //      _unit_name_    : '10min',
  //      _unit_ms_      : 600 000,
  //      _unit_ratio_   : 0.4615,
  //      _unit_count_   : 2
  //    }
  //
  //    day_offset is amount of seconds into the day
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
    var
      tz_offset_ms = arg_map._tz_offset_ms_ || __0,
      max_ms       = arg_map._max_ms_ - tz_offset_ms,
      min_ms       = arg_map._min_ms_ - tz_offset_ms,
      tgt_count    = arg_map._tgt_count_,

      date_obj     = new Date(),
      offset_str   = makeClockStr( tz_offset_ms ),
      offset_list  = offset_str[ vMap._split_ ](':'),

      span_ms,         unit_list,    unit_count,
      btm_idx,         top_idx,      btm_count,
      top_count,

      jdx, idx,        check_idx,    check_map,
      check_count,     mod_unit_ms,  offset_ms,
      width_ratio,     offset_ratio, accum_ratio,
      date_ms,         date_offset,

      solve_map,       solve_ms,     solve_str,
      solve_time_list, solve_date_list
      ;

    // Get the time span and a list of available units
    span_ms    = max_ms - min_ms;
    unit_list  = topCmap._unit_ms_list_;
    unit_count = unit_list[ __length ];

    // Init for solve loop
    btm_idx    = __0;
    top_idx    = unit_count - __1;
    btm_count  = tgt_count * 0.75;
    top_count  = tgt_count * 1.25;
    // Back off limits to resolve as close to target as possible
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
    mod_unit_ms  = min_ms % solve_map._unit_ms_;
    offset_ms    = solve_map._unit_ms_ - mod_unit_ms;
    offset_ratio = ( offset_ms / span_ms );

    solve_map._offset_ratio_ = offset_ratio;
    solve_map._unit_ratio_   = solve_map._unit_ms_ / span_ms;

    // Create date list
    date_obj.setTime( min_ms );
    date_obj.setHours(
      -offset_list[ __0 ], -offset_list[ __1], -offset_list[__2]
    );
    date_ms     = date_obj.getTime();
    date_offset = min_ms - date_ms;

    solve_date_list = [];
    accum_ratio     = __0;
    while ( date_ms < max_ms ) {
      width_ratio = ( topCmap._day_ms_ - date_offset ) / span_ms;
      accum_ratio += width_ratio;
      if ( accum_ratio >= __1 ) {
        width_ratio = width_ratio + ( __1 - accum_ratio );
      }
      solve_date_list[ vMap._push_ ]({
        _date_str_     : makeDateStr( date_ms ),
        _width_ratio_  : width_ratio
      });
      date_offset = __0;
      date_ms += topCmap._day_ms_;
    }
    solve_map._date_list_ = solve_date_list;

    solve_time_list = [];
    while ( offset_ratio < __1 ) {
      solve_ms  = __floor( offset_ratio * span_ms ) + min_ms;
      solve_str = makeClockStr( solve_ms, solve_map._show_idx_ );
      solve_time_list[ __push ]( solve_str );
      offset_ratio += solve_map._unit_ratio_;
    }
    solve_map._time_list_ = solve_time_list;

    return solve_map;
  }
  // END Public function /makeSeriesMap/

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
  function makeUcFirstStr ( arg_str ) {
    var
      str    = __Str( arg_str ) || __blank,
      uc_str = str.charAt( __0 ).toUpperCase()
      ;
    return uc_str + str[ vMap._substr_ ]( __1 );
  }
  // END Public method /makeUcFirstStr/

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
      if ( key === undefined ) { break; }

      if ( ! walk_map[ vMap._hasOwnProp_ ]( key ) ) {
        walk_map[ key ] = {};
      }
      if ( ! path_list[ __0 ] ) {
        walk_map[ key ]  = value;
        is_good = __true;
        break;
      }
      walk_map = walk_map[ key ];
    }
    if ( is_good ) { return base_map; }
    return __undef;
  }
  // END Public method /setDeepMapVal/
  // ======================= END PUBLIC METHODS =======================

  // BEGIN initialize module
  function initModule ()  {
    topSmap = {
      _date_obj_     : __undef,
      _tz_offset_ms_ : __undef
    };

    topCmap = {
      _sec_ms_    : 1000,
      _min_sec_   : 60,
      _hrs_min_   : 60,
      _day_hrs_   : 24,

      _min_ms_    : 60000,
      _hrs_ms_    : 3600000,
      _day_ms_    : 86400000,

      _offset_yr_ : 1900,
      _comma_rx_  : makeRxObj( '(\\d)(?=(\\d\\d\\d)+(?!\\d))', 'g' ),
      _tag_rx_    : makeRxObj( '</?[^>]+>', 'g' ),
      _tmplt_rx_  : makeRxObj( '{([^{}]+[^\\\\])}','g' ),
      _tzcode_rx_ : makeRxObj( '\\(([A-Za-z\\s].*)\\)' ),
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
    };
  }
  initModule();
  // END initialize module

  return {
    _clearMap_        : clearMap,
    _cloneData_       : cloneData,
    _getBasename_     : getBasename,
    _getDirname_      : getDirname,
    _getDeepMapVal_   : getDeepMapVal,
    _getListAttrIdx_  : getListAttrIdx,
    _getListAttrMap_  : getListAttrMap,
    _getListDiff_     : getListDiff,
    _getLogUtilObj_   : getLogUtilObj,
    _getNowMs_        : getNowMs,
    _getNumSign_      : getNumSign,
    _getTzOffsetMs_   : getTzOffsetMs,
    _getTzCode_       : getTzCode,
    _getVarType_      : getVarType,
    _makeArgList_     : makeArgList,
    _makeClockStr_    : makeClockStr,
    _makeCommaNumStr_ : makeCommaNumStr,
    _makeDateStr_     : makeDateStr,
    _makeEllipsisStr_ : makeEllipsisStr,
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
    _makeTmpltStr_    : makeTmpltStr,
    _makeUcFirstStr_  : makeUcFirstStr,
    _mergeMaps_       : mergeMaps,
    _pollFunction_    : pollFunction,
    _rmAllObjKeys_    : rmAllObjKeys,
    _scrubHtmlTags_   : scrubHtmlTags,
    _setCmap_         : setCmap,
    _setDeepMapVal_   : setDeepMapVal
  };
}());
