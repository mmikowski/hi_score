/*
 * 01_util.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Summary   : xhi._01_util_._makeInstanceFn_( <appMap>, <optionMap> );
 * Purpose   : Provide utilities with no browser dependencies
 * Example   :
 *   global.xhi    = require( 'js/xhi/00_root' );
 *   xhi._01_util_ = require( 'js/xhi/01_util' );
 *   const
 *     aKey     = 'myApp'
 *     aMap     = xhi._00_root_._makeInstanceFn_( aKey ),
 *     utilObj  = xhi._01_util_._makeInstanceFn_( aMap )
 *     typeKey  = utilObj._getVarType_( 'test' )
 *     ;
 * Requires  : aMap with symbols from xhi.00_root._makeInstanceFn_()
 * Arguments : (positional)
 *   <appMap>    - Application map to add _01_util_
 *   <optionMap> - Optional constraints
 *     + `_dont_autoadd_` - Do not add _01_util_
 *       key to the application map (appMap)
 * Returns   : aMap._01_util_ instance
 * Throws    : None
 *
*/
/*global xhi, xhiJQ*/
// == BEGIN MODULE xhi._01_util_ ======================================
xhi._01_util_ = (function () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var singletonMap;

  // BEGIN constructor /makeSingletonMap/
  function makeSingletonMap ( aMap ) {
    // noinspection MagicNumberJS
    var
    // Set app symbols
    aKey    = aMap._aKey_,
    nMap    = aMap._nMap_,
    vMap    = aMap._vMap_,

    // Set object symbols
    __Array   = vMap._Array_,
    __Date    = vMap._Date_,
    __Math    = vMap._Math_,
    __Num     = vMap._Number_,
    __Str     = vMap._String_,

    // Set function symbols
    clearToFn       = vMap._clearTimeoutFn_,
    data2strFn      = vMap._data2strFn_,
    makeAbsNumFn    = vMap._makeAbsNumFn_,
    makeFloorNumFn  = vMap._makeFloorNumFn_,
    makeKeyListFn   = vMap._makeKeyListFn_,
    makeRandomNumFn = vMap._makeRandomNumFn_,
    makeRoundNumFn  = vMap._makeRoundNumFn_,
    setToFn         = vMap._setTimeoutFn_,
    str2dataFn      = vMap._str2dataFn_,
    typeofFn        = vMap._typeofFn_,

    // Set number symbols
    __n1  = nMap._n1_,
    __0   = nMap._0_,
    __1   = nMap._1_,
    __2   = nMap._2_,
    __3   = nMap._3_,
    __4   = nMap._4_,
    __5   = nMap._5_,
    __6   = nMap._6_,
    __7   = nMap._7_,
    __8   = nMap._8_,
    __10  = nMap._10_,
    __100 = nMap._100_,

    // Set scalar symbols
    __apply      = vMap._apply_,
    __blank      = vMap._blank_,
    __bind       = vMap._bind_,
    __false      = vMap._false_,
    __hasProp    = vMap._hasOwnProperty_,
    __indexOf    = vMap._indexOf_,
    __join       = vMap._join_,
    __length     = vMap._length_,
    __match      = vMap._match_,
    __null       = vMap._null_,
    __pop        = vMap._pop_,
    __push       = vMap._push_,
    __replace    = vMap._replace_,
    __shift      = vMap._shift_,
    __slice      = vMap._slice_,
    __space      = vMap._space_,
    __split      = vMap._split_,
    __substr     = vMap._substr_,
    __toString   = vMap._toString_,
    __true       = vMap._true_,
    __undef      = vMap._undef_,
    __unshift    = vMap._unshift_,

    // Set shared map
    typeofMap = {
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
    },

    // Set configuration map
    configMap = {
      // Used by various time and date function
      _sec_ms_    : 1000,
      _min_sec_   : 60,
      _hrs_min_   : 60,
      _day_hrs_   : 24,

      _min_ms_    : 60000,
      _hrs_ms_    : 3600000,
      _day_ms_    : 86400000,
      _offset_yr_ : 1900,
      _noon_hr_   : 12,

      _get_now_fn_  : vMap._getNowMs_,
      _date_us_rx_  : makeRxObj(
        '^(0?[1-9]|1[012])[\\/-](0?[1-9]|[12][0-9]|3[01])[\\/-]([0-9]{4})\\b'
      ),
      _date_utc_rx_ : makeRxObj(
        '^([0-9]{4})[\\/-](0?[1-9]|1[012])[\\/-](0?[1-9]|[12][0-9]|3[01])\\b'
      ),

      // encodeHtml
      _encode_html_map_ : {
        '&' : '&#38;',
        '"' : '&#34;',
        "'" : '&#39;',
        '>' : '&#62;',
        '<' : '&#60;'
      },
      _encode_html_rx_  : /[&"'><]/g,
      _encode_noamp_rx_ : /["'><]/g,

      // makeCommaNumStr
      _comma_rx_ : makeRxObj( '(\\d)(?=(\\d\\d\\d)+(?!\\d))', 'g' ),

      // makeScrubStr
      _tag_end_rx_: makeRxObj( '(</[^>]+>)+', 'g' ),
      _tag_rx_    : makeRxObj( '</?[^>]+>', 'g' ),

      // makeTmpltStr
      _tmplt_rx_  : makeRxObj( '{([^{}]+[^\\\\])}','g' ),

      // getTimeCode
      _tzcode_rx_ : makeRxObj( '\\((.*)\\)$' ),

      // makeRekeyMap
      _rekey_max_count_ : 10000,

      // makeMetricStr
      _metric_table_ : [
        { _min_int_ : 1.0e+9, _suffix_ : 'G' },
        { _min_int_ : 1.0e+6, _suffix_ : 'M' },
        { _min_int_ : 1.0e+3, _suffix_ : 'K' }
      ],

      // makeSeriesMap
      _unit_ms_list_ : [
        { _str_ : '0.1s',  _ms_ :        100, _time_idx_ : __3 },
        { _str_ : '0.25s', _ms_ :        250, _time_idx_ : __3 },
        { _str_ : '0.5s',  _ms_ :        500, _time_idx_ : __3 },
        { _str_ : '1s',    _ms_ :       1000, _time_idx_ : __3 },
        { _str_ : '2.5s',  _ms_ :       2500, _time_idx_ : __3 },
        { _str_ : '5s',    _ms_ :       5000, _time_idx_ : __3 },
        { _str_ : '10s',   _ms_ :      10000, _time_idx_ : __3 },
        { _str_ : '15s',   _ms_ :      15000, _time_idx_ : __3 },
        { _str_ : '30s',   _ms_ :      30000, _time_idx_ : __3 },
        { _str_ : '1m',    _ms_ :      60000, _time_idx_ : __2 },
        { _str_ : '2.5m',  _ms_ :     150000, _time_idx_ : __3 },
        { _str_ : '5m',    _ms_ :     300000, _time_idx_ : __2 },
        { _str_ : '10m',   _ms_ :     600000, _time_idx_ : __2 },
        { _str_ : '15m',   _ms_ :     900000, _time_idx_ : __2 },
        { _str_ : '30m',   _ms_ :    1800000, _time_idx_ : __2 },
        { _str_ : '1hr',   _ms_ :    3600000, _time_idx_ : __2 },
        { _str_ : '2hr',   _ms_ :    7200000, _time_idx_ : __2 },
        { _str_ : '4hr',   _ms_ :   14400000, _time_idx_ : __2 },
        { _str_ : '6hr',   _ms_ :   21600000, _time_idx_ : __2 },
        { _str_ : '8hr',   _ms_ :   28800000, _time_idx_ : __2 },
        { _str_ : '12hr',  _ms_ :   43200000, _time_idx_ : __1 },
        { _str_ : '1d',    _ms_ :   86400000, _time_idx_ : __1 },
        { _str_ : '2d',    _ms_ : 86400000*2, _time_idx_ : __1 },
        { _str_ : '4d',    _ms_ : 86400000*4, _time_idx_ : __1 },
        { _str_ : '1wk',   _ms_ : 86400000*7, _time_idx_ : __1 }
      ]
    },

    stateMap = {
      _date_obj_     : __undef,
      _tz_offset_ms_ : __undef
    },

    // Declare other module-scope vars
    getBasename, getDirname,
    logObj, logFn;

  /* istanbul ignore next */
  try {
    stateMap._has_jq_ = !! xhiJQ;
  }
  catch ( ignore ) {
    stateMap._has_jq_ = __false;
  }
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN PREREQ METHODS ==========================================
  // BEGIN Public prereq method /getVarType/
  // Summary   : getVarType( <data> );
  // Purpose   : Determine the type of data provided.
  // Example   : getVarType( [] ); // '_Array_'
  // Arguments : ( positional )
  //   <data> - value to examine
  // Returns   : '_Function_', '_Object_', '_Array_', '_String_',
  //             '_Number_', '_Null_', '_Boolean_', or '_Undefined_'
  // Throws    : None
  //
  function getVarType ( data ) {
    var type_key, type_str;

    if ( data === __null ) {  return '_Null_'; }
    if ( data === __undef ) { return '_Undefined_'; }
    if ( __Array.isArray( data ) ) { return '_Array_'; }

    type_key = typeofFn( data );
    type_str = typeofMap[ type_key ];

    if ( type_str && type_str !== '_Object_' ) { return type_str; }

    type_key = {}[ __toString ].call( data )[ __slice ]( __8, __n1 );

    return typeofMap[ type_key ] || type_key;
  }
  // . END Public prereq method /getVarType/

  // BEGIN Public prereq method /castBool/
  // Summary   : castBool( <data>, <alt_data> );
  // Purpose   : Cast a boolean value
  // Example   : castBool( __true ); // returns __true
  // Arguments : ( positional )
  //   <data>     - data to cast as boolean
  //   <alt_data> - alternate value to return
  // Returns   :
  //   <data> if it is a boolean, <alt_data> otherwise
  // Throws    : None
  //
  function castBool ( data, alt_data ) {
    if ( data === __true || data === __false ) { return data; }
    return alt_data;
  }
  // . END Public prereq method /castBool/

  // BEGIN Public prereq method /castFn/
  // Summary   : castFn( <data>, <alt_data> );
  // Purpose   : Cast a function
  // Example   : castFn( function() {} ); // returns function
  // Arguments : ( positional )
  //   <data>     - data to cast as function
  //   <alt_data> - alternate value to return
  // Returns   :
  //   <data> if it is a function, <alt_data> otherwise
  // Throws    : None
  //
  function castFn ( data, alt_data ) {
    var var_type = getVarType( data );
    return ( var_type === '_Function_' ) ? data : alt_data;
  }
  // . END Public prereq method /castFn/

  // BEGIN Private prereq method /checkNumFn/
  // Summary   : checkNumFn( <num>, <alt_data>, <option_map> );
  // Purpose   : Adjust <num> per option_map
  // Example   :
  //   checkNumFn( 25, 0, { _max_num_: 20, _do_autobound_: __true });
  //   // Returns 20
  // Arguments :
  //   <num>        - Number to consider
  //   <alt_data>   - Alternate to use if num is invalid
  //   <option_map> - Map of directives
  //     + _do_autobound_ - Auto bound input to min/max as appropriate.
  //       Default is __false.
  //     + _do_warn_      - Log warnings.      Default is __false.
  //     + _max_num_      - Max allowed value. Default is __undef.
  //     + _min_num_      - Min allowed value. Default is __undef.
  //
  // Returns   : Adjusted num
  // Throws    : None
  //
  function checkNumFn( arg_num, alt_data, option_map ) {
    var
      num      = arg_num,
      log_list = [],

      solve_data;

    if ( option_map[ __hasProp ]( '_max_num_' )
      && num > option_map._max_num_
    ) {
      if ( option_map._do_autobound_ ) {
        num = option_map._max_num_;
      }
      else {
        log_list[ __push ](
          '_num_exceeds_max_ '
          + __Str( num ) + ' > '
          + __Str( option_map._max_num_ )
        );
      }
    }

    if ( option_map[ __hasProp ]( '_min_num_' )
      && num < option_map._min_num_
    ) {
      if ( option_map._do_autobound_ ) {
        num = option_map._min_num_;
      }
      else {
        log_list[ __push ](
          '_num_below_min_ ' + option_map._min_num_
        );
      }
    }

    if ( log_list[ __length ] === __0 ) {
      solve_data = num;
    }
    else {
      if ( option_map._do_warn_ ) {
        logFn( '_warn_', '_num_fails_constraints_', log_list );
      }
      solve_data = alt_data;
    }
    return solve_data;
  }
  // . END Private prereq method /checkNumFn/

  // BEGIN Public prereq method /castInt/
  // Summary   : castInt( <data>, <alt_data>, <option_map> );
  // Purpose   : Cast an integer
  // Example   : castInt( '25.425' ); // returns 25
  // Arguments : (positional)
  //   <data>       - data to cast as int
  //   <alt_data>   - alternate value to return
  //   <option_map> - Optional constraint map
  //     + _do_autobound_ - Auto bound input to min/max as appropriate
  //     + _do_warn_      - Log warnings
  //     + _max_num_      - Max allowed value
  //     + _min_num_      - Min allowed value
  // Returns   :
  //   If a number, returns the number rounded to nearest int.
  //   If a string, returns the number rep rounded to nearest int.
  //   Otherwise <alt_data>.
  // Throws    : None
  //
  function castInt ( data, alt_data, option_map ) {
    var
      var_type = getVarType( data ),
      solve_num  = var_type === '_Number_'
        ? data : var_type === '_String_'
          ? parseFloat( data ) : __undef,
      solve_int;

    if ( isNaN( solve_num ) ) { return alt_data; }
    solve_int = makeRoundNumFn( solve_num );

    // Begin process optional constraints
    if ( typeofFn( option_map ) === vMap._object_ ) {
      return checkNumFn( solve_int, alt_data, option_map );
    }
    // . End process optional constraints
    return solve_int;
  }
  // . END Public prereq method /castInt/

  // BEGIN Public prereq method /castJQ/
  // Summary   : castJQ( <data>, <alt_data> );
  // Purpose   : Cast a jQuery (xhiJQ) object
  // Example   : castJQ( $top_box ); // returns $top_box
  // Arguments : (positional)
  //   <data>     - Data to cast as xhiJQ object
  //   <alt_data> - Alternate value to return
  // Returns   :
  //   <data> if it is a xhiJQ object, <alt_data> otherwise
  // Throws    : None
  //
  function castJQ ( data, alt_data ) {
    if ( stateMap._has_jq_ ) {
      return ( data && data instanceof xhiJQ ) ? data : alt_data;
    }
    /* istanbul ignore next */
    return alt_data;
  }
  // . END Public preq method /castJQ/

  // BEGIN Public prereq method /castList/
  // Summary   : castList( <data>, <alt_data>, <option_map> );
  // Purpose   : Cast a list
  // Example   : castList( [] ); // returns the array
  // Arguments : (positional)
  //   <data>       - Data to cast as list
  //   <alt_data>   - Optional alternate value to return. Default is __undef.
  //   <option_map> - Optional constraint map
  //       + _do_warn_      - Log warnings.       Default is __true.
  //       + _is_empty_ok_  - Allow empty list.   Default is __true.
  //       + _max_length_   - Max allowed length. Default is __undef.
  //       + _min_length_   - Min allowed length. Default is __undef.
  // Returns   :
  //   <data> if it is an array and passes optional constraints,
  //   <alt_data> otherwise
  // Throws    : None
  //
  function castList ( data, alt_data, option_map ) {
    var
      var_type = getVarType( data ),
      log_list, item_count;

    // Return alt_data if not array
    if ( var_type !== '_Array_' ) { return alt_data; }

    // Begin process optional constraints
    if ( typeofFn( option_map ) === vMap._object_ ) {
      log_list = [];
      item_count = data[ __length ];
      if ( item_count === __0 && option_map._is_empty_ok_ === __false ) {
        log_list[ __push ]( '_list_is_empty_' );
      }

      if ( option_map._max_length_
        && item_count > option_map._max_length_
      ) {
        log_list[ __push ](
          '_list_exceed_max_length_ ' + __Str( item_count )
          + ' > ' + __Str( option_map._max_length_ )
        );
      }

      if ( option_map._min_length_
        && item_count < option_map._min_length_
      ) {
        log_list[ __push ](
          '_list_is_below_min_length_  ' + __Str( item_count )
          + ' < ' + __Str( log_list._min_length_ )
        );
      }

      if ( log_list[ __length ] > __0 ) {
        if ( option_map._do_warn_ ) {
          logFn( '_warn_', '_list_fails_constraints_', log_list );
        }
        return alt_data;
      }
    }
    // . End process optional constraints

    return data;
  }
  // . END Public prereq method /castList/

  // BEGIN Public prereq method /castMap/
  // Summary   : castMap( <data>, <alt_data> );
  // Purpose   : Cast a map
  // Example   : castMap( {} ); // returns the object
  // Arguments : (positional)
  //   <data>     - data to cast as map
  //   <alt_data> - alternate value to return
  // Returns   :
  //   <data> if it is a map, <alt_data> otherwise
  // Throws    : None
  //
  function castMap ( data, alt_data ) {
    var var_type = getVarType( data );
    return ( var_type === '_Object_' ) ? data : alt_data;
  }
  // . END Public prereq method /castMap/

  // BEGIN Public prereq method /castNum/
  // Summary   : castNum( <data>, <alt_data>, <option_map> );
  // Purpose   : Cast an integer
  // Example   : castNum( '25.425' ); // returns 25
  // Arguments : (positional)
  //   <data>       - data to cast as int
  //   <alt_data>   - alternate value to return. Default is __undef.
  //   <option_map> - Optional constraint map
  //     + _do_autobound_ - Auto bound input to min/max as appropriate.
  //       Default is __false.
  //     + _do_warn_      - Log warnings.      Default is __false.
  //     + _max_num_      - Max allowed value. Default is __undef.
  //     + _min_num_      - Min allowed value. Default is __undef.
  // Returns   :
  //   If a number, returns the number rounded to nearest int.
  //   If a string, returns the number rep rounded to nearest int.
  //   Otherwise <alt_data>.
  // Throws    : None
  //
  function castNum ( data, alt_data, option_map ) {
    var
      var_type = getVarType( data ),
      solve_num  = var_type === '_Number_'
        ? data : var_type === '_String_'
          ? parseFloat( data ) : __undef;

    if ( isNaN( solve_num ) ) { return alt_data; }

    // Begin process optional constraints
    if ( typeofFn( option_map ) === vMap._object_ ) {
      return checkNumFn( solve_num, alt_data, option_map );
    }
    // . End process optional constraints
    return solve_num;
  }
  // . END Public prereq method /castNum/

  // BEGIN Public prereq method /castObj/
  // Summary   : castObj( <obj_type>, <data>, <alt_data> );
  // Purpose   : Cast an object
  // Example   : castObj( 'styleSheetList', document.styleSheets );
  // Arguments : (positional)
  //   <obj_type> - string of object type (see Example)
  //   <data>     - data to cast as <obj_type> object
  //   <alt_data> - alternate value to return
  // Returns   :
  //   <data> if an <obj_type> object, <alt_data> otherwise
  // Throws    : None
  //
  function castObj ( obj_type, data, alt_data ) {
    var var_type = getVarType( data );
    return var_type === obj_type ? data : alt_data;
  }
  // . END Public prereq method /castObj/

  // BEGIN Public prereq method /castRx/
  // Purpose this is a simple wrapper around castObj for RegExp
  //
  function castRx ( data, alt_data ) {
    return castObj( 'RegExp', data, alt_data );
  }
  // . END Public prereq method /castObj/

  // BEGIN Public prereq method /castStr/
  // Summary   : castStr( <data>, <alt_data> );
  // Purpose   : Cast a string
  // Example   : castStr( 25.425 ); // returns '25.425'
  // Arguments : (positional)
  //   <data>       - Data to cast as string
  //   <alt_data>   - Alternate value to return
  //   <option_map> - Optional constraints
  //     + _do_warn_      - Log warnings. Default is __false.
  //     + _filter_rx_    - A regex filter that must be passed
  //     + _is_empty_ok_  - Allow blank string. Default is yes (__undef).
  //     + _max_length_   - Max allowed length. Default is __undef.
  //     + _min_length_   - Min allowed length. Default is __undef.
  // Returns   :
  //   <data> if a string, or a number converted to a string,
  //   <alt_data> otherwise
  // Throws    : None
  //
  function castStr ( data, alt_data, option_map ) {
    var
      var_type  = getVarType( data ),
      solve_str = ( var_type === '_String_' )
        ? data : var_type === '_Number_'
          ? __Str( data ) : __undef,
      log_list, char_count;

    if ( solve_str === __undef ) { return alt_data; }

    // Begin process optional constraints
    if ( typeofFn( option_map ) === vMap._object_ ) {
      log_list = [];
      char_count = solve_str[ __length ];
      if ( option_map._is_empty_ok_ === __false
        && solve_str === __blank
      ) {
        log_list[ __push ]( '_str_is_empty_' );
      }

      if ( option_map._max_length_
        && char_count > option_map._max_length_
      ) {
        log_list[ __push ](
          '_str_exceeds_max_length_ ' + __Str( char_count )
          + ' > ' + __Str( option_map._max_length_ )
        );
      }

      if ( option_map._min_length_
        && char_count < option_map._min_length_
      ) {
        log_list[ __push ](
          '_str_is_below_min_length_ ' + __Str( char_count )
          + ' < ' + __Str( log_list._min_length_ )
        );
      }

      if ( option_map._filter_rx_
        && ! option_map._filter_rx_.test( solve_str )
      ) {
        log_list[ __push ](
          '_str_fails_filter_rx_ '
          + option_map._filter_rx_[ __toString ]()
        );
      }

      if ( log_list[ __length ] > __0 ) {
        if ( option_map._do_warn_ ) {
          logFn( '_warn_', '_str_fails_constraints_', log_list );
        }
        return alt_data;
      }
    }
    // . End process optional constraints
    return solve_str;
  }
  // . END Public prereq method /castStr/

  // BEGIN Public prereq method /safeJsonParse/
  // Summary   : safeJsonParse( <json_str>, <alt_data> );
  // Purpose   : Parses JSON safely, using alt_data if it cannot
  // Example   : my map = safeJsonParse( '{}', {} );
  // Arguments : (positional)
  //   <json_str> - JSON string to parse
  //   <alt_data> - Alternate return if parsing fails
  // Returns   : Parsed JSON or alt_data
  // Throws    : None
  //
  function safeJsonParse ( json_str, alt_data ) {
    var solve_data;
    try {
      solve_data = str2dataFn( json_str );
    }
    catch ( ignore ) {
      solve_data = alt_data;
    }
    return solve_data;
  }
  // . END Public prereq method /safeJsonParse/

  // BEGIN Public prereq method /safeJsonStringify/
  // Summary   : safeJsonStringify( <data>, <alt_data> );
  // Purpose   : Stringifies JSON safely
  // Example   : my str = safeJsonStringify( {}, '{}' );
  // Arguments : (positional)
  //   <data>     - Data structure to stringify
  //   <alt_data> - Alternate return if parsing fails
  // Returns   : JSON string on success, alt_data on failure
  // Throws    : None
  //
  function safeJsonStringify ( arg_data, alt_data ) {
    var solve_str;
    try {
      solve_str = data2strFn( arg_data );
    }
    catch ( ignore ) {
      solve_str = alt_data;
    }
    return solve_str;
  }
  // . END Public prereq method /safeJsonStringify/

  // BEGIN Public prereq method /cloneData/
  // Summary   : cloneData( <data> );
  // Purpose   : Deep clone non-recursive data structures fast
  // Example   : cloneData( data, [] ); // return copy data or list on fail
  // Arguments : (positional)
  //   <arg_data> - data to clone
  //   <alt_data> - alternate if clone fails
  //
  // Returns   : Success: A deep copy.
  //             Failure: alt_data (malformed, recursive structures)
  // Throws    : None
  //
  function cloneData ( arg_data, alt_data ) {
    var solve_data;
    if ( arg_data === __undef ) { return arg_data; }
    try {
      solve_data = JSON.parse( JSON.stringify( arg_data ) );
    }
    catch ( ignore ) {
      solve_data = alt_data;
    }
    return solve_data;
  }
  // . END Public prereq method /cloneData/

  // BEGIN Public prereq method /extendList/
  // Summary   : extendList( <base_list>, <extend_list> );
  // Purpose   : Extend <base_list> with contents of <extend_list>
  // Example   : extendList( [0], [1,2,3] ); // returns [0,1,2,3]
  // Arguments : (positional)
  //   <base_list>   - list to extend
  //   <extend_list> - list to append to base_list
  // Returns   : base_list after change
  // Throws    : None
  //
  function extendList ( arg_base_list, arg_extend_list ) {
    var
      base_list   = castList( arg_base_list,   [] ),
      extend_list = castList( arg_extend_list, [] );

    __Array.prototype.push[ __apply ]( base_list, extend_list );
    return base_list;
  }
  // . END Public prereq method /extendList/

  // BEGIN Public prereq method /getNowMs/
  // Summary   : getNowMs( <do_local> );
  // Purpose   : Get timestamp
  // Example   : getNowMs(); // returns 1486283077968
  // Arguments :
  //   + <do_local> - Subtract local TZ offset if true
  // Returns   : The current timestamp in milliseconds
  // Throws    : None
  //
  // Note      : The __Date.now() method is 3x faster than the
  //   +new __Date() in NodeJS and provides almost the
  //   the same performance in that env as a raw __Date.now() call.
  //
  function getNowMs ( do_local ) {
    var date_obj;
    if ( do_local ) {
      date_obj = new __Date();
      return date_obj.getTime()
        - ( date_obj.getTimezoneOffset() * configMap._min_ms_ );
    }

    return configMap._get_now_fn_
      ? configMap._get_now_fn_() : +new __Date();
  }
  // . END Public prereq method /getNowMs/

  // BEGIN Public prereq method /getNumSign/
  // Summary   : getNumSign( <data> );
  // Purpose   : Convert number into -1 or 1
  // Example   : getNumSign( '-25' ); // returns -1
  // Arguments :
  //   <data> - number or string to convert to -1 or 1
  // Returns   : -1 if the processed number is less than 0,
  //   otherwise 1.
  // Throws    : None
  //
  function getNumSign ( n ) {
    var num = __Num( n );
    return ( ! isNaN( num ) && num < __0 ) ? __n1 : __1;
  }
  // . END Public prereq method /getNumSign/

  // BEGIN Private method /getTzDateObj/
  // Returns   : A date object singleton for use by Tz methods
  //
  function getTzDateObj () {
    if ( ! stateMap._date_obj_ ) {
      stateMap._date_obj_ = new __Date();
    }
    return stateMap._date_obj_;
  }
  // . END Private method /getTzDateObj/

  // TODO 2017-09-28 mmikowski info: Create checkArgMap from argc.js
  // This should wrap around castXX utilities.
  // nameCheckMap = {
  //   any_rx     : /^_data_?$/,
  //   array_rx   : /_list_?$/,
  //   boolean_rx : /^(allow|is|do|has|have|be|if|dont)_/,
  //   map_rx     : /_map_?$/,
  //   integer_rx : /_(count|idx|idto|idint|ms|px)_?$/,
  //   jquery_rx  : /^\$/,
  //   number_rx  : /_(num|ratio)_?$/,
  //   object_rx  : /^_obj_?$/,
  //   regex_rx   : /^_(regex|rx)_?$/,
  //   string_rx  : /_(name|key|type|text|html)_?$/,
  //   svgelem_rx : /^_svg_?$/
  // }
  // BEGIN Public method /checkArgMap/
  // Purpose   : Provide an easy and efficient means to check named arguments
  // Example   :
  //   argc.setMode( 'strict' );
  //   function fooFn ( arg_map ) {
  //     try {
  //       argc.checkArgMap(
  //         { item_id          : { var_type : 'string' },
  //           left_px          : {
  //             var_type       : 'number',
  //             data_default   : 1280,
  //             min_num        : 0,
  //             max_num        : 2560
  //           },
  //           top_px           : {
  //             var_type       : 'number',
  //             data_default   : 400,
  //             min_num        : 0,
  //             max_num        : 2560
  //           },
  //           height_px        : {
  //             var_type       : 'integer',
  //             data_default   : 50,
  //             min_int        : 1,
  //             max_int        : 50,
  //             is_optional    : true
  //           },
  //           width_px         : {
  //             var_type       : 'integer',
  //             data_default   : 50,
  //             min_int        : 1,
  //             max_int        : 50,
  //             is_optional    : true
  //           },
  //           color_map   : { var_type : 'map',     is_empty_ok : __false },
  //           element_map : { var_type : 'map',     is_empty_ok : __true,
  //             data_default : {}   },
  //           is_pinned   : { var_type : 'boolean', data_default : __false },
  //           is_seen     : { var_type : 'boolean', data_default : __false },
  //           mode_type   : { var_type : 'string',  data_default : 'view',
  //             filter_rx  : /^view$|^edit$/ },
  //           form_map    : { var_type : 'map',     data_default : __null  }
  //         }, arg_map
  //       );
  //     }
  //     catch ( error_obj ) {
  //       console.trace( error_obj );
  //       throw error_obj;
  //     }
  //     ...
  //   }
  //
  // Required Arguments :
  //   * rule_map - a map of rules used to check arguments
  //   * arg_map  - a map of arguments to check
  //
  //   The rule_map is used to test the arg_map.
  //   Each key in the rule_map corresponds to an argument name
  //   except for special keys noted below.  Therefore, the format is:
  //     rule_map = {
  //       <name_1> : { var_type : <var_type>, <optional constraints> },
  //       <name_2> : { var_type : <var_type>, <optional constraints> },
  //       ...
  //     };
  //
  //   Optional constraints for all <var_type>'s include:
  //      is_optional  - is an optional argument
  //      default_data - default value if key is omitted
  //
  //   Optional constraints by data type include:
  //     * array:
  //       + is_empty_ok  - allow empty array
  //       + min_length   - min allowed length
  //       + max_length   - max allowed length
  //     * boolean:
  //     * function:
  //     * integer:
  //       + min_int      - min allowed value
  //       + max_int      - max allowed value
  //       + do_autobound - auto bound input to min/max as appropriate
  //     * map/object:
  //       + is_empty_ok  - allow an empty object
  //     * number:
  //       + min_num      - min allowed value
  //       + max_num      - max allowed value
  //       + do_autobound - auto bound input to min/max as appropriate
  //     * string:
  //       + is_empty_ok  - allow empty string
  //       + filter_rx    - a regex filter that must be passed
  //       + min_length   - min allowed length
  //       + max_length   - max allowed length
  //     * svgelem:
  //
  //   Special directive keys
  //     * _do_check_names : When __true, will
  //       compare key names against a naming convention
  //       (see nameCheckMap for configuration)
  //       WARNING: checkArgMap in 'strict' mode always sets this to __true.
  //     * _allow_more_keys : When __true, check ignores keys not defined
  //       in the check map.  Normal behavior is to throw an error.
  //       WARNING: checkArgMap in 'strict' mode ignores this flag.
  //     * _skip_key_list   : A list of key names to skip consideration.
  //       WARNING: checkArgMap in 'strict' mode ignores this list.
  //     * _allow_falsey_value : When __true, skips validation for an
  //       if its value isNaN, Null, or other non-true value other than
  //       0 or undefined.
  //
  // Optional Argument : None
  // Settings  : checkArgMap.configModule.setMode( '[strict|normal|off]' )
  //   affects the behavior of checkArgMap.
  //   IN 'strict' MODE, the special directive keys are processed as follows:
  //     * _do_check_names  : __true
  //     * _allow_more_keys : __false
  //     * _skip_key_list   : []
  //   IN 'normal' MODE the utility works as above.
  //   IN 'off' MODE , the utility is a no-op and simply returns.
  // Returns   : None
  // Throws    : an error object if validation fails

  // BEGIN Public prereq method /makeArgList/
  // Summary   : makeArgList( <arg_obj> );
  // Purpose   : Make a real array from data in argument object
  // Example   : makeArgList( arguments ); // returns [ ... ]
  // Arguments :
  //   <arg_obj> - an argument object ('arguments' in functions)
  // Returns   : An array of argument values
  // Throws    : None
  //
  // The technique used is around 3x faster than
  //   return Array.prototype[ __slice ].call( arg_obj );
  // See https://github.com/petkaantonov/bluebird/wiki/\
  //   Optimization-killers#3-managing-arguments
  //
  function makeArgList ( arg_obj ) {
    var
      src_obj    = castObj( 'Arguments', arg_obj, {} ),
      arg_count  = src_obj[ __length ],
      solve_list = [],
      idx;

    for ( idx = __0; idx < arg_count; idx++ ) {
      solve_list[ idx ] = arg_obj[ idx ];
    }
    return solve_list;
  }
  // . END Public prereq method /makeArgList/

  // BEGIN Public prereq method /makePadStr/
  // Summary   : makePadStr( <str>, <count>, [ <char>, <do_left> ] );
  // Purpose   : Pad an <str> with <char> for <count> digits
  // Example   : makePadStr( 25, 3 );      //  return ' 25'
  //           : makePadStr( 25, 3, '0' ); // returns '025'
  // Arguments :
  //   <str>      - The string to pad
  //   <count>    - The desired length
  //   <char>     - The padding character (default is space)
  //   <do_left>  - Pad left (default is true), otherwise right
  // Returns   : A trimmed and padded string
  // Throws    : None
  //
  function makePadStr( arg_str, arg_count, arg_char, arg_do_left) {
    var
      str      = castStr(  arg_str   ),
      count    = castInt(  arg_count ),
      char_str = castStr(  arg_char  ,  __space ),
      do_left  = castBool( arg_do_left , __true  ),
      list     = [],

      pad_str, pad_count;

    if ( str === __undef ) { return __blank; }

    str = str[ vMap._trim_ ]();
    if ( ! ( count && count >= __0 ) ) { return str; }

    // Consider: Preserve sign symbol (-/+)

    pad_count = count - str[ __length ];
    if ( pad_count < __0 ) { return str; }

    // See repeat funciton in ES6
    list[ __length ] = pad_count > __0 ? pad_count + __1 : __0;

    pad_str =  list[ __join ]( char_str );

    return do_left ?  pad_str + str : str + pad_str;
  }
  // . END Public prereq method /makePadStr/

  // BEGIN Public prereq method /makeEscRxStr/
  // Summary   : makeEscRxStr( <string> );
  // Purpose   : Escapes a regular expression string
  // Example   : makeEscRxStr( '[]' ) // returns '\[\]\'
  // Arguments : <string> to escape
  // Returns   : Escaped regular expression string
  // Throws    : None
  // Other     : See http://stackoverflow.com/questions/3115150
  //
  function makeEscRxStr( arg_str ) {
    var str = castStr( arg_str, __blank );
    return str[ __replace ]( /[-[\]{}()*+?.,\\^$|#]/gm, "\\$&");
  }
  // . END Public prereq method /makeEscRxStr/

  // BEGIN Public prereq method /makeExtractMap/
  // Summary   : makeExtractMap( <base_map>, <key_list> );
  // Purpose   : Makes and returns a new map using <key_list>
  // Example   : makeExtractMap( { a:1, b:2 }, ['a'] ); // returns { a:1 }
  // Arguments : (positional)
  //   <base_map> - Map to extract values from
  //   <key_list> - List of keys to copy (shallow)
  //                Default: all keys
  // Returns   : Newly created map
  // Throws    : None
  //
  function makeExtractMap ( arg_base_map, arg_key_list ) {
    var
      base_map  = castMap(  arg_base_map, {} ),
      key_list  = castList( arg_key_list, makeKeyListFn( base_map ) ),
      key_count = key_list[ __length ],
      solve_map = {},
      idx, key;

    for ( idx = __0; idx < key_count; idx++ ) {
      key = key_list[ idx ];
      solve_map[ key ] = base_map[ key ];
    }

    return solve_map;
  }
  // . END Public prereq method /makeExtractMap/

  // BEGIN Public prereq method /makeRxObj/
  // Summary   : makeRxObj( <pattern>, <options> );
  // Purpose   : Create a regular expression object
  // Example   : makeRxObj( '\s*hello\s*', 'i' );
  // Arguments :
  //   <pattern> - a string to convert into a regexp
  //   <options> - an option string
  // Returns   : A regular expression object
  // Throws    : None
  //
  function makeRxObj ( arg_pattern_str, arg_option_str ) {
    var
      pattern_str = castStr( arg_pattern_str, __blank ),
      option_str  = castStr( arg_option_str );

    if ( option_str ) {
      return new RegExp( pattern_str, option_str );
    }
    return new RegExp( pattern_str );
  }
  // . END Public prereq method /makeRxObj/

  // BEGIN Public prereq method /makeScrubStr/
  // Summary   : makeScrubStr( <string>, <do_space> );
  // Purpose   : Remove HTML tags and trim string
  // Example   : makeScrubStr( '<h1>Hello</h1><p>Hi</p>', __true );
  //             // returns 'Hello Hi'
  // Arguments :
  //   <string>   - A string to scrub
  //   <do_space> - Add a space between groups
  // Returns   : The scrubbed string
  // Throws    : None
  //
  function makeScrubStr ( arg_str, arg_do_space ) {
    var
      raw_str    = castStr(  arg_str, __blank ),
      do_space   = castBool( arg_do_space ),
      interm_str = do_space
        ? raw_str[ __replace ]( configMap._tag_end_rx_, __space )
        : raw_str;

    interm_str = interm_str[ vMap._trim_ ]();
    return interm_str[ __replace ]( configMap._tag_rx_, __blank );
  }
  // . END Public prereq method /makeScrubStr/

  // BEGIN Public prereq method /makeUcFirstStr/
  // Summary   : makeUcFirstStr( <string> );
  // Purpose   : Capitalize the first letter of a string
  // Example   : makeUcFirstStr( 'hello' );
  //             // returns 'Hello'
  // Arguments :
  //   <string> - A string to process
  // Returns   : The string with the first character capitalized
  // Throws    : None
  //
  function makeUcFirstStr ( arg_str ) {
    var
      str    = castStr( arg_str, __blank ),
      uc_str = str.charAt( __0 ).toUpperCase();
    return uc_str + str[ __substr ]( __1 );
  }
  // . END Public prereq method /makeUcFirstStr/
  // == . END PREREQ METHODS ==========================================

  // == BEGIN UTILITY OBJECTS =========================================
  // BEGIN define logObj singleton
  // Summary   : logObj._setLogLevel_( <log_level> );
  // Purpose   : Provide a log4j-style logging singleton
  // Example   :
  //   logObj._setLogLevel_('_warn_');
  //   logObj._logMsg_('_warn_', 'This will show');
  //   logObj._logMsg_('_info_', 'This will not');
  //   logObj._getLevelName_();  // '_warn_'
  //   logObj._getLevelIdx_();   // 4
  // Methods   :
  //   Log level is based on syslog values and is one of the following:
  //   '[_emerg_|_alert_|_crit_|_error_|_warn_|_notice_|_info_|_debug_]'
  //     + _getLevelName_() - Return log level, e.g. '_warn_'.
  //     + _getLevelIdx_()  - Return log level index. 0=emerg,4=warn,7=debug
  //     + _logMsg_( <log_level>, <message_str> ) - Log message string with
  //       <log_level> urgency. Messages with urgency below the threshold
  //       are not presented to the log. This is provided so developers
  //       can see if log level is more permissive than a threshold:
  //       if ( logObj._getLevelIdx_() > 3 ) { ... }
  //     + _setLoglLevel_(<log_level>) - Set threshold urgency.
  // Returns   : Differs per method
  // Throws    : None
  //
  logObj = (function () {
    var
      levelXCmdMap = {
        _emerg_  : 'trace',
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
        _error_  : __3,
        _warn_   : __4,
        _notice_ : __5,
        _info_   : __6,
        _debug_  : __7
      },

      levelKey = '_warn_',
      levelIdx   = levelXIdxMap[ levelKey ],

      consoleRef;

    // favor node console if available
    /* istanbul ignore next */
    try { consoleRef = global.console; }
    catch ( ignore ) {
      if ( window ) {
        consoleRef = window.console;
      }
      else {
        throw '_cannot_find_console_function_';
      }
    }

    function setLogLevel ( arg_key ) {
      var level_key = castStr( arg_key, __blank );
      if ( ! levelXCmdMap[ level_key ] ) { return levelKey; }
      levelKey = level_key;
      levelIdx = levelXIdxMap[ level_key ];
      return levelKey;
    }

    function getLevelName () { return levelKey; }
    function getLevelIdx  () { return levelIdx; }
    function getIdxByName ( arg_name ) {
      var key = castStr( arg_name, '' );
      return levelXIdxMap[ key ];
    }

    // This follows syslog level conventions
    function logMsg () {
      var
        arg_list    = makeArgList( arguments ),
        level_key   = castStr( arg_list[ __shift ](), __blank ),

        caller_str  = __blank,
        command_str = levelXCmdMap[ level_key ],
        level_idx   = levelXIdxMap[ level_key ],

        caller_list, date_str, prefix_str, pad_key;

      // Handle bad log level
      if ( ! command_str ) {
        arg_list[ __unshift ](
          '_log_level_key_not_found_ (' + level_key + ').'
        );
        level_key   = '_crit_';
        level_idx   = levelXIdxMap[ level_key ];
        command_str = levelXCmdMap[ level_key ];
      }

      // Ignore if level of this log is below cutoff
      if ( level_idx > levelIdx ) { return __false; }

      // Get caller information
      /* istanbul ignore next */
      try {
        caller_list = (new Error()).stack[ __split ](/ *\n/);
        caller_str
          += (caller_list[__2] || __blank )[ __replace ](/^ */g, __blank);
      }
      catch( ignore ) {
        caller_str = '_no_stack_found_';
      }

      // Unshift level, date, caller
      date_str  = makeDateStr({ _date_ms_ : getNowMs(), _time_idx_ : __3 });
      pad_key = makePadStr( level_key, __8, ' ', __false );
      prefix_str = [ pad_key, date_str, caller_str ][ __join ]( ' | ');
      arg_list[ __unshift ]( prefix_str + '\n' );

      // Try to log to console
      try {
        consoleRef[ command_str ][ __apply ]( consoleRef, arg_list );
      }
      // The only problem that may cause a failure is if the log
      // command can not handle more than a single argument or will not
      // allow the apply method (think: IE). We try our best...
      //
      catch ( ignore ) {
        try  {
          consoleRef[ command_str ]( arg_list[ __1 ] );
        }
        // Everything failed. We give up.
        catch ( ignore ) { return __false; }
      }
      return __true;
    }

    return {
      _getIdxByName_ : getIdxByName,
      _getLevelIdx_  : getLevelIdx,
      _getLevelName_ : getLevelName,
      _logMsg_       : logMsg,
      _setLogLevel_  : setLogLevel
    };
  }());
  // . END define logObj singleton
  logFn = logObj._logMsg_;
  // == . END UTILITY METHODS =========================================

  // == BEGIN PUBLIC METHODS ==========================================
  // BEGIN Public method /checkDateStr/
  // Summary   : checkDateStr( <arg_map> );
  // Purpose   : Check validity of a date string
  // Example   : checkDateStr( { _date_str_: '2017-02-29' } ); // __false
  //             checkDateStr( { _date_str_: '2016-02-29' } ); // __true
  // Argument  : <arg_map>
  //   + _date_str_  - The date string to consider
  //   + _order_str_ - The date form to check ('_us_' or ISO)
  // Returns   : boolean
  // Throws    : None
  //
  // Note      : This method works only of strings in the formats
  //             yyyy-mm-dd or yyyy/mm/dd and does not validate the time.
  //
  function checkDateStr ( arg_map ) {
    var
      map         = castMap( arg_map, {} ),
      date_str    = castStr( map._date_str_,  __blank ),
      order_str   = castStr( map._order_str_, __blank ),
      date_us_rx  = configMap._date_us_rx_,
      date_utc_rx = configMap._date_utc_rx_,
      match_list, yy_int, mm_int, dd_int, date_obj, check_int;

    if ( order_str === '_us_' ) {
      match_list = date_str[ __match ]( date_us_rx );
      if ( ! match_list ) { return __false; }
      yy_int = +match_list[ __3 ] - configMap._offset_yr_;
      mm_int = +match_list[ __1 ] - __1;
      dd_int = +match_list[ __2 ];
    }
    else {
      match_list = date_str[ __match ]( date_utc_rx );
      if ( ! match_list ) { return __false; }
      yy_int = +match_list[ __1 ] - configMap._offset_yr_;
      mm_int = +match_list[ __2 ] - __1;
      dd_int = +match_list[ __3 ];
    }

    // Check that utc timestamps match
    date_obj = new __Date( __Date.UTC( yy_int, mm_int, dd_int ) );
    check_int = date_obj.getUTCDate();

    // Invalid dates will not match
    return check_int === dd_int;
  }
  // . END Public method /checkDateStr/

  // BEGIN Public method /makeMetricStr/
  // Summary   : makeMetricStr( <number> );
  // Purpose   : Convert number to a 3 digit string with suffix
  // Example   : makeMetricStr( 968125965968 ); // '968G'
  //             makeMetricStr(    125965968 ); // '126M'
  //             makeMetricStr(       965968 ); // '966K'
  //             makeMetricStr(          968 ); //  '968'
  //   configMap._metric_table_ can be expanded as needed.
  //   Place largest numbers first.
  // Arguments :
  //   + <number> - The number to process
  // Settings  : Uses configMap._metric_table_
  // Returns   : String
  // Throws    : None
  //
  function makeMetricStr( arg_num ) {
    var
      num          = castNum( arg_num, __0 ),
      abs_num      = makeAbsNumFn( num ),
      metric_table = configMap._metric_table_,
      metric_count = metric_table[ __length ],

      root_num, suffix, idx, row_map;

    _SUFFIX_: for ( idx = __0; idx < metric_count; idx++ ) {
      row_map = metric_table[ idx ];
      if ( abs_num >= row_map._min_int_ ) {
        root_num = num / row_map._min_int_;
        suffix   = row_map._suffix_;
        break _SUFFIX_;
      }
    }

    if ( ! root_num ) {
      root_num = num;
      suffix   = __blank;
    }
    return root_num.toPrecision( __3 ) + suffix;
  }
  // . END public method /makeMetricStr/

  // BEGIN Public method /clearMap/
  // Summary   : clearMap( <data_map>, <key_list>, <do_undef> );
  // Purpose   : Process some or all map key values
  // Example   :
  //   clearMap( my_map ); // Delete all keys
  //   clearMap( my_map, [ 'name', 'serial_number' ] ); // Delete 2 keys
  //   clearMap( my_map, __undef, __true );  // Set all values to __undef
  // Arguments :
  //   + <data_map> - Map to modify. Required.
  //   + <key_list> - List of keys to process. Default is all keys.
  //     Provide any non-list value (like 0) to use default.
  //   + <do_undef> - If __true, will set the value of all processed keys to
  //       __undef. Otherwise, all processed keys will be deleted from
  //       the map. Default is __false.
  // Returns   : The modified map
  // Throws    : None
  //
  function clearMap ( arg_map, arg_key_list, do_undef ) {
    var
      map = castMap( arg_map ),
      key_list, key_count, idx, key;

    if ( ! map ) { return; }

    key_list  = castList( arg_key_list, makeKeyListFn( map ) );
    key_count = key_list[ __length ];

    for ( idx = __0; idx < key_count; idx++ ) {
      key = key_list[ idx ];
      if ( map[ __hasProp ]( key ) ) {
        if ( do_undef ) { map[ key ] = __undef; }
        else { delete map[ key ]; }
      }
    }
    return map;
  }
  // . END Public method /clearMap/

  // BEGIN Public method /encodeHtml/
  // Summary   : encodeHtml( <string>, <do_exclude_amp> );
  // Purpose   : Single-pass encode HTML entities from string
  // Example   :
  //   | str = encodeHtml( "<h1>'Help me!'</h1> she said" );
  //   | __logMsg( 'info', str );
  //   > &lt;h1&ht;&quot;Help me!&quot;&lt;/h1&gt; she said.'
  //
  //   | str = encodeHtml( "<h1>'Help me!'</h1> & fast!", __false );
  //   | __logMsg( 'info', str );
  //   > &lt;h1&ht;&quot;Help me!&quot;&lt;/h1&gt; &amp; fast!'
  //
  //   | str = encodeHtml( "<h1>'Help me!'</h1> & fast!", __true );
  //   | __logMsg( 'info', str );
  //   > &lt;h1&ht;&quot;Help me!&quot;&lt;/h1&gt; & fast!'
  //
  // Arguments
  //   + <string>         - The HTML string to encode
  //   + <do_exclude_amp> - Exclude ampersand from encoding.
  //      Default is __false.
  // Returns   : Modified string
  // Throws    : None
  //
  function encodeHtml ( arg_str, arg_do_exclude_amp ) {
    var
      source_str     = castStr(  arg_str, __blank   ),
      do_exclude_amp = castBool( arg_do_exclude_amp ),

      match_rx, lookup_map;

    function matchFn ( key ) {
      return lookup_map[ key ] /* istanbul ignore next */ || __blank;
    }

    lookup_map = configMap._encode_html_map_;
    match_rx   = do_exclude_amp
      ? configMap._encode_noamp_rx_ : configMap._encode_html_rx_;

    return source_str[ __replace ]( match_rx, matchFn );
  }
  // . END Public method /encodeHtml/

  // BEGIN utility /getBaseDirname/
  // Summary   : getBaseDirname.call( <path_str>, <delim_str> );
  // Purpose   : Returns the last filename of a path or the dirname.
  // Examples  : getBaseDirname.call( '_base_', /var/log/demo.log')
  //           :   returns 'demo.log'
  //           : getBaseDirname.call( null, '/var/log/demo.log' )
  //           :   returns '/var/log'
  // Arguments :
  //   <path_str>  - Path string.      Default is __blank.
  //   <delim_str> - Delimeter string. Default is '/'.
  // Settings  : If context_str is '_base_' returns basename, otherwise
  //           : provides dirname.
  // Returns   : Modified string
  // Throws    : None
  //
  function getBaseDirname( arg_path_str, arg_delim_str ) {
    var
      context_str = this,
      path_str    = castStr( arg_path_str, __blank ),
      delim_str   = castStr( arg_delim_str, '/'    ),
      rx_obj      = context_str === '_base_'
        ? makeRxObj( '([^'  + delim_str + ']*)$' )
        : makeRxObj( '^(.*' + delim_str + ')[^' + delim_str + ']*$' ),
      match_list;

    if ( path_str === __blank ) { return path_str; }

    match_list = path_str[ __match ]( rx_obj );
    return ( match_list && match_list[ __1 ] ) || __blank;
  }
  getBasename = getBaseDirname[ __bind ]( '_base_' );
  getDirname  = getBaseDirname[ __bind ]( '_dir_'  );
  // . END utilities /getBasename/ and /getDirname/

  // BEGIN Public method /getListAttrIdx/
  // Summary   : getListAttrIdx( <list>, <key>, <data> );
  // Purpose   : Find the first map in <list> where the value of
  //             <key> is <data>.
  // Examples  : getListAttrIdx( [ { a: 1 } ], 'a', 1 ); // returns 0
  //             getListAttrIdx( [ { a: 1 } ], 'b', 1 ); // returns -1
  //             getListAttrIdx( [ { a: 1 } ], 'a', 9 ); // returns -1
  // Arguments :
  //   + <list> - List of maps.              Default is [].
  //   + <key>  - The key to match.          Default is __blank.
  //   + <data> - The data expected for key. Default is __undef.
  // Returns   : Returns integer index or -1 if not found
  // Throws    : None
  //
  function getListAttrIdx ( arg_map_list, arg_key, data ) {
    var
      map_list  = castList( arg_map_list, [] ),
      key       = castStr(  arg_key, __blank ),
      map_count = map_list[ __length ],
      found_idx = __n1,

      idx, row_map, row_key_list;

    for ( idx = __0; idx < map_count; idx++ ) {
      row_map = map_list[ idx ];
      if ( typeofFn( row_map ) !== 'object' ) { continue; }

      // This is similar to but not the same as hasOwnProperty.
      // This prevents fake positives when sparse maps do not have
      //   the requested key.
      row_key_list = makeKeyListFn( row_map );
      if ( row_key_list[ __indexOf ]( key ) === __n1 ) { continue; }

      if ( row_map[ key ] === data ) {
        found_idx = idx;
        break;
      }
    }
    return found_idx;
  }
  // . END Public method /getListAttrIdx/

  // BEGIN Public method /getListAttrMap/
  // Summary   : getListAttrMap( <list>, <key>, <data> );
  // Purpose   : Find the first map in <list> where the value of
  //             <key> is <data>.
  // Examples  : getListAttrIdx( [ { a: 1 } ], 'a', 1 ); // returns map
  //             getListAttrIdx( [ { a: 1 } ], 'b', 1 ); // returns undef
  //             getListAttrIdx( [ { a: 1 } ], 'a', 9 ); // returns undef
  // Arguments :
  //   + <list> - List of maps.              Default is [].
  //   + <key>  - The key to match.          Default is __blank.
  //   + <data> - The data expected for key. Default is __undef.
  // Returns   : Returns found map or undef if not found
  // Throws    : None
  //
  function getListAttrMap ( arg_list, key_name, key_val ) {
    var
      list     = castList( arg_list, [] ),
      list_idx = getListAttrIdx( list, key_name, key_val );
    return list_idx > __n1 ? list[ list_idx ] : __undef;
  }
  // . END Public method /getListAttrMap/

  // BEGIN Public method /makeColumnList/
  // Summary   : makeColumnList( <list>, <col_id>, [ filter_fn ] );
  // Purpose   : Extract a column from a list-of-lists or list-of-maps table.
  // Examples  : list = makeColumnList( enum_table, 'value' );
  //             list = makeColumnList( grid_table, 5 );
  //             list = makeColumnList( enum_table, 5, function ( row ) {...} )
  // Arguments :
  //   + <list>      - List of maps or lists. Required.
  //   + <col_id>    - The key or index of the column. Required.
  //   + <filter_fn> - Optional filter. Recieves the table row as argument.
  //       If it returns a non-true value the row is discarded.
  // Returns   : Returns found map or undef if not found
  // Throws    : None
  //
  function makeColumnList ( arg_list, arg_key, arg_filter_fn ) {
    var
      list       = castList( arg_list, [] ),
      col_key    = castStr(  arg_key, list[__0] && list[__0][__0] ),
      filter_fn  = castFn(  arg_filter_fn ),

      list_count = list[ __length ],
      solve_list = [],

      idx, row_data, col_data;

    for ( idx = __0; idx < list_count; idx++ ) {
      row_data = list[ idx ];
      if ( typeofFn( row_data ) !== 'object' ) { continue; }
      col_data = row_data[ col_key ];
      if ( filter_fn && ! filter_fn( row_data ) ) { continue; }
      solve_list[ __push ]( col_data );
    }

    return solve_list;
  }
  // . END Public method /getListAttrMap/

  // BEGIN Public method /getListDiff/
  // Summary   : getListDiff( <list1>, <list2> );
  // Purpose   : Find all elements common between two lists.
  //   This is _not_ a deep comparison; two similar lists or maps
  //   will be reported as different unless they point the the same
  //   data structure.
  // Example   : getListDiff( [ 'a','b' ], [ 'b','c','d' ] );
  //             // Returns [ 'a', 'c', 'd' ]
  // Arguments :
  //   + <list1> - The first list
  //   + <list2> - The second list
  // Returns   : A list of unique elements found in first list
  //   followed by unique elements found in the second.
  // Throws    : None
  //
  function getListDiff ( arg0_list, arg1_list ) {
    var
      first_list  = castList( arg0_list, [] ),
      second_list = castList( arg1_list, [] ),
      list_1, list_2;

    list_1 = first_list[ vMap._filter_ ](
      function ( data ) {
        return second_list[ __indexOf ]( data ) === __n1;
      }
    );
    list_2 = second_list[ vMap._filter_ ](
      function ( data ) {
        return first_list[ __indexOf ]( data ) === __n1;
      }
    );
    return list_1[ vMap._concat_ ]( list_2 );
  }
  // . END Public method /getListDiff/

  // BEGIN Public method /getListValCount/
  // Summary   : getListValCount( <list>, <data> );
  // Purpose   : Count the number of elements in <list> that === <data>
  // Example   : getListValCount( [ 'a','b','a' ], 'a' ); // Returns 2
  // Arguments :
  //   + <list> - The list to examine.     Default is [].
  //   + <data> - The data value to match. Default is __undef.
  // Returns   : Match count
  // Throws    : None
  //
  function getListValCount ( arg_list, arg_data ) {
    var
      input_list  = castList( arg_list, [] ),
      end_idx     = input_list[ __length ] - __1,
      match_count = __0,
      idx;

    for ( idx = end_idx; idx > __n1; idx-- ) {
      //noinspection IncrementDecrementResultUsedJS
      if ( input_list[ idx ] === arg_data ) { match_count++; }
    }
    return match_count;
  }
  // . END Public method /getListValCount/

  // BEGIN Public method /getLogObj/
  // See logObj above for details
  function getLogObj () { return logObj; }
  // . END Public method /getlogObj/

  // BEGIN Public method /getStructData/
  // Summary   : getStructData( <data>, <path_list> );
  // Purpose   : Extract a value from <data> by <path_list>
  // Example   : _getStructData_({ foo : { bar : 'hi!' }}, ['foo','bar']);
  //             // Returns 'hi!'
  // Arguments :
  //   + <data>      - An array or map
  //   + <path_list> - A list of map or array keys in order of depth
  // Returns   :
  //   + Success - Requested value
  //   + Failure - undefined
  // Throws    : None
  // Note      : The key list limit is set to 100. If this
  //   is met, a warning is logged and undef returned.
  //
  function getStructData ( base_struct, arg_path_list ) {
    var
      walk_struct = base_struct,
      path_list   = castList( arg_path_list, [] ),
      is_good     = __true,
      key_count   = path_list[ __length ],

      idx, raw_key, struct_type, key;

    if ( key_count > __100 ) {
      logFn( '_error_', '_exceeded_max_depth_' );
      return __undef;
    }

    _GET_KEY_: for ( idx = __0; idx < key_count; idx++ ) {
      raw_key = path_list[ idx ];
      struct_type = getVarType( walk_struct );
      switch ( struct_type ) {
        case '_Array_' :
          key = castInt( raw_key );
          break;
        case '_Object_' :
          key = castStr( raw_key );
          break;
        default :
          // Handle named objects
          if ( typeofFn( walk_struct ) === 'object'
            && walk_struct !== __null
          ) {
            key = castStr( raw_key );
            break;
          }
          key = __undef;
          break;
      }
      if ( key === __undef ) {
        is_good = __false;
        break _GET_KEY_;
      }
      walk_struct = walk_struct[ key ];
    }
    if ( is_good ) { return walk_struct; }
    return __undef;
  }
  // . END Public method /getStructData/

  // BEGIN Public method /getTzCode/
  // Summary: getTzCode();
  // Purpose: Return the local timezone code
  //
  function getTzCode () {
    var
      date_obj = getTzDateObj(),
      date_str = date_obj[ __toString ](),
      match_list = date_str[ __match ]( configMap._tzcode_rx_ );

    return ( match_list && match_list[ __1 ] )
      ? match_list[ __1 ] : __blank;
  }
  // . END Public method /getTzCode/

  // BEGIN Public method /makeClockStr/
  // Summary   : makeClockStr( <time_ms>, <time_idx>, <do_am>, <do_local> );
  // Purpose   : Create HH:MM:SS time string from UTC time integer in ms
  // Example   : clock_str = makeClockStr( 1465621376000 ); // '05:02:56'
  // Arguments :
  //   <time_ms>  - UTC time in milliseconds
  //   <time_idx> - Date precision. Default is __3.
  //     -3 === [DDd:]HHh:MMm:SSs
  //     -2 === [DDd:]HHh:MMm
  //     -1 === [DDd:]HHh
  //      0 === ''
  //      1 === HH
  //      2 === HH:MM
  //      3 === HH:MM:SS
  //   <do_ampm>  - Do am/pm flag.  Default is __false.
  //   <do_local> - Use local time. Default is __false.
  // Returns   : String
  // Note      :
  //   Remember to use your local timezone offset if you want to
  //   show local time. Example:
  //     local_ms = getNowMs( __true )
  //
  function makeClockStr ( arg_time_ms, arg_time_idx, arg_do_ampm, arg_do_local ) {
    var
      do_ampm   = castBool( arg_do_ampm,              __false ),
      do_local  = castBool( arg_do_local,             __false ),
      time_idx  = castInt(  arg_time_idx,                 __3 ),
      time_ms   = castInt(  arg_time_ms, getNowMs( do_local ) ),

      abs_idx   = makeAbsNumFn( time_idx  ),
      sec_ms    = configMap._sec_ms_,
      min_sec   = configMap._min_sec_,
      hrs_min   = configMap._hrs_min_,
      day_hrs   = configMap._day_hrs_,

      raw_sec_int = makeRoundNumFn( time_ms / sec_ms ),
      sec_int     = raw_sec_int % min_sec,

      raw_min_int = makeFloorNumFn( raw_sec_int / min_sec ),
      min_int     = raw_min_int % hrs_min,

      raw_hrs_int = makeFloorNumFn( raw_min_int / hrs_min ),
      hrs_int     = raw_hrs_int % day_hrs,

      day_int     = makeFloorNumFn( raw_hrs_int / day_hrs ),

      time_list   = [],
      suffix_str  = __blank,

      scratch_str;

    if ( abs_idx === __0 || abs_idx > __3 ) { return __blank; }

    if ( time_idx < __0 && day_int > __0 ) {
      scratch_str = day_int + 'd';
      time_list[ __push ]( scratch_str );
    }

    scratch_str = makePadStr( hrs_int, __2, __0 );
    if ( time_idx < __0 ) { scratch_str += 'h'; }
    time_list[ __push ]( scratch_str );

    if ( abs_idx > __1 ) {
      scratch_str = makePadStr( min_int, __2, __0 );
      if ( time_idx < __0 ) { scratch_str += 'm'; }
      time_list[ __push ]( scratch_str );
    }

    if ( abs_idx > __2 ) {
      scratch_str = makePadStr( sec_int, __2, __0 );
      if ( time_idx < __0 ) { scratch_str += 's'; }
      time_list[ __push ]( scratch_str );
    }

    if ( do_ampm ) {
      if ( time_list[__0]  >= configMap._noon_hr_ ) {
        suffix_str = ' PM';
        if ( time_list[__0] > configMap._noon_hr_ ) {
          time_list[__0]   -= configMap._noon_hr_;
        }
      }
      else {
        suffix_str = ' AM';
      }
    }

    return time_list[ __join ]( ':' ) + suffix_str;
  }
  // . END Public method /makeClockStr/

  // BEGIN Public method /makeCommaNumStr/
  // Summary   : makeCommaNumStr( <arg_map> );
  // Purpose   : Convert a number into a string optimized for readability
  // Example   : makeCommaNumStr({ _input_num_ : 1999 })
  //             Returns '2.0k'
  // Arguments : <arg_map> with the following keys
  //   + _input_num_       - The number to format, e.g. 123598
  //   + _round_limit_exp_ - The size (10^exp) of number after which
  //                         a rounded value is returned. Default is __3.
  //   + _round_limit_str  - The limit name. Default is 'k'.
  //   + _round_unit_exp_  - The size (10^exp) of number to group as
  //                         a unit. Default is __3, e.g. 1,000's.
  //   + _round_dec_count_ - Number of decimal places to keep
  //                         in the mantisa when rounding to units
  //   + _nornd_dec_count_ - Number of decimal places to keep when
  //                         NOT rounded to units
  // Returns   :
  //   + Success - Returns formated string
  //   + Failure - Blank string
  // Throws    : None
  //
  function makeCommaNumStr ( arg_map ) {
    var
      map             = castMap( arg_map, {} ),

      input_num       = castNum( map._input_num_,       __0 ),
      round_limit_exp = castInt( map._round_limit_exp_, __3 ),
      round_unit_exp  = castInt( map._round_unit_exp_,  __3 ),
      round_unit_str  = castStr( map._round_unit_str_,  'k' ),
      round_dec_count = castInt( map._round_dec_count_, __1 ),
      nornd_dec_count = castInt( map._nornd_dec_count_, __0,
        { _do_autobound_ : true, _min_num_ : __0 }          ),
      round_limit_num = __Math.pow( __10, round_limit_exp   ),
      round_unit_num  = __Math.pow( __10, round_unit_exp    ),

      floor_num  = makeFloorNumFn( input_num ),

      do_units   = ( makeAbsNumFn( floor_num ) >= round_limit_num ),
      suffix_str = __blank,

      iterm_num, iterm_str,
      join_list, join_str,
      list_count, idx;

    if ( do_units ) {
      iterm_num   = input_num / round_unit_num;
      suffix_str  = round_unit_str;
      iterm_str   = iterm_num[ vMap._toFixed_ ]( round_dec_count );
    }
    else {
      iterm_str = input_num[ vMap._toFixed_ ]( nornd_dec_count );
    }

    join_list  = iterm_str[ __split ]( '.' );
    list_count = join_list[ __length ];
    for ( idx = __0; idx < list_count; idx++ ) {
      join_list[ idx ] = join_list[ idx ][
        __replace ]( configMap._comma_rx_, "$1," );
    }

    join_str = join_list[ __join ]( '.' );
    return do_units ? join_str + suffix_str : join_str;
  }
  // . END Public method /makeCommaNumStr/

  // BEGIN Public method /makeDateStr/
  // Summary   : makeDateStr( <arg_map> );
  // Purpose   : Create a string from a date object
  //   or a UTC time number (in milliseconds).
  // Example   :
  //   makeDateStr({ _date_obj_ : new __Date() });
  //   // Returns a string like '2016-09-18'
  //
  //   makeDateStr({ _date_obj_ : new __Date(), _time_idx_ : 3 });
  //   // Returns a string like '2016-09-18 12:45:52'
  //
  //   makeDateStr({ _date_ms_ : 1474311626050 })
  //   // Returns '2016-09-19'
  // Arguments : <arg_map> with these keys
  //   + _date_obj_ : A valid date object.
  //   + _date_ms_  : A date time in ms.
  //     If neither date_obj or date_ms is provided, will use the
  //       current date.
  //     If BOTH are provided, _date_ms_ will be used in
  //       preference to date_obj.
  //   + _time_idx_ : See _makeClockStr_ to determine
  //       the clock string format. Default is __0.
  //   + _order_str_ :
  //       Request '_us_' results in stupid-format: mm/dd/yyyy hh:mm:ss.
  //       Default is __blank.
  // Returns   :
  //   + Success - Returns formated string
  //   + Failure - Blank string
  // Throws    : None
  // Note      :
  //   Remember to use your local timezone offset if you want to
  //   show local time. Example:
  //       tz_offset_ms = date_obj.geteTimezoneOffset() * 60000;
  //       local_ms     = raw_utc_ms - tz_offset_ms;
  //
  function makeDateStr ( arg_map ) {
    var
      map       = castMap(  arg_map,           {} ),
      date_ms   = castInt(  map._date_ms_         ),
      date_obj  = castObj( 'Date', map._date_obj_ ),
      time_idx  = castInt(  map._time_idx_, __0   ),
      order_str = castStr(  map._order_str_, __blank ),

      yrs_int,   mon_int,   day_int,
      date_list, date_str,  time_ms,
      time_str;

    if ( ! date_obj ) {
      date_obj = new __Date();
    }

    if ( date_ms ) {
      date_obj.setTime( date_ms );
    }

    yrs_int = __Num( date_obj.getYear()  ) + configMap._offset_yr_;
    mon_int = __Num( date_obj.getMonth() ) + __1;
    day_int = __Num( date_obj.getDate()  );

    if ( order_str === '_us_' ) {
      date_list = [
        makePadStr( mon_int, __2, __0 ),
        makePadStr( day_int, __2, __0 ),
        makePadStr( yrs_int, __4, __0 )
      ];
      date_str = date_list[ __join ]( '/' );
    }
    else {
      date_list = [
        makePadStr( yrs_int, __4, __0 ),
        makePadStr( mon_int, __2, __0 ),
        makePadStr( day_int, __2, __0 )
      ];
      date_str = date_list[ __join ]( '-' );
    }

    // Return if no time requested
    if ( time_idx === __0 ) { return date_str; }

    // Process time time requested
    time_ms = __Num( date_obj.getHours()   ) * configMap._hrs_ms_
      + __Num( date_obj.getMinutes() ) * configMap._min_ms_
      + __Num( date_obj.getSeconds() ) * configMap._sec_ms_;

    time_str = makeClockStr( time_ms, time_idx );

    return time_str ?  date_str + __space + time_str : date_str;
  }
  // . END Public method /makeDateStr/

  // BEGIN Public method /makeDebounceFn/
  // Summary   : makeDebounceFn( <arg_map> );
  // Purpose   : Create a function which will call a provided method a
  //             specified time period after it was last called. Any
  //             call that occurs within the time period resets the clock.
  //
  // Example   : dbFn = makeDebounceFn({ _fn_ : myMethodFn, _delay_ms_: 250 });
  //             dbFn( 'method argument' ); // Executes in 250ms
  //
  // Arguments : <arg_map> with the following keys
  //   + _fn_       - The method to execute           Required.
  //   + _delay_ms_ - The time of inactivity          Default is __0.
  //   + _ctx_data_ - Method context                  Default is __undef.
  //   + _do_asap_  - Fire method on first call       Default is __false.
  //
  // Returns   :
  //   + Success - The debounce function as described above.
  //   + Failure - undef
  //
  // Throws    : None
  //
  // Note      : The method, myMethodFn, is always invoked with the latest
  //             arguments provided. Consider this example:
  //
  //             dbFn( 'myArgs' ); dbFn( 'Hello World' );
  //
  //             The argument 'myArgs' will likely be discarded and
  //             myMethodnFn( 'Hello World' ) will likely be invoked.
  //
  // Todo      : Provide a means to reset _do_asap_ with either a timeout
  //             or other mechanism.
  //
  function makeDebounceFn ( arg_map ) {
    var
      map      = castMap(  arg_map,             {} ),

      delay_ms = castInt(  map._delay_ms_,     __0 ),
      do_asap  = castBool( map._do_asap_,  __false ),
      fn       = castFn(   map._fn_                ),
      ctx_data = map._ctx_data_,

      arg_list, delay_toid;

    if ( ! fn ) {
      logFn( '_error_', '_bad_debounce_arguments_', arg_map );
      return __undef;
    }

    function debounceFn () {
      var inner_ms = do_asap ? 0 : delay_ms;

      // Due to closure arg_list is always updated to lastest call
      arg_list = makeArgList( arguments );
      if ( delay_toid ) { clearToFn( delay_toid ); }

      delay_toid = setToFn( function() {
        fn[ __apply]( ctx_data, arg_list );
        delay_toid = __undef;
      }, inner_ms );
      do_asap = false;
    }

    return debounceFn;
  }
  // . END Public method /makeDebounceFn/

  // BEGIN Public method /makeThrottleFn/
  // Summary   : makeThrottleFn( <arg_map> );
  // Purpose   : Create a function which will call a provided method only
  //             once per time period.
  //
  // Example   : thFn = makeThrottleFn({ _fn_ : myMethodFn, _delay_ms_: 250 });
  //             thFn( 'method argument' ); // Executes in 250ms
  //
  // Arguments : <arg_map> with the following keys
  //   + _fn_       - The method to execute           Required.
  //   + _delay_ms_ - The minimum time between calls  Default is __0.
  //   + _ctx_data_ - Method context                  Default is __undef.
  //   + _do_asap_  - Fire method on first call       Default is __false.
  //
  // Returns   :
  //   + Success - The throttle function as described above.
  //   + Failure - undef
  //
  // Throws    : None
  //
  // Note      : The method, myMethodFn, is always invoked with the latest
  //             arguments provided. Consider this example:
  //
  //             thFn( 'myArgs' ); thFn( 'Hello World' );
  //
  //             The argument 'myArgs' will likely be discarded and
  //             myMethodnFn( 'Hello World' ) will likely be invoked.
  //
  // Todo      : Provide a means to reset _do_asap_ with either a timeout
  //             or other mechanism.
  //
  function makeThrottleFn ( arg_map ) {
    var
      map      = castMap(  arg_map, {} ),

      delay_ms = castInt(  map._delay_ms_,     __0 ),
      do_asap  = castBool( map._do_asap_,  __false ),
      fn       = castFn(   map._fn_                ),
      ctx_data = map._ctx_data_,

      last_ms, arg_list, delay_toid;

    if ( ! fn ) {
      logFn( '_error_', '_bad_throttle_arguments_', fn );
      return __undef;
    }

    function throttleFn () {
      var now_ms = getNowMs(), delta_ms, is_locked;
      if ( ! last_ms ) { last_ms = now_ms; }
      delta_ms = delay_ms - ( now_ms - last_ms );

      // Due to closure arg_list is always updated to lastest call
      arg_list = makeArgList( arguments );

      // Clear delay_toid if timeout. This should only happend in edge cases.
      if ( delta_ms < __0 || do_asap ) {
        if ( delay_toid ) { clearToFn( delay_toid ); }
        delay_toid  = __undef;
        last_ms     = __undef;
        do_asap     = false;
        return fn[ __apply ]( ctx_data, arg_list );
      }

      // Discard this call if we already have a timeout id
      if ( delay_toid ) { return; }

      do_asap = false;
      delay_toid = setToFn(
        function () {
          if ( is_locked ) { return; }
          delay_toid  = __undef;
          last_ms     = __undef;
          fn[ __apply ]( ctx_data, arg_list );
        },
        delta_ms
      );
    }
    return throttleFn;
  }
  // . END Public method /makeThrottleFn/

  // BEGIN Public method /makeEllipsisStr/
  // Summary   : makeEllipsisStr( <arg_map> );
  // Purpose   : Shorten a string to a maximum length and append ellipsis
  //   if it is exceeded.
  // Example   :
  //   makeEllipsisStr({
  //     _input_str_      : 'hee haw and the boys',
  //     _char_limit_int_ : 10,
  //     _do_word_break_  : __true
  //   });
  //   // returns 'hee haw ...'
  // Arguments :
  //   + _char_limit_int_ : Maxiumum allowed chars.  Default is __0.
  //   + _do_word_break_  : Break at word boundries. Default is __true.
  //   + _input_str_      : The string to shorten
  // Returns   : A string
  // Throws    : None
  //
  function makeEllipsisStr( arg_map ) {
    var
      map           = castMap( arg_map, {} ),
      scrub_str     = makeScrubStr( map._input_str_,  __false ),
      limit_int     = castInt(  map._char_limit_int_,     __0 ),
      do_word_break = castBool( map._do_word_break_,   __true ),
      scrub_count   = scrub_str[ __length ],

      word_list,   word_count,
      solve_count, solve_list,
      idx,         solve_word;

    if ( ! ( limit_int && limit_int > __3 ) ) { return __blank; }

    if ( scrub_count <= limit_int ) { return scrub_str; }

    if ( do_word_break ) {
      word_list   = scrub_str[ __split ]( __space );
      word_count  = word_list[ __length ];
      solve_count = __0;
      solve_list  = [];

      _WORD_: for ( idx = __0; idx < word_count; idx++ ) {
        solve_word  = word_list[ idx ];
        solve_count += solve_word[ __length ] + __1;
        if ( solve_count >= limit_int - __3 ) {
          solve_list[ __push ]( '...' );
          break _WORD_;
        }
        solve_list[ __push ]( solve_word );
      }
      return __blank + solve_list[ __join ]( __space );
    }

    return scrub_str[ __substr ](__0, limit_int - __3 ) + '...';
  }
  // . END Public method /makeEllipsisStr/

  // BEGIN Public method /makeErrorObj/
  // Summary   : makeErrorObj( <name>, <msg> );
  // Purpose   : A convenient method to create an error object
  // Example   : makeErrorObj( 'notCool', 'This is not cool' );
  // Arguments :
  //   + <name> - Error name.    Default is 'error'.
  //   + <msg>  - Error message. Default is __blank.
  // Returns   : A newly constructed error object
  // Throws    : None
  //
  function makeErrorObj ( arg_name, arg_msg ) {
    var error_obj = new Error();

    error_obj.name    = aKey + ':'
      + ( ( arg_name && __Str( arg_name ) ) || 'error' );
    error_obj.message = ( arg_msg  && __Str( arg_msg  ) ) || __blank;

    return error_obj;
  }
  // . END Public method /makeErrorObj/

  // BEGIN Public method /makeGuidStr/
  // Summary   : makeGuidStr()
  // Purpose   : Return a standard GUID
  // Example   : makeGuidStr();
  // Arguments : None
  // Returns   : A GUID
  // Throws    : None
  //
  function makeGuidStr () {
    function makePart () {
      //noinspection NonShortCircuitBooleanExpressionJS,MagicNumberJS
      return ((( __1 + makeRandomNumFn() ) * 0x10000 ) | __0
        )[ __toString ](16)[ __substr ]( __1 );
    }

    return makePart() + makePart()
      + '-' + makePart()
      + '-' + makePart()
      + '-' + makePart()
      + '-' + makePart() + makePart() + makePart();
  }
  // . END Public method /makeGuidStr/

  // BEGIN Public method /makeMapUtilObj/
  // Summary  : makeMapUtilObj()
  // Purpose  : Creates a map utility object used to streamlining
  //   list.map() functions and avoid nesting.
  // Example  :
  // 1. Create a map_util object:
  //    | var map_util_obj = makeMapUtilObj();
  // 2. (optional) Set any data your map function will use.
  //    | map_util_obj._setArgList_ = [ name_list ];
  // 3. Create a function that for element of the array.
  //    The arg_list provided is set in step 2:
  //    | function mapUtil_renameFn ( field_data, idx, list, arg_list ) {
  //    |   var
  //    |     name_list  = arg_list[ __0 ],
  //    |     field_key  = name_list[ idx ],
  //    |     field_str  = __Str( field_data )
  //    |     ;
  //    |
  //    |   // Return [ key, value ] to add to map.
  //    |   // Return undef to not add anything.
  //    |   return [ field_key, field_str ];
  //    | }
  // 4. Set the function in the utility
  //    | map_util_obj._setMapFn_( mapUtil_renameFn );
  // 5. Initialize the result map. You need this pointer.
  //    | result_map = {};
  //    | map_util_obj._setResultMap_( result_map );
  // 6. Invoke the map function:
  //    | my_list.map( map_util_obj._invokeFn_ );
  // 7. result_map will now contain the key value pairs return by
  //    mapUtil_renameFn for the provided list.
  //
  // Returns  : A mapUtil object
  // Throws   : None
  // Note     : A closure creates unique private variables in each
  //   instance returned. Examples include argList, resultMap, and mapFn.
  //
  //
  function makeMapUtilObj () {
    var resultMap, argList, mapFn;

    function getArgList   (          ) { return argList;                   }
    function getMapFn     (          ) { return mapFn;                     }
    function getResultMap (          ) { return resultMap;                 }
    function setArgList   ( arg_list ) { argList   = castList( arg_list ); }
    function setMapFn     ( map_fn   ) { mapFn     = castFn(   map_fn   ); }
    function setResultMap ( rmap     ) { resultMap = castMap(  rmap     ); }

    function invokeFn ( field_data, idx, list ) {
      var ret_list, ret_key, ret_data;

      ret_list = mapFn && mapFn( field_data, idx, list, argList );
      if ( ! ret_list ) { return; }

      //noinspection JSUnusedAssignment
      ret_key  = ret_list[ __0 ];
      ret_data = ret_list[ __1 ];
      resultMap[ ret_key ] = ret_data;
    }

    return {
      _getArgList_   : getArgList,
      _getMapFn_     : getMapFn,
      _getResultMap_ : getResultMap,
      _invokeFn_     : invokeFn,
      _setArgList_   : setArgList,
      _setMapFn_     : setMapFn,
      _setResultMap_ : setResultMap
    };
  }
  // . END Public method /makeMapUtilObj/

  // BEGIN Public method /makeOptionHtml/
  // Summary   : makeOptionHtml( <arg_map> );
  // Purpose   : Create an HTML string with option tags
  // Example   : makeOptionHtml({ _val_list_ : [1,2,3,4] });
  // Arguments : <arg_map> with the following keys
  //    + _enum_table_  : A table of _name_ and _value_. Default is [].
  //    + _match_list_ : List of values to be selected.  Default is [].
  //      This is useful for multi-select fields.
  // Returns   : An HTML option select string
  // Throws    : None
  //
  function makeOptionHtml ( arg_map ) {
    var
      map        = castMap(  arg_map,           {} ),
      enum_table = castList( map._enum_table_,  [] ),
      match_list = castList( map._match_list_,  [] ),

      enum_count = enum_table[ __length ],
      solve_html = __blank,

      idx, row_map, val_str, val_html, label_str, label_html;

    _OPTION_: for ( idx = __0; idx < enum_count; idx++ ) {
      row_map = enum_table[ idx ];
      val_str = castStr( row_map._value_ );

      if ( val_str === __undef ) { continue _OPTION_; }

      val_html   = encodeHtml( val_str );
      label_str  = row_map._label_ || makeUcFirstStr( val_str );
      label_html = encodeHtml( label_str );

      solve_html += '<option value="' + val_html + '"';
      if ( match_list[ __indexOf ]( val_str ) > __n1 ) {
        solve_html += ' selected="selected"';
      }
      solve_html += '>' + label_html + '</option>';
    }
    return solve_html;
  }
  // . END Public method /makeOptionHtml/

  // BEGIN Public method /makePctStr/
  // Summary   : makePctStr( <ratio>, <precition_int> );
  // Purpose   : Convert a decimal ratio into a readable % string
  // Example   : makePctStr( 0.529863, 1 );
  // Arguments :
  //   <ratio>         - Ratio to convert. 1 = 100%.    Default is __0.
  //   <precision_int> - Count of digits after decimal. Default is __0.
  // Returns   : A percentage string
  // Throws    : None
  //
  function makePctStr ( arg_ratio, arg_count ) {
    var
      ratio = castNum( arg_ratio, __0 ),
      count = castNum( arg_count, __0 );

    count = count < __0 ? __0 : makeFloorNumFn( count );
    return ( ratio * __100 )[ vMap._toFixed_ ]( count ) + '%';
  }
  // . END Public method /makePctStr/

  // BEGIN Public method /makeRadioHtml/
  // Purpose : Make an array of checkboxes from a list
  //
  function makeRadioHtml ( arg_map ) {
    var
      map        = castMap(  arg_map,          {} ),
      enum_table = castList( map._enum_table_, [] ),
      match_str  = castStr(  map._match_str_      ),
      group_name = castStr(  map._group_name_     ),
      group_html = encodeHtml( group_name         ),

      enum_count = enum_table[ __length ],
      solve_html = __blank,

      idx, row_map, val_str, val_html, label_str, label_html;

    _RADIO_: for ( idx = __0; idx < enum_count; idx++ ) {
      row_map    = castMap( enum_table[ idx ], {} );
      val_str    = castStr( row_map._value_ );
      if ( val_str === __undef ) { continue _RADIO_; }
      val_html   = encodeHtml( val_str );
      label_str  = castStr( row_map._label_, makeUcFirstStr( val_html ) );
      label_html = encodeHtml( label_str );

      solve_html
        += '<label>'
        +  '<input type="radio" name="' + group_html
        +  '" value="' + val_html + '"';

      if ( val_str === match_str ) { solve_html += ' checked="checked"'; }
      solve_html += '>' + label_html + '</label>';
    }
    return solve_html;
  }
  // . END Public method /makeRadioHtml/

  // BEGIN Public method /makeReplaceFn/
  // Summary   : makeReplaceFn( <search_str>, <replace_str> );
  // Purpose   : Return a high-performance function that
  //   replaces <search_str> with <value_str>.
  // Example   :
  //   fn = makeReplaceFn( '_x_', 'fred' );
  //   __logMsg( 'info', fn('you do not know {_x_}.') );
  //   // Prints 'you do not know fred.'
  // Arguments : ( positional )
  //   + <search_str>  - The symbol to replace.
  //     It is be wrapped in braces.
  //   + <replace_str> - The replacement string.
  // Returns   : A replacement function
  // Throws    : None
  //
  function makeReplaceFn ( arg_search_str, arg_value_str ) {
    var
      search_str = castStr( arg_search_str, __blank ),
      value_str  = castStr( arg_value_str,  __blank ),
      escape_str = makeEscRxStr( '{' + search_str + '}' ),
      search_rx  = makeRxObj( escape_str, 'g' );

    return function ( arg_tmplt ) {
      var tmplt = castStr( arg_tmplt, __blank );
      return tmplt[ __replace ]( search_rx, value_str );
    };
  }
  // . END Public method /makeReplaceFn/

  // BEGIN Public method /makeRekeyMap/
  // Summary   : makeRekeyMap( <struct_data>, <key_map>, <mode_str> );
  // Purpose   : Change all keys or values in a map to the new values provided
  // Arguments : <arg_map> with the following keys:
  //   + <struct_data> - A complex structure to rekey or revalue
  //   + <key_map>     - A key map pointing to values
  //   + <mode_str>    - '_rekey_' or '_reval_'
  // Examples  :
  //   makeRekeyMap(
  //     { a : 1, b : 2, c : [] },
  //     { a : '_x_', b : '_y_', c : '_z_' },
  //     '_rekey_'
  //   );
  //   // Returns { _x_:1, _y_:2, _z_:[] }
  //
  //   makeRekeyMap(
  //     { a : 1, b : 2, list : [ { c : [] } ] },
  //     { a : '_x_', b: '_y_', c : 22 },
  //     '_reval_'
  //   );
  //   // Returns { a : '_x_', b : '_y_', list : [ { c : 22 } ] }
  // Returns   : A new map or list or other data
  // Throws    : None
  // Note      : A hard limit of 100 000 iterations are supported.
  //   Executes deep renaming through arrays and objects.
  //
  function makeContextObj ( arg_struct ) {
    var
      key_list     = makeKeyListFn( arg_struct ),
      key_count    = key_list[ __length ],
      solve_struct = __Array.isArray( arg_struct ) ? [] : {};

    return key_count > __0 ? {
      _source_struct_ : arg_struct,
      _solve_struct_  : solve_struct,
      _key_list_      : key_list,
      _key_count_     : key_count,
      _key_idx_       : __0
    } : null;
  }

  function makeRekeyMap( arg_struct, arg_key_map, arg_mode_str ) {
    // noinspection JSMismatchedCollectionQueryUpdate
    var
      context_obj = makeContextObj( arg_struct ),
      mode_str    = castStr( arg_mode_str, '_rekey_', {
        _filter_rx_ : /^(_rekey_|_reval_)$/
      }),
      stack_list  = [],
      max_count = configMap._rekey_max_count_,

      key_count, key_list, key_idx,
      source_struct, solve_struct,
      key, data, replace_data,
      check_obj, pop_solve_struct, idx;

    if ( ! context_obj ) { return arg_struct; }

    _CONTEXT_: for ( idx = __0; idx < max_count; idx++ ) {
      key_count  = context_obj._key_count_;
      key_idx    = context_obj._key_idx_;
      key_list   = context_obj._key_list_;

      source_struct = context_obj._source_struct_;
      solve_struct  = context_obj._solve_struct_;

      key          = key_list[ key_idx ];
      data         = source_struct[ key ];
      replace_data = arg_key_map[ key ];

      if ( pop_solve_struct ) {
        data = pop_solve_struct;
        pop_solve_struct = null;
      }
      else if ( data && typeofFn( data ) === vMap._object_ ) {
        check_obj = makeContextObj( data );
        if ( check_obj ) {
          stack_list[ __push ]( context_obj );
          context_obj = check_obj;
          continue _CONTEXT_;
        }
      }

      if ( mode_str === '_reval_' ) {
        if ( ! replace_data ) { replace_data = data; }
        solve_struct[ key ] = replace_data;
      }
      else {
        if ( ! replace_data ) { replace_data = key; }
        solve_struct[ replace_data ] = data;
      }

      key_idx++;
      context_obj._key_idx_ = key_idx;
      if ( key_idx >= key_count ) {
        if ( stack_list[ __length ] > __0 ) {
          pop_solve_struct = context_obj._solve_struct_;
          context_obj = stack_list[ __pop ]();
        }
        else {
          break _CONTEXT_;
        }
      }

      if ( mode_str === '_reval_' ) {
        solve_struct[ key ] = replace_data;
      }
      else {
        solve_struct[ replace_data ] = data;
      }
    }
    if ( idx === max_count ) {
      logFn( '_error_', '_rekey_incomplete_max_count_exceeded_' );
    }
    return context_obj._solve_struct_;
  }
  // . END Public method /makeRekeyMap/

  // BEGIN Public method /makeSeenMap/
  // Purpose : Convert arg_key_list into a map with each key assigned
  // the value of arg_seen_data. Default is __true.
  //
  function makeSeenMap ( arg_key_list, arg_seen_data ) {
    var
      key_list  = castList( arg_key_list, [] ),
      key_count = key_list[ __length ],

      solve_data = arg_seen_data === __undef ? __true : arg_seen_data,
      solve_map = {},
      key, idx;

    for ( idx = __0; idx < key_count; idx++ ) {
      key = key_list[ idx ];
      solve_map[ key ] = solve_data;
    }
    return solve_map;
  }
  // . END Public method /makeSeenMap/

  // BEGIN Public method /makeStrFromMap/
  // Purpose : Concatenate a number of key-values
  // into a single string
  function makeStrFromMap ( arg_map ) {
    // noinspection JSMismatchedCollectionQueryUpdate
    var
      map       = castMap(  arg_map         ,      {} ),
      prop_map  = castMap(  map._prop_map_  ,      {} ),
      key_list  = castList( map._key_list_  ,      [] ),
      delim_str = castStr(  map._delim_str_ , __space ),

      label_delim_str = castStr( map._label_delim_str_, ': ' ),
      label_map       = castMap( map._label_map_,    __undef ),

      do_label   = !! ( label_map || map._do_label_ ),
      key_count  = key_list[ __length ],
      solve_list = [],

      idx, prop_key, prop_str, label_str;

    for ( idx = __0; idx < key_count; idx++ ) {
      prop_key  = key_list[ idx ];
      prop_str  = castStr( prop_map[ prop_key ], __blank );
      if ( prop_str !== __blank ) {
        if ( do_label ) {
          if ( label_map ) {
            label_str = castStr( label_map[ prop_key ], __blank );
            prop_str  = label_str + label_delim_str + prop_str;
          }
          else {
            prop_str = prop_key + label_delim_str + prop_str;
          }
        }
        solve_list[ __push ]( prop_str );
      }
    }
    return solve_list[ __join ]( delim_str ) + __blank;
  }
  // . END Public method /makeStrFromMap/

  // BEGIN Public method /makeSeriesMap/
  // Purpose   : Create a list of time labels quantitized to match
  //   standard time intervals
  // Example   :
  //   series_map = makeSeriesMap({
  //     _max_ms_       : 1465459980000,
  //     _min_ms_       : 1465452840000,
  //     _tgt_count_    : 12
  //   });
  // Arguments :
  //   _max_ms_       : Start local-time milliseconds
  //   _min_ms_       : End local-time in milliseconds
  //   _tgt_count_    : Desired number of divisions (+/- 50%)
  //
  //  Returns
  //   A map useful for plotting a quantized time series like so:
  //   -+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
  //    |     |     |     |     |     |     |     |     |     |     |     |
  //  23:20 23:30 23:40 23:50 00:00 00:10 00:20 00:30 00:40 00:50 01:00 01:10
  //           2016-06-07       |                    2016-06-08
  //  xxxxxxxxxxxxxxxxxxxxxxxxxx+
  //    { _date_list_  : [
  //        { _date_str_ : '2016-06-07', _width_ratio_ : 0.38655462184873 },
  //        { _date_str_ : '2016-06-08', _width_ratio_ : 0.61344537815126 }
  //      ],
  //      _left_ratio_ : 0.050420168067226,
  //      _time_list_ : [
  //        '23:20', '23:30', '23:40', '23:50', '00:00', '00:10',
  //        '00:20', '00:30', '00:40', '00:50', '01:00', '01:10'
  //      ]
  //      _time_idx_   : 1,
  //      _unit_count_ : 12,
  //      _unit_ms_    : 600000,
  //      _unit_name_  : '10m',
  //      _unit_ratio_ : 0.084033613445378,
  //    }
  //
  //    _date_list_  = list of dates and position of date labels
  //    _left_ratio_ = starting postion of time stamps
  //    _time_idx_   = precision of time to show 0 = '', 1=HH, 2=HH:MM, 3=HH:MM:SS
  //    _time_list_  = list of time labels
  //    _unit_count_ = number of time labels units returned
  //    _unit_ms_    = number of ms in
  //    _unit_ratio_ = ratio per time unit for plotting center of time
  //
  // Throws    :
  // Cautions  :
  //   Remember to use your local timezone offset if you want to
  //   show local time. See example on makeClockStr, above.
  //
  function makeSeriesMap( arg_map ) {
    var
      map       = castMap( arg_map, {}       ),
      max_ms    = castInt( map._max_ms_, __0 ),
      min_ms    = castInt( map._min_ms_, __0 ),
      tgt_count = castInt( map._tgt_count_   ),

      date_obj  = new __Date(),

      span_ms,         unit_ms_list, unit_count,
      btm_idx,         top_idx,      last_btm_idx,
      last_top_idx,    btm_count,    top_count,
      expand_ratio,

      jdx, idx,        check_idx,    check_map,
      check_count,     mod_unit_ms,  offset_ms,
      width_ratio,     left_ratio,   accum_ratio,
      date_ms,         date_offset,

      solve_map,       solve_ms,        time_ms,
      solve_str,       solve_time_list, solve_date_list;

    // Get the time span and a list of available units
    span_ms      = max_ms - min_ms;
    unit_ms_list = configMap._unit_ms_list_;
    unit_count   = unit_ms_list[ __length ];

    // Init for solve loop
    btm_count  = tgt_count;
    top_count  = tgt_count;

    // Back off limits to resolve as close to target as possible
    _BACKOFF_: for ( jdx = __0; jdx < __10; jdx ++ ) {
      // Solve for unit size through interpolation
      btm_idx    = __0;
      top_idx    = unit_count - __1;
      last_btm_idx = __undef;
      last_top_idx = __undef;
      _INTERPOLATE_: for ( idx = __0; idx < unit_count; idx++ ) {
        // Calculate ranges
        check_idx   = btm_idx
          + makeRoundNumFn( ( ( top_idx - btm_idx ) / __2 ) );
        check_map   = unit_ms_list[ check_idx ];
        check_count = makeRoundNumFn( ( span_ms / check_map._ms_ ) );
        if ( ( top_idx - btm_idx ) === __1 && last_btm_idx !== __undef ) {
          if ( btm_idx === last_btm_idx && top_idx === last_top_idx ) {
            break _INTERPOLATE_;
          }
        }
        last_btm_idx = btm_idx;
        last_top_idx = top_idx;

        // Continue loop if out of range
        if ( check_count < btm_count ) {
          top_idx = check_idx;
          continue _INTERPOLATE_;
        }
        if ( check_count > top_count ) {
          btm_idx = check_idx;
          continue _INTERPOLATE_;
        }
        solve_map = {
          _time_idx_   : check_map._time_idx_,
          _unit_count_ : check_count,
          _unit_ms_    : check_map._ms_,
          _unit_name_  : check_map._str_
        };
        idx = unit_count;
      }

      if ( solve_map ) { break _BACKOFF_; }

      // No solution found; Increase range and try again
      expand_ratio = __1 + ( ( jdx + __1 ) / __10 );
      top_count = tgt_count * expand_ratio;
      btm_count = tgt_count / expand_ratio;
    }
    if ( ! solve_map ) { return; }

    // Store values to solve_map
    mod_unit_ms  = min_ms % solve_map._unit_ms_;
    offset_ms    = solve_map._unit_ms_ - mod_unit_ms;
    left_ratio = ( offset_ms / span_ms );

    solve_map._left_ratio_ = left_ratio;
    solve_map._unit_ratio_ = solve_map._unit_ms_ / span_ms;

    // Create date list
    date_obj.setTime( min_ms   );
    date_obj.setHours( __0, __0, __0 );
    date_ms     = date_obj.getTime();
    date_offset = min_ms - date_ms;

    solve_date_list = [];
    accum_ratio     = __0;
    while ( date_ms < max_ms ) {
      width_ratio = ( configMap._day_ms_ - date_offset ) / span_ms;
      accum_ratio += width_ratio;
      if ( accum_ratio >= __1 ) {
        width_ratio += ( __1 - accum_ratio );
      }
      solve_date_list[ __push ]({
        _date_str_    : makeDateStr({ _date_ms_ : date_ms, _order_str_ : '_us_' }),
        _width_ratio_ : width_ratio
      });
      date_offset = __0;
      date_ms += configMap._day_ms_;
    }
    solve_map._date_list_ = solve_date_list;

    solve_time_list = [];
    while ( left_ratio < __1 ) {
      solve_ms  = makeFloorNumFn( left_ratio * span_ms ) + min_ms;
      date_obj.setTime( solve_ms );
      time_ms = __Num( date_obj.getHours()   ) * configMap._hrs_ms_
        +       __Num( date_obj.getMinutes() ) * configMap._min_ms_
        +       __Num( date_obj.getSeconds() ) * configMap._sec_ms_;

      solve_str = makeClockStr( time_ms, solve_map._time_idx_ );
      solve_time_list[ __push ]( solve_str );
      left_ratio += solve_map._unit_ratio_;
    }
    solve_map._time_list_ = solve_time_list;

    return solve_map;
  }
  // . END Public function /makeSeriesMap/

  // BEGIN Public method /makeTmpltStr/
  // Purpose   : Replace symbols in a template surrounded by braces
  //   '{}' with the symbol provided in the lookup map.
  // Example   :
  //   makeTmpltStr({
  //     _do_encode_html_ : __true,
  //     _input_str_      : '{_name_} says "{_saying_}"',
  //     _lookup_map_     : { _name_ : 'Fred', _saying_ : 'hello!' }
  //   });
  //   // Returns 'Fred says hello!'
  //
  // Arguments : ( named )
  //   _do_encode_html_ : When __true replaced values will be html encoded.
  //     Default is __false.
  //   _input_str_  : A string template like so:
  //      'This person name {_p1_} said to the other person {_p2_}'.
  //      Default is __blank.
  //   _lookup_map_ : A map of values to replace, like so:
  //      { _p1_ : 'fred', _p2_ : 'barney' }. Default is {}.
  //      Keys in a lookup map can be split be to look up nested values.
  //      For example, the key '_p1_._p2_' will look up the value
  //        found at { _p1_: { _p2_ : value } } in the lookup_map.
  //   _tmplt_rx_   : A regular expression object to define replace patterns.
  //      Default is configMap._tmplt_rx_
  //   _return_map_ : The routine will append found keys to this map if provided.
  //      Default is __undef
  // Throws    : None
  // Returns
  //   The filled-out template string
  //
  function makeTmpltStr ( arg_map ) {
    var
      map = castMap(  arg_map, {} ),

      do_encode_html = castBool( map._do_encode_html_,        __false ),
      input_str      = castStr(  map._input_str_,             __blank ),
      lookup_map     = castMap(  map._lookup_map_,                 {} ),
      return_map     = castMap(  map._return_map_,            __undef ),
      tmplt_rx       = castRx(   map._tmplt_rx_, configMap._tmplt_rx_ ),

      bound_fn;

    function lookupFn ( ignore_match_str, lookup_name ) {
      var
        solve_data = this,
        path_list  = lookup_name[ __split ]( '.' ),
        path_count = path_list[ __length ],

        idx, key_name, solve_str;

      for ( idx = __0; idx < path_count; idx++ ) {
        key_name   = path_list[ idx ];
        solve_data = ( solve_data && solve_data[ key_name ] );
      }

      solve_str = castStr( solve_data, __blank );
      if ( return_map && solve_str ) {
        return_map[ lookup_name ] = __true;
      }
      return do_encode_html ? encodeHtml( solve_str ) : solve_str;
    }

    bound_fn = lookupFn[ __bind ]( lookup_map );
    return input_str[ __replace ]( tmplt_rx, bound_fn );
  }
  // . END Public method /makeTmpltStr/

  // BEGIN Public method /mergeMaps/
  // Purpose : Merge properties of extend_map into base_map
  //
  // Warning : This does not deep copy the extend map.
  // This often provides the desired results.
  //   deep_map  = cloneData( extend_map );
  //   merge_map = mergeMaps( base_map, deep_map );
  //
  function mergeMaps( arg_base_map, arg_extend_map, arg_attr_list ) {
    var
      base_map   = castMap(  arg_base_map,   {} ),
      extend_map = castMap(  arg_extend_map, {} ),
      attr_list  = castList( arg_attr_list ),

      key_list   = makeKeyListFn( extend_map ),
      key_count  = key_list[ __length ],

      idx, key;

    _KEY_: for ( idx = __0; idx < key_count; idx++ ) {
      key = key_list[ idx ];
      if ( attr_list && attr_list[ __indexOf ]( key ) === __n1 ) {
        logFn( '_warn_', '_key_not_supported_ |' + __Str( key ) + '|');
        continue _KEY_;
      }
      base_map[ key ] = extend_map[ key ];
    }
    return base_map;
  }
  // . END Public method /mergeMaps/

  // BEGIN Public method /pollFunction/
  // Purpose : Run the <arg_fn> function every <arg_ms> milliseconds
  //   either <arg_count> number of times or until the function
  //   returns __false, whichever comes first.
  // Arguments ( positional )
  //   0 : fn        : Fn to poll. Return __false to stop. Required.
  //   1 : ms        : Milliseconds between calls. Default is __0.
  //   2 : count     : Maximum count.              Default is __null.
  //   3 : finish_fn : Fn to run on completion.    Default is __null.
  // Returns
  //   __true  : polling started
  //   __false : polling declined
  //
  function pollFunction ( arg_fn, arg_ms, arg_count, arg_finish_fn ) {
    var
      poll_fn   = castFn(  arg_fn ),
      ms        = castInt( arg_ms,           __0 ),
      count     = castInt( arg_count,     __null ),
      finish_fn = castFn(  arg_finish_fn, __null ),
      idx     = __0;

    if ( ! poll_fn ) { return __false; }

    function pollFn () {
      setToFn( function() {
        var do_next;
        if ( count && idx >= count ) {
          return finish_fn && finish_fn();
        }
        do_next = poll_fn( idx );
        idx++;
        if ( do_next !== __false ) { pollFn(); }
      }, ms );
    }

    pollFn();
    return __true;
  }
  // . END Public method /pollFunction/

  // BEGIN Public method /pushUniqListVal/
  function pushUniqListVal ( arg_list, data ) {
    var input_list = castList( arg_list, [] );
    if ( input_list[ __indexOf ]( data ) === __n1 ) {
      input_list[ __push ]( data );
    }
  }
  // . END Public method /pushUniqListVal/

  // BEGIN Public method /rmListVal/
  // Summary    : rmListVal( <base_list>, <val1>, ... <valN> );
  // Purpose    : Remove one or more values from a base_list in-place
  // Example    : rmListVal( base_list, 'a', 1, null );
  //
  // Arguments  : (positional)
  //   0   - base_list
  //   1-n - values to remove
  // Returns    : Count of removed values
  // Throws     : None
  //
  function rmListVal () {
    var
      arg_list   = makeArgList( arguments ),
      item_list  = castList( arg_list[ __shift ](), [] ),
      item_count = item_list[ __length ],
      test_list  = arg_list,
      test_count = test_list[ __length ],
      rm_count   = __0,
      idx, item_data, jdx, test_data;

    _LIST_ITEM_: for ( idx = item_count - __1; idx > __n1; idx-- ) {
      item_data = item_list[ idx ];
      for ( jdx = __0; jdx < test_count; jdx++ ) {
        test_data = arg_list[ jdx ];
        if ( item_data === test_data ) {
          item_list[ vMap._splice_ ]( idx, __1 );
          rm_count++;
          idx++;
          continue _LIST_ITEM_;
        }
      }
    }
    return rm_count;
  }
  // . END Public method /rmListVal/

  // BEGIN Public method /setConfigMap/
  // Summary    : setConfigMap( <input_map>, <settable_map>, <config_map> );
  // Purpose    : Set configMap in consistent way across modules
  // Example    : Used in modules as below:
  //   function setConfigMap ( arg_input_map ) {
  //     setConfigMap( input_map, settableMap, configMap );
  //   }
  //   Where  settableMap shows allowable keys and types
  // Arguments  : (named)
  //   _input_map_    - Map of key-values to set in config
  //   _settable_map_ - Map of allowable keys with future plans to support
  //      types and ranges (see agrc)
  //   _config_map_   - Resulting config map
  // Returns    : Modified config_map
  // Throws     : None
  //
  function setConfigMap ( arg_map ) {
    var
      input_map    = castMap( arg_map._input_map_ ),
      settable_map = castMap( arg_map._settable_map_ ),
      config_map   = castMap( arg_map._config_map_ ),
      key_list, key_count, idx, key_name;

    if ( ! (  input_map && settable_map && config_map ) ) {
      return logFn( '_error_', '_bad_input_' );
    }
    key_list  = makeKeyListFn( input_map );
    key_count = key_list[ __length ];

    for ( idx = __0; idx < key_count; idx++ ) {
      key_name = key_list[ idx ];
      if ( settable_map[ __hasProp ]( key_name ) ) {
        config_map[ key_name ] = input_map[ key_name ];
      }
      else {
        logFn( '_warn_', '_key_not_supported_', key_name );
      }
    }
    return config_map;
  }
  // . END Public method /setConfigMap/

  // BEGIN Public method /makeDeepData/
  // Purpose   : Get all unique keys in a data structure as list or map
  // Example   : _makeDeepData_({ foo:{ bar:1 }, bar:2});
  //             Returns [ 'foo', 'bar' ]
  //             _makeDeepData_({ foo:{ bar:1 }, bar:2}, '_map_');
  //               Returns { bar: 2 } // flattens map
  // Arguments : ( positional )
  //   0 : base_struct - An array or map
  //   1 : mode_str - _list_ or _map_. Default is _list_
  // Returns   :
  //   * Success - A list of a unique keys sorted
  //   * Failure - An empty list
  // Cautions  : The key list limit is set to __100. If this
  //   is met, a warning is logged and __undef returned
  //
  function makeDeepData ( arg_base_data, arg_mode_str ) {
    var
      base_data  = castList( arg_base_data ) || castMap( arg_base_data, {} ),
      mode_str   = castStr(
        arg_mode_str, '_list_', { _filter_rx_ : /^(_list_|_map_)$/ }
      ),
      walk_obj   = base_data,
      solve_data = mode_str === '_list_' ? [] : {},
      stack_list = [],
      key_list   = makeKeyListFn( walk_obj ),
      key_count  = key_list[ __length ],
      idx        = __0,

      loop_key,     loop_data, loop_type,
      ctx_key_list, stack_map;

    _OUTER_: while ( walk_obj ) {
      while ( idx < key_count ) {
        loop_key  = key_list[ idx ];
        loop_data = walk_obj[ loop_key ];
        loop_type = getVarType( loop_data );

        if ( mode_str === '_list_' ) {
          if ( solve_data[ __indexOf ]( loop_key ) === __n1 ) {
            solve_data[ __push ]( loop_key );
          }
        }

        if ( loop_type === '_Object_' || loop_type === '_Array_' ) {
          ctx_key_list = makeKeyListFn( loop_data );
          if ( ctx_key_list[ __length ] > __0 ) {
            stack_list[ __push ]( {
              _idx_       : idx,
              _key_count_ : key_count,
              _key_list_  : key_list,
              _walk_obj_  : walk_obj
            } );

            idx       = __n1;
            walk_obj  = loop_data;
            key_list  = makeKeyListFn( walk_obj );
            key_count = key_list[ __length ];
          }
        }
        else if ( mode_str === '_map_' ) {
          solve_data[ loop_key ] = loop_data;
        }
        idx++;
      }

      stack_map = stack_list[ __pop ]();
      if ( ! stack_map ) { break _OUTER_; }

      walk_obj  = stack_map._walk_obj_;
      key_count = stack_map._key_count_;
      key_list  = stack_map._key_list_;
      idx       = stack_map._idx_ + __1;
    }
    return solve_data;
  }
  // . END Public method /makeDeepData/

  // BEGIN Public method /setStructData/
  // Purpose   : Set a deep structure attribute value
  // Example   : _setStructData_({ foo:{ bar:1 }}, [ 'foo','bar' ], 99 );
  //             Returns __true and set the and adjusts the structure:
  //             { foo : { bar : 99 } }
  // Example   : _setStructData_( [ { car : [ 'seats', 'tyres' ] } ],
  //             [ 0, 'car', 1 ], 'Meyers!' ] );
  //             Returns __true and set the and adjusts the structure:
  //             [ { car : [ 'seats', 'Meyers!' ] } ]
  // Example   : _setStructData_( [],  [ null, 'car', null ], 'Meyers!' );
  //             Returns __true and adjust the structure:
  //             [ { car : [ 'Meyers!' ] } ]
  // Example   : _setStructData_( [], [ 'car', null ], 'Meyers!'  );
  //             Returns __false, as 'car' cannot be a property of the
  //             base structure. It must be null which means "next
  //             available array item" or an integer.
  //
  // Arguments : ( positional )
  //   0 : base_struct - An array or map to add a value
  //   1 : path_list   - A list of map or array keys in order of depth
  //   2 : val_data    - A data value to set
  // Returns   :
  //   * Success - __true
  //   * Failure - __false
  // Cautions  : The key list limit is set to __100. If this
  //   is met, a warning is logged and __undef returned
  //a
  function setStructData ( arg_base_struct, arg_path_list, val_data ) {
    var
      base_struct = arg_base_struct,
      path_list   = castList( arg_path_list, [] ),
      path_count  = path_list[ __length ],
      last_idx    = path_count - __1,
      walk_struct = base_struct,
      is_good     = __true,

      struct_type, idx,          raw_key,
      solve_key,   raw_next_key, int_key,
      int_next_key;

    _SET_KEY_: for ( idx = __0; idx < path_count; idx++ ) {
      raw_key      = path_list[ idx ];
      raw_next_key = path_list[ idx + __1 ];
      struct_type  = getVarType( walk_struct );
      int_key      = castInt( raw_key );

      if ( raw_key === __null ) {
        if ( struct_type !== '_Array_' ) {
          is_good = __false;
          break _SET_KEY_;
        }
        solve_key = walk_struct[ __length ];
      }
      else if ( int_key !== __undef && struct_type === '_Array_' ) {
        solve_key = int_key;
      }
      else {
        solve_key = castStr( raw_key );
        if ( ! solve_key ) {
          is_good = __false;
          break _SET_KEY_;
        }
      }

      if ( idx === last_idx ) {
        walk_struct[ solve_key ] = val_data;
        break _SET_KEY_;
      }

      if ( ! walk_struct[ __hasProp ]( solve_key ) ) {
        int_next_key = castInt( raw_next_key );
        if ( raw_next_key === __null || int_next_key !== __undef ) {
          walk_struct[ solve_key ] = [];
        }
        else {
          walk_struct[ solve_key ] = {};
        }
      }

      walk_struct = walk_struct[ solve_key ];
    }
    return is_good;
  }
  // . END Public method /setStructData/

  // BEGIN Public method /shuffleList/
  // Summary   : ShuffleList( <list> )
  // Purpose   : Shuffle elements in a list
  // Example   : shuffleList( [1,2,3,4] ) returns [ 3,1,4,2 ]
  // Arguments :
  //   <list> - The list to shuffle
  // Returns   : __true on success
  // Throws    : None
  // Technique :
  //   1. Count down from end of array with last_idx
  //   2. Randomly pick element from between 0 and last_idx
  //   3. Swap pick element with last_idx element
  //
  function shuffleList ( arg_list ) {
    var
      list  = castList( arg_list ),
      count, idj, last_idx, pick_idx, swap_data;

    if ( ! list ) { return __false; }

    count = list[ __length ];
    for ( idj = count; idj > __0; idj-- ) {
      last_idx         = idj - __1;
      pick_idx         = makeFloorNumFn( makeRandomNumFn() * idj );
      swap_data        = list[ last_idx ];
      list[ last_idx ] = list[ pick_idx ];
      list[ pick_idx ] = swap_data;
    }
    return __true;
  }
  // . END public method /shuffleList/

  // BEGIN Public method /trimStrList/
  // Summary   : trimStrList( <list> )
  // Purpose   : Trim all strings in a list
  // Example   : shuffleList( [ '  padd string ', 'anudder '] );
  // Arguments :
  //   <list> - The list to trim leading and ending whitespace
  // Returns   : A new list of trimmed strings
  // Throws    : None
  //
  function trimStrList ( arg_list ) {
    var list = castList( arg_list );

    function mapFn ( data ) {
      return getVarType( data ) === '_String_'
        ? data[ vMap._trim_ ]() : data;
    }

    if ( ! list ) { return arg_list; }
    return list[ vMap._map_ ]( mapFn );
  }
  // . END Public method /trimStrList/
  // == . END PUBLIC METHODS ==========================================

  // == BEGIN EXPORT METHODS ==========================================
  // To created a stripped library from xhi/01_utils, copy the library
  // and retain the header and footer comments for the methods to strip
  // but delete the function, and then comment-out the function below.
  // This provides the easiest means to merge back upstream changes.
  // To re-enable, method merge the function back from xhi/01_utils
  // and uncomment the reference below.
  //
  return {
    _getVarType_ : getVarType,

    _castBool_ : castBool,
    _castFn_   : castFn,
    _castInt_  : castInt,
    _castJQ_   : castJQ,
    _castList_ : castList,
    _castMap_  : castMap,
    _castNum_  : castNum,
    _castObj_  : castObj,
    _castRx_   : castRx,
    _castStr_  : castStr,

    _safeJsonParse_     : safeJsonParse,
    _safeJsonStringify_ : safeJsonStringify,

    _cloneData_      : cloneData,
    _extendList_     : extendList,
    _getNowMs_       : getNowMs,
    _getNumSign_     : getNumSign,
    _makeArgList_    : makeArgList,
    _makePadStr_     : makePadStr,
    _makeEscRxStr_   : makeEscRxStr,
    _makeRxObj_      : makeRxObj,
    _makeScrubStr_   : makeScrubStr,
    _makeUcFirstStr_ : makeUcFirstStr,

    _checkDateStr_    : checkDateStr,
    _clearMap_        : clearMap,
    _encodeHtml_      : encodeHtml,
    _getBasename_     : getBasename,
    _getDirname_      : getDirname,
    _getListAttrIdx_  : getListAttrIdx,
    _getListAttrMap_  : getListAttrMap,
    _getListDiff_     : getListDiff,
    _getListValCount_ : getListValCount,
    _getLogObj_       : getLogObj,
    _getStructData_   : getStructData,
    _getTzCode_       : getTzCode,
    _makeClockStr_    : makeClockStr,
    _makeColumnList_  : makeColumnList,
    _makeCommaNumStr_ : makeCommaNumStr,
    _makeDateStr_     : makeDateStr,
    _makeDebounceFn_  : makeDebounceFn,
    _makeDeepData_    : makeDeepData,
    _makeEllipsisStr_ : makeEllipsisStr,
    _makeErrorObj_    : makeErrorObj,
    _makeExtractMap_  : makeExtractMap,
    _makeGuidStr_     : makeGuidStr,
    _makeKeyList_     : makeKeyListFn,
    _makeMapUtilObj_  : makeMapUtilObj,
    _makeMetricStr_   : makeMetricStr,
    _makeOptionHtml_  : makeOptionHtml,
    _makePctStr_      : makePctStr,
    _makeRadioHtml_   : makeRadioHtml,
    _makeRekeyMap_    : makeRekeyMap,
    _makeReplaceFn_   : makeReplaceFn,
    _makeSeenMap_     : makeSeenMap,
    _makeSeriesMap_   : makeSeriesMap,
    _makeStrFromMap_  : makeStrFromMap,
    _makeThrottleFn_  : makeThrottleFn,
    _makeTmpltStr_    : makeTmpltStr,
    _mergeMaps_       : mergeMaps,
    _pollFunction_    : pollFunction,
    _pushUniqListVal_ : pushUniqListVal,
    _rmListVal_       : rmListVal,
    _setConfigMap_    : setConfigMap,
    _setStructData_   : setStructData,
    _shuffleList_     : shuffleList,
    _trimStrList_     : trimStrList
  };
  }
  // . END constructor /makeSingletonMap/
  // == . END EXPORT METHODS ==========================================

  // BEGIN Public method /makeInstanceFn/
  function makeInstanceFn ( aMap, argOptMap ) {
    var optMap;
    if ( ! singletonMap ) {
      singletonMap = makeSingletonMap( aMap );
    }

    optMap = singletonMap._castMap_( argOptMap, {} );
    if ( ! optMap._dont_autoadd_ ) {
      if ( optMap._01_util_ !== singletonMap ) {
        aMap[ '_01_util_' ] = singletonMap;
      }
    }
    return singletonMap;
  }
  return { _makeInstanceFn_ : makeInstanceFn };
  // == . END EXPORT METHODS ==========================================
}());
// == . END MODULE xhi._01_util_ ======================================
