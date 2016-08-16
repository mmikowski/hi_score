/**
 *    xhi.css_lb.js
 *    Litebox (_lb_) class for JS-driven CSS
 *    Michael S. Mikowski - mike.mikowski@gmail.com
 *
*/
/*jslint        browser : true, continue : true,
  devel : true,  indent : 2,      maxerr : 50,
  newcap : true,  nomen : true, plusplus : true,
  regexp : true, sloppy : true,     vars : false,
  white : true,    todo : true,  unparam : true
*/
/*global xhi, pcss */
xhi._css_lb_ = (function () {
  // ================= BEGIN MODULE SCOPE VARIABLES ====================
  'use strict';
  var
    topCmap =  {
      _selector_list_ : [
        {_selector_str_ : '.xhi-_lb_abs_, xhi-_lb_fixed_',
          _rule_map_ : {
            _z_index_       : [ '36' ],
            _display_       : '_block_',
            _opacity_       : '_0_',
            _border_        : [[ '_d25rem_', '_solid_','_hex_area_hover_' ]],
            _border_radius_ : '_d5rem_',
            _box_shadow_    : '_shadow_02_',
            _background_    : '_hex_area_',
            _color_         : '_hex_txt_',
            _overflow_      : '_hidden_',
            _transition_    : [ 'opacity .5s ease' ]
          }
        },
        {_selector_str_ : '.xhi-_lb_abs_',
          _rule_map_ : { _position_ : '_absolute_' }
        },
        {_selector_str_ : '.xhi-_lb_fixed_',
          _rule_map_ : { _position_ : '_fixed_' }
        },
        { _selector_str_ : '.xhi-_lb_abs_.xhi-_x_active_,'
          + 'xhi-_lb_fixed_.xhi-_x_active_',
          _rule_map_ : { _opacity_    : '_1_' }
        },
        { _selector_str_ : '.xhi-_lb_mask_abs_,.xhi-_lb_mask_fixed_',
          _rule_map_ : {
            _display_    : '_block_',
            _opacity_    : '_0_',
            _top_        : '_0_',
            _left_       : '_0_',
            _bottom_     : '_0_',
            _right_      : '_0_',
            _overflow_   : '_hidden_',
            _background_ : '_hex_frame_',
            _transition_ : [ 'opacity .5s ease' ]
          }
        },
        { _selector_str_ : '.xhi-_lb_mask_abs_',
          _rule_map_     : {
            _z_index_  : [ '24' ],
            _position_ : '_absolute_'
          }
        },
        { _selector_str_ : '.xhi-_lb_mask_fixed_',
          _rule_map_     : {
            _z_index_    : [ '35' ],
            _position_ : '_fixed_',
            _cursor_   : '_pointer_'
          }
        },
        { _selector_str_ : '.xhi-_lb_mask_abs_.xhi-_x_noclick,'
          + '.xhi-_lb_mask_fixed_.xhi-_x_noclick_',
          _rule_map_     : { _cursor_ : ['wait'] }
        },
        { _selector_str_ : '.xhi-_lb_abs_ p, .xhi-_lb_fixed_ p',
          _rule_map_ : {
            '_margin_'  : '_0_',
            '_padding_' : '_d5rem_'
          }
        },
        { _selector_str_ : '.xhi-_lb_mask_abs_.xhi-_x_active_,'
            + '.xhi-_lb_mask_fixed_.xhi-_x_active_',
          _rule_map_ : { _opacity_    : [ '.75' ] }
        },
        { _selector_str_ : '.xhi-_lb_content_',
          _rule_map_ : { _position_ : '_relative_' }
        },
        { _selector_str_ : '.xhi-_lb_close_',
          _rule_map_ : {
            _z_index_    : '_1_',
            _position_   : '_absolute_',
            _top_        : '_d5rem_',
            _right_      : '_d625rem_',
            _width_      : '_1d125rem_',
            _height_     : '_1d125rem_',
            _font_family_: '_font_family_awesome_',
            _cursor_     : '_pointer_'
          }
        },
        { _selector_str_ : '@keyframes spinIt {'
        + '100%{transform:rotate(360deg);}}'
        },
        { _selector_str_ : '@keyframes spinReverse {'
        + '100%{transform:rotate(-360deg);}}'
        },
        { _selector_str_ : '.xhi-_lb_spin_abs_,xhi-_lb_spin_fixed_',
          _rule_map_     : {
            _display_     : '_none_',
            _top_         : '_50p_',
            _left_        : '_50p_',
            _margin_top_  : ['-2rem'],
            _margin_left_ : ['-2rem'],
            _height_      : '_4rem_',
            _line_height_ : '_4rem_',
            _font_size_   : '_4rem_',
            _width_       : '_4rem_',
            _text_align_  : '_center_',
            _font_family_ : '_font_family_awesome_',
            _color_       : '_hex_area_accent_',
            _animation_   : ['spinIt 1s linear infinite']
          }
        },
        { _selector_str_ : '.xhi-_lb_spin_abs_.xhi-_x_reverse_,'
          + 'xhi-_lb_spin_fixed_.xhi-_x_reverse_',
          _rule_map_     : {
            _animation_ : [ 'spinReverse 1s linear infinite' ]
          }
        },
        { _selector_str_ : '.xhi-_lb_spin_abs_.xhi-_x_active_,'
            + '.xhi-_lb_spin_fixed_.xhi-_x_active_',
          _rule_map_     : { _display_ : '_block_' }
        },
        { _selector_str_ : '.xhi-_lb_spin_abs_',
          _rule_map_     : {
            _z_index_  : ['25'],
            _position_ : '_absolute_',
            _min_height_ : '_4rem_'
        }
        },
        { _selector_str_ : '.xhi-_lb_spin_fixed_',
          _rule_map_     : {
            _z_index_  : ['50'],
            _position_ : '_fixed_'
          }
        }
      ]
    }
    ;
  // ================== END MODULE SCOPE VARIABLES =====================
  return { _selectorList_ : topCmap._selector_list_ };
}());
