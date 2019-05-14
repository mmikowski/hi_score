/*
 * 00_root.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._00_root_._makeInstanceFn_( '<namespace_key>', option_map );
 * Synopsis : Create an app_map using named <namespace_key> as the root
 * Provides : An application map containing shared symbols
 * Requires : ---
 *
*/
/*global xhi, module */
var xhi = {};
// == BEGIN MODULE xhi._00_root_ =======================================
xhi._00_root_ = (function () {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    // Set object symbols
    jsonObj   = JSON,
    mathObj   = Math,
    objectObj = Object,

    // Set string-like symbols
    __undef  = void 0,

    // The nMap and vMap symbol maps are the minimimum to support the
    // full breadth of xhi client libs. Use _extendSymbolMapFn_
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
      _Math_            : mathObj,
      _Number_          : Number,
      _Object_          : objectObj,
      _String_          : String,

      _clearTimeoutFn_  : clearTimeout,
      _createObjectFn_  : objectObj.create,
      _data2strFn_      : jsonObj.stringify,
      _makeAbsNumFn_    : mathObj.abs,
      _makeFloorNumFn_  : mathObj.floor,
      _makeKeyListFn_   : objectObj.keys,
      _makeRandomNumFn_ : mathObj.random,
      _makeRoundNumFn_  : mathObj.round,
      _setTimeoutFn_    : setTimeout,
      _str2dataFn_      : jsonObj.parse,
      _typeofFn_        : function typeofFn ( a ) { return typeof a; },

      _Deferred_        : 'Deferred',
      _addClass_        : 'addClass',
      _always_          : 'always',
      _apply_           : 'apply',
      _append_          : 'append',
      _attr_            : 'attr',
      _bind_            : 'bind',
      _blank_           : '',
      _body_            : 'body',
      _call_            : 'call',
      _cancel_          : 'cancel',
      _click_           : 'click',
      _closest_         : 'closest',
      _concat_          : 'concat',
      _css_             : 'css',
      _data_            : 'data',
      _empty_           : 'empty',
      _exec_            : 'exec',
      _false_           : false,
      _filter_          : 'filter',
      _find_            : 'find',
      _getElsByTagName_ : 'getElementsByTagName',
      _hasOwnProperty_  : 'hasOwnProperty',
      _height_          : 'height',
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
      _reject_          : 'reject',
      _resolve_         : 'resolve',
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

  // == BEGIN PRIVATE METHODS ==========================================
  // BEGIN private method /makeCloneMap/
  // We use this instead of Object.assign to remain
  // compatible with IE11
  function makeCloneMap ( map ) {
    var
      key_list  = vMap._makeKeyListFn_( map ),
      key_count = key_list.length,
      clone_map = {},
      idx, key;

    for ( idx = nMap._0_; idx < key_count; idx++ ) {
      key = key_list[ idx ];
      clone_map[ key ] = map[ key ];
    }
    return clone_map;
  }
  // . END private method /makeCloneMap/
  // == . END PRIVATE METHODS ==========================================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN public method /getGlobalObjFn/
  function getGlobalObjFn () {
    var global_obj;
    try { global_obj = window; }
    catch ( ignore ) { global_obj = global; }
    if ( ! global_obj ) { throw '_no_global_object_found_'; }
    return global_obj;
  }
  // . END public method /getGlobalObjFn/

  // BEGIN public method /makeInstanceFn/
  function makeInstanceFn ( aKey, arg_option_map ) {
    var
      instanceNmap = makeCloneMap( nMap ),
      instanceVmap = makeCloneMap( vMap ),
      option_map = vMap._typeofFn_( arg_option_map ) === 'object'
        ? arg_option_map : {},

      global_obj, instance_map
      ;

    // BEGIN public method /extendSymbolMapFn/
    // Purpose : Expand symbol maps as needed for project
    // Example :
    //   xhi._00_root_._extendSymbolMapFn_(
    //     '_vMap_',  { _user_name_: 'Fred' }
    //   );
    // This sets xhi._vMap_._user_name_ === 'Fred'
    //
    function extendSymbolMapFn ( symbol_map_name, extend_map ) {
      var
        lookup_map = { _nMap_ : instanceNmap, _vMap_ : instanceVmap },
        target_map = lookup_map[ symbol_map_name ],

        extend_key_list, extend_key_count, key_idx, extend_key
      ;

      if ( !target_map ) {
        return console.warn( '_symbol_map_not_supported_', symbol_map_name );
      }
      if ( vMap._typeofFn_( extend_map ) !== 'object' ) {
        return console.warn( '_merge_data_must_be_an_object_', extend_map );
      }

      extend_key_list  = vMap._makeKeyListFn_( extend_map );
      extend_key_count = extend_key_list[ vMap._length_ ];
      for ( key_idx = nMap._0_; key_idx < extend_key_count; key_idx++ ) {
        extend_key = extend_key_list[ key_idx ];
        if ( target_map[ vMap._hasOwnProperty_ ]( extend_key ) ) {
          console.warn(
            '_refusing_to_override_built_in_value_',
            symbol_map_name, extend_key, target_map[ extend_key ]
          );
        }
        else {
          target_map[ extend_key ] = extend_map[ extend_key ];
        }
      }
      return target_map;
    }
    // . END public method /extendSymbolMapFn/

    instance_map = {
      _extendSymbolMapFn_ : extendSymbolMapFn,
      _aKey_ : aKey,
      _nMap_ : instanceNmap,
      _vMap_ : instanceVmap
    };

    if ( option_map._dont_autoadd_ !== vMap._true_ ) {
      global_obj = getGlobalObjFn();
      global_obj[ aKey ] = instance_map;
    }
    return instance_map;
  }
  // BEGIN public method /makeInstanceFn/

  // getMapFn gets the default nMap and vMap, not the instance values
  return {
    _makeInstanceFn_ : makeInstanceFn
  };
  // == . END PUBLIC METHODS ===========================================
}());
// == . END MODULE xhi._00_root_ =======================================

// == BEGIN BROWSER AND NODE SUPPORT ===================================
/* istanbul ignore next */
try { module.exports = xhi; }
catch ( ignore ) { void 0; }
// == . END BROWSER AND NODE SUPPORT ===================================
