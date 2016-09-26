/*
 * nu_xhi.util.js
 * Node unit test suite for xhi.util.js
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint           node : true, continue : true,
  devel : true,  indent : 2,      maxerr : 50,
 newcap : true,   nomen : true, plusplus : true,
 regexp : true,  sloppy : true,     vars : false,
  white : true,    todo : true,  unparam : true
*/
/*global xhi, module */

// ================= BEGIN MODULE SCOPE VARIABLES ===================
//noinspection MagicNumberJS
'use strict';

require('../js/xhi.js');
require('../js/xhi.util.js');

var
  vMap = xhi._vMap_,
  nMap = xhi._nMap_,


  __blank = vMap._blank_,
  __false = vMap._false_,
  __null  = vMap._null_,
  __Str   = vMap._String_,
  __true  = vMap._true_,
  __undef = vMap._undefined_,

  __n1 = nMap._n1_,
  __0  = nMap._0_,
  __1  = nMap._1_,
  __2  = nMap._2_,
  __3  = nMap._3_,
  __4  = nMap._4_,

  nuFn = function () { console.log( 'nu:' + this , arguments ); },
  mockTestObj = {
    done   : nuFn.bind( 'done'   ),
    expect : nuFn.bind( 'expect' ),
    ok     : nuFn.bind( 'ok'     ),
    test   : nuFn.bind( 'test'   )
  }
  ;
// ================== END MODULE SCOPE VARIABLES ====================

// ==================== BEGIN UTILITY METHODS =======================
// ===================== END UTILITY METHODS ========================

// ================ BEGIN NODEUNIT TEST FUNCTIONS ===================
function clearMap( test_obj ) {
  //noinspection JSUnusedGlobalSymbols
  var
    proto = { do_fn : function () { return 1; } },
    complex_obj = Object.create( proto ),
    assert_list = [
      // arg_data, expect_data
      [ __1,        __undef ],
      [ -694567,    __undef ],
      [ __blank,    __undef ],
      [ __null,     __undef ],
      [ __undef,    __undef ],
      [ 5.062e12,   __undef ],
      [ __0,        __undef ],
      [ /regex/,    __undef ],
      [ 'string',   __undef ],
      [ [ 1,2,3 ],  __undef ],
      [ complex_obj, proto  ],
      [ new Date(), __undef ],
      [ [ 'a', { complex : 'array' } ], __undef ],
      [ { a : 'simple', b : 'map' }, {} ],
      [ { a : 'complex', map : { this : 'that' },
        name_list : [ 'tim', 'bob' ] }, {} ]
    ],
    assert_count = assert_list.length,
    test_fn      = xhi._util_._clearMap_,

    msg_str,  idx,         expect_list,
    arg_data, expect_data, solve_data
    ;

  complex_obj.this = '1';
  complex_obj.that = '2';

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_data    = expect_list[ __0 ];
    expect_data = expect_list[ __1 ];
    solve_data  = test_fn( arg_data );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_data ) + '\n solve_map: '
      + JSON.stringify( solve_data )
      + '\n expect_map: ' + JSON.stringify( expect_data )
      ;
    test_obj.ok(
      JSON.stringify( solve_data ) === JSON.stringify( expect_data ), msg_str
    );
  }
  test_obj.done();
}

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
    msg_str = __Str( idx ) + '. '
      + JSON.stringify( assert_data ) + ' <<==>> '
      + JSON.stringify( cloned_data );
    test_obj.deepEqual(  assert_data, cloned_data, msg_str );
  }
  test_obj.done();
}

function getBasename ( test_obj ) {
  var
    assert_list = [
      // [ arg_list, basename, dirname ]
      [ [], __blank, __blank ],
      [ [ __undef ], __blank, __blank ],
      [ [ __null  ], __blank, __blank ],
      [ [ 'default_delim' ], 'default_delim', __blank ],
      [ [ 'no/slash/word' ], 'word', 'no/slash/' ],
      [ [ '/slash/word'   ], 'word', '/slash/' ],
      [ [ 'no/slash/word', ',' ], 'no/slash/word', __blank ],
      [ [ 'no,slash,word', ',' ], 'word', 'no,slash,' ],
      [ [ ':colon:word:',  ',' ], ':colon:word:', __blank ],
      [ [ ':colon:word:',  ':' ], __blank, ':colon:word:' ],
      [ [ ':colon:word',   ':' ], 'word', ':colon:' ]
    ],
    assert_count = assert_list.length,
    basename_fn  = xhi._util_._getBasename_,
    dirname_fn   = xhi._util_._getDirname_,

    idx, expect_list, arg_list, expect_basename, expect_dirname,
    msg_str, solve_basename, solve_dirname
    ;

  test_obj.expect( assert_count * __2 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list  = expect_list[ __0 ];
    expect_basename = expect_list[ __1 ];
    expect_dirname  = expect_list[ __2 ];

    solve_basename = basename_fn.apply( __undef, arg_list );
    msg_str = __Str( idx ) + '. ' + solve_basename + ' === ' + expect_basename;
    test_obj.ok( solve_basename === expect_basename, msg_str );

    solve_dirname = dirname_fn.apply( __undef, arg_list );
    msg_str = __Str( idx ) + '. ' + solve_dirname + ' === ' + expect_dirname;
    test_obj.ok( solve_dirname === expect_dirname, msg_str );
  }
  test_obj.done();
}

