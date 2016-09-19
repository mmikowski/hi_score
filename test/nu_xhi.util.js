/*
 * nu_xhi.util.js
 * Node unit test suite for xhi.util.js
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint        browser : true, continue : true,
  devel : true,  indent : 2,      maxerr : 50,
 newcap : true,   nomen : true, plusplus : true,
 regexp : true,  sloppy : true,     vars : false,
  white : true,    todo : true,  unparam : true
*/
/*global xhi */

// ================= BEGIN MODULE SCOPE VARIABLES ===================
//noinspection MagicNumberJS
'use strict';

require('../js/xhi.js');
require('../js/xhi.util.js');

var
  vMap = xhi._vMap_,
  nMap = xhi._nMap_,

  __null  = vMap._null_,
  __undef = vMap._undefined_,
  __blank = vMap._blank_,
  __Str   = vMap._String_,

  __n1 = nMap._n1_,
  __0  = nMap._0_,
  __1  = nMap._1_,
  __2  = nMap._2_,
  __3  = nMap._3_
  ;
// ================== END MODULE SCOPE VARIABLES ====================

// ================ BEGIN NODEUNIT TEST FUNCTIONS ===================
function cloneData( test_obj ) {
  var
    assert_list = [
      __1, -694567, __blank, __0, __null, __undef, 5.062e12,
      'A string',
      /a regex object/,
      [ 'a', 'simple', 'array' ],
      { a : 'simple', b : 'map' },
      [ 'a', { complex : 'array' } ],
      { a : 'complex', name_list : [ 'tim', 'bob' ], map: { this : 'that' } }
    ],
    assert_count = assert_list.length,
    clone_fn     = xhi._util_._cloneData_,

    msg_str, idx, assert_data, cloned_data
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    assert_data = assert_list[ idx ];
    cloned_data = clone_fn( assert_data );
    msg_str = JSON.stringify( assert_data ) + '  <<==>> '
      + JSON.stringify( cloned_data );
    test_obj.deepEqual(  assert_data, cloned_data, msg_str );
  }
  test_obj.done();
}

function getBasename ( test_obj ) {
  var
    assert_list = [
      { arg_list : [], basename : __blank, dirname : __blank },
      { arg_list : [ __undef ], basename : __blank, dirname : __blank },
      { arg_list : [ __null  ], basename : __blank, dirname : __blank },
      { arg_list : [ 'default_delim' ],
        basename : 'default_delim', dirname : __blank },
      { arg_list : [ 'no/slash/word' ],
        basename : 'word', dirname : 'no/slash/' },
      { arg_list : [ '/slash/word'        ],
        basename : 'word', dirname : '/slash/' },
      { arg_list : [ 'no/slash/word', ',' ],
        basename : 'no/slash/word', dirname : __blank },
      { arg_list : [ 'no,slash,word', ',' ],
        basename : 'word', dirname : 'no,slash,' },
      { arg_list : [ ':colon:word:',  ',' ],
        basename : ':colon:word:', dirname : __blank },
      { arg_list : [ ':colon:word:',  ':' ],
        basename : __blank, dirname : ':colon:word:' },
      { arg_list : [ ':colon:word',   ':' ],
        basename : 'word', dirname: ':colon:' }
    ],
    assert_count = assert_list.length,
    basename_fn  = xhi._util_._getBasename_,
    dirname_fn   = xhi._util_._getDirname_,

    idx, assert_map, msg_str, basename, dirname
    ;

  test_obj.expect( assert_count * __2 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    assert_map = assert_list[ idx ];

    basename = basename_fn.apply( __undef, assert_map.arg_list );
    msg_str = __Str( idx ) + '. ' + basename + ' === ' + assert_map.basename;
    test_obj.ok( basename === assert_map.basename, msg_str );

    dirname = dirname_fn.apply( __undef, assert_map.arg_list );
    msg_str = __Str( idx ) + '. ' + dirname + ' === ' + assert_map.dirname;
    test_obj.ok( dirname === assert_map.dirname, msg_str );
  }
  test_obj.done();
}

