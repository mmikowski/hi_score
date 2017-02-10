/**
 *    xhi.util.js
 *    Utilities which do not require jQuery or a browser
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true, todo    : true, unparam  : true
*/
/*global jQuery */

var __ns = 'xhi', __NS;
/* istanbul ignore next */
try          { __NS = global[ __ns ]; }
catch ( e1 ) { __NS = window[ __ns ]; }

// == BEGIN MODULE __NS._makeUtil_ ====================================
__NS._makeUtil_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    aKey   = aMap._aKey_,
    vMap   = aMap._vMap_,
    nMap   = aMap._nMap_,

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

    __d5      = nMap._d5_,
    __0       = nMap._0_,
    __1       = nMap._1_,
    __2       = nMap._2_,
    __3       = nMap._3_,
    __4       = nMap._4_,
    __10      = nMap._10_,
    __100     = nMap._100_,
    __n1      = nMap._n1_,

    __floor   = vMap._fnGetFloor_,
    __random  = vMap._fnGetRandom_,
    __setTo   = vMap._fnSetTimeout_,
    __typeof  = vMap._fnTypeof_,
    __keys    = vMap._fnGetKeyList_,

    topSmap, topCmap, // State and cfg maps are set in initModule

    getNowMs,     getVarType,  getBasename,
    getDirname,   logObj,      makeGuidStr,
    makeTmpltStr, trimStrList
    ;
  // == END MODULE SCOPE VARIABLES ====================================

  // == BEGIN PREREQ METHODS ==========================================
  // BEGIN Public prereq method /getVarType/
  // Summary   : getVarType( <data> )
  // Purpose   : Determine the type of data provided.
  // Example   : getVarType( [] ); // '_Array_'
  // Arguments : (positional)
  //   <data> - value to examine
  // Returns   : '_Function_', '_Object_', '_Array_', '_String_',
  //             '_Number_', '_Null_', '_Boolean_', or '_Undefined_'
  // Throws    : none
  //
  //
  getVarType = (function () {
    var
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
      };

    function mainFn ( data ) {
      var type_key, type_str;

      if ( data === __null         ) { return '_Null_';      }
      if ( data === __undef        ) { return '_Undefined_'; }
      if ( __Array.isArray( data ) ) { return '_Array_';     }

      type_key = __typeof( data );
      type_str = typeofMap[ type_key ];

      if ( type_str && type_str !== '_Object_' ) { return type_str; }

      type_key = {}[ vMap._toString_ ][ vMap._call_ ](
        data )[ vMap._slice_ ]( nMap._8_, __n1 );

      return typeofMap[ type_key ] || type_key;
    }
    return mainFn;
  }());
  // END Public prereq method /getVarType/

  // BEGIN Public prereq method /castBool/
  // Summary   : castBool( <data>, <alt_data> )
  // Purpose   : Cast a boolean value
  // Example   : castBool( true ); // returns true
  // Arguments : (positional)
  //   <data>     - data to cast as boolean
  //   <alt_data> - alternate value to return
  // Returns   :
  //   <data> if it is a boolean, <alt_data> otherwise
  // Throws    : none
  //
  function castBool ( data, alt_data ) {
    if ( arguments[ __length ] >= __2 ) {
      if ( data === __true || data === __false ) { return data; }
      return alt_data;
    }
    return !! data;
  }
  // END Public prereq method /castBool/

  // BEGIN Public prereq method /castFn/
  // Summary   : castFn( <data>, <alt_data> )
  // Purpose   : Cast a function
  // Example   : castFn( function(){} ); // returns function
  // Arguments : (positional)
  //   <data>     - data to cast as function
  //   <alt_data> - alternate value to return
  // Returns   :
  //   <data> if it is a function, <alt_data> otherwise
  // Throws    : none
  //
  function castFn ( data, alt_data ) {
    var var_type = getVarType( data );
    return ( var_type === '_Function_' ) ? data : alt_data;
  }
  // END Public prereq method /castFn/

  // BEGIN Public prereq method /castInt/
  // Summary   : castInt( <data>, <alt_data> )
  // Purpose   : Cast an integer
  // Example   : castInt( '25.425' ); // returns 25
  // Arguments : (positional)
  //   <data>     - data to cast as int
  //   <alt_data> - alternate value to return
  // Returns   :
  //   If a number, returns the number rounded to nearest int.
  //   If a string, returns the number rep rounded to nearest int.
  //   Otherwise <alt_data>.
  // Throws    : none
  //
  function castInt ( data, alt_data ) {
    var
      var_type = getVarType( data ),
      num      = var_type === '_Number_'
        ? data : var_type === '_String_'
        ? parseFloat( data ) : __undef
        ;
    if ( isNaN( num ) ) { return alt_data; }
    return __floor( num + __d5 );
  }
  // END Public prereq method /castInt/

  // BEGIN Public prereq method /castJQ/
  // Summary   : castJQ( <data>, <alt_data> )
  // Purpose   : Cast a jQuery object
  // Example   : castJQ( $top_box ); // returns $top_box
  // Arguments : (positional)
  //   <data>     - data to cast as jQuery object
  //   <alt_data> - alternate value to return
  // Returns   :
  //   <data> if it is a jQuery object, <alt_data> otherwise
  // Throws    : none
  //
  function castJQ ( data, alt_data ) {
    if ( topSmap._has_jq_ ) {
      return ( data && data instanceof jQuery ) ? data : alt_data;
    }
    /* istanbul ignore next */
    return alt_data;
  }
  // END Public preq method /castJQ/

  // BEGIN Public prereq method /castList/
  // Summary   : castList( <data>, <alt_data> )
  // Purpose   : Cast a list
  // Example   : castList( [] ); // returns the array
  // Arguments : (positional)
  //   <data>     - data to cast as list
  //   <alt_data> - alternate value to return
  // Returns   :
  //   <data> if it is a list, <alt_data> otherwise
  // Throws    : none
  //
  function castList ( data, alt_data ) {
    var var_type = getVarType( data );
    return ( var_type === '_Array_' ) ? data : alt_data;
  }
  // END Public prereq method /castList/

  // BEGIN Public prereq method /castMap/
  // Summary   : castMap( <data>, <alt_data> )
  // Purpose   : Cast a map
  // Example   : castMap( {} ); // returns the object
  // Arguments : (positional)
  //   <data>     - data to cast as map
  //   <alt_data> - alternate value to return
  // Returns   :
  //   <data> if it is a map, <alt_data> otherwise
  // Throws    : none
  //
  function castMap ( data, alt_data ) {
    var var_type = getVarType( data );
    return ( var_type === '_Object_' ) ? data : alt_data;
  }
  // END Public prereq method /castMap/

  // BEGIN Public prereq method /castNum/
  // Summary   : castNum( <data>, <alt_data> )
  // Purpose   : Cast a floating point number
  // Example   : castNum( '25.425' ); // returns 25.425
  // Arguments : (positional)
  //   <data>     - data to cast as number
  //   <alt_data> - alternate value to return
  // Returns   :
  //   <data> if a number, or a string converted into a number,
  //   <alt_data> otherwise
  // Throws    : none
  //
  function castNum ( data, alt_data ) {
    var var_type = getVarType( data ), num;
    num = ( var_type === '_Number_' )
      ? data : var_type === '_String_'
      ? parseFloat( data ) : __undef
      ;
    return isNaN( num ) ? alt_data : num;
  }
  // END Public prereq method /castNum/

  // BEGIN Public prereq method /castObj/
  // Summary   : castObj( <obj_type>, <data>, <alt_data> )
  // Purpose   : Cast an object
  // Example   : castObj( 'styleSheetList',document.styleSheets  );
  // Arguments : (positional)
  //   <obj_type> - string of object type (see Example)
  //   <data>     - data to cast as <obj_type> object
  //   <alt_data> - alternate value to return
  // Returns   :
  //   <data> if an <obj_type> object, <alt_data> otherwise
  // Throws    : none
  //
  function castObj ( obj_type, data, alt_data ) {
    var var_type = getVarType( data );
    return var_type === obj_type ? data : alt_data;
  }
  // END Public prereq method /castObj/

  // BEGIN Public prereq method /castStr/
  // Summary   : castStr( <data>, <alt_data> )
  // Purpose   : Cast a string
  // Example   : castStr( 25.425 ); // returns '25.425'
  // Arguments : (positional)
  //   <data>     - data to cast as string
  //   <alt_data> - alternate value to return
  // Returns   :
  //   <data> if a string, or a number converted to a string,
  //   <alt_data> otherwise
  // Throws    : none
  //
  function castStr ( data, alt_data ) {
    var var_type = getVarType( data );
    return var_type === '_String_'
      ? data : var_type === '_Number_'
      ? __Str( data ) : alt_data;
  }
  // END Public prereq method /castStr/
  //
  // BEGIN Public prereq method /cloneData/
  // Summary   : cloneData( <data> )
  // Purpose   : Deep clones non-recursive data structures fastest
  // Example   : cloneData( [] ); // return copy of list
  // Arguments : (positional)
  //   <data> - data to clone
  // Returns   : undefined if data is recursive; otherwise a deep
  //   copy is returned.
  // Throws    : none
  //
  function cloneData ( data ) {
    var clone_data;
    if ( data === __undef ) { return data; }
    try { clone_data = __jparse( __j2str( data ) ); }
    catch ( ignore_obj ) { clone_data = __undef; }
    return clone_data;
  }
  // END Public prereq method /cloneData/

  // BEGIN Public prereq method /getNowMs/
  // Purpose   : Get timestamp
  // Example   : getNowMs(); // returns 1486283077968
  // Returns   : The current timestamp in milliseconds
  // Throws    : none
  //
  // The Date.now() method is 3x faster than the +new Date()
  //   in NodeJS, and I have confirmed this provides almost the
  //   the same performance in that env as a raw Date.now() call.
  //
  getNowMs = (function () {
    var return_fn;
    /* istanbul ignore else */
    if ( __Date[ vMap._hasOwnProp_ ]( vMap._now_ ) ) {
      return_fn = function () { return __Date[ vMap._now_ ](); };
    }
    else {
      return_fn = function () { return +new __Date(); };
    }
    return return_fn;
  }());
  // END Public prereq method /getNowMs/

  // BEGIN Public prereq method /getNumSign/
  // Summary   : getNumSign( <data> )
  // Purpose   : Convert number into -1 or 1
  // Example   : getNumSign( '-25' ); // returns -1
  // Arguments :
  //   <data> - number or string to convert to -1 or 1
  // Returns   : -1 if the processed number is less than 0,
  //   otherwise 1.
  // Throws    : none
  //
  function getNumSign ( n ) {
    var num = __Num( n );
    return ( ! isNaN( num ) && num < __0 ) ? __n1 : __1;
  }
  // END Public prereq method /getNumSign/

  // BEGIN private method /getTzDateObj/
  // Returns   : A date object singleton for use by Tz methods
  //
  function getTzDateObj () {
    if ( ! topSmap._date_obj_ ) {
      topSmap._date_obj_ = new __Date();
    }
    return topSmap._date_obj_;
  }
  // END private method /getTzDateObj/

  // BEGIN Public prereq method /makeArgList/
  // Summary   : makeArgList( <arg_obj> )
  // Purpose   : Make a real array from data in argument object
  // Example   : makeArgList( arguments ); // returns [ ... ]
  // Arguments :
  //   <arg_obj> - an argument object ('arguments' in functions)
  // Returns   : An array of argument values
  // Throws    : none
  //
  // The technique used is around 3x faster than
  //   return Array.prototype.slice.call( arg_obj );
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
  // END Public prereq method /makeArgList/

  // BEGIN public method /makeMetricStr/
  function makeMetricStr( arg_num ) {
    var
      num     = castNum( arg_num, __0 ),
      abs_num = vMap._fnGetAbs_( num ),
      root_num, suffix
      ;

    if ( abs_num >= 1e+9 ) {
      root_num = num / 1e+9;
      suffix   = 'G';
    }
    else if ( abs_num >= 1e+6 ) {
      root_num = num / 1e+6;
      suffix   = 'M';
    }
    else if ( abs_num >= 1e+3 ) {
      root_num = num / 1e+3;
      suffix   = 'K';
    }
    else {
      root_num = num;
      suffix  = __blank;
    }
    return root_num.toPrecision( __3 ) + suffix;
  }
  // END public method /makeMetricStr/

  // BEGIN Public prereq method /makePadNumStr/
  // Summary   : makePadNumStr( <number>, <count> )
  // Purpose   : Pad an int with 0s for <count> digits
  // Example   : makePadNumStr( 25, 3 ) return '025';
  // Arguments :
  //   <number> - the number to pad
  //   <count>  - the number of digits to fill
  // Returns   : A trimmed and padded string
  // Throws    : none
  //
  function makePadNumStr( arg_num, arg_count ) {
    var
      num   = castNum( arg_num,   __undef ),
      count = castInt( arg_count, __undef ),

      sign_int, num_str, zero_count;

    if ( num === __undef ) { return __blank; }
    if ( ! ( count && count >= __0 ) ) {
      return __Str( num ).trim();
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
  // END Public prereq method /makePadNumStr/

  // BEGIN public prereq method /makeEscRxStr/
  // Summary   : makeEscRxStr( <string> ) {
  // Purpose   : Escapes a regular expression string
  // Example   : makeEscRxStr( '[]' ) // returns '\[\]\'
  // Arguments : <string> to escape
  // Returns   : Escaped regular expression string
  // Throws    : none
  //
  // JSLint capable str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  // See http://stackoverflow.com/questions/3115150
  //
  function makeEscRxStr( arg_str ) {
    var str = castStr( arg_str, __blank );
    return str.replace( /[\-\[\]\{\}\(\)\*\+\?\.\,\\\^\$|#\s]/g, '\\$&' );
  }
  // END Public prereq method /makeEscRxStr/

  // BEGIN Public prereq method /makeRxObj/
  // Summary   : makeRxObj( <pattern>, <options> )
  // Purpose   : Create a regular expression object
  // Example   : makeRxObj( '\s*hello\s*', 'i' );
  // Arguments :
  //   <pattern> - a string to convert into a regexp
  //   <options> - an option string
  // Returns   : A regular expression object
  // Throws    : none
  //
  function makeRxObj ( arg_pattern_str, arg_option_str ) {
    var
      pattern_str = castStr( arg_pattern_str, __blank ),
      option_str  = castStr( arg_option_str )
      ;

    if ( option_str ) {
      return new RegExp( pattern_str, option_str );
    }
    return new RegExp( pattern_str );
  }
  // END Public prereq method /makeRxObj/

  // BEGIN Public prereq method /makeScrubStr/
  function makeScrubStr ( arg_str, arg_do_space ) {
    var
      raw_str    = castStr(  arg_str, __blank ),
      do_space   = castBool( arg_do_space ),
      interm_str = do_space
        ? raw_str[ vMap._replace_ ]( topCmap._tag_end_rx_, ' ' )
        : raw_str;

    interm_str = interm_str[ vMap._trim_ ]();
    return interm_str[ vMap._replace_ ]( topCmap._tag_rx_, __blank );
  }
  // END Public prereq method /makeScrubStr/

  // BEGIN Public prereq method /makeUcFirstStr/
  function makeUcFirstStr ( arg_str ) {
    var
      str    = castStr( arg_str, __blank ),
      uc_str = str.charAt( __0 ).toUpperCase()
      ;
    return uc_str + str[ vMap._substr_ ]( __1 );
  }
  // END Public prereq method /makeUcFirstStr/
  // == END PREREQ METHODS ============================================

  // == BEGIN UTILITY OBJECTS =========================================
  // BEGIN define logObj singleton
  logObj = (function () {
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
        _error_  : __3,
        _warn_   : __4,
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
    /* istanbul ignore next */
    try { consoleRef = global.console; }
    catch ( error ) {
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

    function getLogLevel () { return levelKey; }

    // This follows syslog level conventions
    function logMsg () {
      var
        arg_list  = makeArgList( arguments ),
        level_key = castStr( arg_list[ __0 ], __blank ),
        level_idx = levelXIdxMap[ level_key ],
        arg_count = arg_list[ __length ],

        level_cmd
        ;

      if ( arg_count < __2 ) { return __false; }
      if ( level_idx === __undef ) {
        arg_list[ vMap._unshift_ ](
          '_log_level_not_supported_:|' + level_key + '|'
        );

        arg_list[ vMap._shift_ ]();
        level_key = '_error_';
        level_idx = levelXIdxMap[ level_key ];
        arg_list[ vMap._unshift_]( level_key );
      }

      if ( level_idx > levelIdx ) { return __false; }
      level_cmd = levelXCmdMap[ level_key ];

      // Try to log the best we know how
      //noinspection UnusedCatchParameterJS
      /* istanbul ignore next */
      try {
        consoleRef[ level_cmd ][ vMap._apply_ ]( consoleRef, arg_list );
      }
      // The only problem that may cause a failure is if the log
      // command can not handle more than a single argument or will not
      // allow the apply method (think: IE). We try our best...
      //
      catch ( e0 ) {
        //noinspection UnusedCatchParameterJS
        try  {
          consoleRef[ level_cmd ]( arg_list[ __1 ] );
        }
        // Everything failed. We give up.
        catch ( e1 ) { return __false; }
      }
      return __true;
    }

    return {
      _setLogLevel_ : setLogLevel,
      _getLogLevel_ : getLogLevel,
      _logMsg_      : logMsg
    };
  }());
  // END define logObj singleton
  // == END UTILITY METHODS ===========================================

  // == BEGIN PUBLIC METHODS ==========================================
  // BEGIN Public method /clearMap/
  function clearMap ( arg_map ) {
    var
      map = castMap( arg_map ),

      key_list, key_count, idx, key;

    if ( ! map ) { return; }

    key_list  = __keys( map );
    key_count = key_list[ __length ];

    for ( idx = __0; idx < key_count; idx++ ) {
      key = key_list[ idx ];
      if ( map[ vMap._hasOwnProp_ ]( key ) ) {
        delete map[ key ];
      }
    }
    return map;
  }
  // END Public method /clearMap/

  // BEGIN Public method /encodeHtml/
  // Purpose : This is single pass encoder for html entities and handles
  //   an arbitrary number of characters to encode.
  // Examples:
  //   | str = encodeHtml( "<h1>'Help me!'</h1> she said" );
  //   | __logMsg( 'info', str );
  //   > &lt;h1&ht;&quot;Help me!&quot;&lt;/h1&gt; she said.'
  //
  //   | str = encodeHtml( "<h1>'Help me!'</h1> & fast!", false );
  //   | __logMsg( 'info', str );
  //   > &lt;h1&ht;&quot;Help me!&quot;&lt;/h1&gt; &amp; fast!'
  //
  //   | str = encodeHtml( "<h1>'Help me!'</h1> & fast!", true );
  //   | __logMsg( 'info', str );
  //   > &lt;h1&ht;&quot;Help me!&quot;&lt;/h1&gt; & fast!'
  //
  // Arguments ( positional )
  //   0 : arg_str (req) - The HTML string to encode
  //   1 : arg_do_exclude_amp (opt, default = false ) : Exclude ampersands
  //       from encoding.
  //
  function encodeHtml ( arg_str, arg_do_exclude_amp ) {
    var
      source_str     = castStr(  arg_str, __blank   ),
      do_exclude_amp = castBool( arg_do_exclude_amp ),

      match_fn, match_rx, lookup_map
      ;

    match_fn = function ( key ) {
      return lookup_map[ key ] /* istanbul ignore next */ || __blank;
    };

    lookup_map = topCmap._encode_html_map_;
    match_rx   = do_exclude_amp
      ? topCmap._encode_noamp_rx_ : topCmap._encode_html_rx_;

    return source_str.replace( match_rx, match_fn );
  }
  // END Public method /encodeHtml/

  // BEGIN utilities /getBasename/ and /getDirname/
  // Purpose   : Returns the last bit of a path
  // Example   : getBasename('/Common/demo99/192.168.11_97_demo1')
  //             returns '192.168.11.97_demo1'
  // Arguments : ( positional )
  //   0 - (required) Path string
  //   1 - (optional) Delimeter string (default is /)
  //
  function getBaseDirname( arg_path_str, arg_delim_str ) {
    var
      context_str = this,
      path_str    = castStr( arg_path_str, __blank ),
      delim_str   = castStr( arg_delim_str, '/'    ),
      rx_obj      = context_str === '_base_'
        ? makeRxObj( '([^'  + delim_str + ']*)$' )
        : makeRxObj( '^(.*' + delim_str + ')[^' + delim_str + ']*$' ),
      match_list
      ;

    if ( path_str === __blank ) { return path_str; }

    match_list = path_str[ vMap._match_ ]( rx_obj );
    return ( match_list && match_list[ __1 ] ) || __blank;
  }
  getBasename = getBaseDirname[ vMap._bind_ ]( '_base_' );
  getDirname  = getBaseDirname[ vMap._bind_ ]( '_dir_'  );
  // END utilities /getBasename/ and /getDirname/

  // BEGIN Public method /getListAttrIdx/
  function getListAttrIdx ( arg_map_list, arg_key, data ) {
    var
      map_list = castList( arg_map_list, [] ),
      key      = castStr(  arg_key, __blank ),

      map_count = map_list[ __length ],
      found_idx  = __n1,
      idx, row_map, row_key_list
      ;

    for ( idx = __0; idx < map_count; idx++ ) {
      row_map = map_list[ idx ];
      if ( __typeof( row_map ) !== 'object' ) { continue; }

      // This is similar to but not the same as hasOwnProperty.
      // This prevents false positives when sparse maps do not have
      // the requested key.
      row_key_list = __keys( row_map );
      if ( row_key_list[ vMap._indexOf_ ]( key ) === __n1 ) { continue; }

      if ( row_map[ key ] === data ) {
        found_idx = idx;
        break;
      }
    }
    return found_idx;
  }
  // END Public method /getListAttrIdx/

  // BEGIN Public methd /getListAttrMap/
  function getListAttrMap ( arg_list, key_name, key_val ) {
    var
      list     = castList( arg_list, [] ),
      list_idx = getListAttrIdx( list, key_name, key_val );
    return list_idx > __n1 ? list[ list_idx ] : __undef;
  }
  // END Public method /getListAttrMap/

  // BEGIN Public method /getListDiff/
  // Purpose : Find all elements common between two lists.
  //   Do _not_ do a deep comparison; two similar lists or maps
  //   will be reported as different unless they point the the same
  //   data structure.
  //
  // Returns: A list of elements in the order of unique
  //   elements found in the first list followed by unique
  //   elements found in the second.
  //
  function getListDiff ( arg0_list, arg1_list ) {
    var
      first_list  = castList( arg0_list, [] ),
      second_list = castList( arg1_list, [] ),
      list_1, list_2
      ;

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

  // BEGIN Public method /getListValCount/
  function getListValCount ( arg_list, arg_data ) {
    var
      input_list  = castList( arg_list, [] ),
      input_count = input_list[ __length ],
      match_count = __0,
      idx;

    for ( idx = input_count; idx; __0 ) {
      //noinspection IncrementDecrementResultUsedJS
      if ( input_list[ --idx ] === arg_data ) { match_count++; }
    }
    return match_count;
  }
  // END Public method /getListValCount/

  // BEGIN Public method /getLogObj/
  function getLogObj () { return logObj; }
  // END Public method /getlogObj/

  // BEGIN Public method /getStructData/
  // Purpose   : Get a deep structure attribute value
  // Example   : _getStructData_({ foo : { bar : 'hi!' }}, ['foo','bar']);
  //   Returns 'hi!'
  // Arguments :
  //   * base_struct - An array or map to add a value
  //   * path_list   - A list of map or array keys in order of depth
  // Returns   :
  //   * Success - Requested value
  //   * Failure - undefined
  // Cautions  : The key list limit is set to __100. If this
  //   is met, a warning is logged and __undef returned.
  //
  function getStructData ( base_struct, arg_path_list ) {
    var
      walk_struct = base_struct,
      path_list   = castList( arg_path_list, [] ),
      is_good     = __true,
      key_count   = path_list[ __length ],

      idx, raw_key, struct_type, key
      ;

    if ( key_count > __100 ) {
      logObj._logMsg_( '_warn_', '_maximum_recursion_limit_' );
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
  // END Public method /getStructData/

  // BEGIN Public method /getTzOffsetMs/
  function getTzOffsetMs ( arg_do_recalc ) {
    var
      do_recalc = castBool( arg_do_recalc, __false ),
      date_obj  = getTzDateObj();

    if ( do_recalc || topSmap._tz_offset_ms_ === __undef ) {
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
    return ( match_list && match_list[ __1 ] )
      ? match_list[ __1 ] : __blank;
  }
  // END Public method /getTzCode/

  // BEGIN Public method /makeClockStr/
  // Purpose   : Create HH:MM:SS time string from UTC time integer in ms
  // Example   : clock_str = makeClockStr( 1465621376000 ); // '05:02:56'
  // Arguments : ( positional )
  //   0 - int (required) time_ms  UTC time in milliseconds
  //   1 - int (optional) show_idx Precision.
  //     0 === show HH:MM:SS << default
  //     1 === show HH:MM
  //     2 === show HH
  // Returns   : String
  // Cautions  :
  //   Remember to use your local timezone offset if you want to
  //   show local time. Example:
  //       tz_offset_ms = aMap._util_._getTzOffsetMs_(),
  //       local_ms     = raw_utc_ms - tz_offset_ms;
  //
  function makeClockStr ( arg_time_ms, arg_show_idx ) {
    var
      time_ms   = castInt( arg_time_ms,  __0 ),
      show_idx  = castInt( arg_show_idx, __0 ),
      sec_ms    = topCmap._sec_ms_,
      min_sec   = topCmap._min_sec_,
      hrs_min   = topCmap._hrs_min_,
      day_hrs   = topCmap._day_hrs_,

      raw_sec_int = __floor( time_ms / sec_ms + __d5 ),
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
  // Purpose   : Convert a number into a string optimized for readability
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
  function makeCommaNumStr ( arg_map ) {
    var
      map             = castMap( arg_map, {} ),
      input_num       = castNum( map._input_num_,       __0 ),
      round_limit_exp = castInt( map._round_limit_exp_, __3 ),
      round_unit_exp  = castInt( map._round_unit_exp_,  __3 ),
      round_unit_str  = castStr( map._round_unit_str_,  'k' ),
      round_dec_count = castInt( map._round_dec_count_, __1 ),

      round_limit_num = vMap._Math_.pow( __10, round_limit_exp  ),
      round_unit_num  = vMap._Math_.pow( __10, round_unit_exp   ),

      solve_suffix = __blank,

      solve_num, solve_str, solve_list, list_count, idx
      ;

    if ( vMap._fnGetAbs_( input_num ) >= round_limit_num ) {
      solve_num    = input_num / round_unit_num;
      solve_suffix = round_unit_str;
      solve_str    = solve_num[ vMap._toFixed_]( round_dec_count );
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
  // Purpose   : Create a string from a date object
  //   or a UTC time number (in milliseconds).
  // Examples:
  // 1. makeDateStr({ _date_obj_ : new Date() });
  //    Returns a string like '2016-09-18'
  // 2. makeDateStr({ _date_obj_ : new Date(), _do_time_ : true });
  //    Returns a string like '2016-09-18 12:45:52'
  // 3. makeDateStr({ _date_ms_ : 1474311626050 })
  //    Returns '2016-09-19'
  //
  // Arguments :
  //   * _date_obj_ : A valid date object.
  //   * _date_ms_  : A date time in ms.
  //     If neither date_obj or date_ms is provided, will use the
  //       current date.
  //     If BOTH are provided, _date_ms_ will be used in
  //       preference to date_obj.
  //   * _do_time_ : (opt) A boolean. Default is false.
  //
  function makeDateStr ( arg_map ) {
    var
      map       = castMap(  arg_map, {} ),
      do_time   = castBool( map._do_time_, __false ),
      date_ms   = castInt(  map._date_ms_, __undef ),

      date_obj  = castObj( 'Date', map._date_obj_ ),
      mns       = makePadNumStr,

      yrs_int,   mon_int,   day_int,
      hrs_int,   min_int,   sec_int,
      date_list, date_str,  time_list,
      time_str
      ;

    if ( date_ms ) {
      // new Date( ms ) does not work in node 4.4.3
      date_obj = new Date();
      date_obj.setTime( date_ms );
    }
    if ( ! date_obj ) { return __blank; }

    yrs_int = __Num( date_obj.getYear()  ) + topCmap._offset_yr_;
    mon_int = __Num( date_obj.getMonth() ) + __1;
    day_int = __Num( date_obj.getDate()  );

    date_list = [
      mns( yrs_int, __4 ),
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

  // BEGIN Public method /makeDebounceFn/
  // Purpose : Return a function that will fire after
  //   delay_ms milliseconds of inactivity.
  //
  function makeDebounceFn ( arg_map ) {
    var
      map      = castMap(  arg_map, {} ),
      fn       = castFn(   map._fn_ ),
      delay_ms = castInt(  map._delay_ms_ ),
      do_asap  = castBool( map._do_asap_, __false ),
      ctx_data = map._ctx_data_ || this,
      delay_toid
      ;

    if ( ! ( fn && delay_ms ) ) { return; }

    return function () {
      var arg_list = makeArgList( arguments );
      if ( do_asap && ! delay_toid ) { fn.apply( ctx_data, arg_list ); }
      clearTimeout( delay_toid );
      delay_toid = __setTo( function() {
        if ( ! do_asap ) { fn.apply( ctx_data, arg_list ); }
        delay_toid = __undef;
      }, delay_ms );
    };
  }
  // END Public method /makeDebounceFn/

  // BEGIN Public method /makeThrottleFn/
  // Purpose : Return a function that will fire once per
  //   delay_ms milliseconds. It fires immediately on first
  //   call.
  //
  function makeThrottleFn ( arg_map ) {
    var
      map      = castMap(  arg_map, {} ),
      fn       = castFn(   map._fn_ ),
      delay_ms = castInt(  map._delay_ms_, __0 ),
      ctx_data = map._ctx_data_,
      last_ms  = __0,
      delay_toid;

    if ( ! ( fn && delay_ms ) ) { return; }

    return function () {
      var
        arg_list = makeArgList( arguments ),
        now_ms   = getNowMs(),
        delta_ms = delay_ms - ( now_ms - last_ms )
        ;

      if ( delta_ms <= __0 ) {
        // A timeout id should never be defined except in race conditions
        /* istanbul ignore next */
        if ( delay_toid ) { clearTimeout( delay_toid ); }
        fn.apply( ctx_data, arg_list );
        delay_toid = __undef;
        last_ms    = now_ms;
        return;
      }

      if ( delay_toid ) { return; }
      delay_toid = __setTo(
        function () {
          fn.apply( ctx_data, arg_list );
          delay_toid = __undef;
          last_ms    = now_ms;
        },
        delta_ms
      );
    };
  }
  // END Public method /makeThrottleFn/

  // BEGIN Public method /makeEllipsisStr/
  // Purpose : Shorten a string to a maximum length and append ellipsis
  //   if it is exceeded.
  // Example   :
  //   makeEllipsisStr({
  //     _input_str_      : 'hee haw and the boys',
  //     _char_limit_int_ : 10,
  //     _do_word_break_  : true
  //   });
  //   // returns 'hee haw ...'
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
      map           = castMap( arg_map, {} ),
      scrub_str     = makeScrubStr( map._input_str_,  __false ),
      limit_int     = castInt(  map._char_limit_int_,     __0 ),
      do_word_break = castBool( map._do_word_break_,   __true ),
      scrub_count   = scrub_str[ __length ],

      word_list,   word_count,
      solve_count, solve_list,
      idx,         solve_word
      ;

    if ( ! ( limit_int && limit_int > __3 ) ) { return __blank; }

    if ( scrub_count <= limit_int ) { return scrub_str; }

    if ( do_word_break ) {
      word_list   = scrub_str[ vMap._split_ ]( ' ' );
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
      return __blank + solve_list[ vMap._join_ ]( ' ' );
    }

    return scrub_str.substr(__0, limit_int - __3 ) + '...';
  }
  // END Public method /makeEllipsisStr/

  // BEGIN Public method /makeErrorObj/
  // Purpose   : A convenient method to create an error object
  // Arguments :
  //   * name_text - the error name
  //   * msg_text  - long error message
  //   * data      - optional data attached to error object
  // Returns   : newly constructed error object
  // Throws    : none
  //
  function makeErrorObj ( arg_name, arg_msg, arg_data ) {
    var
      name = ( arg_name && __Str( arg_name ) ) || 'error',
      msg  = ( arg_msg  && __Str( arg_msg  ) ) || __blank,
      data = arg_data || __undef,
      error_obj = new Error();

    error_obj.name        = aKey + ':' + name;
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

  // BEGIN Public method /makeMapUtilObj/
  // Purpose  : Creates a thread-safe map utility object
  //   useful to streamlining list.map() functions and
  //   avoiding nesting.
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
  // This is an excellent example of how a closure creates
  // unique private variables in each instance returned, such
  // as the stored argList, resultMap, and mapFn.
  //
  //
  function makeMapUtilObj () {
    var resultMap, argList, mapFn;

    function getArgList   (          ) { return argList;                  }
    function getMapFn     (          ) { return mapFn;                    }
    function getResultMap (          ) { return resultMap;                }
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
      _setResultMap_ : setResultMap,
      _setArgList_   : setArgList,
      _setMapFn_     : setMapFn,
      _invokeFn_     : invokeFn
    };
  }
  // END Public method /makeMapUtilObj/

  // BEGIN Public method /makeOptionHtml/
  // Arguments : ( named )
  //    * _select_list_ : (opt) List of values to be of selected
  //      This is useful for multi-select fields.
  //    * _title_map_   : (opt) val_x_title map
  //    * _val_list_    : (opt) List of values to process
  // Output    :
  //    * List of options as used in a select statement
  function makeOptionHtml ( arg_map ) {
    var
      map         = castMap(  arg_map, {} ),
      label_map   = castMap(  map._label_map_,   {} ),
      select_list = castList( map._select_list_, [] ),
      val_list    = castList( map._val_list_,    [] ),
      val_count   = val_list[ __length ],
      html_str    = __blank,

      idx, val_data, val_str, label_str
      ;

    _OPTION_: for ( idx = __0; idx < val_count; idx++ ) {
      val_data = val_list[ idx ];
      val_str  = castStr( val_data, __blank );
      if ( val_str === __blank ) { continue _OPTION_; }
      label_str = label_map[ val_str ] || makeUcFirstStr( val_str );

      html_str += '<option value="' + val_str + '"';
      if ( select_list[ vMap._indexOf_ ]( val_data ) !== __n1 ) {
        html_str += ' selected="selected"';
      }
      html_str += '>' + label_str + '</option>';
    }
    return html_str;
  }
  // END Public method /makeOptionHtml/

  // BEGIN Public method /makePctStr/
  // Purpose   : Convert a decimal ratio into a readable % string
  // Example   :
  //   my_pct = makePctStr( 0.529863, 1 );
  // Arguments : ( positional )
  //   0 : (required) A ratio, usually less than 1.
  //   1 : (optional) Number of decimal points to return.
  //       Default value is 0.
  //
  function makePctStr ( arg_ratio, arg_dcount ) {
    var
      ratio  = castNum( arg_ratio,  __0 ),
      dcount = castNum( arg_dcount, __0 )
      ;

    dcount = dcount < __0 ? __0 : __floor( dcount );
    return ( ratio * __100 )[ vMap._toFixed_ ]( dcount ) + '%';
  }
  // END Public method /makePctStr/

  // BEGIN Public method /makeRadioHtml/
  // Purpose : make an array of checkboxes from a list
  //
  function makeRadioHtml ( arg_map ) {
    var
      map        = castMap(  arg_map, {} ),
      group_name = castStr(  map._group_name_ ),    // name=...
      match_str  = castStr(  map._match_str_  ),    // Selected val
      val_list   = castList( map._val_list_,  [] ), // Vals in order
      label_map  = castMap(  map._label_map_, {} ), // Labels

      val_count  = val_list[ __length ],
      html_str   = __blank,

      idx, val_str, label_str
      ;

    _RADIO_: for ( idx = __0; idx < val_count; idx++ ) {
      val_str   = castStr( val_list[ idx ], __blank );
      if ( val_str === __blank ) { continue _RADIO_; }

      label_str = label_map[ val_str ] || makeUcFirstStr( val_str );

      html_str
        += '<label>'
          + '<input type="radio" name="' + group_name
          + '" value="' + val_str + '"'
          ;
       if ( val_str === match_str ) { html_str += ' checked="checked"'; }
       html_str += '/>' + label_str + '</label>';
    }
    return html_str;
  }
  // END Public method /makeRadioHtml/

  // BEGIN Public method /makeReplaceFn/
  // Purpose   : Return a high-performance function that
  //   replaces a single symbol with a predefined value.
  // Example   :
  //   fn = makeReplaceFn( 'x', 'fred' );
  //   __logMsg( 'info', fn('you do not know {x}.') );
  //   // Prints 'you do not know fred.'
  // Arguments : ( positional )
  //  0 - search_str : A string to use to search. It is wrapped
  //    in '{_<search_str>_}'
  //  1 - value_str : Replacement value
  //
  function makeReplaceFn ( arg_search_str, arg_value_str ) {
    var
      search_str = castStr( arg_search_str, __blank ),
      value_str  = castStr( arg_value_str,  __blank ),
      escape_str = makeEscRxStr( '{' + search_str + '}' ),
      search_rx  = makeRxObj( escape_str, 'g' )
      ;

    return function ( arg_tmplt ) {
      var tmplt = castStr( arg_tmplt, __blank );
      return tmplt[ vMap._replace_ ]( search_rx, value_str );
    };
  }
  // END Public method /makeReplaceFn/

  // BEGIN Public method /makeSeenMap/
  // Purpose : Convert arg_key_list into a map with each key assigned
  // the value of arg_seen_data. If not provided, arg_seen_data === true
  //
  function makeSeenMap ( arg_key_list, arg_seen_data ) {
    var
      key_list  = castList( arg_key_list, [] ),
      key_count = key_list[ __length ],

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
  // Purpose : Concatenate a number of key-values
  // into a single string
  function makeStrFromMap ( arg_map ) {
    var
      map       = castMap(  arg_map, {} ),
      prop_map  = castMap(  map._prop_map_, {} ),
      key_list  = castList( map._key_list_, [] ),
      delim_str = castStr( map._delim_str_, ' ' ),
      label_delim_str = castStr( map._label_delim_str_, ': ' ),
      label_map = castMap( map._label_map_, __undef ),

      do_label   = !! ( label_map || map._do_label_ ),
      key_count  = key_list[ __length ],
      solve_list = [],

      idx, prop_key, prop_str, label_str
      ;

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
    return solve_list[ vMap._join_ ]( delim_str ) + __blank;
  }
  // END Public method /makeStrFromMap/

  // BEGIN Public method /makeSeriesMap/
  // Purpose   : Create a list of time labels quantitized to match
  //   standard time intervals
  // Example   :
  //   series_map = makeSeriesMap({
  //     _max_ms_       : 1465459980000,
  //     _min_ms_       : 1465452840000,
  //     _tgt_count_    : 12,
  //     _tz_offset_ms_ : 25200000
  //   });
  // Arguments :
  //   _max_ms_       : (req) int start UTC time in milliseconds
  //   _min_ms_       : (req) int end UTC time in milliseconds
  //   _tgt_count_    : (req) int desired number of divisions (+/- 50%)
  //   _tz_offset_ms_ : (req) int UTC offset for timezone
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
  //      _show_idx_   : 1,
  //      _unit_count_ : 12,
  //      _unit_ms_    : 600000,
  //      _unit_name_  : '10m',
  //      _unit_ratio_ : 0.084033613445378,
  //    }
  //
  //    _date_list_  = list of dates and position of date labels
  //    _left_ratio_ = starting postion of time stamps
  //    _show_idx_   = precision of time to show; 0=HH, 1=HH:MM, 2=HH:MM:SS
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
      map          = castMap( arg_map, {} ),
      tz_offset_ms = castInt( map._tz_offset_ms_, __0 ),
      max_ms       = castInt( map._max_ms_ - tz_offset_ms, __0 ),
      min_ms       = castInt( map._min_ms_ - tz_offset_ms, __0 ),
      tgt_count    = castInt( map._tgt_count_ ),

      date_obj     = new __Date(),
      offset_str   = makeClockStr( tz_offset_ms ),
      offset_list  = offset_str[ vMap._split_ ](':'),

      span_ms,         uni_ms_list,  unit_count,
      btm_idx,         top_idx,      last_btm_idx,
      last_top_idx,    btm_count,    top_count,
      expand_ratio,

      jdx, idx,        check_idx,    check_map,
      check_count,     mod_unit_ms,  offset_ms,
      width_ratio,     left_ratio,   accum_ratio,
      date_ms,         date_offset,

      solve_map,       solve_ms,     solve_str,
      solve_time_list, solve_date_list
      ;

    // Get the time span and a list of available units
    span_ms     = max_ms - min_ms;
    uni_ms_list = topCmap._unit_ms_list_;
    unit_count  = uni_ms_list[ __length ];

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
          + __floor( ( ( top_idx - btm_idx ) / __2 ) + nMap._d5_ );
        check_map   = uni_ms_list[ check_idx ];
        check_count = __floor( ( span_ms / check_map._ms_ ) + nMap._d5_);
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
          _show_idx_   : check_map._show_idx_,
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
      solve_date_list[ __push ]({
        _date_str_    : makeDateStr({ _date_ms_ : date_ms }),
        _width_ratio_ : width_ratio
      });
      date_offset = __0;
      date_ms += topCmap._day_ms_;
    }
    solve_map._date_list_ = solve_date_list;

    solve_time_list = [];
    while ( left_ratio < __1 ) {
      solve_ms  = __floor( left_ratio * span_ms ) + min_ms;
      solve_str = makeClockStr( solve_ms, solve_map._show_idx_ );
      solve_time_list[ __push ]( solve_str );
      left_ratio += solve_map._unit_ratio_;
    }
    solve_map._time_list_ = solve_time_list;

    return solve_map;
  }
  // END Public function /makeSeriesMap/

  // BEGIN Public method /makeTmpltStr/
  // Purpose   : Replace symbols in a template surrounded by braces
  //   '{}' with the symbol provided in the lookup map.
  // Example   :
  //  out_str = makeTmpltStr({
  //    _input_str_  : '{_name_} says "{_saying_}"',
  //    _lookup_map_ : { _name_ : 'Fred', _saying_ : 'hello!' }
  //  });
  //  // out_str is 'Fred says hello!'
  //
  // Arguments : ( named )
  //   _input_str_  : A string template like so:
  //      'This person name {_p1_} said to the other person {_p2_}'
  //   _lookup_map_ : A map of values to replace, like so:
  //      { _p1_ : 'fred', _p2_ : 'barney' }
  // Throws    : none
  // Returns
  //   The filled-out template string
  //
  makeTmpltStr = (function () {
    //noinspection JSUnusedLocalSymbols
    function lookupFn ( match_str, lookup_name ) {
      var
        return_data  = this, // lookup_map
        lookup_list  = lookup_name.split( '.' ),
        lookup_count = lookup_list.length,
        idx, key_name
        ;

      for ( idx = 0; idx < lookup_count; idx++ ) {
        key_name = lookup_list[ idx ];
        return_data = ( return_data && return_data[ key_name ] );
      }
      return castStr( return_data, __blank );
    }

    function mainFn ( arg_map ) {
      var
        map        = castMap( arg_map, {} ),
        input_str  = castStr( map._input_str_, __blank  ),
        lookup_map = castMap( map._lookup_map_,      {} ),

        tmplt_rx   = map._tmplt_rx_ || topCmap._tmplt_rx_,
        bound_fn   = lookupFn.bind( lookup_map )
        ;

      return input_str[ vMap._replace_ ]( tmplt_rx, bound_fn );
    }
    return mainFn;
  }());
  // END Public method /makeTmpltStr/

  // BEGIN Public method /mergeMaps/
  // Purpose : Merge properties of extend_map into base_map
  //
  // Warning : The extend map is not deep copied. If you wish
  // to copy deep references:
  //   extend_map = cloneData( src_map );
  //   merge_map  = mergeMaps( base_map, extend_map );
  //
  function mergeMaps( arg_base_map, arg_extend_map, arg_attr_list ) {
    var
      base_map   = castMap(  arg_base_map,   {} ),
      extend_map = castMap(  arg_extend_map, {} ),
      attr_list  = castList( arg_attr_list ),

      key_list   = __keys( extend_map ),
      key_count  = key_list[ __length ],

      idx, key
      ;

    _KEY_: for ( idx = __0; idx < key_count; idx++ ) {
      key = key_list[ idx ];
      if ( attr_list && attr_list[ vMap._indexOf_ ]( key ) === __n1 ) {
        logObj._logMsg_(
          '_warn_', '_key_not_supported_:|' + __Str( key ) + '|'
        );
        continue _KEY_;
      }
      base_map[ key ] = extend_map[ key ];
    }
    return base_map;
  }
  // END Public method /mergeMaps/

  // BEGIN Public method /pollFunction/
  // Purpose : Run the <arg_fn> function every <arg_ms> milliseconds
  //   either <arg_count> number of times or until the function
  //   returns __false, whichever comes first.
  // Arguments ( positional )
  //   0 : fn        : function to poll, return false to stop polling
  //   1 : ms        : time between function invocation
  //   2 : count     : (optional) Maximum number of times to run the function.
  //   3 : finish_fn : (optional) function to invoke at completion
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
      idx     = __0,
      main_fn
      ;

    if ( ! poll_fn ) { return __false; }

    main_fn = function () {
      __setTo( function() {
        var do_next;
        if ( count && idx >= count ) {
          return finish_fn && finish_fn();
        }
        do_next = poll_fn( idx );
        idx++;
        if ( do_next !== __false ) { main_fn(); }
      }, ms );
    };

    main_fn();
    return __true;
  }
  // END Public method /pollFunction/

  // BEGIN Public method /pushUniqListVal/
  function pushUniqListVal ( arg_list, data ) {
    var input_list = castList( arg_list, [] );
    if ( input_list[ vMap._indexOf_ ]( data ) === __n1 ) {
      input_list[ __push ]( data );
    }
  }
  // END Public method /pushUniqListVal/

  // BEGIN Public method /rmListVal/
  function rmListVal ( arg_list, arg_data ) {
    var
      input_list   = castList( arg_list, [] ),
      input_count  = input_list[ __length ],
      rm_count     = __0,
      idx;

    for ( idx = input_count; idx; __0 ) {
      //noinspection IncrementDecrementResultUsedJS
      if ( input_list[ --idx ] === arg_data ) {
        input_list[ vMap._splice_ ]( idx, __1 );
        rm_count++;
        idx++;
      }
    }
    return rm_count;
  }
  // END Public method /rmUniqListVal/

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
  //
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
      int_next_key
      ;

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

      if ( ! walk_struct[ vMap._hasOwnProp_ ]( solve_key ) ) {
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
  // END Public method /setStructData/

  // BEGIN public method /shuffleList/
  // Purpose : Shuffle elements in an array
  //
  // Returns : boolean
  //  * true  : Shuffle successful
  //  * false : Shuffle not successful
  //
  function shuffleList ( arg_list ) {
    var
      list  = castList( arg_list ),

      count,   n,        rnd_idx,
      idx,     swap_data;

    if ( ! list ) { return __false; }

    count = list[ __length ];
    // Count down from end of array + 1
    for ( n = count; n > nMap._0_; n-- ) {
      // randomly select from list ( will be between 0 and n - 1 )
      rnd_idx = __floor( __random() * n );
      idx = n - __1;

      // swap values ( idx may === rnd_idx )
      swap_data       = list[ idx ];
      list[ idx ]     = list[ rnd_idx ];
      list[ rnd_idx ] = swap_data;
    }
    // End count down...
    return __true;
  }
  // END public method /shuffleList/

  // BEGIN public method /trimStrList/
  trimStrList = ( function () {
    function mapFn( data ) {
      return getVarType( data ) === '_String_'
        ? data[ vMap._trim_ ]() : data;
    }
    function mainFn ( arg_list ) {
      var list = castList( arg_list );
      if ( ! list ) { return arg_list; }
      return list[ vMap._map_ ]( mapFn );
    }
    return mainFn;
  }());
  // END utility /trimStrList/

  // == END PUBLIC METHODS ============================================

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

      _encode_html_rx_  : /[&"'><]/g,
      _encode_noamp_rx_ : /["'><]/g,
      _encode_html_map_ : {
        '&' : '&#38;',
        '"' : '&#34;',
        "'" : '&#39;',
        '>' : '&#62;',
        '<' : '&#60;'
      },

      _comma_rx_  : makeRxObj( '(\\d)(?=(\\d\\d\\d)+(?!\\d))', 'g' ),
      _tag_end_rx_: makeRxObj( '(</[^>]+>)+', 'g' ),
      _tag_rx_    : makeRxObj( '</?[^>]+>', 'g' ),
      _tmplt_rx_  : makeRxObj( '{([^{}]+[^\\\\])}','g' ),
      _tzcode_rx_ : makeRxObj( '\\(([A-Za-z\\s].*)\\)' ),
      _unit_ms_list_ : [
        { _str_ : '0.1s',  _ms_ :      100, _show_idx_ : __0 },
        { _str_ : '0.25s', _ms_ :      250, _show_idx_ : __0 },
        { _str_ : '0.5s',  _ms_ :      500, _show_idx_ : __0 },
        { _str_ : '1s',    _ms_ :     1000, _show_idx_ : __0 },
        { _str_ : '2.5s',  _ms_ :     2500, _show_idx_ : __0 },
        { _str_ : '5s',    _ms_ :     5000, _show_idx_ : __0 },
        { _str_ : '10s',   _ms_ :    10000, _show_idx_ : __0 },
        { _str_ : '15s',   _ms_ :    15000, _show_idx_ : __0 },
        { _str_ : '30s',   _ms_ :    30000, _show_idx_ : __0 },
        { _str_ : '1m',    _ms_ :    60000, _show_idx_ : __1 },
        { _str_ : '2.5m',  _ms_ :   150000, _show_idx_ : __0 },
        { _str_ : '5m',    _ms_ :   300000, _show_idx_ : __1 },
        { _str_ : '10m',   _ms_ :   600000, _show_idx_ : __1 },
        { _str_ : '15m',   _ms_ :   900000, _show_idx_ : __1 },
        { _str_ : '30m',   _ms_ :  1800000, _show_idx_ : __1 },
        { _str_ : '1hr',   _ms_ :  3600000, _show_idx_ : __1 },
        { _str_ : '2hr',   _ms_ :  7200000, _show_idx_ : __1 },
        { _str_ : '4hr',   _ms_ : 14400000, _show_idx_ : __1 },
        { _str_ : '6hr',   _ms_ : 21600000, _show_idx_ : __1 },
        { _str_ : '8hr',   _ms_ : 28800000, _show_idx_ : __1 },
        { _str_ : '12hr',  _ms_ : 43200000, _show_idx_ : __2 },
        { _str_ : '1d',    _ms_ : 86400000, _show_idx_ : __2 },
        { _str_ : '2d',    _ms_ : 86400000*2, _show_idx_ : __2 },
        { _str_ : '4d',    _ms_ : 86400000*4, _show_idx_ : __2 },
        { _str_ : '1wk',   _ms_ : 86400000*7, _show_idx_ : __2 }
      ]
    };
    /* istanbul ignore next */
    try {
      topSmap._has_jq_ = !! jQuery;
    }
    catch ( error ) {
      topSmap._has_jq_ = __false;
    }
  }
  initModule();
  // END initialize module

  aMap._util_ = {
    _getVarType_      : getVarType,

    _castBool_        : castBool,
    _castFn_          : castFn,
    _castInt_         : castInt,
    _castJQ_          : castJQ,
    _castList_        : castList,
    _castMap_         : castMap,
    _castNum_         : castNum,
    _castObj_         : castObj,
    _castStr_         : castStr,
    _cloneData_       : cloneData,
    _getNowMs_        : getNowMs,
    _getNumSign_      : getNumSign,
    _makeArgList_     : makeArgList,
    _makePadNumStr_   : makePadNumStr,
    _makeEscRxStr_    : makeEscRxStr,
    _makeRxObj_       : makeRxObj,
    _makeScrubStr_    : makeScrubStr,
    _makeUcFirstStr_  : makeUcFirstStr,

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
    _getTzOffsetMs_   : getTzOffsetMs,
    _makeClockStr_    : makeClockStr,
    _makeCommaNumStr_ : makeCommaNumStr,
    _makeDateStr_     : makeDateStr,
    _makeDebounceFn_  : makeDebounceFn,
    _makeEllipsisStr_ : makeEllipsisStr,
    _makeErrorObj_    : makeErrorObj,
    _makeGuidStr_     : makeGuidStr,
    _makeMapUtilObj_  : makeMapUtilObj,
    _makeMetricStr_   : makeMetricStr,
    _makeOptionHtml_  : makeOptionHtml,
    _makePctStr_      : makePctStr,
    _makeRadioHtml_   : makeRadioHtml,
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
    _setStructData_   : setStructData,
    _shuffleList_     : shuffleList,
    _trimStrList_     : trimStrList
  };
};
// == END MODULE __NS._makeUtil_ ======================================
