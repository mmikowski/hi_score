/*global $, pcss, tb02*/
// == BEGIN MODULE tb02._06_css_ =======================================
tb02._06_css_ = (function () {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    aMap = tb02,
    aKey = aMap._aKey_,
    nMap = aMap._nMap_,
    vMap = aMap._vMap_,


    __true  = vMap._true_,
    __n1    = nMap._n1_,
    __0     = nMap._0_,
    // __false = vMap._false_,
    // __undef = vMap._undef_,

    __util    = aMap._01_util_,
    __logObj  = __util._getLogObj_(),
    __logMsg  = __logObj._logMsg_,
    __castInt = __util._castInt_,

    __p = __util._makeReplaceFn_( '_p_', aKey ),
    configMap = {
      _base_list_ : [
        { _selector_str_ : __p( '*' ),
          _rule_map_     : {
            _box_sizing_        : '_border_box_',
            __moz_box_sizing_   : '_border_box_',
            _float_             : '_none_',
            _margin_            : '_0_',
            _clip_              : '_auto_',
            _border_            : '_0_',
            _height_            : '_auto_',
            _width_             : '_auto_',
            _padding_           : '_0_',
            _text_align_        : '_left_',
            _text_indent_       : '_0_',
            _line_height_       : '_inherit_',
            _vertical_align_    : '_inherit_',
            _font_family_       : '_inherit_',
            _font_size_         : '_inherit_',
            _font_weight_       : '_inherit_',
            _font_style_        : '_inherit_',
            _text_decoration_   : '_inherit_',
            _color_             : '_inherit_',
            _background_color_  : '_transparent_',

            __webkit_user_select_  : '_none_',
            __moz_user_select_     : '__moz_none_',
            __o_user_select_       : '_none_',
            _user_select_          : '_none_',

            // TODO 2017-09-25 msm : Consider adding-back these keys.
            //   We can set the key list using pcss._initModule_()
            // __ms_user_select_      : '_none_'
            // __webkit_user_drag_    : '_none_',
            // __moz_user_drag_       : '_none_',
            // _user_drag_            : '_none_',
            // __webkit_tap_highlight_color_ : '_transparent_',
            // __webkit_touch_callout_       : '_none_'
          }
        },
        { _selector_str_ : __p( 'input, textarea,.{_p_}-_x-user-select_' ),
          _rule_map_     : {
            __moz_user_select_    : '_text_',
            __o_user_select_      : '_text_',
            __webkit_user_select_ : '_text_',
            _user_select_         : '_text_'
          }
        },
        { _selector_str_ : 'html',
          _rule_map_     : {
            _font_size_   : '_14px_',
            _font_family_ : '_font_family_sans_'
          }
        },
        { _selector_str_ : 'body',
          _rule_map_     : {
            _position_    : '_absolute_',
            _min_width_   : '_40rem_',
            _min_height_  : '_40rem_',
            _top_         : '_0_',
            _bottom_      : '_0_',
            _left_        : '_0_',
            _right_       : '_0_',
            _overflow_    : '_hidden_'
          }
        },
        { _selector_str_ : __p(
          '.{_p_}-_shell_title_, .{_p_}-_shell_subtext_' ),
          _rule_map_     : {
            _display_     : '_block_',
            _position_    : '_absolute_',
            _left_        : '_50p_',
            _width_       : '_56p_',
            _margin_left_ : '_n28p_',
            _text_align_  : '_center_',
            _font_weight_ : '_800_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_subtext_ select' ),
          _rule_map_     : {
            _color_     : '_txt_alt_hex_',
            _font_size_ : '_1d875rem_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_x_down_' ),
          _rule_map_     : {
            _vertical_align_ : '_sub_',
            _color_          : '_accent_hex_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_x_release_' ),
          _rule_map_     : {
            _vertical_align_ : '_sub_',
            _font_size_      : '_2d5rem_',
            _color_          : '_txt_alt_hex_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_title_' ),
          _rule_map_     : {
            _font_size_ : '_4rem_',
            _top_       : '_4rem_',
            _color_     : '_txt_lt_hex_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_subtext_' ),
          _rule_map_     : {
            _font_size_ : '_3rem_',
            _top_       : '_10d5rem_',
            _color_     : '_txt_dk_hex_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_bg_svg_' ),
          _rule_map_     : {
            _position_     : '_absolute_',
            _width_        : '_100p_',
            _height_       : '_100p_',
            _fill_         : '_area_mid_hex_',
            _stroke_width_ : ['.375'],
            _stroke_       : '_txt_lt_hex_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_typebox_' ),
          _rule_map_     : {
            _display_          : '_block_',
            _position_         : '_absolute_',
            _font_size_        : '_2d5rem_',
            _bottom_           : '_0_',
            _height_           : '_5rem_',
            _width_            : '_60p_',
            _line_height_      : '_5rem_',
            _left_             : '_50p_',
            _margin_left_      : '_n30p_',
            _font_family_      : '_font_family_mono_',
            _border_width_     : '_d25rem_',
            _border_style_     : '_solid_',
            _border_color_     : '_txt_lt_hex_',
            _border_bottom_    : '_0_',
            _background_color_ : '_area_accent_hex_',
            _border_radius_    : [[ '_5rem_', '_5rem_', '_0_', '_0_' ]],
            _text_align_       : '_center_',
            _box_shadow_       : '_shdw_02_',
            _overflow_         : '_hidden_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_hi_score_' ),
          _rule_map_     : {
            _display_     : '_block_',
            _position_    : '_absolute_',
            _left_        : '_50p_',
            _width_       : '_36p_',
            _margin_left_ : '_n18p_',
            _padding_     : '_d5rem_',
            _font_size_   : '_2rem_',
            _top_         : '_16rem_',
            _text_align_  : '_center_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_level_' ),
          _rule_map_     : {
            _display_       : '_block_',
            _position_      : '_absolute_',
            _font_size_     : '_2rem_',
            _bottom_        : '_8rem_',
            _left_          : '_2rem_',
            _width_         : '_12rem_',
            _height_        : '_4rem_',
            _line_height_   : '_4rem_',
            _font_weight_   : '_800_',
            _border_bottom_ : '_underscore_border_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_level_label_' ),
          _rule_map_     : {
            _float_ : '_left_',
            _color_ : '_txt_alt_hex_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_level_count_' ),
          _rule_map_     : {
            _float_ : '_right_',
            _color_ : '_txt_lt_hex_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_lives_' ),
          _rule_map_     : {
            _display_     : '_block_',
            _position_    : '_absolute_',
            _font_size_   : '_2rem_',
            _bottom_      : '_2rem_',
            _left_        : '_2rem_',
            _width_       : '_12rem_',
            _height_      : '_4rem_',
            _line_height_ : '_4rem_',
            _font_weight_ : '_800_',
            _border_bottom_ : '_underscore_border_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_lives_count_' ),
          _rule_map_     : {
            _float_ : '_right_',
            _color_ : '_txt_lt_hex_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_lives_gfx_' ),
          _rule_map_     : {
            _float_       : '_left_',
            _font_family_ : '_font_family_awesome_',
            _font_size_   : '_1d5rem_',
            _color_       : '_area_alert_hex_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_score_' ),
          _rule_map_     : {
            _display_       : '_block_',
            _position_      : '_absolute_',
            _font_size_     : '_2rem_',
            _bottom_        : '_2rem_',
            _right_         : '_2rem_',
            _width_         : '_10rem_',
            _height_        : '_6d5rem_',
            _font_weight_   : '_800_',
            _border_bottom_ : '_underscore_border_',
            _color_         : '_txt_lt_hex_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_score_label_' ),
          _rule_map_     : {
            _line_height_ : '_3rem_',
            _color_ : '_txt_alt_hex_',
            _text_align_  : '_center_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_score_int_' ),
          _rule_map_     : {
            _line_height_ : '_3rem_',
            _text_align_  : '_center_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_shell_bomb_' ),
          _rule_map_     : {
            _position_         : '_absolute_',
            _font_size_        : [ '2em' ],
            _border_color_     : '_frame_hex_',
            _border_radius_    : [ '.25em' ],
            _border_style_     : '_solid_',
            _border_width_     : '_d125rem_',
            _height_           : [ '1.25emm' ],
            _line_height_      : [ '1em' ],
            _padding_          : [['_d25rem_', '_d75rem_' ]],
            _font_family_      : '_font_family_mono_',
            _box_shadow_       : '_shdw_09_',
            _color_            : '_txt_inv_hex_',
            _background_color_ : '_area_warn_hex_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_x_fast_' ),
          _rule_map_     : {
            _font_size_        : '_3rem_',
            _background_color_ : '_area_alert_hex_',
            _border_color_     : '_frame_dk_hex_'
          }
        },
        { _selector_str_ : __p( '.{_p_}-_x_slow_' ),
          _rule_map_     : {
            _font_size_        : '_2rem_',
            _background_color_ : '_area_info_hex_',
            _border_color_     : '_frame_lt_hex_'
          }
        }
      ],
      _mixin_map_ : {
        _14px_ : '14px',

        _3d25rem_ : '_3d25rem_',
        _6d25rem_ : '6.25rem',
        _6d5rem_  : '6.5rem',
        _8rem_    : '8rem',
        _10d5rem_ : '10.5rem',
        _12rem_   : '12rem',
        _16rem_   : '16rem',
        _40rem_   : '40rem',
        _36p_     : '36%',
        _56p_     : '56%',
        _60p_     : '60%',
        _n18p_    : '-18%',
        _n28p_    : '-28%',
        _n30p_    : '-30%',

        _sub_  : 'sub',

        __moz_none_           : '-moz-none',
        _underscore_border_   : [[ '_d125rem_', '_solid_', '_txt_dk_hex_' ]]
      }
    },
    stateMap = {
      _is_ready_    : vMap._false_,
      _palette_idx_ : vMap._undef_,
      _palette_map_ : vMap._undef_
    };
  // == . END MODULE SCOPE VARIABLES ===================================

  // == BEGIN UTILITY METHODS ==========================================
  // BEGIN utility /initPaletteMap/
  // Summary   : initPaletteMap( <arg_palette_idx> ];
  // Purpose   : Initialize palette_map in the following priority:
  //   1. Use provided argument: palette_list[ <arg_palette_idx> ]
  //   2. Local store map: Localstorage.<key>-_palette_map_
  //   3. Local store index: palette_list[ Localstorage.<key>-_palette_idx_ ]
  //   4. Default index (0)
  // Example   : var palette_map = initPaletteMap();
  // Arguments : ( positional )
  //   0. arg_idx : (optional) Override palette index to use
  //      In the future we may also support an explicit map.
  // Settings  : Uses stateMap and configMap from context.
  // Returns   : undef
  // Throws    : none
  //
  // We have applied stateMap and configMap in ctx_obj as a test
  function initPaletteMap ( arg_palette_idx ) {
    var
      ctx_obj           = this,
      input_palette_idx = __castInt( arg_palette_idx, __n1 ),
      local_map_key     = aKey + '-_palette_map_',
      local_idx_key     = aKey + '-_palette_idx_',
      palette_map_list  = aMap._05_css_base_._paletteMapList_,
      palette_map_count = palette_map_list[ vMap._length_ ],

      solve_idx, solve_map,
      local_json, local_idx
    ;

    function cleanup_fn () {
      ctx_obj._stateMap_._palette_idx_ = solve_idx;
      ctx_obj._stateMap_._palette_map_ = solve_map;
      return solve_map;
    }

    // 1. Use provided argument: palette_list[ <arg_idx> ]
    if ( input_palette_idx > __n1 ) {
      solve_idx = input_palette_idx >= palette_map_count
        ? palette_map_count + __n1 : input_palette_idx
      ;
      solve_map = palette_map_list[ solve_idx ];
      return cleanup_fn();
    }

    // 2. Use local store map: Localstorage.<key>-_palette_map_
    if ( localStorage[ vMap._hasOwnProperty_ ]( local_map_key ) ) {
      local_json = localStorage[ local_map_key ];
      try {
        solve_map = vMap._str2dataFn_( local_json );
      }
      catch ( error ) {
        __logMsg( '_error_', '_cannot_parse_local_palette_json_', error );
      }
      if ( solve_map ) {
        solve_idx = __n1;
        return cleanup_fn();
      }
    }

    // 3. Use local store index: Localstorage.<key>-_palette_idx_
    if ( localStorage[ vMap._hasOwnProperty_ ]( local_idx_key ) ) {
      local_idx = __castInt( localStorage[ local_idx_key ], __0 );
      solve_idx = local_idx > palette_map_count
        ? palette_map_count - 1 : local_idx < __0
          ? __0 : local_idx;
    }
    // 4. Use default index (__0)
    else {
      solve_idx = __0;
    }
    solve_map = palette_map_list[ solve_idx ];
    return cleanup_fn();
  }
  // . END utility /initPaletteMap/
  // == . END UTILITY METHODS ==========================================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN public method /getPaletteCount/
  function getPaletteCount () {
    var
      palette_map_list = aMap._05_css_base_._paletteMapList_;
    return palette_map_list[ vMap._length_ ];
  }
  // . END public method /getPaletteCount/

  // BEGIN public method /getPaletteMixinMap/
  function getPaletteMixinMap () {
    var
      palette_list = aMap._05_css_base_._paletteMapList_,
      palette_idx      = stateMap._palette_idx_;
    return palette_list[ palette_idx ];
  }
  // . END public method /getPaletteMixinMap/

  // BEGIN public method /setPaletteIdx/
  function setPaletteIdx( arg_idx ) {
    var
      idx            = __util._castInt_( arg_idx, 0 ),
      palette_map_list = aMap._05_css_base_._paletteMapList_,
      palette_idx      = stateMap._palette_idx_,
      palette_count    = palette_map_list[ vMap._length_ ],
      palette_mixin_map;

    // Return current palette index if request is out of range
    // or matches existing.
    if ( idx === palette_idx || idx > palette_count || idx < __0 ) {
      return palette_idx;
    }

    // Get the mixin map for the requested idx.  If no map exists,
    // use the first palette map (0).
    palette_idx = idx;
    palette_mixin_map = palette_map_list[ palette_idx ];
    if ( ! palette_mixin_map ) {
      palette_idx       = __0;
      palette_mixin_map = palette_map_list[ __0 ] || {};
    }

    // Set the cascade and safe state. Return current them index.
    pcss._setCascade_({
      _cascade_id_     : '_c01_',
      _mode_str_       : '_change_',
      _mixin_map_      : palette_mixin_map,
      _regen_type_     : '_use_'
    });
    stateMap._palette_idx_ = palette_idx;
    return palette_idx;
  }
  // . END public method /setPaletteIdx/

  function initModuleFn ( arg_palette_idx ) {
    var palette_map;

    if ( stateMap._is_ready_ ) { return; }

    // Initialize pcss and merge mixin maps
    pcss._initModule_({ _style_el_prefix_ : aKey });
    pcss._setGlobalMixinMap_({
      _mixin_map_ : aMap._05_css_base_._globalMixinMap_
    });
    pcss._setGlobalMixinMap_({
      _mixin_map_ : configMap._mixin_map_,
      _change_type_ : '_merge_'
    });

    // Set up virtual sheets
    pcss._setVsheet_({
      _vsheet_id_     : '_base_',
      _mode_str_      : '_add_',
      _selector_list_ : aMap._05_css_base_._selectorList_
    });
    pcss._setVsheet_({
      _vsheet_id_     : '_lb_',
      _mode_str_      : '_add_',
      _selector_list_ : aMap._05_css_lb_._selectorList_
    });
    pcss._setVsheet_({
      _vsheet_id_     : '_shell_',
      _mode_str_      : '_add_',
      _selector_list_ : configMap._base_list_
    });

    palette_map = initPaletteMap.call(
      { _configMap_ : configMap, _stateMap_ : stateMap },
      arg_palette_idx
    );

    // Create and activate cascade
    pcss._setCascade_({
      _cascade_id_     : '_c01_',
      _mode_str_       : '_add_',
      _vsheet_id_list_ : [ '_base_', '_lb_', '_shell_' ],
      _mixin_map_      : palette_map,
      _regen_type_     : '_use_'
    });
    stateMap._is_ready_ = __true;
  }
  return {
    _getCssKeyMap_       : pcss._getCssKeyMap_,
    _getCssValMap_       : pcss._getCssValMap_,
    _getPaletteCount_    : getPaletteCount,
    _getPaletteMixinMap_ : getPaletteMixinMap,
    _setPaletteIdx_      : setPaletteIdx,

    _initModuleFn_ : initModuleFn
  };
  // == . END PUBLIC METHODS ===========================================
}());
// == . END MODULE tb02._06_css_ =======================================
