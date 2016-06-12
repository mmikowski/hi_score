/**
 *    xhi.css_base.js
 *    Base class resources JS-driven CSS
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint       browser : true, continue : true,
  devel : true, indent : 2,      maxerr : 50,
 newcap : true,  nomen : true, plusplus : true,
 regexp : true, sloppy : true,     vars : false,
  white : true,   todo : true,  unparam : true
*/
/*global jQuery, pcss, xhi */
xhi._css_base_ = (function () {
  // ================= BEGIN MODULE SCOPE VARIABLES ====================
   'use strict';
  var
    topCmap = {
      _global_mixin_map_ : {
        _6rem_    : '6rem',

        _spc_em_00_ : '.375em',  // 06px intra-group
        _spc_em_01_ : '.75em',   // 12px icon-to-label
        _spc_em_02_ : '1.125em', // 18px item indent, word space
        _spc_em_03_ : '1.5em',   // 24px peer item, sentence space
        _spc_em_04_ : '1.875em', // 30px Between groups
        _spc_em_05_ : '2.25em',  // 36px Box padding
        _spc_em_06_ : '2.625em', // 42px Section space

        // near_x
        _shadow_00_ : 'rgba(0,32,64, 0.500 ) 0 0 0.125rem 0',
        // near
        _shadow_01_ : [['_rgba_shadow_01_', [' 0 0 .1875rem 0']]],
        // close
        _shadow_02_ : [['_rgba_shadow_02_', [' 0 0 .1875rem .0625rem']]],
        // close_mid
        _shadow_03_ : [['_rgba_shadow_03_', [' 0 0 .25rem .0625rem']]],
        // mid
        _shadow_04_ : [['_rgba_shadow_03_', [' 0 0 .3125rem .125rem']]],
        // mid_far
        _shadow_05_ : [['_rgba_shadow_03_', [' 0 0 .375rem .125rem']]],
        // far
        _shadow_06_ : [['_rgba_shadow_03_', [' 0 0 .5rem .1875rem']]],
        // far_remote
        _shadow_07_ : [['_rgba_shadow_03_', [' 0 0 .625rem .25rem']]],
        // remote
        _shadow_08_ : [['_rgba_shadow_03_', [' 0 0 .75rem .375rem']]],
        // remote_x
        _shadow_09_ : [['_rgba_shadow_09_', ['0 0 1rem .5rem']]],

        _font_family_awesome_ : 'xhi-fa-4-5-mod, sans-serif',
        _font_family_sans_    : 'OpenSans, sans-serif',
        _font_size_           : '16px',
        _trans_short_         : 'all .2s ease',
        _trans_mid_           : 'all .4s ease',
        _trans_long_          : 'all .5s ease'
      },
      _theme_map_list_ : [
        { _palette_name_       : 'backInBlack',
          _logo_url_           : 'url(app/img/xhi-logo-black.png)',
          _rgba_shadow_01_     : 'rgba(192,222,255,.450)',
          _rgba_shadow_02_     : 'rgba(192,222,255,.405)',
          _rgba_shadow_03_     : 'rgba(192,222,255,.365)',
          _rgba_shadow_04_     : 'rgba(192,222,255,.328)',
          _rgba_shadow_05_     : 'rgba(192,222,255,.295)',
          _rgba_shadow_06_     : 'rgba(192,222,255,.266)',
          _rgba_shadow_07_     : 'rgba(192,222,255,.239)',
          _rgba_shadow_08_     : 'rgba(192,222,255,.215)',
          _rgba_shadow_09_     : 'rgba(192,222,255,.194)',

          // Area color  ====
          _hex_accent_dk_      : '#527582',
          _hex_accent_         : '#4e7585',
          _hex_accent_lt_      : '#385966',

          _hex_area_           : '#16181a',
          _hex_area_hover_     : '#000000',
          _hex_area_accent_    : '#22282a',
          _hex_area_core_      : '#32383a',

          _hex_frame_          : '#acb9c3',
          _hex_frame_lt_       : '#94a5b2',
          _hex_frame_dk_       : '#cdccd4',
          _hex_frame_xdk_      : '#d8e8f5',

          _hex_area_mid_       : '#5d676f',
          _hex_area_mid_lt_    : '#3d4a54',
          _hex_area_mid_dk_    : '#657685',
          _hex_area_mid_xlt_   : '#393f44',

          // Text color
          _hex_txt_dk_         : '#c3ccd4',
          _hex_txt_            : '#acb9c3',
          _hex_txt_lt_         : '#94a5b2',

          _hex_txt_inv_dk_     : '#788087',
          _hex_txt_inv_        : '#5a61dc',
          _hex_txt_inv_lt_     : '#3e5e96',

          _hex_placeholder_    : '#878078',

          // Link color
          _hex_link_           : '#598cc0',
          _hex_link_dk_        : '#7fb5ed',
          _hex_link_fade_      : '#4b576b',
          _hex_link_lt_        : '#3e5e96',

          // Button color
          _hex_btn_area_       : '#598cc0', // button bkg
          _hex_btn_area_hover_ : '#7fb5ed', // button hover bkg
          _hex_btn_txt_        : '#16181a', // button text
          _hex_btn_txt_hover_  : '#000000'
        },
      ],
      _selector_list_ : [
        { _selector_str_ : '::-webkit-input-placeholder',
          _rule_map_     : {_color_ : '_hex_placeholder_'}
        },
        { _selector_str_ : '::-moz-placeholder',
          _rule_map_     : {
            _color_   : '_hex_placeholder_',
            _opacity_ : '_1_'
          }
        },
        { _selector_str_ : '::-ms-input-placeholder',
          _rule_map_     : {_color_ : '_hex_placeholder_'}
        },

        { _selector_str_ : '*',
          _rule_map_     : {
            __moz_box_sizing_  : '_border_box_',
            _box_sizing_       : '_border_box_',
            _float_            : '_none_',
            _margin_           : '_0_',
            _padding_          : '_0_',
            _clip_             : '_auto_',
            _line_height_      : '_inherit_',
            _vertical_align_   : '_inherit_',
            _font_family_      : '_inherit_',
            _font_size_        : '_inherit_',
            _font_weight_      : '_inherit_',
            _font_style_       : '_inherit_',
            _text_decoration_  : '_inherit_',
            _color_            : '_inherit_',
            _background_color_ : '_transparent_',
            _outline_          : '_transparent_'
          }
        },
        { _selector_str_ : 'html',
          _rule_map_     : {
            _font_family_ : '_font_family_sans_',
            _font_size_   : '_font_size_',
            _color_       : '_hex_txt_',
            _background_  : '_hex_area_'
          }
        },
        { _selector_str_ : 'body',
          _rule_map_     : {
            _position_   : '_relative_',
            _display_    : '_block_',
            _overflow_x_ : '_hidden_',
            _overflow_y_ : '_auto_',
            _padding_    : '_2rem_'
          }
        },
        { _selector_str_ : 'h1',
          _rule_map_     : {
            _font_weight_ : '_800_',
            _font_size_   : '_2rem_'
          }
        },
        { _selector_str_ : 'button',
          _rule_map_     : {
            _display_       : '_block_',
            _position_      : '_relative_',
            _margin_        : [['_d5rem_', '_1rem_', '_1rem_', '_1rem_']],
            _border_        : '_0_',
            _outline_       : '_none_',
            _border_radius_ : '_d375rem_',
            _height_        : '_2d5rem_',
            _line_height_   : '_2d25rem_',
            _padding_       : [['_0_', '_1d25rem_']],
            _font_size_     : '_1d25rem_',
            _color_         : '_hex_btn_txt_',
            _background_    : '_hex_btn_area_',
            _cursor_        : '_pointer_'
          }
        },
        { _selector_str_ : 'button:hover',
          _rule_map_     : {
            _background_ : '_hex_btn_area_hover_',
            _color_      : '_hex_btn_txt_hover_'
          }
        },
        { _selector_str_ : 'a',
          _rule_map_     : {
            _color_  : '_hex_link_',
            _cursor_ : '_pointer_'
          }
        },
        { _selector_str_ : 'a:hover',
          _rule_map_     : {
            _color_           : '_hex_link_dk_',
            _text_decoration_ : '_underline_'
          }
        },

        /* BEGIN .xhi-_x_*_ selectors */
        { _selector_str_ : '.xhi-_x_noselect_',
          _rule_map_     : {
            __webkit_user_select_ : '_none_',
            __moz_user_select_    : '_none_',
            __o_user_select_      : '_none_',
            _user_select_         : '_none_'
          }
        },
        { _selector_str_ : '.xhi-_x_fa_',
          _rule_map_     : {_font_family_ : '_font_family_awesome_'}
        },
        // we use xhi to make selector override more general selectors
        { _selector_str_ : '.xhi-_x_color_crit_',
          _rule_map_     : {_color_ : '_hex_txt_crit_'}
        },
        { _selector_str_ : '.xhi-_x_color_major_',
          _rule_map_     : {_color_ : '_hex_txt_major_'}
        },
        { _selector_str_ : '.xhi-_x_color_minor_',
          _rule_map_     : {_color_ : '_hex_txt_minor_'}
        },
        { _selector_str_ : '.xhi-_x_color_info_',
          _rule_map_     : {_color_ : '_hex_txt_info_'}
        },
        { _selector_str_ : '.xhi-_x_color_norm_',
          _rule_map_     : {_color_ : '_hex_link_'}
        },
        { _selector_str_ : '.xhi-_x_link_,.xhi-_x_link_inv_',
          _rule_map_     : {
            _color_  : '_hex_link_',
            _cursor_ : '_pointer_'
          }
        },
        { _selector_str_ : '.xhi-_x_link_:hover',
          _rule_map_     : {
            _text_decoration_ : '_underline_',
            _color_           : '_hex_link_dk_'
          }
        },
        { _selector_str_ : '.xhi-_x_link_inv_:hover',
          _rule_map_     : {
            _text_decoration_ : '_underline_',
            _color_           : '_hex_link_lt_'
          }
        },
        { _selector_str_ : '.xhi-_x_bold_',
          _rule_map_     : {_font_weight_ : '_800_'}
        },

        { _selector_str_ : '.xhi-_x_clearfloat_',
          _rule_map_     : {
            _visibility_ : [['_hidden_', '_important_']],
            _float_      : [['_none_', '_important_']],
            _height_     : [['_0_', '_important_']],
            _clear_      : [['_both_', '_important_']]
          }
        },
        { _selector_str_ : '.xhi-_x_tab_',
          _rule_map_     : {
            _position_        : '_relative_',
            _height_          : '_3rem_',
            _line_height_     : '_2rem_',
            _border_bottom_   : [[ '_d25rem_', '_solid_', '_hex_area_' ]],
            _font_size_       : '_1d125rem_',
            _color_           : '_hex_area_',
            _background_      : '_hex_area_mid_lt_',
            _vertical_align_  : '_middle_',
            _list_style_type_ : '_none_'
          }
        },
        { _selector_str_ : '.xhi-_x_tab_>li',
          _rule_map_ : {
            _float_       : '_left_',
            _width_       : '_50p_',
            _height_      : '_100p_',
            _padding_     : [[ '_d3125rem_', '_0_','_0_', '_1rem_' ]],
            _cursor_      : '_pointer_'
          }
        },
        { _selector_str_ : '.xhi-_x_tab_>li:hover',
          _rule_map_ : {
            _color_       : '_hex_area_hover_',
            _background_  : '_hex_area_mid_'
          }
        },
        { _selector_str_ : '.xhi-_x_tab_>li.xhi-_x_active_',
          _rule_map_     : {
            _color_      : '_hex_link_',
            _background_ : '_hex_area_',
            _cursor_     : '_default_'
          }
        },
        { _selector_str_ : '.xhi-_x_tbox_>li',
          _rule_map_     : {
            _display_    : '_none_',
            _max_height_ : [ '25rem' ],
            _background_  : '_hex_area_mid_xlt_',
            _overflow_x_ : '_hidden_',
            _overflow_y_ : '_auto_'
          }
        },
        { _selector_str_ : '.xhi-_x_tbox_>li.xhi-_x_active_',
          _rule_map_     : {
            _display_     : '_block_',
            _cursor_      : '_default_'
          }
        },
        { _selector_str_ : '.xhi-_x_tbox_list_',
          _rule_map_     : {
            _list_style_type_ : '_none_'
          }
        },
        { _selector_str_ : '.xhi-_x_tbox_list_>li',
          _rule_map_     : {
            _position_ : '_relative_',
            _padding_  : [[ '_d5rem_', '_1rem_' ]],
            _cursor_   : '_pointer_'
          }
        },
        { _selector_str_ : '.xhi-_x_tbox_list_>li:hover',
          _rule_map_     : {
            _background_    : '_hex_area_',
            _color_         : '_hex_txt_dk_'
          }
        },
        { _selector_str_ : '.xhi-_x_list_title_',
          _rule_map_ : {
            _line_height_    : '_2rem_',
            _font_size_      : '_1d125rem_',
            _color_          : '_hex_link_',
            _vertical_align_ : '_top_'
          }
        }
      ]
      /* END .xhi-_x_*_ selectors */
    };
  // ================== END MODULE SCOPE VARIABLES =====================

  return {
    _globalMixinMap_ : topCmap._global_mixin_map_,
    _selectorList_   : topCmap._selector_list_,
    _themeMapList_   : topCmap._theme_map_list_
  };
  // ======================= END PUBLIC METHODS ========================
}());