function getDeepMapVal ( test_obj ) {
  var
    deep_map_0   = { foo : { bar : __1 } },
    deep_map_1   = { bing : { bang : 'string' }, list : [ __1, __2 ] },
    assert_list  = [
      // [ arg_list, expect_data ]
      [ [ __null,  [ 'foo', 'bar' ] ], __undef ],
      [ [ __undef, [ 'foo', 'bar' ] ], __undef ],
      [ [ 'foofy', [ 'foo', 'bar' ] ], __undef ],
      [ [ deep_map_0, [ 'foo', 'bar' ] ], __1 ],
      [ [ deep_map_0, [ 'foo' ] ], deep_map_0.foo ],
      [ [ deep_map_0, [] ], deep_map_0 ],
      [ [ deep_map_1, [ 'bing' ] ], deep_map_1.bing ],
      [ [ deep_map_1, [ 'bing', 'bang' ] ], 'string' ],
      [ [ deep_map_1, [ 'list'] ], deep_map_1.list  ],
      [ [ deep_map_1, [] ], deep_map_1 ]
    ],
    assert_count = assert_list.length,
    deep_fn      = xhi._util_._getDeepMapVal_,

    idx, expect_list, arg_list, expect_data, solve_data, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_data  = expect_list[ __1 ];
    solve_data = deep_fn.apply( __undef, arg_list );
    msg_str     = __Str( idx ) + '. '
      + __Str( solve_data ) + ' <===> ' + __Str( expect_data );
    test_obj.deepEqual( solve_data, expect_data, msg_str );
  }
  test_obj.done();
}

function getListAttrIdx ( test_obj ) {
  var
    map_list  = [
      { foo : __1, bar : 'string' },
      { foo : __2, bar : 'foofy' },
      __undef,
      { biz : 'cart',  bang: __null },
      { biz : __undef, bang: __null }
    ],
    assert_list  = [
      // [ arg_list, expect_data ]
      [ [ map_list, 'foo', __1 ], __0 ],
      [ [ map_list, 'foo', __2 ], __1 ],
      [ [ map_list, 'foo', __3 ], __n1  ],
      [ [ map_list, 'bar', 'string' ], __0 ],
      [ [ map_list, 'bar', 'foofy' ], __1 ],
      [ [ map_list, 'bar', 'poopy' ], __n1 ],
      [ [ map_list, 'bang', __null ], __3  ],
      [ [ map_list, 'bang', __undef ], __n1 ],
      [ [ map_list, 'biz',  __undef ], __4 ]
    ],

    assert_count = assert_list.length,
    get_idx_fn   = xhi._util_._getListAttrIdx_,
    get_map_fn   = xhi._util_._getListAttrMap_,
    check_count  = __0,

    idx,          expect_list,  arg_list,
    expect_idx,   msg_str,      solve_idx,

    expect_map,   solve_map
    ;

  test_obj.expect( assert_count * __2 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_idx   = expect_list[ __1 ];

    solve_idx = get_idx_fn.apply( __undef, arg_list );
    msg_str    = __Str( check_count ) + '. '
      + __Str( solve_idx ) + ' === ' + __Str( expect_idx );
    test_obj.ok( solve_idx === expect_idx, msg_str );
    check_count++;

    expect_map = map_list[ expect_idx ];
    solve_map  = get_map_fn.apply( __undef, arg_list );
    msg_str    = __Str( check_count ) + '. '
      + JSON.stringify( solve_map ) + ' === '
      + JSON.stringify( expect_map )
      ;
    test_obj.ok( solve_map === expect_map, msg_str );
    check_count++;
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
      // [ arg_list, expect_data ]
      [ [ list_01, list_01 ], [] ],
      [ [ list_01, list_02 ], [ 'fred' ] ],
      [ [ list_02, list_03 ], [] ],
      [ [ list_03, list_04 ], [ 'fred', map_01 ] ],
      [ [ list_04, list_05 ], [] ],
      [ [ list_05, list_06 ], [ 1,2,3,4 ] ],
      [ [ list_06, list_07 ], [ map_01, map_02] ],
      [ [ list_07, list_08 ], [ 1,2,3 ] ],
      [ [ list_08, list_09 ], [ map_01, map_02 ] ],
      [ [ list_09, list_09 ], [] ]
    ],

    assert_count = assert_list.length,
    get_diff_fn   = xhi._util_._getListDiff_,

    idx, expect_list, arg_list, expect_data, solve_data, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_data  = expect_list[ __1 ];
    solve_data = get_diff_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( solve_data ) + ' <===> '
      + JSON.stringify( expect_data );

    test_obj.deepEqual( solve_data, expect_data, msg_str );
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
      // [ arg_list, expect_data ]
      [ [ __0 ],       __1  ],
      [ [ __1 ],       __1  ],
      [ [ __n1],       __n1 ],
      [ [ 25  ],       __1  ],
      [ [ 3.28e24 ],   __1  ],
      [ [ -4562 ],     __n1 ],
      [ [ -0.000001 ], __n1 ],
      [ [ 2e5 - 2e4 ], __1  ],
      [ [ 2e4 - 2e5 ], __n1 ],
      [ [ 'fred'    ], __1  ]
    ],

    assert_count = assert_list.length,
    get_sign_fn   = xhi._util_._getNumSign_,

    idx,        expect_list,  arg_list,
    expect_int, solve_int,    msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_int   = expect_list[ __1 ];

    solve_int = get_sign_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_int ) + ' === ' + __Str( expect_int );

    test_obj.ok( solve_int === expect_int, msg_str );
  }
  test_obj.done();
}

