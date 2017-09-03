/* * xhi_level_0.js
 * Node unit test suite xhi, util, utilb, lb
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint           node   : true, continue : true,
   devel  : true,  indent : 2,    maxerr   : 50,
   newcap : true,  nomen  : true, plusplus : true,
   regexp : true,  sloppy : true, vars     : false,
   white  : true,  todo   : true, unparam  : true
*/
/*global xhi, module, process, window, console, $ */

// == BEGIN MODULE SCOPE VARIABLES  ===================================
'use strict';
//noinspection JSUnusedLocalSymbols
var
  __ns        = 'xhi',
  aKey        = 'test',
  libDir      = '../js/',
  libPrefix   = libDir + __ns + '/',
  mockFn      = function () { console.log( aKey + '.' + this , arguments ); },
  mockTestObj = {
    deepEqual : mockFn.bind( 'deepEqual' ),
    done      : mockFn.bind( 'done'      ),
    expect    : mockFn.bind( 'expect'    ),
    ok        : mockFn.bind( 'ok'        ),
    test      : mockFn.bind( 'test'      )
  },
  jsdomObj = require( 'jsdom' ),
  winRef   = new jsdomObj.JSDOM().window,
  docRef   = winRef.document,
  jQuery   = require( 'jquery' )( winRef ),

  aMap, nMap, vMap, __Str, __blank, __false,
  __null, __true, __undef, __util, __utilb, __lb,
  __n1, __0, __1, __2, __3, __4,
  liteBoxMap
  ;

global.window   = winRef;
global.document = docRef;
global.jQuery   = jQuery;
global.$        = jQuery;

global.pcss = require( libDir + 'vendor/pcss-1.4.2.js' );
require( libDir + 'vendor/pcss.cfg-1.4.2.js' );

global[ __ns ] = require( libPrefix + '00.js' );
require( libPrefix + '01.util.js'  );
require( libPrefix + '04.utilb.js' );
require( libPrefix + '06.lb.js'    );

aMap = xhi._makeRoot_( aKey );
global[ aKey ] = aMap;

xhi._makeUtil_(  aMap );
xhi._makeUtilb_( aMap );
xhi._makeLb_(    aMap );

vMap    = aMap._vMap_;
nMap    = aMap._nMap_;

__util  = aMap._util_;
__utilb = aMap._utilb_;
__lb    = aMap._lb_;

__blank = vMap._blank_;
__false = vMap._false_;
__null  = vMap._null_;
__Str   = vMap._String_;
__true  = vMap._true_;
__undef = vMap._undef_;

__n1 = nMap._n1_;
__0  = nMap._0_;
__1  = nMap._1_;
__2  = nMap._2_;
__3  = nMap._3_;
__4  = nMap._4_;
// == . END MODULE SCOPE VARIABLES  ===================================

// == BEGIN UTILITY METHODS  ==========================================
// == . END UTILITY METHODS  ==========================================

// == BEGIN NODEUNIT TEST FUNCTIONS  ==================================
function setLogLevel ( test_obj ) {
  var
    assert_table = [
      [ ['_warn_'],                   '_warn_' ],
      [ [],                           '_warn_' ],
      [ [ __null ],                   '_warn_' ],
      [ [ __undef ],                  '_warn_' ],
      [ [ '_emerg_' ],               '_emerg_' ],
      [ [ ],                         '_emerg_' ],
      [ [ __null ],                  '_emerg_' ],
      [ [ __undef ],                 '_emerg_' ],
      [ [ 'str', {}, 29 ],           '_emerg_' ],
      [ [ '_crit_', __false ],        '_crit_' ],
      [ [ '_error_', 'betty' ],      '_error_' ],
      [ [ '_warn_', 3e6, 'string' ],  '_warn_' ],
      [ [ 0, 3e6, 'string' ],         '_warn_' ],
      [ [ ],                          '_warn_' ],
      [ [ '_notice_' ],             '_notice_' ],
      [ [ '_info_' ],                 '_info_' ],
      [ [ '_debug_' ],               '_debug_' ],
      [ [ __undef ],                 '_debug_' ],
      [ [ '_error_' ],               '_error_' ],
      [ [ '_wtf_', 'this', 'that' ], '_error_' ],
      [ [ '_info_' ],                 '_info_' ],
      [ [ '_wtf_', 'this', 'that' ],  '_info_' ],
      [ [ '_error_' ],               '_error_' ]
    ],

    assert_count = assert_table.length,
    log_obj      = __util._getLogObj_(),

    idx,        expect_list, arg_list,
    expect_str, solve_str,   msg_str
    ;

  test_obj.expect( assert_count * __2 + __2 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list   = expect_list[ __0 ];
    expect_str = expect_list[ __1 ];
    solve_str  = log_obj._setLogLevel_.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_str: ' + solve_str
      + '\n expect_str: ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
    test_obj.ok( log_obj._getLogLevel_() === expect_str, msg_str );
  }
  log_obj._logMsg_( 'bogus', '_this_should_default_to_error_' );
  test_obj.ok( log_obj._logMsg_( 'bogus' ) === __false, 'no log on 1 arg' );
  test_obj.ok( log_obj._logMsg_() === __false, 'no log on 0 arg' );

  test_obj.done();
}

function castInt ( test_obj ) {
  var
    assert_table = [
      // arg_list, expect_data
      [ [],                         __undef ],
      [ [ __undef ],                __undef ],
      [ [ __null  ],                __undef ],
      [ [ {}  ],                    __undef ],
      [ [ []  ],                    __undef ],
      [ [ '0'  ],                         0 ],
      [ [ '25' ],                        25 ],
      [ [ '025' ],                       25 ],
      [ [ '-025' ],                     -25 ],
      [ [ __0 ],                          0 ],
      [ [ 25  ],                         25 ],
      [ [ -25 ],                        -25 ],
      [ [ 0.5 ],                          1 ],
      [ [ 0.499 ],                        0 ],
      [ [ -0.1 ],                         0 ],
      [ [ -0.5 ],                         0 ],
      [ [ -0.501 ],                      -1 ],
      [ [ 9.5,      'bob' ],             10 ],
      [ [ 23.232,   'bob' ],             23 ],
      [ [ 23.828,   'bob' ],             24 ],
      [ [ -23.232,  'bob' ],            -23 ],
      [ [ -23.828,  'bob' ],            -24 ],
      [ [ __null,   'bob' ],          'bob' ],
      [ [ __blank,  'bob' ],          'bob' ],
      [ [ __undef,  'bob' ],          'bob' ],
      [ [ 5.062e12, 'bob' ],      5.062e12  ],
      [ [ /regex/ ],                __undef ],
      [ [ /regex/,  'bob' ],          'bob' ],
      [ [ new Date() ],             __undef ],
      [ [ new Date(), 'jeani' ],    'jeani' ]
    ],
    assert_count = assert_table.length,
    test_fn      = __util._castInt_,

    msg_str,  idx,         expect_list,
    arg_list, expect_str,  solve_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = test_fn[ vMap._apply_ ]( __undef, arg_list );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_str: ' + solve_str
      + '\n expect_str: ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function castJQ ( test_obj ) {
  var
    cast_jq = __util._castJQ_,
    $jq     = global.$('<div/>')
    ;

  test_obj.expect( __4 );

  test_obj.ok( cast_jq( {}         ) === __undef, '0' );
  test_obj.ok( cast_jq( {},  'bob' ) ===   'bob', '1' );
  test_obj.ok( cast_jq( $jq        ) ===     $jq, '2' );
  test_obj.ok( cast_jq( $jq, 'bob' ) ===     $jq, '3' );

  test_obj.done();
}

function castStr ( test_obj ) {
  var
    assert_table = [
      // arg_list, expect_data
      [ [],                         __undef ],
      [ [ __undef ],                __undef ],
      [ [ __null  ],                __undef ],
      [ [ {}  ],                    __undef ],
      [ [ []  ],                    __undef ],
      [ [ __0 ],                        '0' ],
      [ [ 25  ],                       '25' ],
      [ [ __blank,  'bob' ],        __blank ],
      [ [ __undef,  'bob' ],          'bob' ],
      [ [ 5.062e12, 'bob' ], '5062000000000'],
      [ [ /regex/ ],                __undef ],
      [ [ new Date() ],             __undef ]
    ],
    assert_count = assert_table.length,
    test_fn      = __util._castStr_,

    msg_str,  idx,         expect_list,
    arg_list, expect_str,  solve_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = test_fn[ vMap._apply_ ]( __undef, arg_list );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_str: ' + solve_str
      + '\n expect_str: ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function checkDateStr ( test_obj ) {
  var
    assert_table = [
      // arg_list, expect_data
      [ [],                         __false ],
      [ [ __undef ],                __false ],
      [ [ __null  ],                __false ],
      [ [ {}  ],                    __false ],
      [ [ []  ],                    __false ],
      [ [ 25  ],                    __false ],
      [ [ 0   ],                    __false ],
      [ [ new Date() ],             __false ],

      [ [ { _date_str_ : '2017-02-29' } ],  __false ],
      [ [ { _date_str_ : '2016-02-29' } ],  __true  ],
      [ [ { _date_str_ : '2020-02-29' } ],  __true  ],
      [ [ { _date_str_ : '2016-12-01' } ],  __true  ],
      [ [ { _date_str_ : '2016-2-1'   } ],  __true  ],
      [ [ { _date_str_ : '2016-01-30' } ],  __true  ],
      [ [ { _date_str_ : '2016-01-40' } ],  __false ],

      [ [ { _date_str_ : '2017/02/29' } ],  __false ],
      [ [ { _date_str_ : '2016/02/29' } ],  __true  ],
      [ [ { _date_str_ : '2020/02/29' } ],  __true  ],
      [ [ { _date_str_ : '2016/12/01' } ],  __true  ],
      [ [ { _date_str_ : '2016/2/1'   } ],  __true  ],
      [ [ { _date_str_ : '2016/01/30' } ],  __true  ],
      [ [ { _date_str_ : '2016/01/40' } ],  __false ],

      [ [ { _date_str_ : '2017-02-29', _order_str_ : '_us_' } ],  __false ],
      [ [ { _date_str_ : '2016-02-29', _order_str_ : '_us_' } ],  __false ],
      [ [ { _date_str_ : '2020-02-29', _order_str_ : '_us_' } ],  __false ],
      [ [ { _date_str_ : '2016-12-01', _order_str_ : '_us_' } ],  __false ],
      [ [ { _date_str_ : '2016-2-1'  , _order_str_ : '_us_' } ],  __false ],
      [ [ { _date_str_ : '2016-01-30', _order_str_ : '_us_' } ],  __false ],
      [ [ { _date_str_ : '2016-01-40', _order_str_ : '_us_' } ],  __false ],

      [ [ { _date_str_ : '02-29-2017', _order_str_ : '_us_' } ],  __false ],
      [ [ { _date_str_ : '02-29-2016', _order_str_ : '_us_' } ],  __true  ],
      [ [ { _date_str_ : '02-29-2020', _order_str_ : '_us_' } ],  __true  ],
      [ [ { _date_str_ : '12-01-2016', _order_str_ : '_us_' } ],  __true  ],
      [ [ { _date_str_ : '2-1-2016'  , _order_str_ : '_us_' } ],  __true  ],
      [ [ { _date_str_ : '01-30-2016', _order_str_ : '_us_' } ],  __true  ],
      [ [ { _date_str_ : '01-40-2016', _order_str_ : '_us_' } ],  __false ],

      [ [ { _date_str_ : '02/29/2017', _order_str_ : '_us_' } ],  __false ],
      [ [ { _date_str_ : '02/29/2016', _order_str_ : '_us_' } ],  __true  ],
      [ [ { _date_str_ : '02/29/2020', _order_str_ : '_us_' } ],  __true  ],
      [ [ { _date_str_ : '12/01/2016', _order_str_ : '_us_' } ],  __true  ],
      [ [ { _date_str_ : '2/1/2016'  , _order_str_ : '_us_' } ],  __true  ],
      [ [ { _date_str_ : '01/30/2016', _order_str_ : '_us_' } ],  __true  ],
      [ [ { _date_str_ : '01/40/2016', _order_str_ : '_us_' } ],  __false ],
    ],
    assert_count = assert_table.length,
    test_fn      = __util._checkDateStr_,

    msg_str,  idx,      expect_list,
    arg_list, is_valid, expect_bool
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_bool = expect_list[ __1 ];
    is_valid    = test_fn[ vMap._apply_ ]( __undef, arg_list );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n is_valid: ' + is_valid
      + '\n expect_val: ' + expect_bool;
    test_obj.ok( is_valid === expect_bool, msg_str );
  }
  test_obj.done();
}

