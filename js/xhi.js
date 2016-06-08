/*
 * xhi.js - common root module
*/
/*jslint         browser : true, continue : true,
   devel : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
   white : true,    todo : true,  unparam : true
*/
/*global xhi:true, pcss */

var xhi = (function () {
  // ================= BEGIN MODULE SCOPE VARIABLES ====================
  'use strict';
  //noinspection MagicNumberJS
  var
    __Object  = Object,
    __Math    = Math,
    vMap = {
      // We will need these eventually ...
      // __typeof = function ( a ) { return typeof a; },
      // __Array  = Array,
      // __Date   = Date,
      _100p_        : '100%',
      _String_      : String,
      _Number_      : Number,
      _Math_        : __Math,
      _Object_      : __Object,
      _JSON_        : JSON,

      _fnGetKeyList_    : __Object.keys,
      _fnGetFloor_      : __Math.floor,
      _fnGetRandom_     : __Math.random,
      _fnGetRound_      : __Math.round,

      _activeElement_   : 'activeElement',
      _addClass_        : 'addClass',
      _add_             : 'add',
      _ajax_            : 'ajax',
      _appendChild_     : 'appendChild',
      _appendTo_        : 'appendTo',
      _append_          : 'append',
      _apply_           : 'apply',
      _bind_            : 'bind',
      _blank_           : '',
      _blur_            : 'blur',
      _body_            : 'body',
      _call_            : 'call',
      _carouscroll_     : 'carouscroll',
      _children_        : 'children',
      _clone_           : 'clone',
      _closest_         : 'closest',
      _concat_          : 'concat',
      _createElement_   : 'createElement',
      _createTextNode_  : 'createTextNode',
      _cssText_         : 'cssText',
      _css_             : 'css',
      _data_            : 'data',
      _disabled_        : 'disabled',
      _done_            : 'done',
      _each_            : 'each',
      _empty_           : 'empty',
      _eq_              : 'eq',
      _extend_          : 'extend',
      _fadeIn_          : 'fadeIn',
      _fadeOut_         : 'fadeOut',
      _fail_            : 'fail',
      _false_           : false,
      _filter_          : 'filter',
      _find_            : 'find',
      _focus_           : 'focus',
      _font_weight_     : 'font-weight',
      _forEach_         : 'forEach',
      _fromCharCode_    : 'fromCharCode',
      _getElsByTagName_ : 'getElementsByTagName',
      _get_             : 'get',
      _hasClass_        : 'hasClass',
      _hasOwnProp_      : 'hasOwnProperty',
      _head_            : 'head',
      _hide_            : 'hide',
      _html_            : 'html',
      _id_              : 'id',
      _indexOf_         : 'indexOf',
      _index_           : 'index',
      _innerHTML_       : 'innerHTML',
      _innerText_       : 'innerText',
      _join_            : 'join',
      _keydown_         : 'keydown',
      _keyup_           : 'keyup',
      _length_          : 'length',
      _makeDsObj_       : 'makeDragScrollObj',
      _map_             : 'map',
      _null_            : null,
      _off_             : 'off',
      _offset_          : 'offset',
      _on_              : 'on',
      _onload_          : 'onload',
      _outerHTML_       : 'outerHTML',
      _outerHeight_     : 'outerHeight',
      _outerWidth_      : 'outerWidth',
      _parent_          : 'parent',
      _parse_           : 'parse',
      _pop_             : 'pop',
      _prepend_         : 'prepend',
      _preventDefault_  : 'preventDefault',
      _prop_            : 'prop',
      _publish_         : 'publish',
      _push_            : 'push',
      _removeAttr_      : 'removeAttr',
      _removeChild_     : 'removeChild',
      _removeClass_     : 'removeClass',
      _remove_          : 'remove',
      _replace_         : 'replace',
      _resize_          : 'resize',
      _scrollHeight_    : 'scrollHeight',
      _scrollLeft_      : 'scrollLeft',
      _scrollTop_       : 'scrollTop',
      _setAttribute_    : 'setAttribute',
      _shift_           : 'shift',
      _slice_           : 'slice',
      _splice_          : 'splice',
      _split_           : 'split',
      _stopPropagation_ : 'stopPropagation',
      _stringify_       : 'stringify',
      _style_           : 'style',
      _subscribe_       : 'subscribe',
      _target_          : 'target',
      _textContent_     : 'textContent',
      _text_            : 'text',
      _text_css_        : 'text/css',
      _then_            : 'then',
      _toString_        : 'toString',
      _toUpperCase_     : 'toUpperCase',
      _toggleClass_     : 'toggleClass',
      _toggle_          : 'toggle',
      _transitionend_   : 'transitionend',
      _trigger_         : 'trigger',
      _true_            : true,
      _udragend_        : 'udragend',
      _udragmove_       : 'udragmove',
      _udragstart_      : 'udragstart',
      _uheldend_        : 'uheldend',
      _uheldmove_       : 'uheldmove',
      _uheldstart_      : 'uheldstart',
      _unbind_          : 'unbind',
      _undef_           : undefined,
      _unshift_         : 'unshift',
      _utap_            : 'utap',
      _val_             : 'val',
      _when_            : 'when'
    },

    nMap = {
      _n1000_  : -1000,
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
      _11_     : 11,
      _12_     : 12,
      _19_     : 19,
      _22_     : 22,
      _30_     : 30,
      _50_     : 50,
      _100_    : 100,
      _200_    : 200,
      _250_    : 250,
      _500_    : 500,
      _800_    : 800,
      _1000_   : 1000,
      _2000_   : 2000,
      _3000_   : 3000,
      _4000_   : 4000,
      _5000_   : 5000
    },
    cssVmap, cssKmap
    ;

  if ( pcss ) {
    cssKmap = pcss._getCssKeyMap_();
    cssVmap = pcss._getCssValMap_();
  }
  // ================== END MODULE SCOPE VARIABLES =====================

  // ====================== BEGIN PUBLIC METHODS =======================
  return {
    _cssKmap_ : cssKmap,
    _cssVmap_ : cssVmap,
    _nMap_    : nMap,
    _vMap_    : vMap
  };
  // ======================= END PUBLIC METHODS ========================
}());

// Node support
try { xhi._vMap_._window_ = window; xhi._vMap_._document_ = window.document; }
catch( e1 ) {
  try { xhi._vMap_._window_ = global; global.xhi = xhi; }
  catch( e2 ) { throw '_not_a_browser_or_node_'; }
}