function makeArgList ( test_obj ) {
  var
    assert_list  = [
      // Single arg var types
      [ __undef  ],
      [ __blank  ],
      [ __null   ],
      [ 'fred'   ],
      [ 3.248e24 ],
      [ { map : 'string' } ],
      [ [ 'a','list','words' ] ],

      // Permutations
      [ __undef, __blank ],
      [ __undef, __null  ],
      [ __undef, 'fred'  ],
      [ __undef, 3.248e24 ],
      [ __undef, { map : 'string' } ],
      [ __undef, [ 'a','list','words' ] ],

      [ __blank, __undef ],
      [ __blank, __null  ],
      [ __blank, 'fred'  ],
      [ __blank, 3.248e24 ],
      [ __blank, { map : 'string' } ],
      [ __blank, [ 'a','list','words' ] ],

      [ __null, __undef  ],
      [ __null, __blank  ],
      [ __null, 'fred'   ],
      [ __null, 3.248e24 ],
      [ __null, { map : 'string' } ],
      [ __null, [ 'a','list','words' ] ],

      [ 'fred', __undef  ],
      [ 'fred', __blank  ],
      [ 'fred', __null   ],
      [ 'fred', 3.248e24  ],
      [ 'fred', { map : 'string' } ],
      [ 'fred', [ 'a','list','words' ] ],

      [ 3.248e24, __undef  ],
      [ 3.248e24, __blank  ],
      [ 3.248e24, __null   ],
      [ 3.248e24, 'fred'   ],
      [ 3.248e24, { map : 'string' } ],
      [ 3.248e24, [ 'a','list','words' ] ],

      [ { map : 'string' }, __undef  ],
      [ { map : 'string' }, __blank  ],
      [ { map : 'string' }, __null   ],
      [ { map : 'string' }, 'fred'   ],
      [ { map : 'string' }, 3.248e24 ],
      [ { map : 'string' }, [ 'a','list','words' ] ],

      [ [ 'a','list','words' ], __undef  ],
      [ [ 'a','list','words' ], __blank  ],
      [ [ 'a','list','words' ], __null   ],
      [ [ 'a','list','words' ], 'fred'   ],
      [ [ 'a','list','words' ], 3.248e24 ],
      [ [ 'a','list','words' ], { map : 'string' } ],

      [ __1 , 'fred' ],
      [ { name: 'fred', list : [1,2,3] }, __undef ],
      [ 3.28e24, { a : 'map'}, [ 'list','of','words'] ],
      [ { param_1 : 'one', param_2 : { a : 'map'} } ]
    ],

    assert_count = assert_list.length,
    get_args_fn  = function () {
      return xhi._util_._makeArgList_( arguments );
    },

    idx, expect_list, solve_list, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    solve_list   = get_args_fn.apply( __undef, expect_list );
    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( solve_list ) + ' <===> '
      + JSON.stringify( expect_list );

    test_obj.deepEqual( solve_list, expect_list, msg_str );
  }
  test_obj.done();
}