function clearMap ( test_obj ) {
  //noinspection JSUnusedGlobalSymbols
  var
    proto = { callback_fn : function () { return 1; } },
    complex_obj = Object.create( proto ),
    assert_table = [
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
    assert_count = assert_table.length,
    test_fn      = __util._clearMap_,

    msg_str,  idx,         expect_list,
    arg_data, expect_data, solve_data
    ;

  complex_obj.this = '1';
  complex_obj.that = '2';

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
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

function cloneData ( test_obj ) {
  var
    assert_table = [
      __1, -694567, __blank, __0, __null, __undef, 5.062e12,
      'A string',
      /a regex object/,
      [ 'a', 'simple', 'array' ],
      { a : 'simple', b : 'map' },
      [ 'a', { complex : 'array' } ],
      { a : 'complex', name_list : [ 'tim', 'bob' ], map: { this : 'that' } }
    ],
    assert_count = assert_table.length,
    clone_fn     = __util._cloneData_,

    msg_str, idx, assert_data, cloned_data
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    assert_data = assert_table[ idx ];
    cloned_data = clone_fn( assert_data );
    msg_str = __Str( idx ) + '. '
      + JSON.stringify( assert_data ) + ' <<==>> '
      + JSON.stringify( cloned_data );
    test_obj.deepEqual(  assert_data, cloned_data, msg_str );
  }
  test_obj.done();
}

function encodeHtml ( test_obj ) {
  var
    assert_table  = [
      // [ arg_map, expect_str ]
      [ [],            __blank ],
      [ [ __null ],    __blank ],
      [ [ __undef ],   __blank ],
      [ [ 'fred'  ],   'fred'  ],
      [ [1,2,3,4],     '1'     ],
      [ [ "<h1>'Help me!'</h1> she said." ],
        '&#60;h1&#62;&#39;Help me!&#39;&#60;/h1&#62; she said.'
      ],
      [ [ "<h1>'Help me!'</h1> & fast!" ],
        '&#60;h1&#62;&#39;Help me!&#39;&#60;/h1&#62; &#38; fast!'
      ],
      [ [ "<h1>'Help me!'</h1> & fast!", __false ],
        '&#60;h1&#62;&#39;Help me!&#39;&#60;/h1&#62; &#38; fast!'
      ],
      [ [ "<h1>'Help me!'</h1> & fast!", __true ],
        '&#60;h1&#62;&#39;Help me!&#39;&#60;/h1&#62; & fast!'
      ],
      [ [ '<p>"And so began, ...",'
          + " she 'said' with her eyes & mouth...</p>" ],
        '&#60;p&#62;&#34;And so began, ...&#34;,'
        + " she &#39;said&#39; with her eyes &#38; mouth..."
        + '&#60;/p&#62;'
      ],
      [ [ '<p>"And so began, ...",'
      + " she 'said' with her eyes & mouth...</p>", __true ],
        '&#60;p&#62;&#34;And so began, ...&#34;,'
        + " she &#39;said&#39; with her eyes & mouth..."
        + '&#60;/p&#62;'
      ],
      [ [ '& start and end &', __false ], '&#38; start and end &#38;' ],
      [ [ '& start and end &', __true ], '& start and end &' ]
    ],

    assert_count = assert_table.length,
    encode_fn    = __util._encodeHtml_,

    idx, expect_list, arg_list, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = encode_fn[ vMap._apply_ ]( __undef, arg_list );
    msg_str     = __Str( idx ) + '. ' + solve_str + ' === ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function getBasename ( test_obj ) {
  var
    assert_table = [
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
    assert_count = assert_table.length,
    basename_fn  = __util._getBasename_,
    dirname_fn   = __util._getDirname_,

    idx, expect_list, arg_list, expect_basename, expect_dirname,
    msg_str, solve_basename, solve_dirname
    ;

  test_obj.expect( assert_count * __2 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
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

function getStructData ( test_obj ) {
  var
    deep0_map   = { foo : { bar : __1 } },
    deep1_map   = { bing : { bang : 'string' }, list : [ __1, __2 ] },
    deep0_list  = [ 0,1,2,3,{ car : { size : 'lg' } },
      [ 0,1, [ 'kitty', 'cat'] ] ],
    deepest_map  = {},
    deepest_list = [],
    assert_table  = [
      // [ arg_list, expect_data ]
      [ [ __null,  [ 'foo', 'bar' ] ], __undef ],
      [ [ __undef, [ 'foo', 'bar' ] ], __undef ],
      [ [ 'foofy', [ 'foo', 'bar' ] ], __undef ],
      [ [ deep0_list, [ 4, 'car','size' ] ], 'lg' ],
      [ [ deep0_list, [ 4, 'car','smut' ] ],  __undef ],
      [ [ deep0_list, [ 0 ] ], 0 ],
      [ [ deep0_list, [ 5, 2, 0 ] ], 'kitty' ],
      [ [ deep0_list, [ 5, 2, 1 ] ],   'cat' ],
      [ [ deep0_map, [ 'foo', 'chaz_bono' ]  ], __undef ],
      [ [ deep0_map, [ 'foo', 'bar' ] ], __1 ],
      [ [ deep0_map, [ 'foo' ] ], deep0_map.foo ],
      [ [ deep0_map, [] ], deep0_map ],
      [ [ deep1_map, [ 'bing' ] ], deep1_map.bing ],
      [ [ deep1_map, [ 'bing', 'bang' ] ], 'string' ],
      [ [ deep1_map, [ 'list'] ], deep1_map.list  ],
      [ [ deep1_map, [] ], deep1_map ],
      [ [ deep1_map, [ 'list', __1 ] ], __2 ],
      [ [ deepest_map, deepest_list ], __undef ]
    ],
    assert_count = assert_table.length,
    deep_fn      = __util._getStructData_,

    idx,         expect_list, arg_list,
    expect_data, solve_data,  msg_str,
    walk_map,    walk_key
    ;

  // Load up very deep map to test recursion limits
  walk_map = deepest_map;
  for ( idx = __0; idx < 102; idx++ ) {
    walk_key = 'foo' + __Str( idx );
    deepest_list[ vMap._push_ ]( walk_key );

    walk_map[ walk_key ] = {};
    walk_map = walk_map[ walk_key ];
  }

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
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
    assert_table  = [
      // [ arg_list, expect_data ]
      [ [ map_list, 'foo', __1      ], __0  ],
      [ [ map_list, 'foo', __2      ], __1  ],
      [ [ map_list, 'foo', __3      ], __n1 ],
      [ [ map_list, 'bar', 'string' ], __0  ],
      [ [ map_list, 'bar', 'foofy'  ], __1  ],
      [ [ map_list, 'bar', 'poopy'  ], __n1 ],
      [ [ map_list, 'bang', __null  ], __3  ],
      [ [ map_list, 'bang', __undef ], __n1 ],
      [ [ map_list, 'biz',  __undef ], __4  ]
    ],

    assert_count = assert_table.length,
    get_idx_fn   = __util._getListAttrIdx_,
    get_map_fn   = __util._getListAttrMap_,
    check_count  = __0,

    idx,          expect_list,  arg_list,
    expect_idx,   msg_str,      solve_idx,

    expect_map,   solve_map
    ;

  test_obj.expect( assert_count * __2 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
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
    map_01  = { boo: 'bob'   },
    map_02  = { bar: 'frank' },

    list_01 = [ 1, 2, 3, 4 ],
    list_02 = [ 'fred', 1, 2, 3, 4 ],
    list_03 = [ 1, 2, 3, 4, 'fred'],
    list_04 = [ map_01, 1, 2, 3, 4 ],
    list_05 = [ 1, 2, 3, 4, map_01 ],
    list_06 = [ map_01 ],
    list_07 = [ map_02 ],
    list_08 = [ 1,2,3, map_02 ],
    list_09 = [ 1,2,3, map_01 ],
    assert_table  = [
      // [ arg_list, expect_data ]
      [ [ list_01, list_01 ], [] ],
      [ [ list_01, list_02 ], [ 'fred' ] ],
      [ [ list_02, list_03 ], [] ],
      [ [ list_03, list_04 ], [ 'fred', map_01 ] ],
      [ [ list_04, list_05 ], [] ],
      [ [ list_05, list_06 ], [ 1,2,3,4 ] ],
      [ [ list_06, list_07 ], [ map_01, map_02] ],
      [ [ list_07, list_08 ], [ 1,2,3 ] ],
      [ [ list_08, list_09 ], [ map_02, map_01 ] ],
      [ [ list_09, list_09 ], [] ]
    ],

    assert_count = assert_table.length,
    get_diff_fn   = __util._getListDiff_,

    idx, expect_list, arg_list, expect_data, solve_data, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
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

function getListValCount ( test_obj ) {
  var
    map_01  = { boo: 'bob'   },
    map_02  = { bar: 'frank' },

    list_01 = [ 1, 2, 1, 4, 'dog' ],
    list_02 = [ 'fred', 1, 2, 3, 4, 'fred' ],
    list_03 = [ __null, __null, 3, map_01, __null, map_01 ],
    assert_table  = [
      // [ arg_list, expect_data ]
      [ [], __0  ],
      [ [ list_01 ], __0 ],
      [ [ list_01, 'cow' ],   __0 ],
      [ [ list_01, __1   ],   __2 ],
      [ [ list_01, 'dog' ],   __1 ],
      [ [ list_02, __undef ], __0 ],
      [ [ list_02, 'fred' ],  __2 ],
      [ [ list_03, __null ],  __3 ],
      [ [ list_03, map_01 ],  __2 ],
      [ [ list_03, map_02 ],  __0 ]
    ],

    assert_count = assert_table.length,
    get_count_fn = __util._getListValCount_,

    idx,          expect_list,   arg_list,
    expect_data,  solve_data,    msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_data  = expect_list[ __1 ];
    solve_data = get_count_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( solve_data ) + ' <===> '
      + JSON.stringify( expect_data );

    test_obj.deepEqual( solve_data, expect_data, msg_str );
  }
  test_obj.done();
}

function getNowMs ( test_obj ) {
  var
    now_ms = __util._getNowMs_(),
    rx     = /^[\d]{13}$/;

  test_obj.expect( __1 );
  test_obj.ok( rx.test( now_ms.toString() ), 'Timestamp has 13 digits');
  test_obj.done();
}

function getNumSign ( test_obj ) {
  var
    assert_table  = [
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

    assert_count = assert_table.length,
    get_sign_fn   = __util._getNumSign_,

    idx,        expect_list,  arg_list,
    expect_int, solve_int,    msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_int   = expect_list[ __1 ];

    solve_int = get_sign_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_int ) + ' === ' + __Str( expect_int );

    test_obj.ok( solve_int === expect_int, msg_str );
  }
  test_obj.done();
}

function getTzCode ( test_obj ) {
  var tz_code = __util._getTzCode_();
  test_obj.expect( __1 );

  test_obj.ok( tz_code.match( /^[A-Z0-9+\-]+$/ ),
    'Code fails to match regex: ' + tz_code
  );
  test_obj.done();
}

function getTzOffsetMs ( test_obj ) {
  var
    assert_table  = [
      // [ arg_list, expect_data ]
      [],
      [ __0       ],
      [ __true    ],
      [ __false   ],
      [ __n1      ],
      [ 25        ],
      [ 3.28e24   ],
      [ -4562     ],
      [ -0.000001 ],
      [ 2e5 - 2e4 ],
      [ 2e4 - 2e5 ],
      [ 'fred'    ]
    ],

    assert_count  = assert_table.length,
    get_offset_fn = __util._getTzOffsetMs_,

    idx,        arg_list,
    solve_int,    msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    arg_list  = assert_table[ idx ];

    solve_int = get_offset_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_int ) + ' === /^-?\\d\\d*$/';

    test_obj.ok( __Str(solve_int).match( /^-?\d\d*$/ ), msg_str );
  }
  test_obj.done();
}

function getVarType ( test_obj ) {
  var
    // this is a hack to get around jslint warnings
    ob = Boolean, oa = Array, os = String,
    on = Number,  // oo = Object,

    und1 = __undef,
    msg_str,

    bool1 = __true,
    list1 = [ 'a','b','c' ],
    null1 = __null,
    num1  = 25,
    str1  = 'cde',
    obj1  = { length : 12 },

    bool2 = new ob(),
    list2 = new oa(),
    num2  = new on(),
    str2  = new os(),
    d_obj = new Date(),

    get_type_fn = __util._getVarType_;

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
  test_obj.ok( get_type_fn( d_obj ) ===  'Date',       msg_str );

  test_obj.done();
}

function makeArgList ( test_obj ) {
  var
    assert_table  = [
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

    assert_count = assert_table.length,
    make_list_fn  = function () {
      return __util._makeArgList_( arguments );
    },

    idx, expect_list, solve_list, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
    solve_list   = make_list_fn.apply( __undef, expect_list );
    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( solve_list ) + ' <===> '
      + JSON.stringify( expect_list );

    test_obj.deepEqual( solve_list, expect_list, msg_str );
  }
  test_obj.done();
}

function makeClockStr ( test_obj ) {
  var
    assert_table  = [
      // [ arg_list, expect_data ]
      [ [ 1473980001000     ], '22:53:21' ],
      [ [ 1473980001000, 3  ], '22:53:21' ],
      [ [ 1473980001000, 2  ], '22:53'    ],
      [ [ 1473980001000, 1  ], '22'       ],
      [ [ 1474832093000     ], '19:34:53' ],
      [ [ 1474832093000, 3  ], '19:34:53' ],
      [ [ 1474832093000, 2  ], '19:34'    ],
      [ [ 1474832093000, 1  ], '19'       ],
      [ [ 1474832093000, -3 ], '17069d:19h:34m:53s' ],
      [ [ 1474832093000, -2 ], '17069d:19h:34m'     ],
      [ [ 1474832093000, -1 ], '17069d:19h'         ],
      [ [ 86400000, -3      ], '1d:00h:00m:00s'     ],
      [ [ 86400000, -2      ], '1d:00h:00m'         ],
      [ [ 86400000, -1      ], '1d:00h'             ],
      [ [ 97200000, -3      ], '1d:03h:00m:00s'     ],
      [ [ 97200000, -2      ], '1d:03h:00m'         ],
      [ [ 97200000, -1      ], '1d:03h'             ],
      [ [ 98700000, -3      ], '1d:03h:25m:00s'     ],
      [ [ 98700000, -2      ], '1d:03h:25m'         ],
      [ [ 98700000, -1      ], '1d:03h'             ],
      [ [ 98745000, -3      ], '1d:03h:25m:45s'     ],
      [ [ 98745000, -2      ], '1d:03h:25m'         ],
      [ [ 98745000, -1      ], '1d:03h'             ]
    ],

    assert_count = assert_table.length,
    make_str_fn   = __util._makeClockStr_,

    idx, expect_list, arg_list, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
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
    assert_table  = [
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

    assert_count = assert_table.length,
    make_str_fn  = __util._makeCommaNumStr_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
    arg_map      = expect_list[ __0 ];
    expect_str   = expect_list[ __1 ];

    solve_str   = make_str_fn.apply( __undef, [ arg_map ] );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeDateStr ( test_obj ) {
  var
    date_obj      = new Date( 1374294605000 ),
    tz_offset_ms  = __util._getTzOffsetMs_(),
    assert_table  = [
      // [ arg_map, expect_data ]
      [ __null, __blank ],
      [ { foo : '_bar_' }, __blank ],
      [ { _date_ms_ : 1474323404498 }, '2016-09-19' ],
      [ { _date_ms_ : 1474323404498, _time_idx_ : 0 },
         '2016-09-19' ],
      [ { _date_ms_ : 1474323404498, _time_idx_ : 1 },
         '2016-09-19 22' ],
      [ { _date_ms_ : 1474323404498, _time_idx_ : 2 },
         '2016-09-19 22:16' ],
      [ { _date_ms_ : 1474323404498, _time_idx_ : 3 },
         '2016-09-19 22:16:44' ],
      [ { _date_ms_ : 1274323404500 },
         '2010-05-20' ],
      [ { _date_ms_ : 1274323404999, _time_idx_ : 0 },
         '2010-05-20' ],
      [ { _date_ms_ : 1274323404999, _time_idx_ : 1 },
         '2010-05-20 02' ],
      [ { _date_ms_ : 1274323404999, _time_idx_ : 2 },
         '2010-05-20 02:43' ],
      [ { _date_ms_ : 1274323405000, _time_idx_ : 3 },
         '2010-05-20 02:43:25' ],

      [ { _date_obj_ : date_obj }, '2013-07-20' ],
      [ { _date_obj_ : date_obj,     _time_idx_ : 0 }, '2013-07-20' ],
      [ { _date_obj_ : date_obj,     _time_idx_ : 1 }, '2013-07-20 12' ],
      [ { _date_obj_ : date_obj,     _time_idx_ : 2 }, '2013-07-20 12:30' ],
      [ { _date_obj_ : date_obj,     _time_idx_ : 3 }, '2013-07-20 12:30:05'],
      [ { _date_obj_ : date_obj,     _time_idx_ : 4 }, '2013-07-20' ],

      [ { _date_ms_ : 1374323405099, _time_idx_ : 0 },
         '2013-07-20' ],
      [ { _date_ms_ : 1374323405099, _time_idx_ : 1 },
         '2013-07-20 12' ],
      [ { _date_ms_ : 1374323405099, _time_idx_ : 2 },
         '2013-07-20 12:30' ],
      [ { _date_ms_ : 1374323405099, _time_idx_ : 3 },
         '2013-07-20 12:30:05' ],
      [ { _date_obj_ : date_obj,     _time_idx_ : 4 },
         '2013-07-20' ],
      [ { _date_obj_ : date_obj,     _time_idx_ : -1 },
         '2013-07-20 12h' ],
      [ { _date_ms_ : 1374323405099, _time_idx_ : -2 },
         '2013-07-20 12h:30m' ],
      [ { _date_ms_ : 1374323405099, _time_idx_ : -3 },
         '2013-07-20 12h:30m:05s' ],
      [ { _date_obj_ : date_obj,     _time_idx_ : -4 },
         '2013-07-20' ],

      // US format test
      [ { _date_ms_ : 1474323404010, _order_str_ : '_us_' }, '09/19/2016' ],
      [ { _date_ms_ : 1474323404020, _order_str_ : '_us_', _time_idx_ : 0 },
        '09/19/2016' ],
      [ { _date_ms_ : 1474323404498, _order_str_ : '_us_', _time_idx_ : 1 },
        '09/19/2016 22' ],
      [ { _date_ms_ : 1474323404498, _order_str_ : '_us_', _time_idx_ : 2 },
        '09/19/2016 22:16' ],
      [ { _date_ms_ : 1474323404498, _order_str_ : '_us_', _time_idx_ : 3 },
        '09/19/2016 22:16:44' ],
      [ { _date_ms_ : 1274323404500, _order_str_ : '_us_' }, '05/20/2010' ],
      [ { _date_ms_ : 1274323404999, _order_str_ : '_us_', _time_idx_ : 0 },
        '05/20/2010' ],
      [ { _date_ms_ : 1274323404999, _order_str_ : '_us_', _time_idx_ : 1 },
        '05/20/2010 02' ],
      [ { _date_ms_ : 1274323404999, _order_str_ : '_us_', _time_idx_ : 2 },
        '05/20/2010 02:43' ],
      [ { _date_ms_ : 1274323405000, _order_str_ : '_us_', _time_idx_ : 3  },
        '05/20/2010 02:43:25' ],

      [ { _date_obj_ : date_obj, _order_str_ : '_us_' }, '07/20/2013' ],
      [ { _date_obj_ : date_obj, _order_str_ : '_us_', _time_idx_ : 0 },
        '07/20/2013' ],
      [ { _date_obj_ : date_obj, _order_str_ : '_us_', _time_idx_ : 1 },
        '07/20/2013 12' ],
      [ { _date_obj_ : date_obj, _order_str_ : '_us_', _time_idx_ : 2 },
        '07/20/2013 12:30' ],
      [ { _date_obj_ : date_obj, _order_str_ : '_us_', _time_idx_ : 3 },
        '07/20/2013 12:30:05' ],
      [ { _date_obj_ : date_obj, _order_str_ : '_us_', _time_idx_ : 4 },
        '07/20/2013' ],

      [ { _date_ms_ : 1374323405099, _order_str_ : '_us_', _time_idx_ : 0 },
        '07/20/2013' ],
      [ { _date_ms_ : 1374323405099, _order_str_ : '_us_', _time_idx_ : 1 },
        '07/20/2013 12' ],
      [ { _date_ms_ : 1374323405099, _order_str_ : '_us_', _time_idx_ : 2 },
        '07/20/2013 12:30' ],
      [ { _date_ms_ : 1374323405099, _order_str_ : '_us_', _time_idx_ : 3 },
        '07/20/2013 12:30:05' ],

      [ { _date_obj_ : date_obj, _order_str_ : '_us_',     _time_idx_ : -1 },
        '07/20/2013 12h' ],
      [ { _date_ms_ : 1374323405099, _order_str_ : '_us_', _time_idx_ : -2 },
        '07/20/2013 12h:30m' ],
      [ { _date_ms_ : 1374323405099, _order_str_ : '_us_', _time_idx_ : -3 },
        '07/20/2013 12h:30m:05s' ],
      [ { _date_obj_ : date_obj, _order_str_ : '_us_',     _time_idx_ : -4 },
      '07/20/2013' ]
    ],

    assert_count = assert_table.length,
    make_str_fn   = __util._makeDateStr_,

    idx, expect_list, arg_map,
    expect_str, solve_str, msg_str
    ;

  date_obj.setTime( 1374323405099 + tz_offset_ms );

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
    arg_map      = expect_list[ __0 ];
    expect_str   = expect_list[ __1 ];

    // date_obj.
    if ( arg_map && arg_map._date_ms_ ) {
      arg_map._date_ms_ += tz_offset_ms;
    }

    solve_str   = make_str_fn( arg_map );
    msg_str     = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }

  test_obj.done();
}

function makeDebounce01Fn ( test_obj ) {
  var
    test_idx  = 0,
    run_fn = function () { test_idx++; },
    curry_fn;

  test_obj.expect( 2 );
  curry_fn = __util._makeDebounceFn_();

  test_obj.ok( curry_fn === __undef );

  curry_fn = __util._makeDebounceFn_({
    _fn_ : run_fn,
    _do_asap_  : __true,
    _delay_ms_ : 10
  });
  curry_fn();
  curry_fn();
  curry_fn();
  test_obj.ok( test_idx === 1, '0. test_idx === 1' );
  setTimeout( test_obj.done, 15 );
}

function makeDebounce02Fn ( test_obj ) {
  var
    test_idx  = 0,
    run_fn = function () { test_idx++; },
    curry_fn;

  curry_fn = __util._makeDebounceFn_({
    _fn_ : run_fn,
    _do_asap_  : __false,
    _delay_ms_ : 10
  });
  test_obj.expect( 2 );
  curry_fn();
  curry_fn();
  curry_fn();
  curry_fn();
  curry_fn();
  test_obj.ok( test_idx === 0, 'test_idx === 0' );
  setTimeout( function () {
    test_obj.ok( test_idx === 1, 'test_idx === 1' );
    test_obj.done();
  }, 15 );
}

function __run03Fn () { this.foo = 'bar'; }
function makeDebounce03Fn ( test_obj ) {
  var
    ctx_map = { str : 'hi there' },
    curry_fn;

  curry_fn = __util._makeDebounceFn_({
    _fn_       : __run03Fn,
    _ctx_data_ : ctx_map,
    _do_asap_  : __true,
    _delay_ms_ : 10
  });

  test_obj.expect( 1 );
  curry_fn();
  curry_fn();
  curry_fn();
  test_obj.deepEqual( ctx_map, { foo : 'bar', str : 'hi there' } );
  setTimeout( test_obj.done, 15 );
}

function __run04Fn () {
  this._list_ = __util._makeArgList_( arguments );
}

function makeDebounce04Fn ( test_obj ) {
  var ctx_map = {}, curry_fn;

  curry_fn = __util._makeDebounceFn_({
    _fn_       : __run04Fn,
    _ctx_data_ : ctx_map,
    _do_asap_  : __false,
    _delay_ms_ : 10
  });

  test_obj.expect( 2 );
  curry_fn( 1, 2, 3);
  curry_fn();
  curry_fn( __null );
  curry_fn( 'barney fife' );
  curry_fn( 'wilma' );
  test_obj.ok( ctx_map._list_ === __undef, '_list_ === __undef' );
  setTimeout( function () {
    var msg_str = JSON.stringify( ctx_map._list_ ) + ' <===> [ wilma ]';
    test_obj.deepEqual( ctx_map._list_, [ 'wilma' ], msg_str );
    test_obj.done();
  }, 20 );
}

function makeEllipsisStr ( test_obj ) {
  var
    str0 = 'Georgey', //7
    str1 = 'Hee haw and the boys', // 20
    str2 = 'Tim knickers and the fem-fatale chicks', // 38
    str3 = '<br>This is by far the longest string. <b>It contains html '
      + 'markup</b> which makes it especially sucky, parse-wise',
    assert_table  = [
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

    assert_count = assert_table.length,
    make_str_fn   = __util._makeEllipsisStr_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
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
    default_list = [ aKey + ':error', __blank, __undef ],
    assert_table = [
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
      [ [ '_bad_data_' ], [ aKey + ':_bad_data_', __blank, __undef ] ],
      [ [ __1 ], [ aKey + ':1', __blank, __undef ] ],
      [ [ '_bad_data_', '_the_list_is_missing_' ],
        [ aKey + ':_bad_data_', '_the_list_is_missing_', __undef ]
      ],
      [ [ '_bad_data_', '_the_list_is_missing_', { is : __true } ],
        [ aKey + ':_bad_data_', '_the_list_is_missing_', { is : __true } ]
      ]
    ],

    key_count    = key_list.length,
    assert_count = assert_table.length,
    make_fn      = __util._makeErrorObj_,
    test_count   = __0,

    idx, expect_list, arg_list, expect_obj, solve_obj,
    idj, expect_key, expect_data, solve_data, msg_str
    ;

  test_obj.expect( assert_count * key_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
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


function makeEscRxStr ( test_obj ) {
  var
    // [ arg_list, expect_list ]
    assert_table = [
      [ [         ],           __blank ],
      [ [ __null  ],           __blank ],
      [ [ __undef ],           __blank ],
      [ [ __0     ],               '0' ]
    ],

    assert_count = assert_table.length,
    make_str_fn  = __util._makeEscRxStr_,

    idx, expect_list, arg_list, expect_str,
    solve_str, msg_str
    ;

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
    arg_list   = expect_list[ __0 ];
    expect_str = expect_list[ __1 ];
    solve_str  = make_str_fn.apply( __undef, arg_list );

    msg_str   = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeGuidStr ( test_obj ) {
  var
    seen_map     = {},
    assert_count = 100,
    make_str_fn  = __util._makeGuidStr_,
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
function makeMapUtilObj ( test_obj ) {
  var
    map_util_obj = __util._makeMapUtilObj_(),
    arg_list   = [ [ 'cows', 'donkeys', 'sheep' ] ],
    field_list = [ 'moo', 'garaaah', 'bahbah' ],
    clone_list = __util._cloneData_( field_list ),
    map_fn   = function ( field_data, idx, list, arg_list ) {
      var
        name_list  = arg_list[  __0 ],
        field_key  = name_list[ idx ],
        field_str  = String( field_data )
        ;
      if ( field_key ) {
        return [ field_key, field_str ];
      }
    },
    result_map = {}
    ;

  test_obj.expect( 5 );

  field_list.map( map_util_obj._invokeFn_ );
  test_obj.deepEqual( field_list, clone_list );

  map_util_obj._setArgList_(     arg_list );
  map_util_obj._setMapFn_(         map_fn );
  map_util_obj._setResultMap_( result_map );

  test_obj.deepEqual( map_util_obj._getArgList_(),   arg_list,   'check' );
  test_obj.deepEqual( map_util_obj._getMapFn_(),     map_fn,     'check' );
  test_obj.deepEqual( map_util_obj._getResultMap_(), result_map, 'check' );

  field_list.map( map_util_obj._invokeFn_ );
  test_obj.deepEqual( result_map,
    { cows : 'moo', donkeys : 'garaaah', sheep : 'bahbah'}
  );

  test_obj.done();
}

function makeMetricStr ( test_obj ) {
  var
    assert_table  = [
      // [ arg_list, expect_data ]
      [ [ __undef   ],    '0.00'  ],
      [ [ __null    ],    '0.00'  ],
      [ [ -35       ],   '-35.0'  ],
      [ [ []        ],    '0.00'  ],
      [ [ 1,2,3,4   ],    '1.00'  ],
      [ [ 0.956     ],   '0.956'  ],
      [ [ 0.95623   ],   '0.956'  ],
      [ [ 0.95683   ],   '0.957'  ],
      [ [    -0.856 ],  '-0.856'  ],
      [ [  -0.85623 ],  '-0.856'  ],
      [ [  -0.85683 ],  '-0.857'  ],
      [ [      23.1 ],    '23.1'  ],
      [ [    23.123 ],    '23.1'  ],
      [ [    23.158 ],    '23.2'  ],
      [ [     -25.1 ],   '-25.1'  ],
      [ [   -25.125 ],   '-25.1'  ],
      [ [   -25.158 ],   '-25.2'  ],
      [ [       510 ],     '510'  ],
      [ [      -823 ],    '-823'  ],
      [ [      1000 ],   '1.00K'  ],
      [ [      -1e6 ],  '-1.00M'  ],
      [ [       1e6 ],   '1.00M'  ],
      [ [      -1e9 ],  '-1.00G'  ],
      [ [       1e9 ],   '1.00G'  ],
      [ [  2.8693e9 ],   '2.87G'  ],
    ],

    assert_count = assert_table.length,
    make_str_fn  = __util._makeMetricStr_,

    idx,        expect_list, arg_list,
    expect_str, solve_str,   msg_str
    ;

  test_obj.expect( assert_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = make_str_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}
function makeOptionHtml ( test_obj ) {
  var
    assert_table  = [
      // [ arg_map, expect_data ]
      [ __undef,     __blank ],
      [ __null,      __blank ],
      [ -35,         __blank ],
      [ [],          __blank ],
      [ [ 1,2,3,4],  __blank ],
      [ {},          __blank ],
      [ { _val_list_ : [ 1 ] }, '<option value="1">1</option>' ],
      [ { _val_list_ : [ 1 ], _label_map_ : { 1 : 'One' } },
        '<option value="1">One</option>'
      ],
      [ { _val_list_  : [ 'rosey', 'betty' ],
        _label_map_   : { 'rosey' : 'The Rose' },
        _select_list_ : [ 'betty' ]
      },
        '<option value="rosey">The Rose</option>'
        + '<option value="betty" selected="selected">Betty</option>'
      ],
      [ { _val_list_  : [ 'rosey', 'betty', 'debauch',
          { cow: __null }, [ 32 ], __undef, 99, 865, -22, __null
         ],
          _label_map_   : { 'debauch' : 'De Bauch Airy' },
          _select_list_ : [ 'debauch', -22 ]
        },
        '<option value="rosey">Rosey</option>'
        + '<option value="betty">Betty</option>'
        + '<option value="debauch" selected="selected">De Bauch Airy</option>'
        + '<option value="99">99</option>'
        + '<option value="865">865</option>'
        + '<option value="-22" selected="selected">-22</option>'
      ]
    ],

    assert_count = assert_table.length,
    make_str_fn  = __util._makeOptionHtml_,

    idx,        expect_list, arg_map,
    expect_str, solve_str,   msg_str
    ;

  test_obj.expect( assert_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_map     = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = make_str_fn( arg_map );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makePadNumStr ( test_obj ) {
  var
    assert_table  = [
      [ [ __undef       ], __blank ],
      [ [ __undef, __0  ], __blank ],
      [ [ __null,  __n1 ], __blank ],
      [ [ 'frank'       ], __blank ],
      [ [ '   25', __n1 ],    '25' ],
      [ [ '   25', __1  ],    '25' ],
      [ [ '   25', __2  ],    '25' ],
      [ [ '   25', __3  ],   '025' ],
      [ [ '   25', __4  ],  '0025' ],
      [ [ '00025', __n1 ],    '25' ],
      [ [ '00025', __1  ],    '25' ],
      [ [ '00025', __2  ],    '25' ],
      [ [ '00025', __3  ],   '025' ],
      [ [ '00025', __4  ],  '0025' ],
      [ [      25, __n1 ],    '25' ],
      [ [      25, __1  ],    '25' ],
      [ [      25, __2  ],    '25' ],
      [ [      25, __3  ],   '025' ],
      [ [      25, __4  ],  '0025' ],
      [ [ '-025', __n1 ],   '-25'  ],
      [ [ '-025', __1  ],   '-25'  ],
      [ [ '-025', __2  ],   '-25'  ],
      [ [ '-025', __3  ],   '-25'  ],
      [ [ '-025', __4  ],  '-025'  ],
      [ [ '-025',   5  ], '-0025'  ]
    ],
    assert_count = assert_table.length,
    make_str_fn  = __util._makePadNumStr_,

    idx, expect_list, arg_list, expect_str,
    solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
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
    assert_table  = [
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
    assert_count = assert_table.length,
    make_str_fn  = __util._makePctStr_,

    idx, expect_list, arg_list, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str = make_str_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. ' + solve_str + ' === ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeRadioHtml ( test_obj ) {
  var
    assert_table  = [
      // [ arg_map, expect_data ]
      [ __undef,     __blank ],
      [ __null,      __blank ],
      [ -35,         __blank ],
      [ [],          __blank ],
      [ [ 1,2,3,4],  __blank ],
      [ {},          __blank ],
      [ { _group_name_ : 'fred', _match_str_:1, _val_list_: [1,2,3]},
        '<label>'
        + '<input type="radio" name="fred" value="1" checked="checked"/>'
        + '1</label>'
        + '<label><input type="radio" name="fred" value="2"/>2</label>'
        + '<label><input type="radio" name="fred" value="3"/>3</label>'
      ],
      [ { _group_name_ : 'bs', _match_str_: __null,
          _val_list_: [ [ 'foolish' ], { some: 'map', count: 22 }, __null,
            '6', 'gal', 'pal', __undef ]
          },
        '<label><input type="radio" name="bs" value="6"/>6</label>'
        + '<label><input type="radio" name="bs" value="gal"/>Gal</label>'
        + '<label><input type="radio" name="bs" value="pal"/>Pal</label>'
      ],
      [ { _group_name_ : 'bs', _match_str_: 'gal',
          _val_list_: [ '6', 'gal', 'pal' ],
          _label_map_ : { 6 : 'Six', gal: 'Girl', pal : 'Friend' }
      },
        '<label><input type="radio" name="bs" value="6"/>Six</label>'
        + '<label><input type="radio" name="bs" value="gal" '
          + 'checked="checked"/>Girl</label>'
        + '<label><input type="radio" name="bs" value="pal"/>Friend</label>'
      ]
    ],

    assert_count = assert_table.length,
    make_str_fn  = __util._makeRadioHtml_,

    idx,        expect_list, arg_map,
    expect_str, solve_str,   msg_str
    ;

  test_obj.expect( assert_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_map     = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = make_str_fn( arg_map );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeReplaceFn ( test_obj ) {
  var
    tmplt1_str = '{_1_} {_2_} {_3_} {_d_}',
    tmplt2_str = '{_c_} {_d_} {_e_} {_d_}',
    ret_1a_str = '2 {_2_} {_3_} {_d_}',
    ret_1b_str = 'fred {_2_} {_3_} {_d_}',
    ret_1c_str = '{_1_} {_2_} {_3_} fred',
    ret_2c_str = '{_c_} fred {_e_} fred',

    // [ arg_list, expect_data from fn ]
    assert_table  = [
      [ [],                tmplt1_str, tmplt2_str ],
      [ [ __undef ],       tmplt1_str, tmplt2_str ],
      [ [ {}, 'party' ],   tmplt1_str, tmplt2_str ],
      [ [ 1,2,3,4,5 ],     tmplt1_str, tmplt2_str ],
      [ [ '_1_',2 ],       ret_1a_str, tmplt2_str ],
      [ [ '_1_', 'fred' ], ret_1b_str, tmplt2_str ],
      [ [ '_d_', 'fred' ], ret_1c_str, ret_2c_str ]
    ],

    assert_count = assert_table.length,
    test_count   = __0,

    make_str_fn, idx,         expect_list,
    arg_list,    expect1_str, expect2_str,
    solve1_str,  solve2_str,  msg_str
    ;

  test_obj.expect( assert_count * __2 );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
    arg_list     = expect_list[ __0 ];
    expect1_str  = expect_list[ __1 ];
    expect2_str  = expect_list[ __2 ];
    make_str_fn  = __util._makeReplaceFn_.apply( __undef, arg_list );

    solve1_str = make_str_fn( tmplt1_str );
    msg_str    = __Str( test_count ) + '. '
      + '|' + __Str( solve1_str ) + '| === |' + expect1_str + '|';
    test_obj.ok( solve1_str === expect1_str, msg_str );
    test_count++;

    solve2_str = make_str_fn( tmplt2_str );
    msg_str    = __Str( test_count ) + '. '
      + '|' + __Str( solve2_str ) + '| === |' + expect2_str + '|';
    test_obj.ok( solve2_str === expect2_str, msg_str );
    test_count++;
  }
  test_obj.done();
}

function makeScrubStr ( test_obj ) {
  var
    assert_table  = [
      // [ arg_list, expect_data ]
      [ [ __undef       ], __blank  ],
      [ [ __undef, __0  ], __blank  ],
      [ [ __null,  __n1 ], __blank  ],
      [ [ [],      __1  ], __blank  ],
      [ [ {}            ], __blank  ],
      [ [ 'hello' ], 'hello' ],
      [ [ '<h1>hello</h1>' ], 'hello' ],
      [ [ '<div>hello</div>' ], 'hello' ],
      [ [ '<div><h1>hello</h1><p>This is lc.</p></div>' ],
          'helloThis is lc.' ],
      [ [ '<div><h1>Hello! </h1><p>This is lc.</p></div>' ],
        'Hello! This is lc.' ],
      [ [ '<ul><li>Fred</li><li>Barney</li><li>Wilma</li><li>Betty</li>' ],
        'FredBarneyWilmaBetty' ],
      [ [ 'hello', __false ], 'hello' ],
      [ [ '<h1>hello</h1>', 'freddy' ], 'hello' ],
      [ [ '<div>hello</div>', 12 ], 'hello' ],
      [ [ '<div><h1>hello</h1><p>This is lc.</p></div>', __undef ],
        'helloThis is lc.' ],
      [ [ '<div><h1>Hello! </h1><p>This is lc.</p></div>', __null ],
        'Hello! This is lc.' ],
      [ [ '<ul><li>Fred</li><li>Barney</li><li>Wilma</li><li>Betty</li>', __0 ],
        'FredBarneyWilmaBetty' ],
      [ [ 'hello', __true ], 'hello' ],
      [ [ '<h1>hello</h1>', 'freddy' ], 'hello' ],
      [ [ '<div>hello</div>', __true ], 'hello' ],
      [ [ '<div><h1>hello</h1><p>This is lc.</p></div>', __1 ],
        'hello This is lc.' ],
      [ [ '<div><h1>Hello!</h1><p>This is lc.</p></div>', __1 ],
        'Hello! This is lc.' ],
      [ [ '<ul><li>Fred</li><li>Barney</li><li>Wilma</li><li>Betty</li></ul>',
        __true ],
        'Fred Barney Wilma Betty' ]
    ],

    assert_count = assert_table.length,
    make_str_fn   = __util._makeScrubStr_,

    idx,        expect_list, arg_list,
    expect_str, solve_str,   msg_str
    ;

  test_obj.expect( assert_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_str   = expect_list[ __1 ];
    solve_str   = make_str_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeSeenMap ( test_obj ) {
  var
    data_map     = { _foo_ : 'bar', _baz_ : 22 },
    assert_table  = [
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
    assert_count = assert_table.length,
    make_map_fn  = __util._makeSeenMap_,

    idx, expect_list, arg_list, expect_map, solve_map, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
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

// The makeSeriesMap assert_map looks like this:
// assert_table = [
//   { ..expect_map.. },
//   [ { ..alt1_expect_map.. }, ... { ..altN_expect_map.. } ],
//   'ditto',
// ]
// { ..expect_map.. } = expected results from test
// [ ..alt_list.. ]   = alternate expect maps, any match is good
// 'ditto'            = use same data from last row
//
// We use the 'ditto' tag to avoid duplicating tons of data.
// We use the alt_list structure where algorithmic jitter can result
//   in two or more valid results.
//
function makeSeriesMap ( test_obj ) {
  var
    start_ms   = 1465452840000,
    delta_list = [
      1000,         // 1s
      5000,         // 5s
      20000,        // 20s
      40000,        // 40s
      140000,       // 2.3m
      3540000,      // 5.9m
      7140000,      // 11.9m
      14280000,     // 3.97hr
      28560000      // 7.93hr
      // 57440000,     // 15.96hr
      // 114080000,    // 31.69hr
      // 231360000,    // 2.68d
      // 460800000,    // 5.33d
      // 928000000,    // 10.74d
      // 1840640000    // 21.30d

      // These need some love to improve larger date-size presentation
      // 3769600000,   // 43.67d
      // 7354419200,   // 85.12d
      // 14708838400   // 170.24d
    ],
    interval_list = [ 2,3,4,5,6,7,9,11,13,15,17,21 ],
    assert_table = [
      // begin 1s expect list
      {"_time_idx_":3,"_unit_count_":2,"_unit_ms_":500,"_unit_name_":"0.5s","_left_ratio_":0.5,"_unit_ratio_":0.5,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:00"]},
      {"_time_idx_":3,"_unit_count_":4,"_unit_ms_":250,"_unit_name_":"0.25s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:00","06:14:00","06:14:00"]},
      'ditto', 'ditto', 'ditto', 'ditto',
      // these can not be solve with our current config
      __undef, __undef, __undef, __undef, __undef, __undef,
      // . end 1s expect list

      // begin 5s expect list
      {"_time_idx_":3,"_unit_count_":2,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.5,"_unit_ratio_":0.5,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:02"]},
      'ditto',
      {"_time_idx_":3,"_unit_count_":5,"_unit_ms_":1000,"_unit_name_":"1s","_left_ratio_":0.2,"_unit_ratio_":0.2,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:01","06:14:02","06:14:03","06:14:04"]},
      'ditto', 'ditto', 'ditto',
      {"_time_idx_":3,"_unit_count_":10,"_unit_ms_":500,"_unit_name_":"0.5s","_left_ratio_":0.1,"_unit_ratio_":0.1,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:00","06:14:01","06:14:01","06:14:02","06:14:02","06:14:03","06:14:03","06:14:03","06:14:04","06:14:04"]},
      'ditto', 'ditto',
      {"_time_idx_":3,"_unit_count_":20,"_unit_ms_":250,"_unit_name_":"0.25s","_left_ratio_":0.05,"_unit_ratio_":0.05,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:00","06:14:00","06:14:00","06:14:01","06:14:01","06:14:01","06:14:01","06:14:01","06:14:02","06:14:02","06:14:02","06:14:03","06:14:03","06:14:03","06:14:03","06:14:04","06:14:04","06:14:04","06:14:04"]},
      'ditto', 'ditto',
      // . end 5s expect list

      // begin 20s expect list
      {"_time_idx_":3,"_unit_count_":2,"_unit_ms_":10000,"_unit_name_":"10s","_left_ratio_":0.5,"_unit_ratio_":0.5,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:10"]},
      {"_time_idx_":3,"_unit_count_":4,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:05","06:14:10","06:14:15"]},
      'ditto', 'ditto',
      {"_time_idx_":3,"_unit_count_":8,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:02","06:14:05","06:14:07","06:14:10","06:14:12","06:14:15","06:14:17"]},
      'ditto', 'ditto', 'ditto',
      {"_time_idx_":3,"_unit_count_":20,"_unit_ms_":1000,"_unit_name_":"1s","_left_ratio_":0.05,"_unit_ratio_":0.05,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:01","06:14:02","06:14:03","06:14:04","06:14:05","06:14:06","06:14:07","06:14:07","06:14:09","06:14:09","06:14:10","06:14:12","06:14:13","06:14:14","06:14:15","06:14:16","06:14:17","06:14:18","06:14:19"]},
      'ditto', 'ditto', 'ditto',
      // . end 20s expect list

      // begin 40s expect list
      {"_time_idx_":3,"_unit_count_":3,"_unit_ms_":15000,"_unit_name_":"15s","_left_ratio_":0.375,"_unit_ratio_":0.375,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:15","06:14:30"]},
      'ditto',
      {"_time_idx_":3,"_unit_count_":4,"_unit_ms_":10000,"_unit_name_":"10s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:10","06:14:20","06:14:30"]},
      'ditto',
      {"_time_idx_":3,"_unit_count_":8,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:05","06:14:10","06:14:15","06:14:20","06:14:25","06:14:30","06:14:35"]},
      'ditto', 'ditto', 'ditto',
      {"_time_idx_":3,"_unit_count_":16,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.0625,"_unit_ratio_":0.0625,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:02","06:14:05","06:14:07","06:14:10","06:14:12","06:14:15","06:14:17","06:14:20","06:14:22","06:14:25","06:14:27","06:14:30","06:14:32","06:14:35","06:14:37"]},
      'ditto', 'ditto', 'ditto',
      // . end 40s expect list

      // begin 2.3m expect list
      {"_time_idx_":2,"_unit_count_":2,"_unit_ms_":60000,"_unit_name_":"1m","_left_ratio_":0.42857142857142855,"_unit_ratio_":0.42857142857142855,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:15","06:16"]},
      'ditto',
      {"_time_idx_":3,"_unit_count_":5,"_unit_ms_":30000,"_unit_name_":"30s","_left_ratio_":0.21428571428571427,"_unit_ratio_":0.21428571428571427,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:30","06:15:00","06:15:29","06:16:00"]},
      'ditto', 'ditto',
      {"_time_idx_":3,"_unit_count_":9,"_unit_ms_":15000,"_unit_name_":"15s","_left_ratio_":0.10714285714285714,"_unit_ratio_":0.10714285714285714,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:15","06:14:30","06:14:44","06:15:00","06:15:15","06:15:29","06:15:44","06:15:59","06:16:14"]},
      'ditto',
      {"_time_idx_":3,"_unit_count_":14,"_unit_ms_":10000,"_unit_name_":"10s","_left_ratio_":0.07142857142857142,"_unit_ratio_":0.07142857142857142,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:10","06:14:20","06:14:30","06:14:40","06:14:49","06:14:59","06:15:09","06:15:19","06:15:29","06:15:39","06:15:49","06:15:59","06:16:09","06:16:19"]},
      'ditto', 'ditto', 'ditto',
      {"_time_idx_":3,"_unit_count_":28,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.03571428571428571,"_unit_ratio_":0.03571428571428571,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:14:05","06:14:10","06:14:15","06:14:20","06:14:24","06:14:29","06:14:34","06:14:39","06:14:44","06:14:49","06:14:54","06:14:59","06:15:04","06:15:09","06:15:14","06:15:19","06:15:24","06:15:29","06:15:34","06:15:39","06:15:44","06:15:49","06:15:54","06:15:59","06:16:04","06:16:09","06:16:14","06:16:19"]},
      // . end 2.3m expect list

      // begin 5.9m expect list
      {"_time_idx_":2,"_unit_count_":2,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.2711864406779661,"_unit_ratio_":0.5084745762711864,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:30","06:59"]},
      {"_time_idx_":2,"_unit_count_":4,"_unit_ms_":900000,"_unit_name_":"15m","_left_ratio_":0.01694915254237288,"_unit_ratio_":0.2542372881355932,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:15","06:30","06:44","06:59"]},
      'ditto',
      {"_time_idx_":2,"_unit_count_":6,"_unit_ms_":600000,"_unit_name_":"10m","_left_ratio_":0.1016949152542373,"_unit_ratio_":0.1694915254237288,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:20","06:30","06:40","06:49","06:59","07:09"]},
      'ditto', 'ditto',
      {"_time_idx_":2,"_unit_count_":12,"_unit_ms_":300000,"_unit_name_":"5m","_left_ratio_":0.01694915254237288,"_unit_ratio_":0.0847457627118644,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:15","06:20","06:25","06:30","06:35","06:40","06:44","06:49","06:54","06:59","07:04","07:09"]},
      'ditto', 'ditto', 'ditto', 'ditto',
      {"_time_idx_":3,"_unit_count_":24,"_unit_ms_":150000,"_unit_name_":"2.5m","_left_ratio_":0.01694915254237288,"_unit_ratio_":0.0423728813559322,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:15:00","06:17:29","06:20:00","06:22:30","06:25:00","06:27:30","06:30:00","06:32:30","06:35:00","06:37:30","06:40:00","06:42:30","06:44:59","06:47:29","06:49:59","06:52:29","06:54:59","06:57:29","06:59:59","07:02:29","07:04:59","07:07:29","07:09:59","07:12:29"]},
      // . end 5.9m expect list

      // begin 11.9m expect list
      {"_time_idx_":2,"_unit_count_":2,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.3865546218487395,"_unit_ratio_":0.5042016806722689,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["07:00","08:00"]},
      {"_time_idx_":2,"_unit_count_":4,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.13445378151260504,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:30","06:59","07:30","08:00"]},
      'ditto', 'ditto',
      {"_time_idx_":2,"_unit_count_":8,"_unit_ms_":900000,"_unit_name_":"15m","_left_ratio_":0.008403361344537815,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:15","06:30","06:44","06:59","07:14","07:30","07:45","08:00"]},
      'ditto', 'ditto',
      {"_time_idx_":2,"_unit_count_":12,"_unit_ms_":600000,"_unit_name_":"10m","_left_ratio_":0.05042016806722689,"_unit_ratio_":0.08403361344537816,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:20","06:30","06:40","06:50","07:00","07:10","07:20","07:30","07:40","07:50","08:00","08:10"]},
      'ditto', 'ditto', 'ditto',
      {"_time_idx_":2,"_unit_count_":24,"_unit_ms_":300000,"_unit_name_":"5m","_left_ratio_":0.008403361344537815,"_unit_ratio_":0.04201680672268908,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:15","06:20","06:25","06:30","06:35","06:40","06:45","06:50","06:55","07:00","07:05","07:10","07:15","07:20","07:25","07:30","07:35","07:40","07:45","07:49","07:54","07:59","08:04","08:09"]},
      // . end 11.9m expect list

      // begin 3.97hr expect list
      [
        {"_time_idx_":2,"_unit_count_":2,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.19327731092436976,"_unit_ratio_":0.5042016806722689,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["07:00","09:00"]},
        {"_time_idx_":2,"_unit_count_":2,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.44537815126050423,"_unit_ratio_":0.5042016806722689,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["08:00","10:00"]}
      ],
      {"_time_idx_":2,"_unit_count_":4,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.19327731092436976,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["07:00","08:00","09:00","10:00"]},
      'ditto', 'ditto',
      {"_time_idx_":2,"_unit_count_":8,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.06722689075630252,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:30","06:59","07:30","08:00","08:30","09:00","09:30","10:00"]},
      'ditto', 'ditto', 'ditto',
      [
        {"_time_idx_":2,"_unit_count_":16,"_unit_ms_":900000,"_unit_name_":"15m","_left_ratio_":0.004201680672268907,"_unit_ratio_":0.06302521008403361,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:15","06:30","06:44","06:59","07:14","07:30","07:45","08:00","08:15","08:30","08:45","09:00","09:15","09:30","09:45","10:00"]},
        {"_time_idx_":2,"_unit_count_":4,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.09663865546218488,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["07:00","09:00","11:00","13:00"]}
      ],
      'ditto', 'ditto',
      [
        {"_time_idx_":2,"_unit_count_":24,"_unit_ms_":600000,"_unit_name_":"10m","_left_ratio_":0.025210084033613446,"_unit_ratio_":0.04201680672268908,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:20","06:30","06:40","06:50","07:00","07:10","07:20","07:30","07:40","07:50","08:00","08:10","08:20","08:30","08:40","08:50","09:00","09:09","09:19","09:29","09:39","09:49","09:59","10:09"]},
        {"_time_idx_":2,"_unit_count_":4,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.09663865546218488,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["07:00","09:00","11:00","13:00"]}
      ],
      // . end 11.9m expect list

      //  begin 7.93hr expect list
      [
        {"_time_idx_":2,"_unit_count_":2,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.22268907563025211,"_unit_ratio_":0.5042016806722689,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["08:00","12:00"]},
        {"_time_idx_":2,"_unit_count_":2,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.3487394957983193,"_unit_ratio_":0.5042016806722689,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["09:00","13:00"]}
      ],
      [
        {"_time_idx_":2,"_unit_count_":4,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.22268907563025211,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["08:00","10:00","12:00","14:00"]},
        {"_time_idx_":2,"_unit_count_":4,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.09663865546218488,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["07:00","09:00","11:00","13:00"]}
      ],
      'ditto', 'ditto',
      {"_time_idx_":2,"_unit_count_":8,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.09663865546218488,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00"]},
      'ditto', 'ditto', 'ditto',
      {"_time_idx_":2,"_unit_count_":16,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.03361344537815126,"_unit_ratio_":0.06302521008403361,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:30","06:59","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00"]},
      'ditto', 'ditto',
      {"_time_idx_":2,"_unit_count_":16,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.03361344537815126,"_unit_ratio_":0.06302521008403361,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["06:30","06:59","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00"]},
      // . end 7.93hr expect list

      // begin 15.96hr expect list
      {"_time_idx_":2,"_unit_count_":2,"_unit_ms_":28800000,"_unit_name_":"8hr","_left_ratio_":0.36142061281337046,"_unit_ratio_":0.5013927576601671,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["12:00","20:00"]},
      {"_time_idx_":2,"_unit_count_":3,"_unit_ms_":21600000,"_unit_name_":"6hr","_left_ratio_":0.1107242339832869,"_unit_ratio_":0.37604456824512533,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["08:00","14:00","20:00"]},
      {"_time_idx_":2,"_unit_count_":4,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.1107242339832869,"_unit_ratio_":0.25069637883008355,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["08:00","12:00","16:00","20:00"]},
      'ditto',
      {"_time_idx_":2,"_unit_count_":8,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.1107242339832869,"_unit_ratio_":0.12534818941504178,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00"]},
      'ditto', 'ditto', 'ditto',
      {"_time_idx_":2,"_unit_count_":16,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.06267409470752089,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":1}],"_time_list_":["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","14:59","15:59","16:59","17:59","18:59","19:59","20:59","21:59"]},
      'ditto', 'ditto', 'ditto',
      // . end 15.96hr expect list

      // begin 31.69hr expect list
      {"_time_idx_":1,"_unit_count_":3,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.05575035063113604,"_unit_ratio_":0.37868162692847124,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.5606591865357644},{"_date_str_":"06/10/2016","_width_ratio_":0.4393408134642357}],"_time_list_":["08","20","07"]},
      'ditto',
      {"_time_idx_":2,"_unit_count_":4,"_unit_ms_":28800000,"_unit_name_":"8hr","_left_ratio_":0.18197755960729312,"_unit_ratio_":0.25245441795231416,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.5606591865357644},{"_date_str_":"06/10/2016","_width_ratio_":0.4393408134642357}],"_time_list_":["12:00","20:00","04:00","12:00"]},
      {"_time_idx_":2,"_unit_count_":5,"_unit_ms_":21600000,"_unit_name_":"6hr","_left_ratio_":0.05575035063113604,"_unit_ratio_":0.18934081346423562,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.5606591865357644},{"_date_str_":"06/10/2016","_width_ratio_":0.4393408134642357}],"_time_list_":["08:00","14:00","20:00","02:00","07:59"]},
      'ditto',
      {"_time_idx_":2,"_unit_count_":8,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.05575035063113604,"_unit_ratio_":0.12622720897615708,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.5606591865357644},{"_date_str_":"06/10/2016","_width_ratio_":0.4393408134642357}],"_time_list_":["08:00","12:00","16:00","20:00","00:00","04:00","08:00","12:00"]},
      'ditto', 'ditto',
      {"_time_idx_":2,"_unit_count_":16,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.05575035063113604,"_unit_ratio_":0.06311360448807854,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.5606591865357644},{"_date_str_":"06/10/2016","_width_ratio_":0.4393408134642357}],"_time_list_":["08:00","09:59","12:00","14:00","16:00","17:59","20:00","22:00","00:00","02:00","04:00","06:00","08:00","10:00","12:00"]},
      'ditto', 'ditto', 'ditto',
      // . end 31.69hr expect list

      //  begin 2.68d expect list
      {"_time_idx_":1,"_unit_count_":3,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.2142116182572614,"_unit_ratio_":0.37344398340248963,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.27645228215767637},{"_date_str_":"06/10/2016","_width_ratio_":0.37344398340248963},{"_date_str_":"06/11/2016","_width_ratio_":0.3501037344398341}],"_time_list_":["20","20","20"]},
      'ditto',
      {"_time_idx_":1,"_unit_count_":5,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.027489626556016597,"_unit_ratio_":0.18672199170124482,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.27645228215767637},{"_date_str_":"06/10/2016","_width_ratio_":0.37344398340248963},{"_date_str_":"06/11/2016","_width_ratio_":0.3501037344398341}],"_time_list_":["08","20","08","20","08","20"]},
      'ditto', 'ditto',
      {"_time_idx_":2,"_unit_count_":8,"_unit_ms_":28800000,"_unit_name_":"8hr","_left_ratio_":0.08973029045643154,"_unit_ratio_":0.12448132780082988,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.27645228215767637},{"_date_str_":"06/10/2016","_width_ratio_":0.37344398340248963},{"_date_str_":"06/11/2016","_width_ratio_":0.3501037344398341}],"_time_list_":["12:00","20:00","04:00","12:00","20:00","04:00","12:00","20:00"]},
      'ditto',
      {"_time_idx_":2,"_unit_count_":11,"_unit_ms_":21600000,"_unit_name_":"6hr","_left_ratio_":0.027489626556016597,"_unit_ratio_":0.09336099585062241,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.27645228215767637},{"_date_str_":"06/10/2016","_width_ratio_":0.37344398340248963},{"_date_str_":"06/11/2016","_width_ratio_":0.3501037344398341}],"_time_list_":["08:00","14:00","20:00","02:00","08:00","14:00","20:00","02:00","08:00","14:00","20:00"]},
      'ditto',
      {"_time_idx_":2,"_unit_count_":16,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.027489626556016597,"_unit_ratio_":0.06224066390041494,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.27645228215767637},{"_date_str_":"06/10/2016","_width_ratio_":0.37344398340248963},{"_date_str_":"06/11/2016","_width_ratio_":0.3501037344398341}],"_time_list_":["08:00","12:00","16:00","20:00","00:00","04:00","08:00","12:00","16:00","20:00","00:00","04:00","08:00","12:00","16:00","20:00"]},
      'ditto', 'ditto',
      // . end 2.68d expect list

      // begin 5.33d expect list
      {"_time_idx_":1,"_unit_count_":3,"_unit_ms_":172800000,"_unit_name_":"2d","_left_ratio_":0.10755208333333334,"_unit_ratio_":0.375,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.13880208333333333},{"_date_str_":"06/10/2016","_width_ratio_":0.1875},{"_date_str_":"06/11/2016","_width_ratio_":0.1875},{"_date_str_":"06/12/2016","_width_ratio_":0.1875},{"_date_str_":"06/13/2016","_width_ratio_":0.1875},{"_date_str_":"06/14/2016","_width_ratio_":0.11119791666666679}],"_time_list_":["20","20","20"]},
      'ditto',
      {"_time_idx_":1,"_unit_count_":5,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.10755208333333334,"_unit_ratio_":0.1875,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.13880208333333333},{"_date_str_":"06/10/2016","_width_ratio_":0.1875},{"_date_str_":"06/11/2016","_width_ratio_":0.1875},{"_date_str_":"06/12/2016","_width_ratio_":0.1875},{"_date_str_":"06/13/2016","_width_ratio_":0.1875},{"_date_str_":"06/14/2016","_width_ratio_":0.11119791666666679}],"_time_list_":["20","20","20","20","20"]},
      'ditto', 'ditto', 'ditto',
      {"_time_idx_":1,"_unit_count_":11,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.013802083333333333,"_unit_ratio_":0.09375,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.13880208333333333},{"_date_str_":"06/10/2016","_width_ratio_":0.1875},{"_date_str_":"06/11/2016","_width_ratio_":0.1875},{"_date_str_":"06/12/2016","_width_ratio_":0.1875},{"_date_str_":"06/13/2016","_width_ratio_":0.1875},{"_date_str_":"06/14/2016","_width_ratio_":0.11119791666666679}],"_time_list_":["08","20","08","20","08","20","08","20","08","20","08"]},
      'ditto', 'ditto',
      {"_time_idx_":2,"_unit_count_":16,"_unit_ms_":28800000,"_unit_name_":"8hr","_left_ratio_":0.04505208333333333,"_unit_ratio_":0.0625,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.13880208333333333},{"_date_str_":"06/10/2016","_width_ratio_":0.1875},{"_date_str_":"06/11/2016","_width_ratio_":0.1875},{"_date_str_":"06/12/2016","_width_ratio_":0.1875},{"_date_str_":"06/13/2016","_width_ratio_":0.1875},{"_date_str_":"06/14/2016","_width_ratio_":0.11119791666666679}],"_time_list_":["12:00","20:00","04:00","12:00","20:00","04:00","12:00","20:00","04:00","12:00","20:00","04:00","12:00","20:00","04:00","12:00"]},
      'ditto',
      {"_time_idx_":2,"_unit_count_":21,"_unit_ms_":21600000,"_unit_name_":"6hr","_left_ratio_":0.013802083333333333,"_unit_ratio_":0.046875,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.13880208333333333},{"_date_str_":"06/10/2016","_width_ratio_":0.1875},{"_date_str_":"06/11/2016","_width_ratio_":0.1875},{"_date_str_":"06/12/2016","_width_ratio_":0.1875},{"_date_str_":"06/13/2016","_width_ratio_":0.1875},{"_date_str_":"06/14/2016","_width_ratio_":0.11119791666666679}],"_time_list_":["08:00","14:00","20:00","02:00","08:00","14:00","20:00","02:00","08:00","14:00","20:00","02:00","08:00","14:00","20:00","02:00","08:00","14:00","20:00","02:00","08:00","14:00"]},
      // . end 5.33d expect list

      // begin 10.74d expect list
      {"_time_idx_":1,"_unit_count_":2,"_unit_ms_":604800000,"_unit_name_":"1wk","_left_ratio_":0.6120258620689655,"_unit_ratio_":0.6517241379310345,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.06892241379310345},{"_date_str_":"06/10/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/11/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/12/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/13/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/14/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/15/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/16/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/17/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/18/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/19/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/20/2016","_width_ratio_":0.0000431034482758913}],"_time_list_":["20"]},
      {"_time_idx_":1,"_unit_count_":3,"_unit_ms_":345600000,"_unit_name_":"4d","_left_ratio_":0.23961206896551723,"_unit_ratio_":0.3724137931034483,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.06892241379310345},{"_date_str_":"06/10/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/11/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/12/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/13/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/14/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/15/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/16/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/17/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/18/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/19/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/20/2016","_width_ratio_":0.0000431034482758913}],"_time_list_":["20","20","20"]},
      {"_time_idx_":1,"_unit_count_":5,"_unit_ms_":172800000,"_unit_name_":"2d","_left_ratio_":0.053405172413793105,"_unit_ratio_":0.18620689655172415,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.06892241379310345},{"_date_str_":"06/10/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/11/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/12/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/13/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/14/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/15/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/16/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/17/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/18/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/19/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/20/2016","_width_ratio_":0.0000431034482758913}],"_time_list_":["20","20","20","20","20","20"]},
      'ditto', 'ditto', 'ditto',
      {"_time_idx_":1,"_unit_count_":11,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.053405172413793105,"_unit_ratio_":0.09310344827586207,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.06892241379310345},{"_date_str_":"06/10/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/11/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/12/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/13/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/14/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/15/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/16/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/17/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/18/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/19/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/20/2016","_width_ratio_":0.0000431034482758913}],"_time_list_":["20","20","20","20","20","20","20","19","19","19","19"]},
      'ditto', 'ditto', 'ditto',
      {"_time_idx_":1,"_unit_count_":21,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.006853448275862069,"_unit_ratio_":0.04655172413793104,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.06892241379310345},{"_date_str_":"06/10/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/11/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/12/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/13/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/14/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/15/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/16/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/17/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/18/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/19/2016","_width_ratio_":0.09310344827586207},{"_date_str_":"06/20/2016","_width_ratio_":0.0000431034482758913}],"_time_list_":["08","20","08","20","08","20","08","20","08","20","07","20","08","20","08","20","08","20","08","20","08","20"]},
      'ditto',
      // . end 10.74d expect list

      // begin 21.30d expect list
      {"_time_idx_":1,"_unit_count_":3,"_unit_ms_":604800000,"_unit_name_":"1wk","_left_ratio_":0.3085665855354659,"_unit_ratio_":0.32858136300417246,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.034748783031988875},{"_date_str_":"06/10/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/11/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/12/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/13/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/14/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/15/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/16/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/17/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/18/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/19/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/20/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/21/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/22/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/23/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/24/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/25/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/26/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/27/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/28/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/29/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/30/2016","_width_ratio_":0.02644732267037589}],"_time_list_":["20","19","20"]},
      'ditto',
      {"_time_idx_":1,"_unit_count_":5,"_unit_ms_":345600000,"_unit_name_":"4d","_left_ratio_":0.1208058066759388,"_unit_ratio_":0.18776077885952713,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.034748783031988875},{"_date_str_":"06/10/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/11/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/12/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/13/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/14/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/15/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/16/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/17/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/18/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/19/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/20/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/21/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/22/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/23/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/24/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/25/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/26/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/27/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/28/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/29/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/30/2016","_width_ratio_":0.02644732267037589}],"_time_list_":["20","20","20","20","20"]},
      'ditto', 'ditto', 'ditto',
      {"_time_idx_":1,"_unit_count_":11,"_unit_ms_":172800000,"_unit_name_":"2d","_left_ratio_":0.026925417246175243,"_unit_ratio_":0.09388038942976357,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.034748783031988875},{"_date_str_":"06/10/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/11/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/12/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/13/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/14/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/15/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/16/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/17/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/18/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/19/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/20/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/21/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/22/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/23/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/24/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/25/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/26/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/27/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/28/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/29/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/30/2016","_width_ratio_":0.02644732267037589}],"_time_list_":["20","20","20","20","20","20","20","20","20","20","20"]},
      'ditto', 'ditto',
      {"_time_idx_":1,"_unit_count_":21,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.026925417246175243,"_unit_ratio_":0.04694019471488178,"_date_list_":[{"_date_str_":"06/09/2016","_width_ratio_":0.034748783031988875},{"_date_str_":"06/10/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/11/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/12/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/13/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/14/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/15/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/16/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/17/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/18/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/19/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/20/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/21/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/22/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/23/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/24/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/25/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/26/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/27/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/28/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/29/2016","_width_ratio_":0.04694019471488178},{"_date_str_":"06/30/2016","_width_ratio_":0.02644732267037589}],"_time_list_":["20","20","20","20","20","20","20","19","19","19","19","19","19","19","19","19","19","19","19","19","19"]},
      'ditto', 'ditto'
      // . end 21.30d expect list
    ],
    delta_count    = delta_list.length,
    expect_count   = __0,
    interval_count = interval_list.length,
    make_map_fn    = __util._makeSeriesMap_,
    tz_offset_ms   = __util._getTzOffsetMs_(),

    delta_idx, delta_ms, interval_idx, interval_int,
    alt_list, alt_count, alt_bool, alt_str, i,
    arg_map, tmp_data, assert_data, expect_map,
    solve_map, msg_str
    ;

  test_obj.expect( delta_count * interval_count );

  for ( delta_idx = __0; delta_idx < delta_count; delta_idx ++ ) {
    delta_ms = delta_list[ delta_idx ];
    INTV: for ( interval_idx = __0; interval_idx < interval_count; interval_idx ++ ) {
      interval_int = interval_list[ interval_idx ];
      arg_map = {
        _max_ms_       : start_ms + tz_offset_ms + delta_ms,
        _min_ms_       : start_ms + tz_offset_ms,
        _tgt_count_    : interval_int
      };
      solve_map = make_map_fn( arg_map );
      tmp_data  = assert_table[ expect_count ];

      // reuse prior data if directed
      if ( tmp_data !== 'ditto' ) {
        assert_data = tmp_data;
      }

      // test for alternates (compensates for algo jitter)
      if ( Array.isArray( assert_data ) ) {
        alt_list  = assert_data;
        alt_count = alt_list.length;
        alt_bool  = false;
        ALT: for ( i = 0; i < alt_count; i++ ) {
          alt_str  = JSON.stringify( alt_list[ i ] );
          alt_bool = JSON.stringify( solve_map ) === alt_str;
          if ( alt_bool ) { break ALT; }
        }
        test_obj.ok( alt_bool, 'At least one alternate matches' );
        expect_count++;
        continue INTV;
      }

      // deep test
      expect_map = assert_data;
      msg_str = __Str( expect_count ) + '. arg_map: '
        + JSON.stringify( arg_map ) + '\n solve_map: '
        + JSON.stringify( solve_map )
        + '\n expect_map: ' + JSON.stringify( expect_map );
      test_obj.deepEqual( solve_map, expect_map, msg_str );
      expect_count++;
    }
  }
  test_obj.done();
}

function makeStrFromMap ( test_obj ) {
  var
    prop01_map = {
      _name_ : 'fred', _state_code_: 'LA', _country_code_ : 'US'
    },
    prop02_map = {
      _first_name_ : 'Wilma', _last_name_ : 'Rubble', _age_num_ : 48,
      _mole_count_ : __0
    },
    prop01_list = Object.keys( prop01_map ),
    prop02_list = Object.keys( prop02_map ),
    prop01a_list = [ '_name_', '_missing_', __undef, __null, {} ],
    prop02a_list = [ {}, __null, __undef, '_first_name_', '_unseen_', '_age_num_' ],
    label01_map = { _name_ : 'Name', _state_code_ : 'State Code',
      _country_code_ : 'Country Code'
    },
    label02_map = { _first_name_ : 'First', _last_name_ : 'Last',
      _age_num_ : 'Age', _mole_count_ : 'Number of moles'
    },

    assert_table  = [
      // [ arg_map, expect_str ]
      [ { _prop_map_ : prop01_map }, __blank ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01_list }, 'fred LA US' ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01_list,
        _delim_str_ : ',' }, 'fred,LA,US' ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01_list,
        _do_label_ : __true, _delim_str_ : ', ' },
        '_name_: fred, _state_code_: LA, _country_code_: US' ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01_list,
        _delim_str_ : ', ', _label_map_ : label01_map },
        'Name: fred, State Code: LA, Country Code: US'
      ],
      [ { _prop_map_ : prop02_map }, __blank ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02_list },
        'Wilma Rubble 48 0' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02_list,
        _delim_str_ : ',' }, 'Wilma,Rubble,48,0' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02_list,
        _do_label_ : __true, _delim_str_ : ', ' },
        '_first_name_: Wilma, _last_name_: Rubble, _age_num_: 48,'
        + ' _mole_count_: 0' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02_list,
        _delim_str_ : ', ', _label_map_ : label02_map },
        'First: Wilma, Last: Rubble, Age: 48, Number of moles: 0'
      ],
      [ { _prop_map_ : prop01_map }, __blank ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01a_list }, 'fred' ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01a_list,
        _delim_str_ : ',' }, 'fred' ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01a_list,
        _do_label_ : __true, _delim_str_ : ', ' }, '_name_: fred' ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01a_list,
        _delim_str_ : ', ', _label_map_ : label01_map }, 'Name: fred'
      ],
      [ { _prop_map_ : prop02_map }, __blank ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02a_list },
        'Wilma 48' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02a_list,
        _do_label_ : __true }, '_first_name_: Wilma _age_num_: 48' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02a_list,
        _do_label_ : __true, _delim_str_ : ' | ' },
        '_first_name_: Wilma | _age_num_: 48' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02a_list,
        _do_label_ : __true, _delim_str_ : ' | ', _label_map_ : {
          _first_name_ : 'fff' , _age_num_ : 'isss' }
      }, 'fff: Wilma | isss: 48' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02a_list,
        _delim_str_ : ' | ', _label_map_ : {
          _first_name_ : 'fff' , _age_num_ : 'isss' }
      }, 'fff: Wilma | isss: 48' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02a_list,
        _delim_str_ : ' | ', _label_delim_str_ : ' === ', _label_map_ : {
          _first_name_ : 'fff' , _age_num_ : 'isss' }
      }, 'fff === Wilma | isss === 48' ]
    ],
    assert_count = assert_table.length,
    make_str_fn  = __util._makeStrFromMap_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_map     = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = make_str_fn( arg_map );
    msg_str     = __Str( idx ) + '. arg_map: '
      + JSON.stringify( arg_map ) + ' solve_str: >>'
      + solve_str + '<< expect_str: >>' + expect_str + '<<';
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeThrottle01Fn ( test_obj ) {
  var idx = __0, curry_fn;

  test_obj.expect( 3 );
  curry_fn = __util._makeThrottleFn_();

  test_obj.ok( curry_fn === __undef );

  curry_fn = __util._makeThrottleFn_({
    _fn_       : function () { idx++; },
    _do_asap_  : __false,
    _delay_ms_ : 10
  });
  curry_fn(); curry_fn(); curry_fn();
  curry_fn(); curry_fn(); curry_fn();
  test_obj.ok( idx === __1, 'idx === 1 not ' + idx );
  setTimeout( function () {
    test_obj.ok( idx === __2, 'idx === 2 not ' + idx );
    test_obj.done();
  }, 15 );
}