function getDeepMapVal ( test_obj ) {
  var
    deep_map_0   = { foo : { bar : __1 } },
    deep_map_1   = { bing : { bang : 'string' }, list : [ __1, __2 ] },
    assert_list  = [
      { arg_list : [ __null,  [ 'foo', 'bar' ] ], data : __undef },
      { arg_list : [ __undef, [ 'foo', 'bar' ] ], data : __undef },
      { arg_list : [ 'foofy', [ 'foo', 'bar' ] ], data : __undef },
      { arg_list : [ deep_map_0, [ 'foo', 'bar' ] ], data : __1 },
      { arg_list : [ deep_map_0, [ 'foo' ] ], data : deep_map_0.foo },
      { arg_list : [ deep_map_0, [] ], data : deep_map_0 },
      { arg_list : [ deep_map_1, [ 'bing' ] ], data : deep_map_1.bing },
      { arg_list : [ deep_map_1, [ 'bing', 'bang' ] ], data : 'string' },
      { arg_list : [ deep_map_1, [ 'list'] ], data : deep_map_1.list  },
      { arg_list : [ deep_map_1, [] ], data : deep_map_1 }
    ],
    assert_count = assert_list.length,
    deep_fn      = xhi._util_._getDeepMapVal_,

    idx, assert_map, msg_str, return_data
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    assert_map  = assert_list[ idx ];
    return_data = deep_fn.apply( __undef, assert_map.arg_list );
    msg_str     = __Str( idx ) + '. '
      + __Str( return_data ) + ' <===> ' + __Str( assert_map.data );

    test_obj.deepEqual( return_data, assert_map.data, msg_str );
  }
  test_obj.done();
}

function getListAttrIdx ( test_obj ) {
  var
    test_list  = [
      { foo : __1, bar : 'string' },
      { foo : __2, bar : 'foofy' },
      __undef,
      { biz : 'cart',  bang: __null },
      { biz : __undef, bang: __null }
    ],
    assert_list  = [
      { arg_list : [ test_list, 'foo', __1 ], idx : __0 },
      { arg_list : [ test_list, 'foo', __2 ], idx : __1 },
      { arg_list : [ test_list, 'foo', __3 ], idx : __n1  },
      { arg_list : [ test_list, 'bar', 'string' ], idx : __0 },
      { arg_list : [ test_list, 'bar', 'foofy' ], idx : __1 },
      { arg_list : [ test_list, 'bar', 'poopy' ], idx : __n1 },
      { arg_list : [ test_list, 'bang', __null ], idx : __3  },
      { arg_list : [ test_list, 'bang', __undef ], idx : __n1 },
      { arg_list : [ test_list, 'biz',  __undef ], idx : 4 }
    ],

    assert_count = assert_list.length,
    get_idx_fn    = xhi._util_._getListAttrIdx_,
    get_map_fn    = xhi._util_._getListAttrMap_,

    idx,        assert_map,  msg_str,
    return_idx, solve_map,   return_map
    ;

  test_obj.expect( assert_count * __2 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    assert_map  = assert_list[ idx ];

    return_idx = get_idx_fn.apply( __undef, assert_map.arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( return_idx ) + ' === ' + __Str( assert_map.idx );
    test_obj.ok( return_idx === assert_map.idx, msg_str );

    solve_map  = test_list[ return_idx ];
    return_map = get_map_fn.apply( __undef, assert_map.arg_list );
    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( return_map ) + ' === '
      + JSON.stringify( solve_map )
      ;
    test_obj.ok( return_map === solve_map, msg_str );

  }
  test_obj.done();
}

function getListDiff ( test_obj ) {
  var
    map_01  = { boo: 'bob' },
    map_02  = { boo: 'bob' },

    list_01 = [ 1, 2, 3, 4 ],
    list_02 = [ 'fred', 1, 2, 3, 4 ],
    list_03 = [ 1, 2, 3, 4, 'fred'],
    list_04 = [ map_01, 1, 2, 3, 4 ],
    list_05 = [ 1, 2, 3, 4, map_01 ],
    list_06 = [ map_01 ],
    list_07 = [ map_02 ],
    list_08 = [ 1,2,3, map_02 ],
    list_09 = [ 1,2,3, map_01 ],
    assert_list  = [
      { arg_list : [ list_01, list_01 ], list : [] },
      { arg_list : [ list_01, list_02 ], list : [ 'fred' ] },
      { arg_list : [ list_02, list_03 ], list : [] },
      { arg_list : [ list_03, list_04 ], list : [ 'fred', map_01 ] },
      { arg_list : [ list_04, list_05 ], list : [] },
      { arg_list : [ list_05, list_06 ], list : [ 1,2,3,4 ] },
      { arg_list : [ list_06, list_07 ], list : [ map_01, map_02] },
      { arg_list : [ list_07, list_08 ], list : [ 1,2,3 ] },
      { arg_list : [ list_08, list_09 ], list : [ map_01, map_02 ] },
      { arg_list : [ list_09, list_09 ], list : [] }
    ],

    assert_count = assert_list.length,
    get_diff_fn   = xhi._util_._getListDiff_,

    idx, assert_map,  diff_list, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    assert_map  = assert_list[ idx ];

    diff_list = get_diff_fn.apply( __undef, assert_map.arg_list );
    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( diff_list ) + ' <===> '
      + JSON.stringify( assert_map.list );

    test_obj.deepEqual( diff_list, assert_map.list, msg_str );
  }
  test_obj.done();
}

