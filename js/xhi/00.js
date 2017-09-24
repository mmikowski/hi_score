/*
 * 00.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use     : xhi._makeRoot_( '<namespace>' );
 * Synopsis: Create an app_map using named <namespace>
 * Provides: An application map containing shared symbols
 *
*/
/*global xhi */
var xhi          = {};
// == BEGIN MODULE xhi._makeRootFn_ ====================================
xhi._makeRootFn_ = function ( aKey, argOptionMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    __JSON   = JSON,
    __Math   = Math,
    __Object = Object,
    __undef  = void 0,

    // The nMap and vMap symbols are the minimimum to support the
    // full breadth of xhi client libs. Use the argOptionMap
    // to expand these lists for project specific requirements.
    //
    nMap = {
      _n4_     : -4,
      _n3_     : -3,
      _n2_     : -2,
      _n1_     : -1,
      _d1_     : 0.1,
      _d2_     : 0.2,
      _d5_     : 0.5,
      _0_      : 0,
      _1_      : 1,
      _2_      : 2,
      _3_      : 3,
      _4_      : 4,
      _5_      : 5,
      _6_      : 6,
      _7_      : 7,
      _8_      : 8,
      _9_      : 9,
      _10_     : 10,
      _100_    : 100
    },

    vMap = {
      _Array_           : Array,
      _Date_            : Date,
      _Math_            : __Math,
      _Number_          : Number,
      _Object_          : __Object,
      _String_          : String,

      _clearTimeoutFn_  : clearTimeout,
      _createObjectFn_  : __Object.create,
      _data2strFn_      : __JSON.stringify,
      _makeAbsNumFn_    : __Math.abs,
      _makeFloorNumFn_  : __Math.floor,
      _makeKeyListFn_   : __Object.keys,
      _makeRandomNumFn_ : __Math.random,
      _makeRoundNumFn_  : __Math.round,
      _setTimeoutFn_    : setTimeout,
      _str2dataFn_      : __JSON.parse,
      _typeofFn_        : function ( a ) { return typeof a; },

      _addClass_        : 'addClass',
      _apply_           : 'apply',
      _append_          : 'append',
      _attr_            : 'attr',
      _bind_            : 'bind',
      _blank_           : '',
      _body_            : 'body',
      _call_            : 'call',
      _cancel_          : 'cancel',
      _concat_          : 'concat',
      _css_             : 'css',
      _empty_           : 'empty',
      _false_           : false,
      _filter_          : 'filter',
      _find_            : 'find',
      _getElsByTagName_ : 'getElementsByTagName',
      _hasOwnProperty_  : 'hasOwnProperty',
      _html_            : 'html',
      _indexOf_         : 'indexOf',
      _join_            : 'join',
      _length_          : 'length',
      _map_             : 'map',
      _match_           : 'match',
      _null_            : null,
      _off_             : 'off',
      _on_              : 'on',
      _onload_          : 'onload',
      _outerHeight_     : 'outerHeight',
      _outerWidth_      : 'outerWidth',
      _parse_           : 'parse',
      _pop_             : 'pop',
      _prop_            : 'prop',
      _push_            : 'push',
      _removeAttr_      : 'removeAttr',
      _removeChild_     : 'removeChild',
      _removeClass_     : 'removeClass',
      _replace_         : 'replace',
      _scrollHeight_    : 'scrollHeight',
      _scrollLeft_      : 'scrollLeft',
      _scrollTop_       : 'scrollTop',
      _shift_           : 'shift',
      _show_            : 'show',
      _slice_           : 'slice',
      _sort_            : 'sort',
      _splice_          : 'splice',
      _split_           : 'split',
      _src_             : 'src',
      _status_          : 'status',
      _string_          : 'string',
      _style_           : 'style',
      _submit_          : 'submit',
      _subscribe_       : 'subscribe',
      _substr_          : 'substr',
      _target_          : 'target',
      _text_            : 'text',
      _then_            : 'then',
      _toFixed_         : 'toFixed',
      _toString_        : 'toString',
      _trigger_         : 'trigger',
      _trim_            : 'trim',
      _true_            : true,
      _udragend_        : 'udragend',
      _udragmove_       : 'udragmove',
      _udragstart_      : 'udragstart',
      _uheld_           : 'uheld',
      _uheldend_        : 'uheldend',
      _uheldmove_       : 'uheldmove',
      _uheldstart_      : 'uheldstart',
      _undef_           : __undef,
      _unshift_         : 'unshift',
      _unsubscribe_     : 'unsubscribe',
      _utap_            : 'utap',
      _val_             : 'val'
    }
    ;
  // == . END MODULE SCOPE VARIABLES ===================================

  // == BEGIN expand vMap and nMaps with app-specific symbols ==========
  // Purpose : Expand symbol maps as needed for project
  // Example :
  //   app_map = xhi._makeRootFn_( 'tb02', { _vMap_ : { _foo_: 'bar' } } );
  // This sets xhi._vMap_._foo_ === 'bar'
  //
  function extendSymbolMapsFn ( arg_option_map ) {
    var
      option_map = ( typeof arg_option_map === 'object' )
        ? arg_option_map : {},
      expand_list  = [ [ '_nmap_', nMap ], [ '_vmap_', vMap ] ],
      expand_count = expand_list.length,

      expand_idx, row_list, source_name, source_map, target_map,
      source_key_list, source_key_count, key_idx, source_key
      ;

    for ( expand_idx = nMap._0_; expand_idx < expand_count; expand_idx++ ) {
      row_list    = expand_list[ expand_idx ];
      source_name = row_list[ nMap._0_ ];
      target_map  = row_list[ nMap._1_ ];
      source_map  = option_map[ source_name ];

      if ( source_map && target_map ) {
        source_key_list  = vMap._makeKeyListFn_( source_map );
        source_key_count = source_key_list[ vMap._length_ ];
        for ( key_idx = nMap._0_; key_idx < source_key_count; key_idx++ ) {
          source_key = source_key_list[ key_idx ];
          if ( target_map[ vMap._hasOwnProperty_ ]( source_key ) ) {
            console.warn(
              'Symbol expansion error.\n Will not override default value'
              + ' for |' + source_key + '| in ' + source_name
            );
          }
          else {
            target_map[ source_key ] = source_map[ source_key ];
          }
        }
      }
    }
  }
  // == . END expand vMap and nMaps with app-specific symbols ==========

  // == BEGIN PUBLIC METHODS ===========================================
  extendSymbolMapsFn( argOptionMap );
  return {
    _aKey_    : aKey,
    _nMap_    : nMap,
    _vMap_    : vMap
  };
  // == . END PUBLIC METHODS ===========================================
};
// == . END MODULE xhi._makeRootFn_ ====================================

// == BEGIN BROWSER AND NODE SUPPORT ===================================
/* istanbul ignore next */
try { module.exports = xhi; }
catch ( ignore ) { console.log(''); }
// == . END BROWSER AND NODE SUPPORT ===================================