function makeTmpltStr ( test_obj ) {
  var
    t1_str  = 'some {_test_}',
    t2_str  = 'I told {_name_} some {_thing_._name_}s have {_thing_._part_}s',
    t3_str  = 'I wonder about {_thing_}s',
    t4_str  = '{_thing_} and {_thing_._name_} and {_thing_._part_} '
      + 'and {_thing_._foo_} and {_foo_} and {_foo_._bar_}.',
    assert_table  = [
      // [ arg_map, expect_str ]
      [ [],        __blank ],
      [ __null,    __blank ],
      [ __undef,   __blank ],
      [ 'fred',    __blank ],
      [ [1,2,3,4], __blank ],
      [ {},        __blank ],
      [ { _input_str_ : t1_str }, 'some ' ],
      [ { _input_str_ : t1_str, _lookup_map_ : { _test_ : 'bobby'}},
        'some bobby' ],
      [ { _input_str_ : t1_str, _lookup_map_ : { _test_ : 'Frank'}},
        'some Frank' ],
      [ { _input_str_ : t2_str }, 'I told  some s have s' ],
      [ { _input_str_ : t2_str, _lookup_map_ : { thing: {} } },
        'I told  some s have s' ],
      [ { _input_str_ : t2_str, _lookup_map_ : { _thing_: { _part_ : 'udder'} } },
        'I told  some s have udders' ],
      [ { _input_str_ : t2_str, _lookup_map_ : { _name_ : 'Frank',
        _thing_: { _part_ : 'udder' } } }, 'I told Frank some s have udders' ],
      [ { _input_str_ : t2_str, _lookup_map_ : { _name_ : 'Frank',
        _thing_: { _part_ : 'udder', _name_: 'cow' } } },
        'I told Frank some cows have udders' ],
      [ { _input_str_ : t3_str, _lookup_map_ : { _thing_: {
        _part_ : 'udder', _name_: 'cow' } } }, 'I wonder about s' ],
      [ { _input_str_ : t3_str, _lookup_map_ : { _thing_: 'Big Foot' } },
        'I wonder about Big Foots' ],
      [ { _input_str_ : t4_str }, ' and  and  and  and  and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : {} }, ' and  and  and  and  and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : { _thing_ : {} } },
        ' and  and  and  and  and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : { _thing_ : 'Tommy' } },
        'Tommy and  and  and  and  and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : { _thing_ : { _name_ : 'testy' }}},
        ' and testy and  and  and  and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : { _thing_ : { _name_ : 'testy',
        _part_ : 'part' }} }, ' and testy and part and  and  and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : { _thing_ : { _name_ : 'testy',
        _part_ : 'part' }, _foo_ : 'Bobby' } },
        ' and testy and part and  and Bobby and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : { _thing_ : { _name_ : 'testy',
        _part_ : 'part' }, _foo_ : { _bar_: 'Bat' } } },
        ' and testy and part and  and  and Bat.' ]
    ],

    assert_count = assert_table.length,
    make_str_fn  = __util._makeTmpltStr_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_map     = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str = make_str_fn( arg_map );
    msg_str    = __Str( idx ) + '. ' + solve_str + ' === ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeUcFirstStr ( test_obj ) {
  var
    assert_table  = [
      // [ arg_map, expect_str ]
      [ [],        __blank ],
      [ __null,    __blank ],
      [ __undef,   __blank ],
      [ 'fred',    'Fred'  ],
      [ [1,2,3,4], __blank ],
      [ {},        __blank ],
      [ 'a long sentence.', 'A long sentence.' ],
      [ 'oNE sENTENCE', 'ONE sENTENCE']
    ],

    assert_count = assert_table.length,
    make_str_fn  = __util._makeUcFirstStr_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_map     = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str = make_str_fn( arg_map );
    msg_str    = __Str( idx ) + '. ' + solve_str + ' === ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function mergeMaps ( test_obj ) {
  //noinspection JSUnusedGlobalSymbols
  var
    base0_map = { attr1 : 'val1', attr2 : 'val2' },
    base1_map = { attr3 : 10,     attr4 : 20     },
    base2_map = { fn : function () { console.log( arguments ); } },
    out0_map  = {
      attr1 : 'val1', attr2 : 'val2', attr3 : 10, attr4 : 20
    },
    out1_map  = { attr1 : 'val1', attr2  : 'val2', list : [] },
    out2_map  = { attr3 : 10, attr4 : 20, list : [] },
    out3_map  = { attr1 : 'val1', attr2 : 'val2' },
    out4_map  = { attr1 : 'val1', attr2 : 'val2', attr3 : 10 },

    attr0_list  = [ 'attr3' ],
    assert_table = [
      // [ arg_list, expect_data ]
      [ [],                 {} ],
      [ [ {}],              {} ],
      [ [ __null ],         {} ],
      [ [ __undef ],        {} ],
      [ [ 1,2,3,4 ],        {} ],
      [ [ __0,            __undef ],         {} ],
      [ [ __blank,             {} ],         {} ],
      [ [ base0_map,      __null  ],  base0_map ],
      [ [ base0_map,           {} ],  base0_map ],
      [ [ base0_map,    base1_map ],   out0_map ],
      [ [ base0_map,    base1_map ],   out0_map ],
      [ [ base0_map, { list: [] } ],   out1_map ],
      [ [ base0_map, { list: [] } ],   out1_map ],
      [ [ base1_map, { list: [] } ],   out2_map ],
      [ [ base1_map, { list: [] } ],   out2_map ],
      [ [ base0_map,    base2_map ],   out3_map ],

      // Using a restricted list of key
      [ [ [],[],[] ],          {} ],
      [ [ [],[],__null ],      {} ],
      [ [ __0,'fred',__null ], {} ],
      [ [ base0_map, 'fred',__null ], base0_map ],
      [ [ base0_map,__undef, attr0_list ], base0_map ],
      [ [ base0_map,__undef,'fred' ], base0_map ],
      [ [ base0_map, base1_map, attr0_list ], out4_map ]
    ],

    assert_count  = assert_table.length,
    merge_maps_fn = __util._mergeMaps_,

    idx, expect_list, arg_list,
    expect_map, solve_map, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list    = __util._cloneData_( expect_list[ __0 ] );
    expect_map  = expect_list[ __1 ];
    solve_map   = merge_maps_fn.apply( __undef, arg_list );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\r solve_map: '
      + JSON.stringify( solve_map )
      + '\r expect_map: ' + JSON.stringify( expect_map );
    test_obj.deepEqual( solve_map, expect_map, msg_str );
  }
  test_obj.done();
}

