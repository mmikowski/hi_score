/* PowerCSS config - pcss.cfg.js
 * Stock configurations for run-time generated and managed CSS
 * Michael S. Mikowski - mike.mikowski@gmail.com
 * See README.md for further documentation.
*/
/*jslint        browser : true, continue : true,
  devel : true,  indent : 2,      maxerr : 50,
  newcap : true,  nomen : true, plusplus : true,
  regexp : true, sloppy : true,     vars : false,
  white : true,    todo : true,  unparam : true
*/
/*global pcss */

pcss._cfg_ = (function () {
  'use strict';
  var
    cssKeyMap = {
      __moz_appearance_            : '-moz-appearance',
      __ms_appearance_             : '-ms-appearance',
      __webkit_appearance_         : '-webkit-appearance',
      __moz_box_sizing_            : '-moz-box-sizing',
      __webkit_font_smoothing_     : '-webkit-font-smoothing',
      __webkit_overflow_scrolling_ : '-webkit-overflow-scrolling',
      __webkit_user_select_        : '-webkit-user-select',
      __moz_user_select_           : '-moz-user-select',
      __o_user_select_             : '-o-user-select',
      _user_select_                : 'user-select',

      _animation_              : 'animation',
      _background_             : 'background',
      _background_color_       : 'background-color',
      _background_image_       : 'background-image',
      _background_position_    : 'background-position',
      _background_repeat_      : 'background-repeat',
      _background_size_        : 'background-size',
      _body_                   : 'body',
      _border_                 : 'border',
      _border_bottom_          : 'border-bottom',
      _border_bottom_color_    : 'border-bottom-color',
      _border_bottom_width_    : 'border-bottom-width',
      _border_collapse_        : 'border-collapse',
      _border_color_           : 'border-color',
      _border_left_            : 'border-left',
      _border_left_color_      : 'border-left-color',
      _border_left_width_      : 'border-left-width',
      _border_radius_          : 'border-radius',
      _border_right_           : 'border-right',
      _border_right_color_     : 'border-right-color',
      _border_right_width_     : 'border-right-width',
      _border_spacing_         : 'border-spacing',
      _border_style_           : 'border-style',
      _border_top_             : 'border-top',
      _border_top_color_       : 'border-top-color',
      _border_top_left_radius_ : 'border-top-left-radius',
      _border_top_width_       : 'border-top-width',
      _border_width_           : 'border-width',
      _bottom_                 : 'bottom',
      _box_shadow_             : 'box-shadow',
      _box_sizing_             : 'box-sizing',
      _clear_                  : 'clear',
      _clip_                   : 'clip',
      _color_                  : 'color',
      _content_                : 'content',
      _cursor_                 : 'cursor',
      _display_                : 'display',
      _empty_cells_            : 'empty_cells',
      _fill_                   : 'fill',
      _float_                  : 'float',
      _font_family_            : 'font-family',
      _font_size_              : 'font-size',
      _font_style_             : 'font-style',
      _font_weight_            : 'font-weight',
      _height_                 : 'height',
      _left_                   : 'left',
      _line_height_            : 'line-height',
      _list_style_position_    : 'list-style-position',
      _list_style_type_        : 'list-style-type',
      _margin_                 : 'margin',
      _margin_bottom_          : 'margin-bottom',
      _margin_left_            : 'margin-left',
      _margin_right_           : 'margin-right',
      _margin_top_             : 'margin-top',
      _max_height_             : 'max-height',
      _max_width_              : 'max-width',
      _min_height_             : 'min-height',
      _min_width_              : 'min-width',
      _opacity_                : 'opacity',
      _outline_                : 'outline',
      _overflow_               : 'overflow',
      _overflow_x_             : 'overflow-x',
      _overflow_y_             : 'overflow-y',
      _padding_                : 'padding',
      _padding_bottom_         : 'padding-bottom',
      _padding_left_           : 'padding-left',
      _padding_right_          : 'padding-right',
      _padding_top_            : 'padding-top',
      _position_               : 'position',
      _resize_                 : 'resize',
      _right_                  : 'right',
      _rx_                     : 'rx',
      _ry_                     : 'ry',
      _src_                    : 'src',
      _stroke_                 : 'stroke',
      _stroke_opacity_         : 'stroke-opacity',
      _stroke_width_           : 'stroke-width',
      _text_align_             : 'text-align',
      _text_decoration_        : 'text-decoration',
      _text_indent_            : 'text-indent',
      _text_overflow_          : 'text-overflow',
      _text_shadow_            : 'text-shadow',
      _top_                    : 'top',
      _transition_             : 'transition',
      _vertical_align_         : 'vertical-align',
      _visibility_             : 'visibility',
      _white_space_            : 'white-space',
      _width_                  : 'width',
      _word_break_             : 'word-break',
      _z_index_                : 'z-index'
    },

    // Common CSS values
    cssValMap = {
      _d0_  : '.0',
      _d1_  : '.1',
      _d2_  : '.2',
      _d3_  : '.3',
      _d4_  : '.4',
      _d5_  : '.5',
      _d6_  : '.6',
      _d7_  : '.7',
      _d8_  : '.8',
      _d9_  : '.9',
      _0_   : '0',
      _1_   : '1',
      _2_   : '2',
      _3_   : '3',
      _4_   : '4',
      _5_   : '5',
      _6_   : '6',
      _7_   : '7',
      _8_   : '8',
      _9_   : '9',

      _0p_            : '0%',
      _12d5p_         : '12.5%',
      _25p_           : '25%',
      _36d5p_         : '37.5%',
      _50p_           : '50%',
      _62d5p_         : '62.5%',
      _75p_           : '75%',
      _87d5p_         : '87.5%',
      _100p_          : '100%',

      // 1px increments for 16px nominal font-size
      // VIM tip: I used visual-select and tac reverse order
      // to create negative values:
      // :'<'>!tac

      _n2rem_         : '-2rem',
      _n1rem_         : '-1rem',
      _nd9375rem_     : '-.9375rem', // 15px
      _nd875rem_      : '-.875rem',  // 14px
      _nd8125rem_     : '-.8125rem', // 13px
      _nd75rem_       : '-.75rem',   // 12px
      _nd6875rem_     : '-.6875rem', // 11px
      _nd625rem_      : '-.625rem',  // 10px
      _nd5625rem_     : '-.5625rem', // 09px
      _nd5rem_        : '-.5rem',    // 08px
      _nd4375rem_     : '-.4375rem', // 07px
      _nd375rem_      : '-.375rem',  // 06px
      _nd3125rem_     : '-.3125rem', // 05px
      _nd25rem_       : '-.25rem',   // 04px
      _nd1875rem_     : '-.1875rem', // 03px
      _nd125rem_      : '-.125rem',  // 02px
      _nd0625rem_     : '-.0625rem', // 01px
      _d0625rem_      : '.0625rem',  // 01px
      _d125rem_       : '.125rem',   // 02px
      _d1875rem_      : '.1875rem',  // 03px
      _d25rem_        : '.25rem',    // 04px
      _d3125rem_      : '.3125rem',  // 05px
      _d375rem_       : '.375rem',   // 06px
      _d4375rem_      : '.4375rem',  // 07px
      _d5rem_         : '.5rem',     // 08px
      _d5625rem_      : '.5625rem',  // 09px
      _d625rem_       : '.625rem',   // 10px
      _d6875rem_      : '.6875rem',  // 11px
      _d75rem_        : '.75rem',    // 12px
      _d8125rem_      : '.8125rem',  // 13px
      _d875rem_       : '.875rem',   // 14px
      _d9375rem_      : '.9375rem',  // 15px
      _1rem_          : '1rem',      // 16px

      // 2px increments for 16px nominal font size
      _1d125rem_      : '1.125rem',
      _1d25rem_       : '1.25rem',
      _1d375rem_      : '1.375rem',
      _1d5rem_        : '1.5rem',
      _1d625rem_      : '1.625rem',
      _1d75rem_       : '1.75rem',
      _1d875rem_      : '1.875rem',

      // 4px increments for 16px nominal font-size
      _2rem_          : '2rem',
      _2d25rem_       : '2.25rem',
      _2d5rem_        : '2.5rem',
      _2d75rem_       : '2.75rem',

      // 8px increments for 16px nominal font-size
      _3rem_          : '3rem',
      _3d5rem_        : '3.5rem',
      _3d75rem_       : '3.75rem',
      _4rem_          : '4rem',
      _4d5rem_        : '4.5rem',
      _5rem_          : '5rem',
      _5d5rem_        : '5.5rem',
      _6rem_          : '6rem',
      _10rem_         : '10rem',

      _200_           : '200',
      _400_           : '400',
      _800_           : '800',
      _x444_          : '#444',
      _x888_          : '#888',
      _xaaa_          : '#aaa',
      _xbbb_          : '#bbb',
      _xccc_          : '#ccc',
      _xddd_          : '#ddd',
      _xeee_          : '#eee',
      _xfff_          : '#fff',
      _absolute_      : 'absolute',
      _antialiased_   : 'antialiased',
      _auto_          : 'auto',
      _baseline_      : 'baseline',
      _block_         : 'block',
      _border_box_    : 'border-box',
      _both_          : 'both',
      _bottom_        : 'bottom',
      _break_word_    : 'break-word',
      _center_        : 'center',
      _circle_        : 'circle',
      _clip_          : 'clip',
      _collapse_      : 'collapse',
      _col_resize_    : 'col-resize',
      _contain_       : 'contain',
      _content_box_   : 'content-box',
      _cover_         : 'cover',
      _decimal_       : 'decimal',
      _default_       : 'default',
      _disc_          : 'disc',
      _ellipsis_      : 'ellipsis',
      _fixed_         : 'fixed',
      _font_fixed_    : 'courier new,courier,fixed,monospace',
      _font_sans_     : 'opensans,arial,helvetica,sans-serif',
      _hidden_        : 'hidden',
      _important_     : '!important',
      _inherit_       : 'inherit',
      _inline_        : 'inline',
      _inline_block_  : 'inline-block',
      _italic_        : 'italic',
      _left_          : 'left',
      _line_through_  : 'line-through',
      _middle_        : 'middle',
      _move_          : 'move',
      _no_repeat_     : 'no-repeat',
      _none_          : 'none',
      _normal_        : 'normal',
      _nowrap_        : 'nowrap',
      _outside_       : 'outside',
      _pointer_       : 'pointer',
      _relative_      : 'relative',
      _right_         : 'right',
      _scroll_        : 'scroll',
      _show_          : 'show',
      _solid_         : 'solid',
      _text_          : 'text',
      _top_           : 'top',
      _touch_         : 'touch',
      _transparent_   : 'transparent',
      _underline_     : 'underline',
      _uppercase_     : 'uppercase',
      _vertical_      : 'vertical',
      _visible_       : 'visible'
    }
    ;

  return {
    _cssKeyMap_ : cssKeyMap,
    _cssValMap_ : cssValMap
  };
}());