function getNowMs ( test_obj ) {
  var
    now_ms = xhi._util_._getNowMs_(),
    rx     = /^[\d]{13}$/;

  test_obj.expect( __1 );
  test_obj.ok( rx.test( now_ms.toString() ), 'Timestamp has 13 digits');
  test_obj.done();
}

function getNumSign ( test_obj ) {
  var
    assert_list  = [
      { arg_list : [ __0 ], num : __1 },
      { arg_list : [ __1 ], num : __1 },
      { arg_list : [ __n1], num : __n1 },
      { arg_list : [ 25  ], num : __1 },
      { arg_list : [ 3.28e24 ], num : __1 },
      { arg_list : [ -4562 ], num : __n1 },
      { arg_list : [ -0.000001 ], num : __n1 },
      { arg_list : [ 2e5 - 2e4 ], num : __1 },
      { arg_list : [ 2e4 - 2e5 ], num : __n1 },
      { arg_list : [ 'fred'    ], num : 'NaN' }
    ],

    assert_count = assert_list.length,
    get_sign_fn   = xhi._util_._getNumSign_,

    idx, assert_map,  num_sign, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    assert_map  = assert_list[ idx ];

    num_sign = get_sign_fn.apply( __undef, assert_map.arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( num_sign ) + ' === ' + __Str( assert_map.num );
    if ( isNaN( num_sign ) ) { num_sign = 'NaN'; }

    test_obj.ok( num_sign === assert_map.num, msg_str );
  }
  test_obj.done();
}

