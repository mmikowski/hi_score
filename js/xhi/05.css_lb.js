/**
 *    xhi.css_lb.js
 *    Litebox manager CSS classes using PowerCSS
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true, todo    : true, unparam  : true
*/
/*global pcss */

var __ns = 'xhi', __NS;
/* istanbul ignore next */
try          { __NS = global[ __ns ]; }
catch ( e1 ) { __NS = window[ __ns ]; }

// == BEGIN MODULE __NS._makeCssLb_ ====================================
__NS._makeCssLb_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    aKey    = aMap._aKey_,
    __util  = aMap._util_,
    __p     = __util._makeReplaceFn_( 'p', aKey ),

    topCmap =  {
      _selector_list_ : [
        { _selector_str_ : __p('.{_p_}-_lb_'),
          _rule_map_ : {
            _z_index_       : [ '36' ],
            _position_      : '_absolute_',
            _display_       : '_block_',
            _opacity_       : '_0_',
            _width_         : '_50p_',
            _border_        : [[ '_d25rem_', '_solid_','_hex_area_hover_' ]],
            _border_radius_ : '_d5rem_',
            _box_shadow_    : '_shdw_02_',
            _background_    : '_hex_area_',
            _color_         : '_hex_txt_',
            _overflow_x_    : '_hidden_',
            _overflow_y_    : '_auto_',
            _transition_    : [ 'opacity .5s ease' ]
          }
        },
        {_selector_str_ : __p('.{_p_}-_lb_.{_p_}-_x_local_'),
          _rule_map_ : { _position_ : '_absolute_' }
        },
        { _selector_str_ : __p('.{_p_}-_lb_.{_p_}-_x_active_'),
          _rule_map_ : { _opacity_    : '_1_' }
        },
        { _selector_str_ : __p('.{_p_}-_lb_mask_'),
          _rule_map_ : {
            _z_index_  : [ '35' ],
            _position_ : '_absolute_',
            _display_    : '_block_',
            _opacity_    : '_0_',
            _top_        : '_0_',
            _left_       : '_0_',
            _bottom_     : '_0_',
            _right_      : '_0_',
            _overflow_   : '_hidden_',
            _background_ : '_hex_txt_inv_',
            _cursor_   : '_pointer_',
            _transition_ : [ 'opacity .5s ease' ]
          }
        },
        { _selector_str_ : __p('.{_p_}-_lb_mask_.{_p_}-_x_local_'),
          _rule_map_     : {
            _z_index_    : '_1_',
            _transition_ : '_none_',
            _cursor_     : '_default_'
          }
        },
        { _selector_str_ : __p('.{_p_}-_lb_mask_.{_p_}-_x_noclick_'),
          _rule_map_     : { _cursor_ : [ 'wait' ] }
        },
        { _selector_str_ : __p('.{_p_}-_lb_mask_.{_p_}-_x_active_'),
          _rule_map_ : { _opacity_    : [ '.65' ] }
        },
        { _selector_str_ : __p('.{_p_}-_lb_content_'),
          _rule_map_ : {
            _position_ : '_relative_',
            _padding_    : '_1rem_',
          }
        },
        { _selector_str_ : __p('.{_p_}-_lb_content_ p'),
          _rule_map_ : { _margin_bottom_ : '_1rem_' }
        },
        { _selector_str_ : __p('.{_p_}-_lb_content_ p:last-child'),
          _rule_map_ : { _margin_bottom_ : '_0_' }
        },
        { _selector_str_ : __p('.{_p_}-_lb_close_'),
          _rule_map_ : {
            _z_index_    : '_1_',
            _position_   : '_absolute_',
            _top_        : '_0_',
            _right_      : '_0_',
            _cursor_     : '_pointer_'
          }
        },
        { _selector_str_ : __p('.{_p_}-_lb_title_'),
          _rule_map_ : {
            _position_ : '_relative_',
            _padding_    : [[ '_d25rem_', '_1rem_' ]],
            _font_size_  : '_1d5rem_',
            _background_ : '_hex_area_mid_',
            _cursor_     : '_move_'
          }
        },
        { _selector_str_ : '@keyframes spinIt {'
            + '100%{transform:rotate(360deg);}}'
        },
        { _selector_str_ : '@keyframes spinReverse {'
            + '100%{transform:rotate(-360deg);}}'
        },
        { _selector_str_ : __p('.{_p_}-_lb_spin_'),
          _rule_map_     : {
            _z_index_     : ['50'],
            _position_    : '_fixed_',
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
            _color_       : '_hex_accent_',
            _animation_   : ['spinIt 1s linear infinite']
          }
        },
        { _selector_str_ : __p('.{_p_}-_lb_spin_.{_p_}-_x_reverse_'),
          _rule_map_     : {
            _animation_ : [ 'spinReverse 1s linear infinite' ]
          }
        },
        { _selector_str_ : __p('.{_p_}-_lb_spin_.{_p_}-_x_active_'),
          _rule_map_     : { _display_ : '_block_' }
        },
        { _selector_str_ : __p('.{_p_}-_lb_spin_.{_p_}-_x_local_'),
          _rule_map_     : {
            _z_index_    : '_1_',
            _position_   : '_absolute_',
            _min_height_ : '_4rem_'
          }
        }
      ]
    };
  // == END MODULE SCOPE VARIABLES =====================================

  // == BEGIN PUBLIC METHODS ===========================================
  aMap._css_lb_ = { _selectorList_ : topCmap._selector_list_ };
  // == END PUBLIC METHODS =============================================
};
// == END MODULE __NS._makeCssLb_ ======================================