function pushUniqListVal ( test_obj ) {
  var
    base0_map  = { attr1 : 'val1', attr2 : 'val2' },
    base0_list = [ 'ding', __undef ],
    assert_table  = [
      [ [], [] ],
      [ [ 1, 2, 1, 4, 'dog' ], [ 1,2,4,'dog' ] ],
      [ [ 3, 8, 'dog', 3, 'dog', __null ], [ 3,8,'dog',__null ] ],
      [ [ __true, __true, __0, __false, __true ],
        [ __true, __0, __false ] ],
      [ [ __undef, __true, __0, __null, 'bob' ],
        [ __undef, __true, __0, __null, 'bob' ] ],
      [ [ 'patch', base0_map, __1, base0_map, base0_list, base0_list ],
        [ 'patch', base0_map, __1, base0_list ] ],
      [ [ 'string', 1.23456, -467.88, 0, 'string', 1.23456, -467.88, 0 ],
        [ 'string', 1.23456, -467.88, 0 ]
      ],
      [ [ __null  ], [ __null  ] ],
      [ [ __undef ], [ __undef ] ]
    ],

    assert_count = assert_table.length,
    push_uniq_fn = __util._pushUniqListVal_,

    idx, jdx,     val_list,     val_count,
    expect_list,  expect_data,  solve_list,
    push_val,     msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
    val_list     = expect_list[ __0 ];
    expect_data  = expect_list[ __1 ];
    val_count    = val_list.length;
    solve_list   = [];

    for ( jdx = __0; jdx < val_count; jdx++ ) {
      push_val = val_list[ jdx ];
      push_uniq_fn( solve_list, push_val );
    }

    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( solve_list  ) + ' <===> '
      + JSON.stringify( expect_data );

    test_obj.deepEqual( solve_list, expect_data, msg_str );
  }
  test_obj.done();
}