function makeClockStr ( test_obj ) {
  var
    assert_list  = [
      // [ arg_list, expect_data ]
      [ [ 1473980001000    ], '22:53:21' ],
      [ [ 1473980001000, 1 ], '22:53' ],
      [ [ 1473980001000, 2 ], '22' ],
      [ [ 1474832093000    ], '19:34:53' ],
      [ [ 1474832093000, 1 ], '19:34' ],
      [ [ 1474832093000, 2 ], '19' ]
    ],

    assert_count = assert_list.length,
    make_str_fn   = xhi._util_._makeClockStr_,

    idx, expect_list, arg_list, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_str   = expect_list[ __1 ];
    solve_str   = make_str_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeCommaNumStr ( test_obj ) {
  var
    assert_list  = [
      // [ arg_map, expect_data ]
      [ { _input_num_ :        10 },        '10' ],
      [ { _input_num_ :       100 },       '100' ],
      [ { _input_num_ :      1000 },      '1.0k' ],
      [ { _input_num_ :      1950 },      '1.9k' ],
      [ { _input_num_ :      1951 },      '2.0k' ],
      [ { _input_num_ :      1999 },      '2.0k' ],
      [ { _input_num_ :   1000000 },  '1,000.0k' ],
      [ { _input_num_ :       -10 },       '-10' ],
      [ { _input_num_ :      -100 },      '-100' ],
      [ { _input_num_ :     -1000 },     '-1.0k' ],
      [ { _input_num_ :  -1000000 }, '-1,000.0k' ],

      [ { _round_limit_exp_: 6, _round_unit_exp_ : 6,
        _round_unit_str_ : 'm', _round_dec_count_ : 3,
        _input_num_ : 10 }, '10' ],
      [ { _round_limit_exp_: 6, _round_unit_exp_ : 6,
        _round_unit_str_ : 'm', _round_dec_count_ : 3,
        _input_num_ : 1234000 }, '1.234m' ]
    ],

    assert_count = assert_list.length,
    make_str_fn  = xhi._util_._makeCommaNumStr_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_map      = expect_list[ __0 ];
    expect_str   = expect_list[ __1 ];

    solve_str   = make_str_fn.apply( __undef, [ arg_map ] );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeDateStr( test_obj ) {
  var
    date_obj     = new Date(),
    assert_list  = [
      // [ arg_map, expect_data ]
      [ { _date_ms_ : 1474323404010 }, '2016-09-19' ],
      [ { _date_ms_ : 1474323404020, _do_time_ : __false },
        '2016-09-19' ],
      [ { _date_ms_ : 1474323404498, _do_time_ : __true  },
        '2016-09-19 15:16:44' ],
      [ { _date_ms_ : 1274323404500 }, '2010-05-19' ],
      [ { _date_ms_ : 1274323404999, _do_time_ : __false }, '2010-05-19' ],
      [ { _date_ms_ : 1274323405000, _do_time_ : __true  },
        '2010-05-19 19:43:25' ],
      [ { _date_ms_  : 1374323405099}, '2013-07-20' ],
      [ { _date_obj_ : date_obj },     '2013-07-20' ],
      [ { _date_ms_ : 1374323405099, _do_time_ : __false  }, '2013-07-20' ],
      [ { _date_obj_ : date_obj,     _do_time_ : __false  }, '2013-07-20' ],
      [ { _date_ms_ : 1374323405099, _do_time_ : __true  },
        '2013-07-20 05:30:05'
      ],
      [ { _date_obj_ : date_obj,     _do_time_ : __true  },
        '2013-07-20 05:30:05'
      ]
    ],

    assert_count = assert_list.length,
    make_str_fn   = xhi._util_._makeDateStr_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  date_obj.setTime( 1374323405099 );
  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_map      = expect_list[ __0 ];
    expect_str   = expect_list[ __1 ];

    solve_str   = make_str_fn( arg_map );
    msg_str     = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }

  test_obj.done();
}

function makeEllipsisStr( test_obj ) {
  var
    str0 = 'Georgey', //7
    str1 = 'Hee haw and the boys', // 20
    str2 = 'Tim knickers and the fem-fatale chicks', // 38
    str3 = '<br>This is by far the longest string. <b>It contains html '
      + 'markup</b> which makes it especially sucky, parse-wise',
    assert_list  = [
      // [ arg_map, expect_str ]
      [ { _input_str_ : __undef }, __blank ],
      [ { _input_str_ : __null  }, __blank ],
      [ { _input_str_ : str1    }, __blank ],
      [ { _input_str_ : str2, _char_limit_int_ : __undef  }, __blank ],
      [ { _input_str_ : __undef, _do_word_break_ : __undef }, __blank ],
      [ { _input_str_ : __null, _do_word_break_ : __false  }, __blank ],
      [ { _input_str_ : str1, _do_word_break_ : __0 }, __blank ],
      [ { _input_str_ : str2, _do_word_break_ : __true,
        _char_limit_int_ : __undef  }, __blank ],
      [ { _input_str_ : str2, _char_limit_int_ : __undef  }, __blank ],
      [ { _input_str_ : str2, _char_limit_int_ : __null  }, __blank ],
      [ { _input_str_ : str2, _char_limit_int_ : __n1  }, __blank ],
      [ { _input_str_ : str2, _char_limit_int_ : __0  }, __blank ],
      [ { _input_str_ : str2, _char_limit_int_ : 'string'  }, __blank ],
      [ { _input_str_ : str0, _char_limit_int_ : 5  }, '...' ],
      [ { _input_str_ : str1, _char_limit_int_ : 5  }, '...' ],
      [ { _input_str_ : str2, _char_limit_int_ : 5  }, '...' ],
      [ { _input_str_ : str3, _char_limit_int_ : 5  }, '...' ],
      [ { _input_str_ : str0, _char_limit_int_ : 10  }, 'Georgey' ],
      [ { _input_str_ : str1, _char_limit_int_ : 10  }, 'Hee ...' ],
      [ { _input_str_ : str2, _char_limit_int_ : 10  }, 'Tim ...' ],
      [ { _input_str_ : str3, _char_limit_int_ : 10  }, 'This ...' ],
      [ { _input_str_ : str0, _char_limit_int_ : 25  }, 'Georgey' ],
      [ { _input_str_ : str1, _char_limit_int_ : 25  },
        'Hee haw and the boys' ],
      [ { _input_str_ : str2, _char_limit_int_ : 25  },
        'Tim knickers and the ...' ],
      [ { _input_str_ : str3, _char_limit_int_ : 25  },
        'This is by far the ...' ],
      [ { _input_str_ : str0, _char_limit_int_ : 40  },
        'Georgey' ],
      [ { _input_str_ : str1, _char_limit_int_ : 40  },
        'Hee haw and the boys' ],
      [ { _input_str_ : str2, _char_limit_int_ : 40  },
        'Tim knickers and the fem-fatale chicks' ],
      [ { _input_str_ : str3, _char_limit_int_ : 40  },
        'This is by far the longest string. ...' ],
      [ { _input_str_ : str3, _char_limit_int_ : 2e2 },
        'This is by far the longest string. It contains html '
        + 'markup which makes it especially sucky, parse-wise'
      ],
      [ { _input_str_ : str0, _do_word_break_ : __false,
        _char_limit_int_ : 5  }, 'Ge...' ],
      [ { _input_str_ : str1, _do_word_break_ : __false,
        _char_limit_int_ : 5  }, 'He...' ],
      [ { _input_str_ : str2, _do_word_break_ : __false,
        _char_limit_int_ : 5  }, 'Ti...' ],
      [ { _input_str_ : str3, _do_word_break_ : __false,
        _char_limit_int_ : 5  }, 'Th...' ],
      [ { _input_str_ : str0, _do_word_break_ : __false,
        _char_limit_int_ : 10  }, 'Georgey' ],
      [ { _input_str_ : str1, _do_word_break_ : __false,
        _char_limit_int_ : 10  }, 'Hee haw...' ],
      [ { _input_str_ : str2, _do_word_break_ : __false,
        _char_limit_int_ : 10  }, 'Tim kni...' ],
      [ { _input_str_ : str3, _do_word_break_ : __false,
        _char_limit_int_ : 10  }, 'This is...' ],
      [ { _input_str_ : str0, _do_word_break_ : __false,
        _char_limit_int_ : 25  }, 'Georgey' ],
      [ { _input_str_ : str1, _do_word_break_ : __false,
        _char_limit_int_ : 25  }, 'Hee haw and the boys' ],
      [ { _input_str_ : str2, _do_word_break_ : __false,
        _char_limit_int_ : 25  }, 'Tim knickers and the f...' ],
      [ { _input_str_ : str3, _do_word_break_ : __false,
        _char_limit_int_ : 25  }, 'This is by far the lon...' ],
      [ { _input_str_ : str0, _do_word_break_ : __false,
        _char_limit_int_ : 40  }, 'Georgey' ],
      [ { _input_str_ : str1, _do_word_break_ : __false,
        _char_limit_int_ : 40  }, 'Hee haw and the boys' ],
      [ { _input_str_ : str2, _do_word_break_ : __false,
        _char_limit_int_ : 40  },
        'Tim knickers and the fem-fatale chicks' ],
      [ { _input_str_ : str3, _do_word_break_ : __false,
        _char_limit_int_ : 40  },
        'This is by far the longest string. It...' ],
      [ { _input_str_ : str3, _do_word_break_ : __false,
        _char_limit_int_ : 2e2 },
        'This is by far the longest string. It contains html '
        + 'markup which makes it especially sucky, parse-wise'
      ]
    ],

    assert_count = assert_list.length,
    make_str_fn   = xhi._util_._makeEllipsisStr_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_map      = expect_list[ __0 ];
    expect_str   = expect_list[ __1 ];

    solve_str = make_str_fn( arg_map );
    msg_str   = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeErrorObj ( test_obj ) {
  var
    key_list     = [ 'name', 'description', 'data' ],
    default_list = [ 'xhi:error', __blank, __undef ],
    assert_list = [
      // [ arg_list, expect_list ]
      [ [], default_list ],
      [ [ __0 ], default_list ],
      [ [ __undef ], default_list ],
      [ [ __0, __0 ], default_list ],
      [ [ __undef, __undef ], default_list ],
      [ [ __null, __undef ], default_list ],
      [ [ __null, __null ], default_list ],
      [ [ __null, __null, __undef ], default_list ],
      [ [ __null, __0, __undef ], default_list ],
      [ [ __undef, __null, __null ], default_list ],
      [ [ '' ], default_list ],
      [ [ '_bad_data_' ], [ 'xhi:_bad_data_', __blank, __undef ] ],
      [ [ __1 ], [ 'xhi:1', __blank, __undef ] ],
      [ [ '_bad_data_', '_the_list_is_missing_' ],
        [ 'xhi:_bad_data_', '_the_list_is_missing_', __undef ]
      ],
      [ [ '_bad_data_', '_the_list_is_missing_', { is : __true } ],
        [ 'xhi:_bad_data_', '_the_list_is_missing_', { is : __true } ]
      ]
    ],

    key_count    = key_list.length,
    assert_count = assert_list.length,
    make_fn      = xhi._util_._makeErrorObj_,
    test_count   = __0,

    idx, expect_list, arg_list, expect_obj, solve_obj,
    idj, expect_key, expect_data, solve_data, msg_str
    ;

  test_obj.expect( assert_count * key_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_obj = expect_list[ __1 ];
    solve_obj   = make_fn.apply( __undef, arg_list );

    for ( idj = __0; idj < key_count; idj++ ) {
      expect_key = key_list[ idj ];
      expect_data = expect_obj[ idj ];
      solve_data  = solve_obj[ expect_key ];
      msg_str    = __Str( test_count ) + '. '
        + JSON.stringify( expect_list )
        + expect_key + ': '
        + JSON.stringify( solve_data ) + ' <==> '
        + JSON.stringify( expect_data );
      test_obj.deepEqual( solve_data, expect_data, msg_str );
      test_count++;
    }
  }
  test_obj.done();
}

function makeGuidStr( test_obj ) {
  var
    seen_map     = {},
    assert_count = 100,
    make_str_fn  = xhi._util_._makeGuidStr_,
    guid_rx      = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/,
    idx, solve_str;


  test_obj.expect( assert_count * __3 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    solve_str = make_str_fn();
    test_obj.ok( ! seen_map[ solve_str ], solve_str + ' is unique' );
    test_obj.ok( solve_str.length === 36, solve_str + ' is correct length' );
    test_obj.ok( guid_rx.test( solve_str ), solve_str + ' matches regex' );
  }

  test_obj.done();
}
function makePadNumStr( test_obj ) {
  var
    assert_list  = [
      [ [ __undef       ], __blank ],
      [ [ __undef, __0  ], __blank ],
      [ [ __null,  __n1 ], __blank ],
      [ [ 'frank'       ], __blank ],
      [ [ '   25', __n1 ], __blank ],
      [ [ '   25', __1  ],    '25' ],
      [ [ '   25', __2  ],    '25' ],
      [ [ '   25', __3  ],   '025' ],
      [ [ '   25', __4  ],  '0025' ],
      [ [ '00025', __n1 ], __blank ],
      [ [ '00025', __1  ],    '25' ],
      [ [ '00025', __2  ],    '25' ],
      [ [ '00025', __3  ],   '025' ],
      [ [ '00025', __4  ],  '0025' ],
      [ [      25, __n1 ], __blank ],
      [ [      25, __1  ],    '25' ],
      [ [      25, __2  ],    '25' ],
      [ [      25, __3  ],   '025' ],
      [ [      25, __4  ],  '0025' ],
      [ [ '-025', __n1 ], __blank  ],
      [ [ '-025', __1  ],   '-25'  ],
      [ [ '-025', __2  ],   '-25'  ],
      [ [ '-025', __3  ],   '-25'  ],
      [ [ '-025', __4  ],  '-025'  ],
      [ [ '-025',   5  ], '-0025'  ]
    ],
    assert_count = assert_list.length,
    make_str_fn  = xhi._util_._makePadNumStr_,

    idx, expect_list, arg_list, expect_str,
    solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str = make_str_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. ' + solve_str + ' === ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makePctStr ( test_obj ) {
  var
    assert_list  = [
      // [ arg_list, expect_str ]
      [ [ __undef       ], '0%'       ],
      [ [ __undef, __0  ], '0%'       ],
      [ [ __null,  __n1 ], '0%'       ],
      [ [ 'frank'       ], '0%'       ],
      [ [ {},      __n1 ], '0%'       ],
      [ [ [],      __1  ], '0.0%'     ],
      [ [ '00.25', __n1 ], '25%'      ],
      [ [ ' 0.25', __0  ], '25%'      ],
      [ [ '  .25', __1  ], '25.0%'    ],
      [ [ '  .25', __3  ], '25.000%'  ],
      [ [    0.25, __n1 ], '25%'      ],
      [ [    0.25, __0  ], '25%'      ],
      [ [    0.25, __1  ], '25.0%'    ],
      [ [    0.25, __3  ], '25.000%'  ],
      [ [  '-.25', __n1 ], '-25%'     ],
      [ [ '-0.25', __0  ], '-25%'     ],
      [ [ '-0.25', __1  ], '-25.0%'   ],
      [ ['-00.25', __3  ], '-25.000%' ],
      [ [ (1/3),   __0  ], '33%'      ],
      [ [ (2/3),   __0  ], '67%'      ]
    ],
    assert_count = assert_list.length,
    make_str_fn  = xhi._util_._makePctStr_,

    idx, expect_list, arg_list, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str = make_str_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. ' + solve_str + ' === ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeSeenMap ( test_obj ) {
  var
    data_map     = { _foo_ : 'bar', _baz_ : 22 },
    assert_list  = [
      // [ arg_list, expect_data ]
      [ [ [1,2,3,4] ], {1:__true,2:__true,3:__true,4:__true} ],
      [ [ {} ], {} ],
      [ [ 'fred' ], {} ],
      [ [], {} ],
      [ [ __0, __0 ], {} ],
      [ [ [3,2,1], __0 ], {3:__0,2:__0,1:__0} ],
      [ [ ['red','green','blue'] ],
        {red:__true,green:__true,blue:__true} ],
      [ [ ['red','green','blue'], __false ],
        {red:__false,green:__false,blue:__false} ],
      [ [ ['red','green','blue'], __0 ],
        {red:__0,green:__0,blue:__0} ],
      [ [ ['red','green','blue'], data_map ],
        {red:data_map,green:data_map,blue:data_map} ]
    ],
    assert_count = assert_list.length,
    make_map_fn  = xhi._util_._makeSeenMap_,

    idx, expect_list, arg_list, expect_map, solve_map, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_map  = expect_list[ __1 ];
    solve_map   = make_map_fn.apply( __undef, arg_list );
    msg_str     = __Str( idx ) + '. arg_map: '
      + JSON.stringify( arg_list ) + ' solve_map: '
      + JSON.stringify( solve_map )
      + ' expect_map: ' + JSON.stringify( expect_map );
    test_obj.deepEqual( solve_map, expect_map, msg_str );
  }
  test_obj.done();
}

function makeSeriesMap ( test_obj ) {
  var
    start_ms = 1465452840000,
    delta_list = [
      5000,         // 5s
      20000,        // 20s
      40000,        // 40s
      // 140000,       // 2.3m
      // 3540000,      // 5.9m
      // 7140000,      // 11.9m
      // 14280000,     // 3.97hr
      // 28560000,     // 7.93hr
      // 57440000,     // 15.96hr
      // 114080000,    // 31.69hr
      // 231360000,    // 2.68d
      // 460800000,    // 5.33d
      // 928000000,    // 10.74d
      // 1840640000,   // 21.30d
      // 3769600000,   // 43.67d
      // 7354419200,   // 85.12d
      // 14708838400   // 170.24d
    ],
    intvl_list = [ 5,6, 7, 9, 11, 13, 15, 17 ],
    expect_map_list = [
      // begin 5s expect list
      {"_show_idx_":0,"_unit_count_":2,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.5,"_unit_ratio_":0.5,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03"]},
      {"_show_idx_":0,"_unit_count_":2,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.5,"_unit_ratio_":0.5,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03"]},
      __undef,
      __undef,
      __undef,
      __undef,
      __undef,
      __undef,
      // end 5s expect list
      // begin 20s expect list
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15"]},
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18"]},
      // end 20s expect list
      // begin 40s expect list
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":10000,"_unit_name_":"10s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:10","23:14:20","23:14:30"]},
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":10000,"_unit_name_":"10s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:10","23:14:20","23:14:30"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15","23:14:20","23:14:25","23:14:30","23:14:35"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15","23:14:20","23:14:25","23:14:30","23:14:35"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15","23:14:20","23:14:25","23:14:30","23:14:35"]},
      {"_show_idx_":0,"_unit_count_":16,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.0625,"_unit_ratio_":0.0625,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18","23:14:20","23:14:23","23:14:25","23:14:28","23:14:30","23:14:33","23:14:35","23:14:38"]},
      {"_show_idx_":0,"_unit_count_":16,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.0625,"_unit_ratio_":0.0625,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18","23:14:20","23:14:23","23:14:25","23:14:28","23:14:30","23:14:33","23:14:35","23:14:38"]},
      {"_show_idx_":0,"_unit_count_":16,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.0625,"_unit_ratio_":0.0625,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18","23:14:20","23:14:23","23:14:25","23:14:28","23:14:30","23:14:33","23:14:35","23:14:38"]},
      // end 40s expect list
    ],
    expect_count = __0,
    delta_count  = delta_list.length,
    intvl_count  = intvl_list.length,
    make_map_fn  = xhi._util_._makeSeriesMap_,

    delta_idx, delta_ms, intvl_idx, intvl_int,
    arg_map, expect_map, solve_map, msg_str
    ;

  test_obj.expect( delta_count * intvl_count );

  for ( delta_idx = __0; delta_idx < delta_count; delta_idx ++ ) {
    delta_ms = delta_list[ delta_idx ];
    for ( intvl_idx = __0; intvl_idx < intvl_count; intvl_idx ++ ) {
      intvl_int = intvl_list[ intvl_idx ];
      arg_map = {
        _max_ms_       : start_ms + delta_ms,
        _min_ms_       : start_ms,
        _tgt_count_    : intvl_int,
        _tz_offset_ms_ : 25200000
      };
      solve_map  = make_map_fn( arg_map );
      expect_map = expect_map_list[ expect_count ];
      msg_str     = __Str( expect_count ) + '. arg_map: '
        + JSON.stringify( arg_map ) + '\n solve_map: '
        + JSON.stringify( solve_map )
        + '\n expect_map: ' + JSON.stringify( expect_map );
      test_obj.deepEqual( solve_map, expect_map, msg_str );
      expect_count++;
    }
  }
  test_obj.done();
}

function getVarType( test_obj ) {
  var
    // this is a hack to get around jslint warnings
    ob = Boolean, oa = Array, os = String,
    on = Number,  // oo = Object,

    und1 = __undef,
    msg_str,

    bool1 = __true,
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
//
console.log( 'Use mockTestObj for debugging tests using nodejs instead '
  + 'of nodeunit, which obscures error messages.  Use like so:'
  + 'makeErrorObj( mockTestObj ); ',
  mockTestObj
);

// getListAttrIdx( mockTestObj );

module.exports = {
  _clearMap_        : clearMap,
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
  _makeDateStr_     : makeDateStr,
  _makeEllipsisStr_ : makeEllipsisStr,
  _makeErrorObj_    : makeErrorObj,
  _makeGuidStr_     : makeGuidStr,
  _makePadNumStr_   : makePadNumStr,
  _makePctStr_      : makePctStr,
  _makeSeenMap_     : makeSeenMap,
  _makeSeriesMap_   : makeSeriesMap
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
// _makeRxObj_       : makeRxObj,
// _getLogUtilObj_   : getLogUtilObj,
// _getTzOffsetMs_   : getTzOffsetMs,
// _getTzCode_       : getTzCode,
// _makeListPlus_    : makeListPlus,
// _makeMapUtilObj_  : makeMapUtilObj,