function makeArgList ( test_obj ) {
  var
    assert_list  = [
      // Single arg var types
      { arg_list : [ __undef  ] },
      { arg_list : [ __blank  ] },
      { arg_list : [ __null   ] },
      { arg_list : [ 'fred'   ] },
      { arg_list : [ 3.248e24 ] },
      { arg_list : [ { map : 'string' } ] },
      { arg_list : [ [ 'a','list','words' ] ] },

      // Permutations
      { arg_list : [ __undef, __blank ] },
      { arg_list : [ __undef, __null  ] },
      { arg_list : [ __undef, 'fred'  ] },
      { arg_list : [ __undef, 3.248e24 ] },
      { arg_list : [ __undef, { map : 'string' } ] },
      { arg_list : [ __undef, [ 'a','list','words' ] ] },

      { arg_list : [ __blank, __undef ] },
      { arg_list : [ __blank, __null  ] },
      { arg_list : [ __blank, 'fred'  ] },
      { arg_list : [ __blank, 3.248e24 ] },
      { arg_list : [ __blank, { map : 'string' } ] },
      { arg_list : [ __blank, [ 'a','list','words' ] ] },

      { arg_list : [ __null, __undef  ] },
      { arg_list : [ __null, __blank  ] },
      { arg_list : [ __null, 'fred'   ] },
      { arg_list : [ __null, 3.248e24 ] },
      { arg_list : [ __null, { map : 'string' } ] },
      { arg_list : [ __null, [ 'a','list','words' ] ] },

      { arg_list : [ 'fred', __undef  ] },
      { arg_list : [ 'fred', __blank  ] },
      { arg_list : [ 'fred', __null   ] },
      { arg_list : [ 'fred', 3.248e24  ] },
      { arg_list : [ 'fred', { map : 'string' } ] },
      { arg_list : [ 'fred', [ 'a','list','words' ] ] },

      { arg_list : [ 3.248e24, __undef  ] },
      { arg_list : [ 3.248e24, __blank  ] },
      { arg_list : [ 3.248e24, __null   ] },
      { arg_list : [ 3.248e24, 'fred'   ] },
      { arg_list : [ 3.248e24, { map : 'string' } ] },
      { arg_list : [ 3.248e24, [ 'a','list','words' ] ] },

      { arg_list : [ { map : 'string' }, __undef  ] },
      { arg_list : [ { map : 'string' }, __blank  ] },
      { arg_list : [ { map : 'string' }, __null   ] },
      { arg_list : [ { map : 'string' }, 'fred'   ] },
      { arg_list : [ { map : 'string' }, 3.248e24 ] },
      { arg_list : [ { map : 'string' }, [ 'a','list','words' ] ] },

      { arg_list : [ [ 'a','list','words' ], __undef  ] },
      { arg_list : [ [ 'a','list','words' ], __blank  ] },
      { arg_list : [ [ 'a','list','words' ], __null   ] },
      { arg_list : [ [ 'a','list','words' ], 'fred'   ] },
      { arg_list : [ [ 'a','list','words' ], 3.248e24 ] },
      { arg_list : [ [ 'a','list','words' ], { map : 'string' } ] },

      { arg_list : [ __1 , 'fred' ] },
      { arg_list : [ { name: 'fred', list : [1,2,3] }, __undef ] },
      { arg_list : [ 3.28e24, { a : 'map'}, [ 'list','of','words'] ] },
      { arg_list : [ { param_1 : 'one', param_2 : { a : 'map'} } ] }
    ],

    assert_count = assert_list.length,
    get_args_fn  = function () {
      return xhi._util_._makeArgList_( arguments );
    },

    idx, assert_map, arg_list, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    assert_map  = assert_list[ idx ];

    arg_list = get_args_fn.apply( __undef, assert_map.arg_list );
    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( arg_list ) + ' <===> '
      + JSON.stringify( assert_map.arg_list );

    test_obj.deepEqual( arg_list, assert_map.arg_list, msg_str );
  }
  test_obj.done();
}

function makeClockStr ( test_obj ) {
  var
    assert_list  = [
      { arg_list : [ 1473980001000    ], str : '22:53:21' },
      { arg_list : [ 1473980001000, 1 ], str : '22:53' },
      { arg_list : [ 1473980001000, 2 ], str : '22' }
    ],

    assert_count = assert_list.length,
    make_str_fn   = xhi._util_._makeClockStr_,

    idx, assert_map, clock_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    assert_map  = assert_list[ idx ];

    clock_str   = make_str_fn.apply( __undef, assert_map.arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( clock_str ) + ' === ' + __Str( assert_map.str );

    test_obj.ok( clock_str === assert_map.str, msg_str );
  }
  test_obj.done();
}

function makeCommaNumStr ( test_obj ) {
  var
    assert_list  = [
      { arg_map : { _input_num_ :        10 }, str :        '10' },
      { arg_map : { _input_num_ :       100 }, str :       '100' },
      { arg_map : { _input_num_ :      1000 }, str :      '1.0k' },
      { arg_map : { _input_num_ :      1950 }, str :      '1.9k' },
      { arg_map : { _input_num_ :      1951 }, str :      '2.0k' },
      { arg_map : { _input_num_ :      1999 }, str :      '2.0k' },
      { arg_map : { _input_num_ :   1000000 }, str :  '1,000.0k' },
      { arg_map : { _input_num_ :       -10 }, str :       '-10' },
      { arg_map : { _input_num_ :      -100 }, str :      '-100' },
      { arg_map : { _input_num_ :     -1000 }, str :     '-1.0k' },
      { arg_map : { _input_num_ :  -1000000 }, str : '-1,000.0k' },

      { arg_map : { _round_limit_exp_: 6, _round_unit_exp_ : 6,
        _round_unit_str_ : 'm', _round_dec_count_ : 3,
        _input_num_ : 10 }, str : '10' },
      { arg_map : { _round_limit_exp_: 6, _round_unit_exp_ : 6,
        _round_unit_str_ : 'm', _round_dec_count_ : 3,
        _input_num_ : 1234000 }, str : '1.234m' }
    ],

    assert_count = assert_list.length,
    make_str_fn   = xhi._util_._makeCommaNumStr_,

    idx, assert_map, comma_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    assert_map  = assert_list[ idx ];

    comma_str   = make_str_fn.apply( __undef, [ assert_map.arg_map ] );
    msg_str    = __Str( idx ) + '. '
      + __Str( comma_str ) + ' === ' + __Str( assert_map.str );

    test_obj.ok( comma_str === assert_map.str, msg_str );
  }
  test_obj.done();
}