function rmListVal ( test_obj ) {
  var
    base0_map  = { attr1 : 'val1', attr2 : 'val2' },
    base0_list = [ 'ding', __undef ],
    test0_list = [
      'string', 1.23456, -467.88, 0, 'string', 1.23456, -467.88,
      base0_map, base0_list, base0_map, base0_list
    ],
    expect0_list = [
      'string', 1.23456, -467.88, 0, 'string', 1.23456, -467.88,
      base0_list, base0_list
    ],
    expect1_list = [
      'string', 1.23456, -467.88, 0, 'string', 1.23456, -467.88 ],
    expect2_list = [ 1.23456, -467.88, 0, 1.23456, -467.88 ],
    expect3_list = [ 1.23456, -467.88, 1.23456, -467.88 ],
    assert_table  = [
      [ [],          __undef, __0 ],
      [ [ __undef ], __undef, __0 ],
      [ [ __null  ], __undef, __0 ],
      [ [ __true  ], __undef, __0 ],
      [ [ test0_list ], test0_list, __0 ],
      [ [ test0_list, base0_map  ], expect0_list, __2 ],
      [ [ test0_list, base0_list ], expect1_list, __2 ],
      [ [ test0_list, 'string'   ], expect2_list, __2 ],
      [ [ test0_list, 'fetzer'   ], expect2_list, __0 ],
      [ [ test0_list, '0'        ], expect2_list, __0 ],
      [ [ test0_list, __0        ], expect3_list, __1 ]
    ],

    assert_count = assert_table.length,
    rm_val_fn    = __util._rmListVal_,

    idx,          expect_list,  arg_list,
    expect_data,  expect_count, solve_list,
    solve_count,  msg_str
    ;

  test_obj.expect( assert_count  * __2 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_data  = expect_list[ __1 ];
    expect_count = expect_list[ __2 ];

    solve_list = ( arg_list[ __0 ] && Array.isArray( arg_list[ __0 ] ) )
      ? arg_list[ __0 ] : __undef;
    solve_count = rm_val_fn.apply( __undef, arg_list );

    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( solve_list  ) + ' <===> '
      + JSON.stringify( expect_data );

    test_obj.deepEqual( solve_list,  expect_data,  msg_str );
    test_obj.deepEqual( solve_count, expect_count, msg_str );
  }
  test_obj.done();
}

