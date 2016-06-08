/*
 * xhi.css_lb.js
 * Litebox (_lb_) class for JS-driven CSS
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint        browser : true, continue : true,
  devel : true,  indent : 2,      maxerr : 50,
  newcap : true,  nomen : true, plusplus : true,
  regexp : true, sloppy : true,     vars : false,
  white : true,    todo : true,  unparam : true
*/
/*global jQuery, xhi, pcss */
xhi._css_lb_ = (function () {
  // ================= BEGIN MODULE SCOPE VARIABLES ====================
  'use strict';
  var
    topCmap =  {
      _selector_list_ : [
        {_selector_str_ : '.xhi-_lb_',
          _rule_map_ : {
            _z_index_       : [ '36' ],
            _display_       : '_block_',
            _opacity_       : '_0_',
            _position_      : '_absolute_',
            _border_        : [[ '_d25rem_', '_solid_','_hex_area_hover_' ]],
            _border_radius_ : '_d5rem_',
            _box_shadow_    : '_shadow_02_',
            _background_    : '_hex_area_',
            _overflow_      : '_hidden_',
            _transition_    : [ 'opacity .5s ease' ]
          }
        },
        { _selector_str_ : '.xhi-_lb_.xhi-_x_active_',
          _rule_map_ : { _opacity_    : '_1_' }
        },
        { _selector_str_ : '.xhi-_lb_mask_',
          _rule_map_ : {
            _z_index_    : [ '35' ],
            _display_    : '_block_',
            _opacity_    : '_0_',
            _position_   : '_fixed_',
            _top_        : '_0_',
            _left_       : '_0_',
            _bottom_     : '_0_',
            _right_      : '_0_',
            _overflow_   : '_hidden_',
            _background_ : [ '#888' ],
            _cursor_     : '_pointer_',
            _transition_ : [ 'opacity .5s ease' ]
          }
        },
        { _selector_str_ : '.xhi-_lb_mask_.xhi-_x_active_',
          _rule_map_ : { _opacity_    : [ '.625' ] }
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
        }
      ]
    }
    ;
  // ================== END MODULE SCOPE VARIABLES =====================
  return { _selectorList_ : topCmap._selector_list_ };
}());