function makeDateStr( test_obj ) {
  test_obj.expect( __0 );
  test_obj.done();

}

function getVarType( test_obj ) {
  var
    // this is a hack to get around jslint warnings
    ob = Boolean, oa = Array, os = String,
    on = Number,  // oo = Object,

    und1 = __undef,
    msg_str,

    bool1 = true,
    list1 = [ 'a','b','c' ],
    null1 = null,
    num1  = 25,
    str1  = 'cde',
    obj1  = { length : 12 },

    bool2 = new ob(),
    list2 = new oa(),
    num2  = new on(),
    str2  = new os(),
    d_obj = new Date(),

    get_type_fn = xhi._util_._getVarType_;

  test_obj.expect( 12 );

  msg_str = 'Should match expected type';

  test_obj.ok( get_type_fn( und1  ) === '_Undefined_', msg_str );
  test_obj.ok( get_type_fn( null1 ) === '_Null_',      msg_str );
  test_obj.ok( get_type_fn( bool1 ) === '_Boolean_',   msg_str );
  test_obj.ok( get_type_fn( str1  ) === '_String_',    msg_str );
  test_obj.ok( get_type_fn( num1  ) === '_Number_',    msg_str );
  test_obj.ok( get_type_fn( list1 ) === '_Array_',     msg_str );
  test_obj.ok( get_type_fn( obj1  ) === '_Object_',    msg_str );
  test_obj.ok( get_type_fn( bool2 ) === '_Boolean_',   msg_str );
  test_obj.ok( get_type_fn( str2  ) === '_String_',    msg_str );
  test_obj.ok( get_type_fn( num2  ) === '_Number_',    msg_str );
  test_obj.ok( get_type_fn( list2 ) === '_Array_',     msg_str );
  test_obj.ok( get_type_fn( d_obj ) === 'Date',    msg_str );

  test_obj.done();
}
// ======== END NODEUNIT TEST FUNCTIONS ===========

module.exports = {
  _cloneData_       : cloneData,
  _getBasename_     : getBasename,     // Includes getDirname
  _getDeepMapVal_   : getDeepMapVal,
  _getListAttrIdx_  : getListAttrIdx,  // Include getListAttrMap
  _getListDiff_     : getListDiff,
  _getNowMs_        : getNowMs,
  _getNumSign_      : getNumSign,
  _getVarType_      : getVarType,
  _makeArgList_     : makeArgList,
  _makeClockStr_    : makeClockStr,
  _makeCommaNumStr_ : makeCommaNumStr,
  _makeDateStr_     : makeDateStr
 // _makeEllipsisStr_ : makeElipsisStr,
 // _makeErrorObj_    : makeErrorObj,
 // _makeGuidStr_     : makeGuidStr,
 // _makeListPlus_    : makeListPlus,
 // _makeMapUtilObj_  : makeMapUtilObj,
 // _makePadNumStr_   : makePadNumStr,
 // _makePctStr_      : makePctStr,
 // _makeRxObj_       : makeRxObj,
 // _makeSeenMap_     : makeSeenMap,
 // _makeSeriesMap_   : makeSeriesMap,
 // _makeStrFromMap_  : makeStrFromMap,
 // _makeTmpltStr_    : makeTmpltStr,
 // _makeUcFirstStr_  : makeUcFirstStr,
 // _mergeMaps_       : mergeMaps,
 // _pollFunction_    : pollFunction,
 // _rmAllObjKeys_    : rmAllObjKeys,
 // _scrubHtmlTags_   : scrubHtmlTags,
 // _setCmap_         : setCmap,
 // _setDeepMapVal_   : setDeepMapVal
};

// Defer
// _getLogUtilObj_   : getLogUtilObj,
// _getTzOffsetMs_   : getTzOffsetMs,
// _getTzCode_       : getTzCode,