function pollFunction ( test_obj ) {
  var
    test_list = [],
    test_fn   = function ( idx ) { test_list.push( idx ); return __true; },
    finish_fn = function () {
      test_obj.deepEqual( test_list, [ 0,1,2,3 ], 'fn runs 4 times' );
      test_obj.done();
    };

  test_obj.expect( __3 );
  test_obj.ok( ! __util._pollFunction_ ( __undef, __0, 29, finish_fn ),
    'no fn should fail ' );
  test_obj.ok( __util._pollFunction_( test_fn, __0, 4, finish_fn ),
    'proper call should return true.' );
}

function setStructData ( test_obj ) {
  var
    base0_map = { attr1 : 'val1', attr2 : 'val2', sub_map : {} },
    expect0_map = { attr1 : 'val1', attr2 : 'val2', sub_map : {
      dakota : [ 'hello', 'world' ]
    } },
    assert_table = [
      [ [],                 __undef ],
      [ [ __null ],         __null  ],
      [ [ __null, __null ], __null  ],
      [ [ 'liz', 'mary'  ],   'liz' ],
      [ [ { ad_lib: 'julie' }, []   ], { ad_lib:'julie'} ],
      [ [ base0_map, __undef ], base0_map ],
      [ [ base0_map, [ 'sub_map', 'dakota' ],
          [ 'hello', 'world' ] ], expect0_map
      ],
      [ [ [], [ __null, 'car', __null ], 'tyres' ],
        [ { car : [ 'tyres' ] } ]
      ],
      [ [ { foo:{ bar:1 }}, [ 'foo','bar' ], 99 ],
        { foo : { bar : 99 } }
      ],
      [ [ [ { car : [ 'seats', 'tyres' ] } ], [ 0, 'car', 1 ], 'Meyers!' ],
        [ { car : [ 'seats', 'Meyers!' ] } ]
      ],
      [ [ [],  [ null, 'car', null ], 'Meyers!' ],
        [ { car : [ 'Meyers!' ] } ]
      ],
      [ [ [], [ 'car', null ], 'Meyers!'  ], [] ],
      [ [ [ 'power' ],  [ null, 'car', null ], 'Meyers!' ],
        [ 'power', { car : [ 'Meyers!' ] } ]
      ],
      [ [ { cat : 'power' },  [ null, 'car', null ], 'Meyers!' ],
        { cat : 'power' }
      ],
      [ [ { cat : 'power' },  [ '', 'car', null ], 'Meyers!' ],
        { cat : 'power' }
      ]
    ],

    assert_count  = assert_table.length,
    set_deep_fn = __util._setStructData_,

    idx, expect_list, arg_list,
    expect_data, solve_data, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list    = __util._cloneData_( expect_list[ __0 ] );
    expect_data = expect_list[ __1 ];
    solve_data  = arg_list[ __0 ];
    set_deep_fn.apply( __undef, arg_list );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_data: '
      + JSON.stringify( solve_data )
      + '\n expect_data: ' + JSON.stringify( expect_data );
    test_obj.ok(
      JSON.stringify( solve_data ) ===  JSON.stringify( expect_data ),
      msg_str
    );
  }
  test_obj.done();
}

