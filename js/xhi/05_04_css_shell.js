/*
 * 05_04_css_shell.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._05_04_css_shell_._makeInstanceFn_( app_map, option_map );
 * Synopsis : Add _05_04_css_shell_ capabilities to app_map
 * Provides : PowerCSS structure CSS data
 * Requires : aMap (app map) with symbols from 00_root._makeInstanceFn_()
 *
*/
/*global xhi*/
// == BEGIN MODULE xhi._05_04_css_shell_ ==============================
xhi._05_04_css_shell_ = (function () {
  'use strict';
  // == BEGIN public method /makeInstanceFn/ ==========================
  function makeInstanceFn ( aMap, argOptionMap ) {
    // == BEGIN MODULE SCOPE VARIABLES ================================
    var
      // Set app symbols
      aKey    = aMap._aKey_,
      subName = '_05_04_css_shell_',
      vMap    = aMap._vMap_,

      // Set object symbols
      utilObj  = aMap._01_util_,

      // Set function symbols
      pFn = utilObj._makeReplaceFn_( '_p_', aKey ),

      // Set scalar symbols
      __blank = vMap._blank_,

      // Set config map
      configMap = {
        _selector_list_ : [
          // -- begin {_p_}-_shell_ selectors
          { _selector_str_ : pFn('.{_p_}-_shell_head_'),
            _rule_map_     : {
              _z_index_     : [ '30' ],
              _position_   : '_fixed_',
              _box_shadow_ : '_shdw_03_',
              _top_        : '_0_',
              _left_       : '_3d75rem_',
              _right_      : '_0_',
              _height_     : '_3d75rem_',
              _background_ : '_frame_hex_',
              _transition_ : '_trans_short_'
            }
          },
          { _selector_str_  : pFn('.{_p_}-_shell_head_logo_'),
            _rule_map_      : {
              _position_    : '_absolute_',
              _left_        : '_spc_rem_01_',
              _top_         : '_spc_rem_02_',
              _height_      : '_spc_rem_03_',
              _width_       : [ '11.25rem' ],
              _background_ : [[
                '_logo_url_', '_no_repeat_', '_center_','_center_'
              ]],
              _background_size_  : '_cover_'
            }
          },
          { _selector_str_  : pFn('.{_p_}-_shell_head_search_'),
            _rule_map_      : {
              _position_    : '_absolute_',
              _left_        : '_50p_',
              _top_         : '_d875rem_',
              _margin_left_ : [ '-7.5rem' ],
              _width_       : [ '15rem' ],
              _height_      : '_spc_rem_04_'
            }
          },
          { _selector_str_  : pFn('.{_p_}-_shell_head_search_ > input'),
            _rule_map_ : {
              _outline_     : '_none_',
              _width_       : '_100p_',
              _height_      : '_spc_rem_04_',
              _padding_     : [[ '_0_', '_1rem_', '_0_', '_spc_rem_04_' ]],
              _line_height_ : '_spc_rem_04_',
              _color_       : '_txt_lt_hex_',
              _background_  : '_area_accent_hex_',
              _border_      : [[ '_d0625rem_', '_solid_', '_area_mid_hex_' ]],
              _border_radius_ : '_radius_07_'
            }
          },
          { _selector_str_  : pFn('.{_p_}-_shell_head_search_ > input:focus'),
            _rule_map_ : { _border_color_ : '_area_xdk_hex_' }
          },
          { _selector_str_  : pFn('.{_p_}-_shell_head_search_ .{_p_}-_x_mag_'),
            _rule_map_ : {
              _position_    : '_absolute_',
              _top_         : '_0_',
              _left_        : '_d625rem_',
              _outline_     : '_none_',
              _height_      : '_spc_rem_04_',
              _line_height_ : '_spc_rem_04_',
              _font_size_   : '_spc_rem_02_',
              _color_       : '_link_hex_',
              _cursor_      : '_pointer_',
              _font_family_ : '_font_family_awesome_'
            }
          },
          { _selector_str_  : pFn('.{_p_}-_shell_head_search_ .{_p_}-_x_mag_:hover'),
            _rule_map_ : { _color_ : '_link_lt_hex_' }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_head_ a'),
            _rule_map_     : { _color_ : '_link_lt_hex_' }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_head_ a:hover'),
            _rule_map_     : { _color_ : '_link_dk_hex_' }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_umenu_'),
            _rule_map_ : {
              _z_index_  : [ '30' ],
              _display_  : '_block_',
              _position_ : '_fixed_',
              _top_      : '_0_',
              _right_    : '_0_',
              _padding_  : [[ '_d25rem_', '_0_' ]],
              _color_    : '_link_hex_',
              _border_radius_ : [[ '_0_', '_0_', '_0_', '_radius_15_' ]]
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_umenu_.{_p_}-_x_open_'),
            _rule_map_     : {
              _background_ : '_frame_hex_',
              _box_shadow_ : '_shdw_04_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_umenu_>li'),
            _rule_map_     : {
              _display_     : '_none_',
              _height_      : '_3rem_',
              _line_height_ : '_3rem_',
              _width_       : '_100p_',
              _padding_     : [[ '_0_', '_1rem_' ]],
              _font_size_   : '_spc_rem_02_',
              _color_       : '_link_hex_',
              _white_space_ : '_nowrap_',
              _text_align_  : '_right_',
              _cursor_        : '_pointer_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_umenu_.{_p_}-_x_open_>li'),
            _rule_map_     : { _display_ : '_block_' }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_umenu_>li:first-child'),
            _rule_map_ : {
              _display_     : '_block_',
              _line_height_ : '_spc_rem_03_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_umenu_>li div'),
            _rule_map_ : {
              _line_height_ : '_spc_rem_03_',
              _margin_right_ : '_spc_rem_04_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_umenu_>li:hover'),
            _rule_map_ : { _color_ : '_link_lt_hex_' }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_umenu_>li span'),
            _rule_map_ : {
              _display_      : '_block_',
              _float_        : '_right_',
              _height_       : '_3rem_',
              _line_height_  : '_3rem_',
              _width_        : '_spc_rem_03_',
              _margin_left_  : '_spc_rem_01_',
              _font_family_  : '_font_family_awesome_',
              _font_size_    : '_spc_rem_03_',
              _text_align_   : '_center_',
              _text_decoration_ : '_none_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_tgl_'),
            _rule_map_     : {
              _z_index_     : [ '20' ],
              _position_   : '_fixed_',
              _top_        : '_0_',
              _left_       : '_0_',
              _width_      : '_3d75rem_',
              _height_     : '_3d75rem_',
              _line_height_: '_3d75rem_',
              _font_family_: '_font_family_awesome_',
              _font_size_  : '_spc_rem_03_',
              _color_      : '_link_lt_hex_',
              _background_ : '_frame_dk_hex_',
              _text_align_ : '_center_',
              _cursor_     : '_pointer_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_tgl_:hover'),
            _rule_map_ : { _color_ : '_link_xlt_hex_' }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_nav_'),
            _rule_map_ : {
              _z_index_     : [ '10' ],
              _position_    : '_fixed_',
              _box_shadow_  : '_shdw_02_',
              _top_         : '_0_',
              _left_        : '_0_',
              _bottom_      : '_0_',
              _width_       : '_3d75rem_',
              _padding_top_ : [ '4.25rem' ],
              _background_  : '_frame_dk_hex_',
              _overflow_y_  : '_auto_',
              _overflow_x_  : '_hidden_',
              _transition_  : '_trans_short_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_nav_>li'),
            _rule_map_ : {
              _white_space_   : '_nowrap_',
              _padding_left_  : '_spc_rem_02_',
              _height_        : '_spc_rem_04_',
              _width_         : '_100p_',
              _line_height_   : '_spc_rem_04_',
              _font_size_     : '_spc_rem_02_',
              _margin_bottom_ : '_d875rem_',
              _cursor_        : '_pointer_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_nav_>li a'),
            _rule_map_ : { _color_ : '_link_lt_hex_' }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_nav_>li a:hover'),
            _rule_map_ : { _color_ : '_link_xlt_hex_' }
          },
          { _selector_str_ : '.{_p_}-_shell_nav_>li.active a',
            _rule_map_     : { _color_ : '_link_xlt_hex_' }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_nav_>li.{_p_}-_x_select_'),
            _rule_map_ : { _color_ : '_link_xlt_hex_' }
          },
          { _selector_str_ : '.{_p_}-_shell_nav_>li.xhi-_x_select_',
            _rule_map_ : { _background_ : '_frame_xdk_hex_' }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_nav_ li span'),
            _rule_map_ : {
              _display_      : '_inline_block_',
              _width_        : '_spc_rem_03_',
              _margin_right_ : '_spc_rem_02_',
              _font_family_  : '_font_family_awesome_',
              _font_size_    : '_spc_rem_03_',
              _text_align_   : '_center_',
              _text_decoration_ : '_none_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_foot_'),
            _rule_map_     : {
              _z_index_       : [ '30' ],
              _position_      : '_fixed_',
              _bottom_        : '_0_',
              _right_         : '_0_',
              _border_radius_ : [[ '_radius_05_', '_0_', '_0_','_0_' ]],
              _padding_       : [[ '_spc_rem_00_', '_spc_rem_01_','_spc_rem_01_','_spc_rem_01_' ]],
              _background_    : '_frame_dk_hex_',
              _color_         : '_link_lt_hex_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_foot_txt_'),
            _rule_map_     : {
              _position_   : '_relative_',
              _font_size_  : '_d625rem_',
              _text_align_ : '_center_',
              _padding_bottom_ : '_d25rem_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_cont_'),
            _rule_map_ : {
              _margin_     : '_auto_',
              _padding_    : [[ '_5rem_', '_spc_rem_04_', '_3rem_', '_5d5rem_' ]],
              _max_width_  : [ '100rem' ],
              _transition_ : '_trans_short_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_cont_head_'),
            _rule_map_     : {
              _z_index_       : '_1_',
              _float_         : '_left_',
              _position_      : '_relative_',
              _margin_right_  : '_1rem_',
              _margin_bottom_ : '_1rem_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_cont_head_bread_ li'),
            _rule_map_     : {
              _display_        : '_inline_block_',
              _float_          : '_left_',
              _line_height_    : '_spc_rem_04_',
              _font_size_      : '_1d25rem_',
              _color_          : '_link_fade_hex_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_cont_head_bread_ li:nth-child(even)'),
            _rule_map_     : {
              _margin_top_  : '_d125rem_',
              _width_       : '_spc_rem_04_',
              _font_family_ : '_font_family_awesome_',
              _text_align_  : '_center_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_cont_head_bread_ li:last-child'),
            _rule_map_     : {
              _font_size_ : '_1d75rem_',
              _color_     : '_txt_hex_',
              _cursor_    : '_default_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_cont_head_icon_'),
            _rule_map_     : {
              _margin_right_   : '_spc_rem_01_',
              _font_family_    : '_font_family_awesome_',
              _vertical_align_ : '_baseline_'
            }
          },
          { _selector_str_ : pFn('.{_p_}-_box_'),
            _rule_map_ : { _position_    : '_relative_' }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_nav_.{_p_}-_x_open_'),
            _rule_map_ : { _width_ : [ '13rem' ] }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_head_.{_p_}-_x_open_'),
            _rule_map_     : {
              _border_radius_ : [[ '_0_','_0_','_0_','_radius_15_' ]]
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_cont_.{_p_}-_x_open_'),
            _rule_map_     : { _padding_left_ : [ '15.25rem' ] }
          },
          // -- end {_p_}-_shell_ selectors

          // -- begin {_p_}-_shell_ mid-width conditional selectors
          { _begin_cond_str_ : '@media all and (max-width: 812px)' },
          { _selector_str_ : pFn('.{_p_}-_shell_cont_'),
            _rule_map_ : {
              _padding_    : [[ '_5rem_', '_3rem_', '_5rem_', '_spc_rem_04_' ]]
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_base_'),
            _rule_map_ : {
              _padding_    : [[ '_0_', '_3rem_', '_0_', '_spc_rem_04_' ]]
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_nav_'),
            _rule_map_     : { _width_ : '_0_' }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_tgl_'),
            _rule_map_ : { _box_shadow_ : '_shdw_03_' }
          },
          { _selector_str_  : pFn('.{_p_}-_shell_head_search_'),
            _rule_map_      : {
              _left_        : '_auto_',
              _margin_left_ : '_0_',
              _right_       : [ '8rem' ]
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_tgl_.{_p_}-_x_open_'),
            _rule_map_ : { _box_shadow_ : '_none_' }
          },
          { _end_cond_str_ : __blank },
          // -- end {_p_}-_shell_ mid-width conditional selectors

          // -- begin {_p_}-_shell_ narrow-width conditional selectors
          { _begin_cond_str_ : '@media all and (max-width: 600px)' },
          { _selector_str_ : pFn('.{_p_}-_shell_head_'),
            _rule_map_     : { _height_ : [ '6.5rem' ] }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_cont_'),
            _rule_map_     : {
              _padding_ : [[ ['8rem'], '_1rem_', '_6rem_', '_1rem_' ]]
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_base_'),
            _rule_map_ : {
              _padding_    : [[ '_0_', '_1rem_', '_0_', '_1rem_' ]]
            }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_nav_.{_p_}-_x_open_'),
            _rule_map_ : { _width_ : '_100p_' }
          },
          { _selector_str_ : pFn('.{_p_}-_shell_tgl_'),
            _rule_map_     : {
              _height_      : [ '6.5rem' ],
              _line_height_ : '_6rem_'
            }
          },
          { _selector_str_  : pFn('.{_p_}-_shell_head_search_'),
            _rule_map_      : {
              _left_        : '_spc_rem_01_',
              _top_         : '_3d5rem_',
              _margin_left_ : '_0_',
              _width_       : '_auto_',
              _right_       : '_spc_rem_03_'
            }
          },
          { _end_cond_str_ : __blank }
          // -- end {_p_}-_shell_ narrow-width conditional selectors
        ]
      },

      // Declare other module-scope variables
      instanceMap, optionMap
      ;
    // == . END MODULE SCOPE VARIABLES ================================

    // == BEGIN PUBLIC METHODS ========================================
    instanceMap = { _selectorList_ : configMap._selector_list_ };

    optionMap = utilObj._castMap_( argOptionMap, {} );
    if ( optionMap._dont_autoadd_ !== vMap._true_ ) {
      aMap[ subName ] = instanceMap;
    }

    return instanceMap;
    // == . END PUBLIC METHODS ========================================
  }
  // == . END public method /makeInstanceFn/ ==========================
  return { _makeInstanceFn_ : makeInstanceFn };
}());
// == . END MODULE xhi._05_04_css_shell_ ==============================

