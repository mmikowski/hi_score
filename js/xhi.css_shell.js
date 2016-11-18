/**
 *    xhi.css_shell.js
 *    Shell class for JS-driven CSS using PowerCSS
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true, todo    : true, unparam  : true
*/
/*global pcss, $ */

var __ns = 'xhi', __NS;
/* istanbul ignore next */
try          { __NS = global[ __ns ]; }
catch ( e1 ) { __NS = window[ __ns ]; }

// == BEGIN MODULE _makeCssShell_ ======================================
__NS._css_shell_ = (function () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  //noinspection MagicNumberJS
  'use strict';
  var
    aKey    = __ns,
    aMap    = __NS,
    vMap    = aMap._vMap_,

    __blank = vMap._blank_,
    topCmap = {
      _selector_list_ : [
        // -- begin aKey-_shell_ selectors
        { _selector_str_ : '.' + aKey + '-_shell_head_',
          _rule_map_     : {
            _z_index_     : [ '30' ],
            _position_   : '_fixed_',
            _box_shadow_ : '_shdw_03_',
            _top_        : '_0_',
            _left_       : '_3d75rem_',
            _right_      : '_0_',
            _height_     : '_3d75rem_',
            _background_ : '_hex_frame_',
            _transition_ : '_trans_short_'
          }
        },
        { _selector_str_  : '.' + aKey + '-_shell_head_logo_',
          _rule_map_      : {
            _position_    : '_absolute_',
            _left_        : '_d75rem_',
            _top_         : '_1d125rem_',
            _height_      : '_1d5rem_',
            _width_       : [ '11.25rem' ],
            _background_ : [[
              '_logo_url_', '_no_repeat_', '_center_','_center_'
            ]],
            _background_size_  : '_cover_'
          }
        },
        { _selector_str_  : '.' + aKey + '-_shell_head_search_',
          _rule_map_      : {
            _position_    : '_absolute_',
            _left_        : '_50p_',
            _top_         : '_d875rem_',
            _margin_left_ : [ '-7.5rem' ],
            _width_       : [ '15rem' ],
            _height_      : '_2rem_'
          }
        },
        { _selector_str_  : '.' + aKey + '-_shell_head_search_ > input',
          _rule_map_ : {
            _outline_     : '_none_',
            _width_       : '_100p_',
            _height_      : '_2rem_',
            _padding_     : [[ '_0_', '_1rem_', '_0_', '_2rem_' ]],
            _line_height_ : '_2rem_',
            _color_       : '_hex_txt_lt_',
            _background_  : '_hex_area_accent_',
            _border_      : [[ '_d0625rem_', '_solid_', '_hex_area_mid_xlt_' ]],
            _border_radius_ : '_d5rem_'
          }
        },
        { _selector_str_  : '.' + aKey + '-_shell_head_search_ > input:focus',
          _rule_map_ : { _border_color_ : '_hex_area_mid_dk_' }
        },
        { _selector_str_  : '.' + aKey + '-_shell_head_search_ .' + aKey + '-_x_mag_',
          _rule_map_ : {
            _position_    : '_absolute_',
            _top_         : '_0_',
            _left_        : '_d625rem_',
            _outline_     : '_none_',
            _height_      : '_2rem_',
            _line_height_ : '_2rem_',
            _font_size_   : '_1d125rem_',
            _color_       : '_hex_link_',
            _cursor_      : '_pointer_',
            _font_family_ : '_font_family_awesome_'
          }
        },
        { _selector_str_  : '.' + aKey + '-_shell_head_search_ .' + aKey + '-_x_mag_:hover',
          _rule_map_ : { _color_ : '_hex_link_lt_' }
        },
        { _selector_str_ : '.' + aKey + '-_shell_head_ a',
          _rule_map_     : { _color_ : '_hex_link_lt_' }
        },
        { _selector_str_ : '.' + aKey + '-_shell_head_ a:hover',
          _rule_map_     : { _color_ : '_hex_link_dk_' }
        },
        { _selector_str_ : '.' + aKey + '-_shell_umenu_',
          _rule_map_ : {
            _z_index_  : [ '30' ],
            _display_  : '_block_',
            _position_ : '_fixed_',
            _top_      : '_0_',
            _right_    : '_0_',
            _padding_  : [[ '_d25rem_', '_0_' ]],
            _color_    : '_hex_link_',
            _border_radius_ : [[ '_0_', '_0_', '_0_', '_1rem_' ]]
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_umenu_.' + aKey + '-_x_open_',
          _rule_map_     : {
            _background_ : '_hex_frame_',
            _box_shadow_ : '_shdw_04_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_umenu_>li',
          _rule_map_     : {
            _display_     : '_none_',
            _height_      : '_3rem_',
            _line_height_ : '_3rem_',
            _width_       : '_100p_',
            _padding_     : [[ '_0_', '_1rem_' ]],
            _font_size_   : '_1d125rem_',
            _color_       : '_hex_link_',
            _white_space_ : '_nowrap_',
            _text_align_  : '_right_',
            _cursor_        : '_pointer_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_umenu_.' + aKey + '-_x_open_>li',
          _rule_map_     : { _display_ : '_block_' }
        },
        { _selector_str_ : '.' + aKey + '-_shell_umenu_>li:first-child',
          _rule_map_ : {
            '_display_'     : '_block_',
            '_line_height_' : '_1d5rem_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_umenu_>li div',
          _rule_map_ : {
            _line_height_ : '_1d5rem_',
            _margin_right_ : '_2rem_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_umenu_>li:hover',
          _rule_map_ : { _color_ : '_hex_link_lt_' }
        },
        { _selector_str_ : '.' + aKey + '-_shell_umenu_>li span',
          _rule_map_ : {
            _display_      : '_block_',
            _float_        : '_right_',
            _height_       : '_3rem_',
            _line_height_  : '_3rem_',
            _width_        : '_1d5rem_',
            _margin_left_  : '_d75rem_',
            _font_family_  : '_font_family_awesome_',
            _font_size_    : '_1d5rem_',
            _text_align_   : '_center_',
            _text_decoration_ : '_none_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_tgl_',
          _rule_map_     : {
            _z_index_     : [ '20' ],
            _position_   : '_fixed_',
            _top_        : '_0_',
            _left_       : '_0_',
            _width_      : '_3d75rem_',
            _height_     : '_3d75rem_',
            _line_height_: '_3d75rem_',
            _font_family_: '_font_family_awesome_',
            _font_size_  : '_1d5rem_',
            _color_      : '_hex_link_lt_',
            _background_ : '_hex_frame_dk_',
            _text_align_ : '_center_',
            _cursor_     : '_pointer_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_tgl_:hover',
          _rule_map_ : { _color_ : '_hex_link_dk_' }
        },
        { _selector_str_ : '.' + aKey + '-_shell_nav_',
          _rule_map_ : {
            _z_index_     : [ '10' ],
            _position_   : '_fixed_',
            _box_shadow_ : '_shdw_02_',
            _top_        : '_0_',
            _left_       : '_0_',
            _bottom_     : '_0_',
            _width_      : '_3d75rem_',
            _padding_top_ : [ '4.25rem' ],
            _background_ : '_hex_frame_dk_',
            _overflow_   : '_hidden_',
            _transition_ : '_trans_short_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_nav_>li',
          _rule_map_ : {
            _white_space_   : '_nowrap_',
            _padding_left_  : '_1d125rem_',
            _height_        : '_2rem_',
            _width_         : '_100p_',
            _line_height_   : '_2rem_',
            _font_size_     : '_1d125rem_',
            _margin_bottom_ : '_d875rem_',
            _cursor_        : '_pointer_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_nav_>li a',
          _rule_map_ : { _color_ : '_hex_link_lt_' }
        },
        { _selector_str_ : '.' + aKey + '-_shell_nav_>li a:hover',
          _rule_map_ : { _color_ : '_hex_link_dk_' }
        },
        { _selector_str_ : '.' + aKey + '-_shell_nav_>li.' + aKey + '-_x_select_',
          _rule_map_ : { _background_ : '_hex_frame_xdk_' }
        },
        { _selector_str_ : '.' + aKey + '-_shell_nav_ li span',
          _rule_map_ : {
            _display_      : '_inline_block_',
            _width_        : '_1d5rem_',
            _margin_right_ : '_spc_em_02_',
            _font_family_  : '_font_family_awesome_',
            _font_size_    : '_1d5rem_',
            _text_align_   : '_center_',
            _text_decoration_ : '_none_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_cont_',
          _rule_map_ : {
            _margin_     : '_auto_',
            _padding_    : [[ '_5rem_', '_2rem_', '_3rem_', '_5d5rem_' ]],
            _max_width_  : [ '100rem' ],
            _transition_ : '_trans_short_'
          }
        },
        // Keep this padding and max_width in sync with aKey-_shell_cont_
        { _selector_str_ : '.' + aKey + '-_shell_base_',
          _rule_map_ : {
            _z_index_    : [ '35' ],
            _position_   : '_fixed_',
            _left_       : '_0_',
            _right_      : '_0_',
            _bottom_     : '_0_',
            _height_     : '_3rem_',
            _border_top_ : [[ '_d125rem_', '_solid_', '_hex_accent_dk_' ]],
            _padding_    : [[ '_0_', '_2rem_', '_0_', '_5d5rem_' ]],
            _background_ : '_hex_area_mid_dk_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_cont_head_',
          _rule_map_     : {
            _z_index_       : '_1_',
            _float_         : '_left_',
            _position_      : '_relative_',
            _margin_right_  : '_1rem_',
            _margin_bottom_ : '_1rem_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_cont_head_bread_ li',
          _rule_map_     : {
            _display_        : '_inline_block_',
            _float_          : '_left_',
            _line_height_    : '_2rem_',
            _font_size_      : '_1d25rem_',
            _color_          : '_hex_link_fade_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_cont_head_bread_ li:nth-child(even)',
          _rule_map_     : {
            _margin_top_  : '_d125rem_',
            _width_       : '_2rem_',
            _font_family_ : '_font_family_awesome_',
            _text_align_  : '_center_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_cont_head_bread_ li:last-child',
          _rule_map_     : {
            _font_size_ : '_1d75rem_',
            _color_     : '_hex_txt_',
            _cursor_    : '_default_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_cont_head_icon_',
          _rule_map_     : {
            _margin_right_   : '_d75rem_',
            _font_family_    : '_font_family_awesome_',
            _vertical_align_ : '_baseline_'
          }
        },
        { _selector_str_ : '.' + aKey + '-_box_',
          _rule_map_ : { _position_    : '_relative_' }
        },
        { _selector_str_ : '.' + aKey + '-_shell_nav_.' + aKey + '-_x_open_',
          _rule_map_ : { _width_ : [ '13rem' ] }
        },
        { _selector_str_ : '.' + aKey + '-_shell_head_.' + aKey + '-_x_open_',
          _rule_map_     : {
            _border_radius_ : [[ '_0_','_0_','_0_','_1rem_' ]]
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_cont_.' + aKey + '-_x_open_',
          _rule_map_     : { _padding_left_ : [ '15.25rem' ] }
        },
        // -- end aKey-_shell_ selectors

        // -- begin aKey-_shell_ mid-width conditional selectors
        { _begin_cond_str_ : '@media all and (max-width: 812px)' },
        { _selector_str_ : '.' + aKey + '-_shell_cont_',
          _rule_map_ : {
            _padding_    : [[ '_5rem_', '_3rem_', '_5rem_', '_2rem_' ]]
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_base_',
          _rule_map_ : {
            _padding_    : [[ '_0_', '_3rem_', '_0_', '_2rem_' ]]
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_nav_',
          _rule_map_     : { _width_ : '_0_' }
        },
        { _selector_str_ : '.' + aKey + '-_shell_tgl_',
          _rule_map_ : { _box_shadow_ : '_shdw_03_' }
        },
        { _selector_str_  : '.' + aKey + '-_shell_head_search_',
          _rule_map_      : {
            _left_        : '_auto_',
            _margin_left_ : '_0_',
            _right_       : [ '8rem' ]
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_tgl_.' + aKey + '-_x_open_',
          _rule_map_ : { _box_shadow_ : '_none_' }
        },
        { _end_cond_str_ : __blank },
        // -- end aKey-_shell_ mid-width conditional selectors

        // -- begin aKey-_shell_ narrow-width conditional selectors
        { _begin_cond_str_ : '@media all and (max-width: 600px)' },
        { _selector_str_ : '.' + aKey + '-_shell_head_',
          _rule_map_     : { _height_ : [ '6.5rem' ] }
        },
        { _selector_str_ : '.' + aKey + '-_shell_cont_',
          _rule_map_     : {
            _padding_ : [[ ['8rem'], '_1rem_', '_6rem_', '_1rem_' ]]
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_base_',
          _rule_map_ : {
            _padding_    : [[ '_0_', '_1rem_', '_0_', '_1rem_' ]]
          }
        },
        { _selector_str_ : '.' + aKey + '-_shell_nav_.' + aKey + '-_x_open_',
          _rule_map_ : { _width_ : '_100p_' }
        },
        { _selector_str_ : '.' + aKey + '-_shell_tgl_',
          _rule_map_     : {
            _height_      : [ '6.5rem' ],
            _line_height_ : '_6rem_'
          }
        },
        { _selector_str_  : '.' + aKey + '-_shell_head_search_',
          _rule_map_      : {
            _left_        : '_d75rem_',
            _top_         : '_3d5rem_',
            _margin_left_ : '_0_',
            _width_       : '_auto_',
            _right_       : '_1d5rem_'
          }
        },
        { _end_cond_str_ : __blank }
        // -- end aKey-_shell_ narrow-width conditional selectors
      ]
    };
  // == END MODULE SCOPE VARIABLES =====================================

  // == BEGIN PUBLIC METHODS ===========================================
  return { _selectorList_ : topCmap._selector_list_ };
  // == END PUBLIC METHODS =============================================
}());
// == END MODULE _makeCssShell_ ========================================