function shuffleList ( test_obj ) {
  var
    assert_table = [
      // arg_list, expect_data
      [ [],                     __false ],
      [ [ __undef ],            __false ],
      [ [ 'fred' ],             __false ],
      [ [ __null ],             __false ],
      [ [ { a: 1 } ],           __false ],
      [ [ [ 1,2,3,4 ] ],        __true  ],
      [ [ [ {} ] ],             __true  ],
      [ [ [ [] ] ],             __true  ],
      [ [ [ __null ] ],         __true  ],
      [ [ [ __null, {} ] ],     __true  ]

    ],

    assert_count  = assert_table.length,
    expect_count  = assert_count + 2,
    shuffle_fn    = __util._shuffleList_,
    test_idx      = __0,

    idx,         expect_list, arg_list,
    expect_bool, orig_list,   clone_list,
    solve_bool,  msg_str,     pass_bool,
    jdx,         clone_json
    ;


  // Every shuffled list gets two extra test
  assert_table.filter( function ( list ) {
    if ( list[ __1 ] ) { expect_count++; }
  });
  test_obj.expect( expect_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_bool  = expect_list[ __1 ];
    orig_list    = arg_list[ __0 ];
    clone_list   = __util._cloneData_( orig_list );
    solve_bool   = shuffle_fn.apply( __undef, arg_list );

    msg_str = __Str( test_idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_bool: '
      + __Str( solve_bool )
      + '\n expect_bool: ' + __Str( expect_bool );

    test_obj.ok( solve_bool === expect_bool, msg_str );
    test_idx++;

    // Begin extra test to ensure sort
    if ( solve_bool ) {
      clone_json = JSON.stringify( clone_list );
      if ( clone_list.length < 2 ) {
        msg_str = __Str( test_idx ) + '. orig_list = shuffle list';
        test_obj.ok( clone_json === JSON.stringify( orig_list ), msg_str );
        test_idx++;
      }
      else {
        // longer lists should always (eventually) be shuffled
        pass_bool  = __false;
        INR: for ( jdx = __0; jdx < 100; jdx++ ) {
          if ( clone_json !== JSON.stringify( orig_list ) ) {
            pass_bool = __true;
            break INR;
          }
          shuffle_fn( orig_list );
        }
        msg_str = __Str( test_idx ) + '. orig_list != shuffle list '
          + 'after ' + __Str( jdx ) + ' shuffles.';
        test_obj.ok( pass_bool, msg_str );

        test_obj.ok( orig_list.length === clone_list.length,
          'Shuffled list matches original length.'
        );
        test_idx++;
      }
    }
    // . End extra test to ensure sort
  }
  test_obj.done();
}

function trimStrList ( test_obj ) {
  var
    assert_table = [
      [ [ __undef               ],            __undef ],
      [ [ __null                ],            __null  ],
      [ [ []                    ],                 [] ],
      [ [ [1,2,3]               ],            [1,2,3] ],
      [ [ [3,2,1]               ],            [3,2,1] ],
      [ [ [' fred',2,1]         ],   [ 'fred', 2, 1 ] ],
      [ [ [ '  bob  ' ], {},'p' ],           [ 'bob' ]],
      [ [ [ ' x', 'y ', ' z ' ] ],     [ 'x','y','z' ]],
      [ [ [ __undef, 0, ' z ' ] ],   [ __undef,0,'z' ]]
    ],

    assert_count  = assert_table.length,
    trim_fn       = __util._trimStrList_,

    idx, expect_list, arg_list,
    expect_data, solve_data, msg_str
  ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_data = expect_list[ __1 ];
    solve_data  = trim_fn.apply( __undef,  arg_list );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_data: '
      + JSON.stringify( solve_data )
      + '\n expect_data: ' + JSON.stringify( expect_data );
    test_obj.deepEqual( solve_data, expect_data, msg_str );
  }
  test_obj.done();
}

// ===== UTILB
function decodeHtml ( test_obj ) {
  var
    assert_table = [
      [ [ ],                          __blank ],
      [ [ 'text'  ],                   'text' ],
      [ [ __blank ],                  __blank ],
      [ [ __null  ],                  __blank ],
      [ [ __undef ],                  __blank ],
      [ [ '<div>text</div>' ],         'text' ]
    ],
    assert_count = assert_table.length,
    test_fn      = __utilb._decodeHtml_,

    idx,        expect_list, arg_list,
    expect_str, solve_str,   msg_str
  ;

  test_obj.expect( assert_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = test_fn[ vMap._apply_ ]( __undef, arg_list );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_str: ' + solve_str
      + '\n expect_str: ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function fillForm ( test_obj ) {
  var
    form_01_html = '<form><input type="text" name="attr1" value=""/>'
      + '<textarea name="attr2"></textarea></form>',
    form_02_html = '<form><input type="checkbox" name="attr1"/>'
      + '<input type="checkbox" name="attr2" checked="checked"/></form>',
    $form_01 = $( form_01_html ),
    $form_02 = $( form_02_html ),
    solve_str, solve_bool
    ;

  test_obj.expect( 11 );

  test_obj.ok( __utilb._fillForm_(         ) === __false, 'a. no form false' );
  test_obj.ok( __utilb._fillForm_( __undef ) === __false, 'b. bad form false' );
  test_obj.ok( __utilb._fillForm_( {}      ) === __false, 'c. bad form false' );
  test_obj.ok( __utilb._fillForm_( $form_01) === __true,  'd. good form true' );
  test_obj.ok( __utilb._fillForm_( $form_02) === __true,  'e. good form true' );

  __utilb._fillForm_( $form_01, { attr1 : 'my input', attr2 : 'My writing' });

  solve_str = $form_01.find( '[name="attr1"]' ).val();
  test_obj.ok( solve_str === 'my input', '0. ' + solve_str );

  solve_str = $form_01.find( '[name="attr2"]' ).val();
  test_obj.ok( solve_str === 'My writing', '1. ' + solve_str );

  solve_bool = $form_02.find( '[name="attr1"]' ).is( ':checked' );
  test_obj.ok( solve_bool === __false, '2. ' + __Str( solve_bool ) );

  solve_bool = $form_02.find( '[name="attr2"]' ).is( ':checked' );
  test_obj.ok( solve_bool === __true, '3. ' + __Str( solve_bool ) );

  __utilb._fillForm_( $form_02, { attr1 : __true, attr2 : __true });

  solve_bool = $form_02.find( '[name="attr1"]' ).is( ':checked' );
  test_obj.ok( solve_bool === __true, '4. ' + __Str( solve_bool ) );

  solve_bool = $form_02.find( '[name="attr2"]' ).is( ':checked' );
  test_obj.ok( solve_bool === __true, '5. ' + __Str( solve_bool ) );

  test_obj.done();
}

function getFormMap ( test_obj ) {
  var
    form_00_html = '<div><input type="text" name="name"'
      + ' value="Franky"/></div>',
    form_01_html = '<form><input type="text" name="attr1" value=""/>'
      + '<textarea name="attr2"></textarea>'
      + '<input type="checkbox" name="attr3"/>'
      + '<input type="checkbox" name="attr4"/>'
      + '</form>',
    form_02_html
      = '<form><input type="text" name="attr1_1" value="peabody"/>'
      + '<input type="text" data-type="integer" name="attr1_2" value="peabody"/>'
      + '<input type="text" data-type="number"  name="attr1_3" value="peabody"/>'
      + '<input type="text" data-type="string"  name="attr2_1" value="22"/>'
      + '<input type="text" data-type="integer" name="attr2_2" value="22"/>'
      + '<input type="text" data-type="number"  name="attr2_3" value="22"/>'
      + '<input type="text" data-type="string"  name="attr3_1" value="-29.625"/>'
      + '<input type="text" data-type="integer" name="attr3_2" value="-29.625"/>'
      + '<input type="text" data-type="number"  name="attr3_3" value="-29.625"/>'
      + '<textarea name="attr4_1" data-type="string">Hello Bobby 5.5</textarea>'
      + '<textarea name="attr4_2" data-type="integer">Hello Bobby 5.5</textarea>'
      + '<textarea name="attr4_3" data-type="number">Hello Bobby 5.5</textarea>'
      + '<textarea name="attr5_1" data-type="string">0.9625</textarea>'
      + '<textarea name="attr5_2" data-type="integer">0.9625</textarea>'
      + '<textarea name="attr5_3" data-type="number">0.9625</textarea>'
      + '<input data-type="number" type="checkbox" name="attr6" checked="checked"/>'
      + '<input data-type="zoolander" type="checkbox" name="attr7"/>'
      + '</form>',
    form_00_map = { name : 'Franky' },
    form_01_map = {
      attr1 : 'Duty!',
      attr2 : 'in-the-line-of',
      attr3 : __false,
      attr4 : __true
    },
    form_02_map = {
      attr1_1 : 'peabody',
      attr1_2 : 0,
      attr1_3 : 0,
      attr2_1 : '22',
      attr2_2 : 22,
      attr2_3 : 22,
      attr3_1 : '-29.625',
      attr3_2 : -30,
      attr3_3 : -29.625,
      attr4_1 : 'Hello Bobby 5.5',
      attr4_2 : 0,
      attr4_3 : 0,
      attr5_1 : '0.9625',
      attr5_2 : 1,
      attr5_3 : 0.9625,
      attr6   : __true,
      attr7   : __false
    },
    $form_00 = $( form_00_html ),
    $form_01 = $( form_01_html ),
    $form_02 = $( form_02_html ),
    solve_map;

  test_obj.expect( 5 );
  __utilb._fillForm_( $form_01,  form_01_map );

  solve_map = __utilb._getFormMap_();
  test_obj.ok( solve_map === __undef, '0. no args result in undef' );

  solve_map = __utilb._getFormMap_( $() );
  test_obj.deepEqual( solve_map, {}, '1. Empty container results in empty'
    + ' map' );

  solve_map = __utilb._getFormMap_( $form_00 );
  test_obj.deepEqual( solve_map, form_00_map, '2. Maps match' );

  solve_map = __utilb._getFormMap_( $form_01 );
  test_obj.deepEqual( solve_map, form_01_map, '3. Maps match' );

  solve_map = __utilb._getFormMap_( $form_02 );
  test_obj.deepEqual( solve_map, form_02_map, '4. Maps match' );

  test_obj.done();
}

function resizeTextarea ( test_obj ) {
  var
    form_01_html = '<form><textarea name="tex"></textarea></form>',
    blank_map    = { tex : __blank },
    short_str    = 'a short sentence',
    long_str     =
      'One of many lines that we have inclued for a long entry. '
      + 'One of many lines that we have inclued for a long entry. '
      + 'One of many lines that we have inclued for a long entry. '
      + 'One of many lines that we have inclued for a long entry. '
      + 'One of many lines that we have inclued for a long entry. '
      + 'One of many lines that we have inclued for a long entry. '
      + 'One of many lines that we have inclued for a long entry. '
      + 'One of many lines that we have inclued for a long entry.',

    assert_table  = [
      [ __undef,      blank_map ],
      [ __null,       blank_map ],
      [ __blank,      blank_map ],
      [ [ 1,2,3,4 ],  blank_map ],
      [ { pew : 'charitable_trust' }, blank_map ],
      [ short_str, { tex : short_str } ],
      [ long_str,  { tex : long_str  } ]
    ],
    assert_count = assert_table.length,
    text_idx     = __2,
    $form_01     = $( form_01_html ),

    idx, expect_list, arg_str, expect_map, solve_map, msg_str
    ;

  test_obj.expect( assert_count * __2  + __2 );

  test_obj.ok( __utilb._resizeTextarea_() === __false, '0. No args returns false' );
  test_obj.ok( __utilb._resizeTextarea_( $form_01 ) === __true,
    '1. valid form returns true' );



  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_str     = expect_list[ __0 ];
    expect_map  = expect_list[ __1 ];

    __utilb._fillForm_( $form_01, { tex : arg_str } );
    solve_map = __utilb._getFormMap_( $form_01 );

    msg_str = __Str( text_idx ) + '. arg_str: ' + arg_str
      + '\n solve_map: '  + JSON.stringify( solve_map  )
      + '\n expect_str: ' + JSON.stringify( expect_map );
    test_obj.deepEqual( solve_map, expect_map, msg_str );
    text_idx++;

    __utilb._resizeTextarea_( $form_01 );
    solve_map = __utilb._getFormMap_( $form_01 );

    msg_str = __Str( text_idx ) + '. arg_str: ' + arg_str
      + '\n solve_map: '  + JSON.stringify( solve_map  )
      + '\n expect_str: ' + JSON.stringify( expect_map );
    test_obj.deepEqual( solve_map, expect_map, msg_str );
    text_idx++;
  }
  test_obj.done();
}

// ===== LiteBox (LB)
liteBoxMap = {
  _outer01_tmplt_ : __blank
    + '<div id="' + aKey + '-_lb_" style="display: block; top: 50%; '
      + 'left: 50%; margin-top: 0px; margin-left: 0px;" '
      + 'class="' + aKey + '-_lb_ ' + aKey + '-_x_active_"><div class="'
      + aKey + '-_lb_title_" '
      + 'style="display: block;">{_title_}</div>'
      + '<div class="' + aKey + '-_lb_close_"{_close_block_}>{_close_html_}</div>'
      + '<div class="' + aKey + '-_lb_content_">{_content_html_}</div>'
    + '</div>',
  _outer02_tmplt_ : __blank
    + '<div id="' + aKey + '-_lb_" class="' + aKey + '-_lb_ ' + aKey + '-_x_active_" '
      + 'style="display: block; top: 50%; left: 50%; '
      + 'margin-top: 0px; margin-left: 0px;"><div '
      + 'class="' + aKey + '-_lb_title_" style="display: block;">{_title_}</div>'
      + '<div class="' + aKey + '-_lb_close_"{_close_block_}>{_close_html_}</div>'
      + '<div class="' + aKey + '-_lb_content_">{_content_html_}</div>'
    + '</div>',
  _spin_html_     : __blank
    + '<div class="' + aKey + '-_lb_mask_ ' + aKey + '-_x_local_ ' + aKey + '-_x_active_"></div>'
    + '<div class="' + aKey + '-_lb_spin_ ' + aKey + '-_x_local_ ' + aKey + '-_x_active_">'
    + '\uf021</div>',
  _error_tmplt_   : __blank
    + '<div class="' + aKey + '-_lb_error_">'
      + '<h1>Error</h1>'
      + '<div class="' + aKey + '-_lb_error_list_">'
      + '{_rows_html_}'
      + '</div>'
    + '</div>',
  _erow_tmplt_    : __blank
    + '<div class="' + aKey + '-_lb_error_row_">'
      + '<div class="' + aKey + '-_lb_error_row_code_">{_code_}</div>'
      + '<div class="' + aKey + '-_lb_error_row_name_">{_name_}</div>'
      + '<div class="' + aKey + '-_lb_error_row_descr_">{_descr_}</div>'
    + '</div>',
  _success_tmplt_ : __blank
    + '<div class="' + aKey + '-_lb_success_">'
      + '<div class="' + aKey + '-_lb_success_title_">{_msg_str_}</div>'
    + '</div>'
};

function addLocalSpin ( test_obj ) {
  test_obj.expect( 7 );
  var
    spin_html = liteBoxMap._spin_html_,
    blow_html = '<p>This html should be destroy</p>',
    $div = $('<div/>'),
    solve_str
    ;

  __lb._addLocalSpin_( $div );
  solve_str = $div.html();
  test_obj.ok( solve_str === spin_html,
    '0. Apply 0 - ' + solve_str  + ' | ' + spin_html
  );

  __lb._addLocalSpin_( $div );
  solve_str = $div.html();
  test_obj.ok( solve_str === spin_html,
    '1. Apply 1' + solve_str  + ' | ' + spin_html
  );

  $div.empty();
  solve_str = $div.html();
  test_obj.ok( solve_str === __blank,
    '2. Clear 0 ' + solve_str  + ' | __blank'
  );

  __lb._addLocalSpin_( $div );
  solve_str = $div.html();
  test_obj.ok( solve_str === spin_html,
    '3. Fresh Apply 0 ' + solve_str  + ' | ' + spin_html
  );

  $div.empty();
  solve_str = $div.html();
  test_obj.ok( solve_str === __blank,
    '4. Clear 1 ' + solve_str  + ' | __blank'
  );

  $div.html( blow_html );
  solve_str = $div.html();
  test_obj.ok( solve_str === blow_html,
    '5. Apply blow html ' + solve_str  + ' | ' + blow_html
  );

  __lb._addLocalSpin_( $div );
  solve_str = $div.html();
  test_obj.ok( solve_str === spin_html,
    '6. Blow html destroyed ' + solve_str  + ' | ' + spin_html
  );

  test_obj.done();
}

function __showErrorListCb ( $lite_box ) {
  var
    smap       = this,
    test_obj   = smap._test_obj_,

    solve_str  = $lite_box[ __0 ].outerHTML,

    msg_str    = 'CALLBACK ' + __Str( smap._test_idx_ ) + ': '
      + 'arg_list: ' + JSON.stringify( smap._arg_list_ )
      + '\n solve_str: ' + solve_str
      + '\n expect3_str: ' + smap._expect3_str_
    ;

  test_obj.ok( solve_str === smap._expect3_str_, msg_str );
  if ( smap._do_done_ ) { test_obj.done(); }
}

