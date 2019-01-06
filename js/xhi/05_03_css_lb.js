/*
 * 05_03_css_lb.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._05_03_css_lb_._makeInstanceFn_( app_map, option_map );
 * Synopsis : Add _05_03_css_lb_ capabilities to app_map
 * Provides : PowerCSS structure CSS data
 * Requires : aMap (app map) with symbols from 00_root._makeInstanceFn_()
 *
*/
/*global xhi */
// == BEGIN MODULE xhi._makeCssLbFn_ ===================================
xhi._05_03_css_lb_ = (function () {
  'use strict';
  // == BEGIN public method /makeInstanceFn/ ==========================
  function makeInstanceFn ( aMap, argOptionMap ) {
    // == BEGIN MODULE SCOPE VARIABLES ================================
    var
      subName   = '_05_03_css_lb_',
      aKey      = aMap._aKey_,
      vMap      = aMap._vMap_,

      __true    = vMap._true_,

      __util    = aMap._01_util_,
      __p       = __util._makeReplaceFn_( '_p_', aKey ),

      configMap = {
        _selector_list_ : [
          { _selector_str_ : __p( '.{_p_}-_lb_' ),
            _rule_map_     : {
              _z_index_       : [ '36' ],
              _position_      : '_fixed_',
              _display_       : '_block_',
              _opacity_       : '_0_',
              _border_        : [ [ '_d25rem_', '_solid_',
                '_area_hover_hex_' ] ],
              _border_radius_ : '_radius_07_',
              _box_shadow_    : '_shdw_09_',
              _background_    : '_area_hex_',
              _color_         : '_txt_hex_',
              _overflow_x_    : '_hidden_',
              _overflow_y_    : '_auto_',
              _transition_    : [ 'opacity .5s ease' ]
            }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_.{_p_}-_x_local_' ),
            _rule_map_     : { _position_ : '_absolute_' }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_.{_p_}-_x_active_' ),
            _rule_map_     : { _opacity_ : '_1_' }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_mask_' ),
            _rule_map_     : {
              _z_index_    : [ '35' ],
              _position_   : '_fixed_',
              _display_    : '_block_',
              _opacity_    : '_0_',
              _top_        : '_0_',
              _left_       : '_0_',
              _bottom_     : '_0_',
              _right_      : '_0_',
              _overflow_   : '_hidden_',
              _background_ : '_txt_hex_',
              _cursor_     : '_pointer_',
              _transition_ : [ 'opacity .5s ease' ]
            }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_mask_.{_p_}-_x_local_' ),
            _rule_map_     : {
              _position_   : '_absolute_',
              _z_index_    : '_1_',
              _transition_ : '_none_',
              _cursor_     : '_default_'
            }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_mask_.{_p_}-_x_noclick_' ),
            _rule_map_     : { _cursor_ : [ 'wait' ] }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_mask_.{_p_}-_x_active_' ),
            _rule_map_     : { _opacity_ : [ '.65' ] }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_content_' ),
            _rule_map_     : {
              _position_ : '_relative_',
              _padding_  : [[ '_1rem_', '_1d5rem_' ]]
            }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_content_ p' ),
            _rule_map_     : { _margin_bottom_ : '_1rem_' }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_content_ p:last-child' ),
            _rule_map_     : { _margin_bottom_ : '_0_' }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_close_' ),
            _rule_map_     : {
              _z_index_  : '_1_',
              _position_ : '_absolute_',
              _top_      : '_0_',
              _right_    : '_0_',
              _cursor_   : '_pointer_'
            }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_title_' ),
            _rule_map_     : {
              _position_   : '_relative_',
              _padding_    : [ [ '_d25rem_', '_d75rem_' ] ],
              _font_size_  : '_spc_rem_03_',
              _background_ : '_area_lt_hex_',
              _cursor_     : '_move_',
              _white_space_ : '_nowrap_'
            }
          },
          { _selector_str_ : '@keyframes spinIt {'
            + '100%{transform:rotate(360deg);}}'
          },
          { _selector_str_ : '@keyframes spinReverse {'
            + '100%{transform:rotate(-360deg);}}'
          },
          { _selector_str_ : __p( '.{_p_}-_lb_spin_' ),
            _rule_map_     : {
              _z_index_     : [ '50' ],
              _position_    : '_fixed_',
              _display_     : '_none_',
              _top_         : '_50p_',
              _left_        : '_50p_',
              _margin_top_  : [ '-2rem' ],
              _margin_left_ : [ '-2rem' ],
              _height_      : '_4rem_',
              _line_height_ : '_4rem_',
              _font_size_   : '_4rem_',
              _width_       : '_4rem_',
              _text_align_  : '_center_',
              _font_family_ : '_font_family_awesome_',
              _color_       : '_accent_hex_',
              _animation_   : [ 'spinIt 1s linear infinite' ]
            }
          },

          { _selector_str_ : __p( '.{_p_}-_x_local_ .{_p_}-_lb_spin_' ),
            _rule_map_     : {
              _z_index_    : '_1_',
              _position_   : '_absolute_',
              _min_height_ : '_4rem_'
            }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_spin_.{_p_}-_x_reverse_' ),
            _rule_map_     : {
              _animation_ : [ 'spinReverse 1s linear infinite' ]
            }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_spin_.{_p_}-_x_active_' ),
            _rule_map_     : { _display_ : '_block_' }
          },
          { _selector_str_ : __p( '.{_p_}-_lb_spin_.{_p_}-_x_local_' ),
            _rule_map_     : {
              _z_index_    : '_1_',
              _position_   : '_absolute_',
              _min_height_ : '_4rem_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_lb_'),
            _rule_map_ : { _max_width_ : '_50p_' }
          },
          // BEGIN conditional selectors where w -lt 960px
          { _begin_cond_str_ : '@media all and (max-width: 960px)' },
            { _selector_str_ : __p('.{_p_}-_x_lb_'),
              _rule_map_ : { _max_width_ : [ '720px' ] }
            },
          { _end_cond_str_ : '' },
          // . END conditional selectors where w -lt 960px

          // BEGIN conditional selectors where w -lt 750px
          { _begin_cond_str_ : '@media all and (max-width: 750px)' },
            { _selector_str_ : __p('.{_p_}-_x_lb_'),
              _rule_map_ : { _width_ : [ '90%' ] }
            },
          { _end_cond_str_ : '' }
          // . END conditional selectors where w -lt 750px
        ]
      },

      instanceMap, optionMap
      ;
    // == . END MODULE SCOPE VARIABLES ================================

    // == BEGIN PUBLIC METHODS ========================================
    instanceMap = { _selectorList_ : configMap._selector_list_ };

    optionMap = __util._castMap_( argOptionMap, {} );
    if ( optionMap._dont_autoadd_ !== __true ) {
      aMap[ subName ] = instanceMap;
    }

    return instanceMap;
    // == . END PUBLIC METHODS ========================================
  }
  // == . END public method /makeInstanceFn/ ==========================
  return { _makeInstanceFn_ : makeInstanceFn };
}());
// == . END MODULE xhi._05_03_css_lb_ =================================