function showErrorList ( test_obj ) {
  var
    row01_map = { _code_:'x29',_name_:'bad apples',_descr_:'I am blue'},
    row02_map = {},
    rows00_html = 'unknown error',
    rows01_html = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._erow_tmplt_,
      _lookup_map_ : row01_map
    }),
    rows02_html = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._erow_tmplt_,
      _lookup_map_ : row02_map
    }),
    content00_html = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._error_tmplt_,
      _lookup_map_ : { _rows_html_ : rows00_html }
    }),
    content01_html = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._error_tmplt_,
      _lookup_map_ : { _rows_html_ : rows01_html }
    }),
    content02_html = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._error_tmplt_,
      _lookup_map_ : { _rows_html_ : rows02_html }
    }),
    blank1_html = __util._makeTmpltStr_( {
      _input_str_  : liteBoxMap._outer01_tmplt_,
      _lookup_map_ : { _content_html_ : content00_html }
    }),
    blank2_html = __util._makeTmpltStr_( {
      _input_str_  : liteBoxMap._outer02_tmplt_,
      _lookup_map_ : { _content_html_ : content00_html }
    }),
    blank3_html = '<div id="' + aKey + '-_lb_" class="" style="display: none;">'
      + '<div class="' + aKey + '-_lb_title_"></div>'
      + '<div class="' + aKey + '-_lb_close_"></div>'
      + '<div class="' + aKey + '-_lb_content_"></div></div>',
    solve01_1_html = __util._makeTmpltStr_({
      _input_str_ : liteBoxMap._outer01_tmplt_,
      _lookup_map_ : { _content_html_ : content01_html }
    }),
    solve01_2_html = __util._makeTmpltStr_({
      _input_str_ : liteBoxMap._outer02_tmplt_,
      _lookup_map_ : { _content_html_ : content01_html }
    }),
    solve02_1_html = __util._makeTmpltStr_({
      _input_str_ : liteBoxMap._outer01_tmplt_,
      _lookup_map_ : { _content_html_ : content02_html }
    }),
    solve02_2_html = __util._makeTmpltStr_({
      _input_str_ : liteBoxMap._outer02_tmplt_,
      _lookup_map_ : { _content_html_ : content02_html }
    }),
    assert_table = [
      // arg_list, expected html, alt form html, expected html after cleanup
      [ [],                   blank1_html, blank2_html,   blank3_html ],
      [ [ __undef ],          blank1_html, blank2_html,   blank3_html ],
      [ [ __null  ],          blank1_html, blank2_html,   blank3_html ],
      [ [ { boo:'bar'} ],     blank1_html, blank2_html,   blank3_html ],
      [ [ [1,2,3] ],          blank1_html, blank2_html,   blank3_html ],
      [ [ 'Hi bunny' ],       blank1_html, blank2_html,   blank3_html ],
      [ [[ row01_map ]],  solve01_1_html, solve01_2_html, blank3_html ],
      [ [[ row02_map ]],  solve02_1_html, solve02_2_html, blank3_html ]
    ],

    assert_count = assert_table.length,
    show_fn      = __lb._showErrorList_,
    hide_fn      = __lb._hideLb_,

    idx,       expect_list, arg_list,
    solve_$lb, expect1_str, expect2_str, expect3_str,
    solve_str, msg_str, check_fn
    ;

  test_obj.expect( assert_count * __2 );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list    = expect_list[ __0 ];
    expect1_str = expect_list[ __1 ];
    expect2_str = expect_list[ __2 ];
    expect3_str = expect_list[ __3 ];
    solve_$lb   = show_fn.apply( window, arg_list );
    solve_str   = solve_$lb[__0 ].outerHTML;
    msg_str     = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_str: ' + solve_str
      + '\n expect1_str: ' + expect1_str
      + '\n expect2_str: ' + expect2_str;
    test_obj.ok(
      ( solve_str === expect1_str || solve_str === expect2_str ),
      msg_str
    );

    check_fn = __showErrorListCb.bind({
      _arg_list_    : arg_list,
      _do_done_     : idx === assert_count - __1,
      _expect3_str_ : expect3_str,
      _msg_str_     : msg_str,
      _test_idx_    : idx,
      _test_obj_    : test_obj
    });
    hide_fn( check_fn );
  }
}

function __showLbCb ( $lite_box ) {
  var
    smap       = this,
    test_obj   = smap._test_obj_,

    solve_str  = $lite_box[ __0 ].outerHTML,

    msg_str =  'CALLBACK ' + __Str( smap._test_idx_ ) + ': '
      + 'arg_list: '       + JSON.stringify( smap._arg_list_ )
      + '\n solve_str: '   + solve_str
      + '\n expect1_str: ' + smap._expect1_str_
      + '\n expect2_str: ' + smap._expect2_str_
    ;

  test_obj.ok( ( solve_str === smap._expect1_str_
    || solve_str === smap._expect2_str_ ), msg_str
  );
  if ( smap._do_done_ ) { test_obj.done(); }
  return smap._test_idx_  > __1 ? __true : __false;
}

function showLb ( test_obj ) {
  var
    blank_a_html   = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._outer01_tmplt_,
      _lookup_map_ : { _content_html_ : __blank }
    }),
    blank_b_html   = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._outer02_tmplt_,
      _lookup_map_ : { _content_html_ : __blank }
    }),
    t00_a_html   = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._outer01_tmplt_,
      _lookup_map_ : { _content_html_ : 'hello world' }
    }),
    t00_b_html   = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._outer02_tmplt_,
      _lookup_map_ : { _content_html_ : 'hello world' }
    }),
    t01_a_html   = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._outer01_tmplt_,
      _lookup_map_ : {
        _content_html_ : 'mello world',
        _close_html_   : 'x',
        _close_block_  : ' style="display: block;"'
      }
    }),
    t01_b_html   = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._outer02_tmplt_,
      _lookup_map_ : {
        _content_html_ : 'mello world',
        _close_html_   : 'x',
        _close_block_  : ' style="display: block;"'
      }
    }),
    assert_table = [
      // arg_list, expect1_html, expect2_html
      [ [{}], blank_a_html, blank_b_html ],
      [ [{}], blank_a_html, blank_b_html ],
      [ [{ _content_html_ : 'hello world', _autoclose_ms_ : 20 } ],
        t00_a_html, t00_b_html ],
      [ [{ _content_html_ : 'hello world' } ], t00_a_html, t00_b_html ],
      [ [{ _content_html_ : 'hello world', _do_block_click_ : __true } ],
        t00_a_html, t00_b_html ],
      [ [{ _content_html_ : 'hello world',
           _do_block_click_ : __true,
           _do_draggable_   : __false,
           _onshow_fn_      : function () { return 'ping'; }
        }],
        t00_a_html, t00_b_html ],
      [ [{ _close_html_   : 'x',
           _content_html_ : 'mello world',
           _onclose_fn_   : __showLbCb,
           _position_map_ : { top : '50%', left : '50%',
             'margin-top' : 0, 'margin-left' :  0
           }
        } ], t01_a_html, t01_b_html ]
    ],

    assert_count = assert_table.length,
    show_fn      = __lb._showLb_,
    close_fn     = __lb._closeLb_,

    idx,       expect_list, arg_list,
    solve_$lb, expect_a_str, expect_b_str,
    solve_str, msg_str, check_fn
    ;

  test_obj.expect( assert_count * __2 - __1 );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_table[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_a_str = expect_list[ __1 ];
    expect_b_str = expect_list[ __2 ];
    solve_$lb    = show_fn.apply( window, arg_list );
    solve_str    = solve_$lb[__0 ].outerHTML;
    msg_str      = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_str: ' + solve_str
      + '\n expect_a_str: ' + expect_a_str
      + '\n expect_b_str: ' + expect_b_str;

    if ( idx === __0 ) { check_fn = __undef; }
    else {
      check_fn = __showLbCb.bind({
        _arg_list_    : arg_list,
        _do_done_     : idx === assert_count - __1,
        _expect1_str_ : expect_a_str,
        _expect2_str_ : expect_b_str,
        _msg_str_     : msg_str,
        _test_idx_    : idx,
        _test_obj_    : test_obj
      });
    }
    __lb._setCloseFn_( check_fn );
    test_obj.ok(
      ( solve_str === expect_a_str || solve_str === expect_b_str ),
      msg_str
    );
    close_fn();
  }
}

function handleResize ( test_obj ) {
  test_obj.expect( 4 );
  var ret_bool;

  ret_bool = __lb._handleResize_();
  test_obj.ok( ret_bool === __false, '0. empty call should return false' );

  test_obj.ok( ret_bool === __false,
    '1. Second call should return false as the resize is already scheduled'
  );

  ret_bool = __lb._handleResize_({ _body_w_px_ : 1024, _body_h_px_ : 768 });
  test_obj.ok( ret_bool === __true, '2. Resize should work' );

  __lb._showBusy_() ;

  ret_bool = __lb._handleResize_({ _body_w_px_ : 1248, _body_h_px_ : 768 });
  test_obj.ok( ret_bool === __true, '3. Resize should work' );

  test_obj.done();
}

function showBusy ( test_obj ) {
  var
    mask_id  = '#' + aKey + '-_lb_mask_' ,
    $mask    = $( mask_id ),
    off_html = '<div id="' + aKey + '-_lb_mask_" class="' + aKey + '-_lb_mask_" '
      + 'style="display: block;"></div>',
    on_html  = '<div id="' + aKey + '-_lb_mask_" class="' + aKey + '-_lb_mask_ '
      + aKey + '-_x_active_" style="display: block;"></div>',
    outer_html;

  test_obj.expect( 3 );

  __lb._hideLb_();
  outer_html = $mask[0].outerHTML;
  test_obj.ok( outer_html === off_html, '1. Mask has no active class' );

  __lb._showBusy_();
  outer_html = $mask[0].outerHTML;
  test_obj.ok( outer_html === on_html,  '2. Mask contains active class' );

  __lb._hideLb_();
  outer_html = $mask[0].outerHTML;
  test_obj.ok( outer_html === off_html, '3. Mask has no active class' );

  test_obj.done();
}

function __showSuccessCb ( $lite_box ) {
  var
    smap       = this,
    test_obj   = smap._test_obj_,

    solve_str  = $lite_box[ __0 ].outerHTML,

    msg_str =  'CALLBACK ' + __Str( smap._test_idx_ ) + ': '
      + 'arg_list: '       + JSON.stringify( smap._arg_list_ )
      + '\n solve_str: '   + solve_str
      + '\n expect1_str: ' + smap._expect1_str_
      + '\n expect2_str: ' + smap._expect2_str_
    ;

  test_obj.ok( ( solve_str === smap._expect1_str_
    || solve_str === smap._expect2_str_ ), msg_str
  );
  if ( smap._do_done_ ) { test_obj.done(); }
  return smap._test_idx_  > __1 ? __true : __false;
}

function showSuccess ( test_obj ) {
  var
    blank_snip = __util._makeTmpltStr_({
      _input_str_ : liteBoxMap._success_tmplt_
    }),
    blank1_html   = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._outer01_tmplt_,
      _lookup_map_ : { _content_html_ : blank_snip }
    }),
    blank2_html   = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._outer02_tmplt_,
      _lookup_map_ : { _content_html_ : blank_snip }
    }),
    success_snip = __util._makeTmpltStr_({
      _input_str_ : liteBoxMap._success_tmplt_,
      _lookup_map_ : { _msg_str_ : 'Success!' }
    }),
    success1_html = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._outer01_tmplt_,
      _lookup_map_ : { _content_html_ : success_snip }
    }),
    success2_html = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._outer02_tmplt_,
      _lookup_map_ : { _content_html_ : success_snip }
    }),
    hello_snip = __util._makeTmpltStr_({
      _input_str_ : liteBoxMap._success_tmplt_,
      _lookup_map_ : { _msg_str_ : 'Hi bunny' }
    }),
    hello1_html = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._outer01_tmplt_,
      _lookup_map_ : { _content_html_ : hello_snip }
    }),
    hello2_html = __util._makeTmpltStr_({
      _input_str_  : liteBoxMap._outer02_tmplt_,
      _lookup_map_ : { _content_html_ : hello_snip }
    }),
    assert_table = [
      // arg_list, expected html, alt form html, expected html after cleanup
      [ [],                        blank1_html,   blank2_html ],
      [ [ __undef ],               blank1_html,   blank2_html ],
      [ [ __null  ],               blank1_html,   blank2_html ],
      [ [ { boo:'bar'} ],          blank1_html,   blank2_html ],
      [ [ [1,2,3] ],               blank1_html,   blank2_html ],
      [ [ 'Success!' ],          success1_html, success2_html ],
      [ [ 'Success!', __null ],  success1_html, success2_html ],
      [ [ 'Hi bunny' ],            hello1_html,   hello2_html ],
      [ [ 'Hi bunny', __undef ],   hello1_html,   hello2_html ],
      [ [ 'Hi bunny', [1,2,3 ]],   hello1_html,   hello2_html ]
    ],

    assert_count = assert_table.length,
    show_fn      = __lb._showSuccess_,
    close_fn     = __lb._closeLb_,

    idx,       expect_list, arg_list,
    solve_$lb, expect1_str, expect2_str,
    solve_str, msg_str, check_fn
    ;

  test_obj.expect( assert_count * __2 );


  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_table[ idx ];
    arg_list   = expect_list[ __0 ];
    expect1_str= expect_list[ __1 ];
    expect2_str= expect_list[ __2 ];
    solve_$lb  = show_fn.apply( window, arg_list );
    solve_str  = solve_$lb[__0 ].outerHTML;
    msg_str    = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_str: ' + solve_str
      + '\n expect1_str: ' + expect1_str
      + '\n expect2_str: ' + expect2_str;

    check_fn = __showSuccessCb.bind({
      _arg_list_    : arg_list,
      _do_done_     : idx === assert_count - __1,
      _expect1_str_ : expect1_str,
      _expect2_str_ : expect2_str,
      _msg_str_     : msg_str,
      _test_idx_    : idx,
      _test_obj_    : test_obj
    });

    __lb._setCloseFn_( check_fn );
    test_obj.ok(
      ( solve_str === expect1_str || solve_str === expect2_str ),
      msg_str
    );
    close_fn();
  }
}
// == . END NODEUNIT TEST FUNCTIONS  ==================================

// Use mockTestObj for debugging tests using nodejs instead
// of nodeunit, which obscures error messages. Use like so:
// 1. Add the test you would like to run:
// 2. Run node <this_file>
// 3. Inspect the output
// makeReplaceFn( mockTestObj );
// makeMetricStr( mockTestObj );
// checkDateStr( mockTestObj );
// makeClockStr( mockTestObj );

module.exports = {
  // Util
  _setLogLevel_     : setLogLevel,
  _castInt_         : castInt,
  _castJQ_          : castJQ,
  _castStr_         : castStr,
  _checkDateStr_    : checkDateStr,
  _clearMap_        : clearMap,
  _cloneData_       : cloneData,
  _encodeHtml_      : encodeHtml,
  _getBasename_     : getBasename,     // Includes getDirname
  _getStructData_   : getStructData,
  _getListAttrIdx_  : getListAttrIdx,  // Include getListAttrMap
  _getListDiff_     : getListDiff,
  _getListValCount_ : getListValCount,
  _getNowMs_        : getNowMs,
  _getNumSign_      : getNumSign,
  _getTzCode_       : getTzCode,
  _getTzOffsetMs_   : getTzOffsetMs,
  _getVarType_      : getVarType,
  _makeArgList_     : makeArgList,
  _makeClockStr_    : makeClockStr,
  _makeCommaNumStr_ : makeCommaNumStr,
  _makeDateStr_     : makeDateStr,
  _makeDebounce01Fn_: makeDebounce01Fn,
  _makeDebounce02Fn_: makeDebounce02Fn,
  _makeDebounce03Fn_: makeDebounce03Fn,
  _makeDebounce04Fn_: makeDebounce04Fn,
  _makeEllipsisStr_ : makeEllipsisStr,
  _makeErrorObj_    : makeErrorObj,
  _makeEscRxStr_    : makeEscRxStr,
  _makeGuidStr_     : makeGuidStr,
  _makeMapUtilObj_  : makeMapUtilObj,
  _makeMetricStr_   : makeMetricStr,
  _makeOptionHtml_  : makeOptionHtml,
  _makePadNumStr_   : makePadNumStr,
  _makePctStr_      : makePctStr,
  _makeRadioHtml_   : makeRadioHtml,
  _makeReplaceFn_   : makeReplaceFn,
  _makeScrubStr_    : makeScrubStr,
  _makeSeenMap_     : makeSeenMap,
  _makeSeriesMap_   : makeSeriesMap,
  _makeStrFromMap_  : makeStrFromMap,
  _makeThrottle01Fn_: makeThrottle01Fn,
  _makeTmpltStr_    : makeTmpltStr,
  _makeUcFirstStr_  : makeUcFirstStr,
  _mergeMaps_       : mergeMaps,
  _pollFunction_    : pollFunction,
  _pushUniqListVal_ : pushUniqListVal,
  _rmListVal_       : rmListVal,
  _setStructData_   : setStructData,
  _shuffleList_     : shuffleList,
  _trimStrList_     : trimStrList,

  // UtilB
  _decodeHtml_      : decodeHtml,
  _fillForm_        : fillForm,
  _getFormMap_      : getFormMap,
  _resizeTextarea_  : resizeTextarea,

  // LiteBox (lb)
  _addLocalSpin_  : addLocalSpin,
  _showErrorList_ : showErrorList,
  _showLb_        : showLb,
  _handleResize_  : handleResize,
  _showBusy_      : showBusy,
  _showSuccess_   : showSuccess
};

