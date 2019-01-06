/*
 * 05_02_css_base.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._05_02_css_base_._makeInstanceFn_( app_map, option_map );
 * Synopsis : Add _05_02_css_base_ capabilities to app_map
 * Provides : PowerCSS structure CSS data
 * Requires : xhi._01_util_ instance in app_map
 *
*/
/*global xhi */
// == BEGIN MODULE xhi._05_02_css_base_ ===============================
xhi._05_02_css_base_ = (function () {
  'use strict';
  // == BEGIN public method /makeInstanceFn/ ==========================
  function makeInstanceFn ( aMap, argOptionMap ) {
    // == BEGIN MODULE SCOPE VARIABLES ================================
    //noinspection MagicNumberJS
    var
      subName = '_05_02_css_base_',
      aKey    = aMap._aKey_,
      vMap    = aMap._vMap_,

      __true  = vMap._true_,

      __util  = aMap._01_util_,
      __p     = __util._makeReplaceFn_( '_p_', aKey ),
      nowMs   = __util._getNowMs_(),
      configMap = {
        _global_mixin_map_ : {
          _spc_rem_00_ : '.375rem',  // 06px intra-group
          _spc_rem_01_ : '.75rem',   // 12px icon-to-label
          _spc_rem_02_ : '1.125rem', // 18px item indent, word space
          _spc_rem_03_ : '1.5rem',   // 24px per item, sentence space
          _spc_rem_04_ : '1.875rem', // 30px Between groups
          _spc_rem_04a_: '2rem',     // 32px Test
          _spc_rem_05_ : '2.25rem',  // 36px Box padding
          _spc_rem_06_ : '2.625rem', // 42px Section space

          // Shadows colors are listed from near to far. Near shadows that
          // like shdw_00, for example, will be smaller but more distinct.
          _shdw_00_ : [['_rgba_shdw_00_', [ '0 0 0.125rem 0 ']]],
          _shdw_01_ : [['_rgba_shdw_01_', ['0 0 .1875rem 0']]],
          _shdw_02_ : [['_rgba_shdw_02_', ['0 0 .1875rem .0625rem']]],
          _shdw_03_ : [['_rgba_shdw_03_', ['0 0 .25rem .0625rem']]],
          _shdw_03a_: [['_rgba_shdw_03_', ['0 .125rem .375rem 0' ]]],
          _shdw_04_ : [['_rgba_shdw_04_', ['0 0 .3125rem .125rem']]],
          _shdw_05_ : [['_rgba_shdw_05_', ['0 0 .375rem .125rem']]],
          _shdw_06_ : [['_rgba_shdw_06_', ['0 0 .5rem .1875rem']]],
          _shdw_07_ : [['_rgba_shdw_07_', ['0 0 .625rem .25rem']]],
          _shdw_08_ : [['_rgba_shdw_08_', ['0 0 .75rem .375rem']]],
          _shdw_09_ : [['_rgba_shdw_09_', ['0 0 1rem .5rem']]],

          _font_family_awesome_ : 'fontawesome,sans-serif',
          _font_family_mono_    : 'courier,fixed,monospace',
          _font_family_roboto_  : 'roboto,opensans,sans-serif',
          _font_family_sans_    : 'opensans,sans-serif',
          _font_size_           : '16px',

          _trans_short_         : 'all .2s ease',
          _trans_mid_           : 'all .4s ease',
          _trans_long_          : 'all .5s ease',

          // Default radius; override these to make sharper or rounder
          _radius_00_  : '.0625rem',
          _radius_01_  : '.125rem',
          _radius_02_  : '.1875rem',
          _radius_03_  : '.25rem',
          _radius_04_  : '.3125rem',
          _radius_05_  : '.375rem',
          _radius_06_  : '.4375rem',
          _radius_07_  : '.5em',
          _radius_08_  : '.5625rem',
          _radius_09_  : '.625rem',
          _radius_10_  : '.6875rem',
          _radius_11_  : '.75rem',
          _radius_12_  : '.8125rem',
          _radius_13_  : '.875rem',
          _radius_14_  : '.9375rem',
          _radius_15_  : '1rem'
        },
        // -- area_hex remap
        // area_mid_hex     => area_01_hex => area_lt_hex
        // area_mid_xlt_hex => area_02_hex => area_mid_hex
        // area_mid_lt_hex  => area_03_hex => area_dk_hex
        // area_mid_dk_hex  => area_04_hex => area_xdk_hex

        _palette_map_list_ : [
          { _palette_name_  : 'attitude',
            // Accent colors complement primary hue but a distinctly different.
            // Use to draw attention to features.
            _accent_hex_        : '#29363d',  // gradtop_hex === frame_hex
            _accent_dk_hex_     : '#212b31',  // gradbtm_hex === frame_dk_hex
            _accent_lt_hex_     : '#33444c',  //                 frame_lt_hex

            // Area colors are intended to fill large swaths of area.
            // Generally they are less intense than comparable text colors.
            _area_hex_          : '#e4e5e6', // bkgd_hex
            _area_xlt_hex_      : '#f0f3f5', //   lighter
            _area_accent_hex_   : '#e6e5e4', //   alternate
            _area_focus_hex_    : '#ffffdd', //   focus
            _area_hover_hex_    : '#ffffff', //  bright_hex   full hover bright
            _area_lt_hex_       : '#ccd5dc',
            _area_mid_hex_      : '#cccccc',
            _area_dk_hex_       : '#aab3bb',
            _area_xdk_hex_      : '#666e76',

            _area_info_hex_     : '#282',
            _area_warn_hex_     : '#882',
            _area_alert_hex_    : '#822',

            _btn_area_hex_      : '#1e7ba8', // === _link_hex_
            _btn_area_hover_hex_: '#175d80', // === _link_dk_hex_
            _btn_txt_hex_       : '#e8eff8', // === _area_hex_
            _btn_txt_hover_hex_ : '#ffffff', // === _area_hover_hex_

            // Frame colors are used by the outside frame (header, footer,
            // sidebar) as background colors.
            _frame_hex_         : '#29363d', // gradtop_hex header + footer
            _frame_dk_hex_      : '#212b31', // gradbtm_hex lh menu
            _frame_lt_hex_      : '#33444c', // *calc header + footer hover
            _frame_xdk_hex_     : '#11161a', // *calc lh menu selected
            _frame_xlt_hex_     : '#415f6e',

            // Colored icons
            _icon_hex_          : '#808080',
            _icon_hover_hex_    : '#ca3a42',

            // Link colors should be only used on elements which users tap,
            // click, drag, or otherwise interact.
            _link_hex_         : '#1e7ba8', //
            _link_dk_hex_      : '#175d80', //
            _link_fade_hex_    : '#73a5bd', // desaturated link_xlt
            _link_lt_hex_      : '#1e7ba8', //
            _link_xlt_hex_     : '#228abd', //
            _link_xdk_hex_     : '#134e6b', //

            // The placeholder color is a subdued text color shown in input
            // fields when there is no content.
            _placeholder_hex_   : '#9199a1', // === _area_lt_hex_
            // Text colors are generally more saturated and are darker
            // (lighter in inverse scheme) than correlating area colors.
            //
            _txt_hex_           : '#313941', // document font
            _txt_alt_hex_       : '#ca3a42', // color invert of link_hex
            _txt_dk_hex_        : '#20282f', // dark document font
            _txt_lt_hex_        : '#40484f', // light document font
            _txt_xlt_hex_       : '#80888f', // extra light font
            _txt_inv_hex_       : '#e8eff8', // === _area_hex_
            _txt_inv_dk_hex_    : '#dde5ec', // === _area_lt_hex_
            _txt_inv_lt_hex_    : '#ffffff', // === _area_hover_hex_

            // The top-left logo image path.
            _logo_url_           : __p('url(img/{_p_}-logo-white.png)')
              + '?' + nowMs,

            // Shadows colors are listed from near to far. Near shadows that
            // use rgba_shdw_00, for example, will be smaller but more
            // distinct.
            _rgba_shdw_00_     : 'rgba(0,0,50,.500)',
            _rgba_shdw_01_     : 'rgba(0,0,50,.450)',
            _rgba_shdw_02_     : 'rgba(0,0,50,.405)',
            _rgba_shdw_03_     : 'rgba(0,0,50,.365)',
            _rgba_shdw_04_     : 'rgba(0,0,50,.328)',
            _rgba_shdw_05_     : 'rgba(0,0,50,.295)',
            _rgba_shdw_06_     : 'rgba(0,0,50,.266)',
            _rgba_shdw_07_     : 'rgba(0,0,50,.239)',
            _rgba_shdw_08_     : 'rgba(0,0,50,.215)',
            _rgba_shdw_09_     : 'rgba(0,0,50,.194)',

            _txt_shdw_01_      : '0 1px 1px #000000',
            _txt_shdw_01_inv_  : '0 1px 1px #7fb5ed'
          },
          { _palette_name_  : 'Newspaper',
            // Accent colors complement primary hue but a distinctly different.
            // Use to draw attention to features.
            _accent_hex_        : '#046273',  // gradtop_hex
            _accent_dk_hex_     : '#527582',  // gradbtm_hex
            _accent_lt_hex_     : '#06788c',  // * new lighter color

            // Area colors are intended to fill large swaths of area.
            // Generally they are less intense than comparable text colors.
            _area_hex_          : '#ececec', //  bkgd_hex     default bkgd
            _area_accent_hex_   : '#d5d5f8', // *bkgd_ac_hex  textbox bkgd
            _area_hover_hex_    : '#ffffff', //  bright_hex   full hover bright
            _area_lt_hex_       : '#dddddd', // *bkgd_mid_hex
            _area_dk_hex_       : '#aaaabb', // *bkgd_mid_lt_hex
            _area_mid_hex_      : '#ccccdd', // *bkgd_mid_xlt_hex
            _area_xdk_hex_      : '#666666', //  bkgd_dk_hex

            _area_info_hex_     : '#282',
            _area_warn_hex_     : '#882',
            _area_alert_hex_    : '#822',

            // Standard button colors.
            _btn_area_hex_      : '#046273', // === _link_hex_
            _btn_area_hover_hex_: '#02353e', // === _link_dk_hex_
            _btn_txt_hex_       : '#ececec', // === _area_hex_
            _btn_txt_hover_hex_ : '#ffffff', // === _area_hover_hex_

            // Frame colors are used by the outside frame (header, footer,
            // sidebar) as background colors.
            _frame_hex_         : '#046273', // gradtop_hex header + footer
            _frame_dk_hex_      : '#02353e', // gradbtm_hex lh menu
            _frame_lt_hex_      : '#49868f', // *calc header + footer hover
            _frame_xdk_hex_     : '#022a31', // *calc lh menu selected

            // Colored icons
            _icon_hex_           : '#505d6e',
            _icon_hover_hex_     : '#808d9e',

            // Link colors should be only used on elements which users tap,
            // click, drag, or otherwise interact.
            _link_hex_          : '#046273', // link_hex link on both lt and dk bkg
            _link_lt_hex_       : '#056882', // *calc hover on dk bkg
            _link_xlt_hex_      : '#068487', // *calc hover on dk bkg
            _link_fade_hex_     : '#128487', // *calc faded link on color
            _link_dk_hex_       : '#035a6a', // *calc hover on lt bkg

            // The placeholder color is a subdued text color shown in input
            // fields when there is no content.
            _placeholder_hex_   : '#999999', // === _area_lt_hex_
            // Text colors are generally more saturated and are darker
            // (lighter in inverse scheme) than correlating area colors.
            //
            _txt_hex_           : '#373737', // document font
            _txt_alt_hex_       : '#736204', // color invert of link_hex
            _txt_dk_hex_        : '#262626',
            _txt_lt_hex_        : '#484848',
            _txt_xlt_hex_       : '#888888',
            _txt_inv_hex_       : '#ececec',
            _txt_inv_dk_hex_    : '#dddddd',
            _txt_inv_lt_hex_    : '#ffffff',

            // The top-left logo image path.
            _logo_url_           : __p('url(img/{_p_}-logo-white.png)')
              + '?' + nowMs,

            // Shadows colors are listed from near to far. Near shadows that
            // use rgba_shdw_00, for example, will be smaller but more
            // distinct.
            _rgba_shdw_00_     : 'rgba(71,71,71,.500)',
            _rgba_shdw_01_     : 'rgba(71,71,71,.450)',
            _rgba_shdw_02_     : 'rgba(71,71,71,.405)',
            _rgba_shdw_03_     : 'rgba(71,71,71,.365)',
            _rgba_shdw_04_     : 'rgba(71,71,71,.328)',
            _rgba_shdw_05_     : 'rgba(71,71,71,.295)',
            _rgba_shdw_06_     : 'rgba(71,71,71,.266)',
            _rgba_shdw_07_     : 'rgba(71,71,71,.239)',
            _rgba_shdw_08_     : 'rgba(71,71,71,.215)',
            _rgba_shdw_09_     : 'rgba(71,71,71,.194)',
            _txt_shdw_01_      : '0 1px 1px #000000',
            _txt_shdw_01_inv_  : '0 1px 1px #7fb5ed'
          },
          { _palette_name_      : 'BackInBlack',
            // Accent colors complement primary hue but a distinctly different.
            // Use to draw attention to features.
            _accent_hex_        : '#4e7585',
            _accent_dk_hex_     : '#527582',
            _accent_lt_hex_     : '#385966',

            // Area colors are intended to fill large swaths of area.
            // Generally they are less intense than comparable text colors.
            _area_hex_          : '#16181a', // default background
            _area_accent_hex_   : '#22282a', // box background
            _area_hover_hex_    : '#000000', // full-bright
            _area_lt_hex_       : '#5d676f',
            _area_dk_hex_       : '#474e54',
            _area_mid_hex_      : '#393f44',
            _area_xdk_hex_      : '#657685',

            _area_info_hex_     : '#282',
            _area_warn_hex_     : '#882',
            _area_alert_hex_    : '#822',

            // Standard button colors.
            _btn_area_hex_      : '#6cafff', // === _link_hex_
            _btn_area_hover_hex_: '#89c3ff', // === _link_dk_hex_
            _btn_txt_hex_       : '#16181a', // === _area_hex_
            _btn_txt_hover_hex_ : '#000000', // === _area_hover_hex_

            // Frame colors are used by the outside frame (header, footer,
            // sidebar) as background colors.
            _frame_hex_         : '#acb9c3', // header + footer
            _frame_dk_hex_      : '#cdccd4', // lh menu
            _frame_lt_hex_      : '#94a5b2', // header + footer hover
            _frame_xdk_hex_     : '#d8e8f5', // lh menu selected

            // Colored icons
            _icon_hex_           : '#505d6e',
            _icon_hover_hex_     : '#808d9e',

            // Link colors should be only used on elements which users tap,
            // click, drag, or otherwise interact.
            _link_hex_          : '#6cafff', // link on both lt and dk bkg
            _link_lt_hex_       : '#89c3ff', // hover on dk bkg
            _link_xlt_hex_      : '#a9b3ff', // hover on dk bkg
            _link_fade_hex_     : '#4b576b', // faded link on color
            _link_dk_hex_       : '#89c3ff', // hover on lt bkg

            // The placeholder color is a subdued text color shown in input
            // fields when there is no content.
            _placeholder_hex_   : '#5d676f', // === _area_lt_hex_

            // Text colors are generally more saturated and are darker
            // (lighter in inverse scheme) than correlating area colors.
            _txt_hex_           : '#acb9c3', // document font
            _txt_alt_hex_       : '#ffa62c', // invert of link_hex
            _txt_dk_hex_        : '#c3ccd4',
            _txt_inv_hex_       : '#5b666e',
            _txt_inv_dk_hex_    : '#77848f',
            _txt_inv_lt_hex_    : '#3d454a',
            _txt_lt_hex_        : '#94a5b2',
            _txt_xlt_hex_       : '#77848f',

            // The top-left logo image path.
            _logo_url_           : __p('url(img/{_p_}-logo-white.png)')
              + '?' + nowMs,

            // Shadows colors are listed from near to far. Near shadows that
            // use rgba_shdw_00, for example, will be smaller but more
            // distinct.
            _rgba_shdw_00_     : 'rgba(192,222,255,.500)',
            _rgba_shdw_01_     : 'rgba(192,222,255,.450)',
            _rgba_shdw_02_     : 'rgba(192,222,255,.405)',
            _rgba_shdw_03_     : 'rgba(192,222,255,.365)',
            _rgba_shdw_04_     : 'rgba(192,222,255,.328)',
            _rgba_shdw_05_     : 'rgba(192,222,255,.295)',
            _rgba_shdw_06_     : 'rgba(192,222,255,.266)',
            _rgba_shdw_07_     : 'rgba(192,222,255,.239)',
            _rgba_shdw_08_     : 'rgba(192,222,255,.215)',
            _rgba_shdw_09_     : 'rgba(192,222,255,.194)',
            _txt_shdw_01_      : '0 1px 1px #000000',
            _txt_shdw_01_inv_  : '0 1px 1px #7fb5ed'
          }
        ],
        _selector_list_ : [
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
              _height_      : '_100p_',
              _font_family_ : '_font_family_sans_',
              _font_size_   : '_font_size_',
              _color_       : '_txt_hex_',
              _background_  : '_area_hex_'
            }
          },
          { _selector_str_ : 'body',
            _rule_map_     : {
              _position_   : '_relative_',
              _min_height_ : '_100p_',
              _display_    : '_block_',
              _overflow_x_ : '_hidden_',
              _overflow_y_ : '_auto_',
              _color_      : '_txt_hex_'
            }
          },
          { _selector_str_ : '::-webkit-input-placeholder',
            _rule_map_     : { _color_ : '_placeholder_hex_' }
          },
          { _selector_str_ : '::-ms-input-placeholder',
            _rule_map_     : {
              _color_   : '_placeholder_hex_',
              _opacity_ : '_1_'
            }
          },
          // Firefox requires more specific selectors than chrome
          { _selector_str_ : 'input[type="text"]::-moz-placeholder,'
          + 'textarea::-moz-placeholder',
            _rule_map_     : {
              _color_   : '_placeholder_hex_',
              _opacity_ : '_1_'
            }
          },
          // Firefox requires more specific selectors than chrome
          { _selector_str_ : 'input[type="text"]::placeholder,'
          + 'textarea::placeholder',
            _rule_map_     : {
              _color_ : '_placeholder_hex_',
              _opacity_ : '_1_'
            }
          },
          { _selector_str_ : 'button',
            _rule_map_     : {
              _display_       : '_block_',
              _position_      : '_relative_',
              _margin_        :
                [['_spc_rem_01_', '_spc_rem_03_', '_spc_rem_01_', '_spc_rem_03_']],
              _box_shadow_    : '_shdw_01_',
              _border_        : [[ '_d125rem_', '_solid_', '_link_hex_' ]],
              _outline_       : '_none_',
              _border_radius_ : '_radius_05_',
              _height_        : '_spc_rem_04_',
              _line_height_   : '_1d5rem_',
              _padding_       : [['_0_', '_spc_rem_02_']],
              _font_size_     : '_spc_rem_02_',
              _color_         : '_btn_txt_hex_',
              _background_    : '_link_hex_',
              _text_shadow_   : '_txt_shdw_01_inv_',
              _cursor_        : '_pointer_'
            }
          },
          //
          // This is probably redundant with shell_card_
          // TODO 2017-11-29 mmikowski info - review and remove or keep
          // { _selector_str_ : __p('.{_p_}-_x_box_'),
          //   _rule_map_ : {
          //     _border_top_    : [[ '_d1875rem_', '_solid_', '_accent_hex_' ]],
          //     _overflow_      : '_hidden_',
          //     _background_    : '_area_hex_',
          //     _box_shadow_    : '_shdw_03a_',
          //     _color_         : '_txt_hex_',
          //     _margin_bottom_ : '_spc_rem_03_',
          //     _clear_         : '_both_'
          //   }
          // },
          // { _selector_str_ : __p('.{_p_}-_x_box_inr_' ),
          //   _rule_map_ : {
          //     _padding_ : [[ '_spc_rem_03_', '_1d25rem_', '_spc_rem_03_', '_1d75rem_' ]]
          //   }
          // },
          // { _selector_str_ : __p('.{_p_}-_x_box_inr_ p' ),
          //   _rule_map_ : { _margin_: [[ '_0_','_0_','_1rem_','_0_' ]] }
          // },
          // { _selector_str_ : __p('.{_p_}-_x_box_title_'),
          //   _rule_map_ : {
          //     _padding_     : [[ '_0_', '_1d25rem_', '_0_', '_1d25rem_' ]],
          //     _font_size_   : '_spc_rem_02_',
          //     _background_  : '_frame_hex_',
          //     _line_height_ : '_2d5rem_',
          //     _color_       : '_txt_hex_',
          //     _border_bottom_ : [[ '_d0625rem_', '_solid_', '_frame_dk_hex_' ]]
          //   }
          // },
          //
          { _selector_str_ : __p('.{_p_}-_x_hlink_'),
            _rule_map_ : { _display_ : '_none_' }
          },
          { _selector_str_ : __p('button.{_p_}-_x_lh_'),
            _rule_map_ : {
              _float_        : '_left_',
              _margin_left_  : '_0_'
            }
          },
          { _selector_str_ : __p('button.{_p_}-_x_rh_'),
            _rule_map_ : {
              _float_        : '_right_',
              _margin_right_ : '_0_'
            }
          },
          { _selector_str_ : __p('button.{_p_}-_x_inline_'),
            _rule_map_     : {
              _display_ : '_inline_block_',
              _margin_  : '_0_'
            }
          },
          { _selector_str_ : __p('button.{_p_}-_x_alt_'),
            _rule_map_ : {
              _background_  : '_area_hex_',
              _color_       : '_link_hex_',
              _text_shadow_ : '_none_'
            }
          },
          { _selector_str_ : __p('button.{_p_}-_x_disable_,'
            + 'button.{_p_}-_x_disable_:hover'),
            _rule_map_ : {
              _background_   : '_area_lt_hex_',
              _color_        : '_txt_xlt_hex_',
              _cursor_       : '_default_',
              _border_color_ : '_txt_xlt_hex_'
            }
          },
          { _selector_str_ : __p('div.{_p_}-_x_fill_abs_'),
            _rule_map_ : {
              _position_  : '_absolute_',
              _margin_    : '_0_',
              _top_       : '_0_',
              _left_      : '_0_',
              _right_     : '_0_',
              _bottom_    : '_0_',
              _max_width_ : '_none_'
            }
          },
          { _selector_str_ : 'button:hover',
            _rule_map_     : {
              _background_ : '_link_dk_hex_',
              _color_      : '_btn_txt_hover_hex_'
            }
          },
          { _selector_str_ : 'a',
            _rule_map_     : {
              _color_  : '_link_hex_',
              _cursor_ : '_pointer_'
            }
          },
          { _selector_str_ : 'a:hover',
            _rule_map_     : {
              _color_           : '_link_dk_hex_',
              _text_decoration_ : '_underline_'
            }
          },

          /* BEGIN {_p_}-_x_*_ selectors */
          // BEGIN shared link classes
          { _selector_str_ : __p('.{_p_}-_x_link_,.{_p_}-_x_link_inv_'),
            _rule_map_     : {
              _color_  : '_link_hex_',
              _cursor_ : '_pointer_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_link_:hover'),
            _rule_map_     : {
              _text_decoration_ : '_underline_',
              _color_           : '_link_dk_hex_'
            }
          },
          // Do not underline icon links
          { _selector_str_ : __p('.{_p_}-_x_icon_.{_p_}-_x_link_:hover'),
            _rule_map_     : { _text_decoration_ : '_none_' }
          },
          { _selector_str_ : __p('.{_p_}-_x_link_inv_:hover'),
            _rule_map_     : {
              _text_decoration_ : '_underline_',
              _color_           : '_link_lt_hex_'
            }
          },
          // . END shared link classes

          // BEGIN Shared icon class
          { _selector_str_ : __p('.{_p_}-_x_icon_'),
            _rule_map_     : {
              _display_      : '_inline_block_',
              _margin_       : [[ '_0_', '_spc_rem_00_' ]],
              _font_family_  : '_font_family_awesome_',
              _font_size_    : '_spc_rem_03_',
              _line_height_  : '_spc_rem_04_',
              _width_        : '_spc_rem_04_',
              _text_align_   : '_center_'
            }
          },
          { _selector_str_ : __p( '.{_p_}-_x_icon_.{_p_}-_x_small_' ),
            _rule_map_     : { _font_size_ : '_1rem_' }
          },
          { _selector_str_ : __p('.{_p_}-_x_icon_.{_p_}-_x_color_'),
            _rule_map_     : { '_color_' : '_icon_hex_' }
          },
          { _selector_str_ : __p('.{_p_}-_x_icon_.{_p_}-_x_color_:hover'
            + '.{_p_}-_x_icon_.{_p_}-_x_color_.{_p_}._x_select_'
          ),
            _rule_map_     : { '_color_' : '_icon_hover_hex_' }
          },
          { _selector_str_ : __p('.{_p_}-_x_icon_.{_p_}-_x_rh_'),
            _rule_map_     : {
              _margin_right_: '_0_',
              _margin_left_ : '_spc_rem_01_',
              _float_       : '_right_',
              _text_align_  : '_right_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_icon_.{_p_}-_x_lh_'),
            _rule_map_     : {
              _margin_left_ : '_0_',
              _margin_right_: '_spc_rem_01_',
              _float_       : '_left_',
              _text_align_  : '_left_'
            }
          },
          // . END Shared icon class

          // BEGIN Share tab interface classes
          { _selector_str_ : __p('.{_p_}-_x_tab_'),
            _rule_map_     : {
              _position_        : '_relative_',
              _height_          : '_3rem_',
              _line_height_     : '_spc_rem_04_',
              _border_bottom_   : [[ '_d25rem_', '_solid_', '_area_hex_' ]],
              _font_size_       : '_spc_rem_02_',
              _color_           : '_area_hex_',
              _background_      : '_area_dk_hex_',
              _vertical_align_  : '_middle_',
              _list_style_type_ : '_none_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_tab_>li'),
            _rule_map_ : {
              _float_       : '_left_',
              _width_       : '_50p_',
              _height_      : '_100p_',
              _padding_     : [[ '_d3125rem_', '_0_','_0_', '_1rem_' ]],
              _cursor_      : '_pointer_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_tab_>li:hover'),
            _rule_map_ : {
              _color_       : '_area_hover_hex_',
              _background_  : '_area_lt_hex_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_tab_>li.{_p_}-_x_active_'),
            _rule_map_     : {
              _color_      : '_link_hex_',
              _background_ : '_area_hex_',
              _cursor_     : '_default_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_tbox_>li'),
            _rule_map_     : {
              _display_    : '_none_',
              _padding_    : [[ '_d5rem_', '_d5rem_','_0_','_d5rem_' ]],
              _overflow_x_ : '_hidden_',
              _background_ : '_area_hex_',
              _cursor_      : '_default_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_tbox_>li.{_p_}-_x_active_'),
            _rule_map_     : { _display_ : '_block_' }
          },
          { _selector_str_ : __p('.{_p_}-_x_tbox_list_'),
            _rule_map_     : { _list_style_type_ : '_none_' }
          },
          { _selector_str_ : __p('.{_p_}-_x_tbox_list_>li'),
            _rule_map_     : {
              _position_      : '_relative_',
              _margin_bottom_ : '_d5rem_',
              _border_        :
                [[ '_d125rem_', '_solid_', '_area_mid_hex_' ]],
              _border_radius_ : '_radius_07_',
              _padding_       : [[ '_d5rem_', '_1rem_', '_spc_rem_01_', '_1rem_' ]],
              _background_    : '_area_mid_hex_',
              _color_         : '_txt_lt_hex_',
              _cursor_        : '_pointer_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_tbox_list_>li.{_p_}-_x_active_'),
            _rule_map_     : {
              _background_   : '_area_hex_',
              _color_        : '_txt_dk_hex_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_tbox_list_>li:hover'),
            _rule_map_     : {
              _background_   : '_area_hex_',
              _color_        : '_txt_dk_hex_',
              _border_color_ : '_txt_alt_hex_'
            }
          },
          // . END Share tab interface classes

          // BEGIN shared list classes
          { _selector_str_ : __p('.{_p_}-_x_list_title_'),
            _rule_map_ : {
              _line_height_    : '_1d25rem_',
              _font_size_      : '_spc_rem_02_',
              _margin_bottom_  : '_d5rem_',
              _color_          : '_link_hex_',
              _vertical_align_ : '_top_',
              _word_break_     : '_break_word_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_list_float_text_'),
            _rule_map_ : {
              _float_          : '_right_',
              _margin_left_    : '_d5rem_',
              _text_align_     : '_right_',
              _line_height_    : '_1d25rem_',
              _font_size_      : '_1rem_',
              _color_          : '_txt_xlt_hex_',
              _vertical_align_ : '_top_'
            }
          },
          // . END shared list classes

          // BEGIN shared toggle classes
          { _selector_str_ : __p('.{_p_}-_x_toggle_'),
            _rule_map_     : {
              _z_index_     : '_2_',
              _position_    : '_absolute_',
              _top_         : '_0_',
              _right_       : '_0_'
          }
          },
          { _selector_str_ : __p('.{_p_}-_x_toggle_>li'),
            _rule_map_     : {
              _float_       : '_right_',
              _position_    : '_relative_',
              _margin_left_ : '_d5rem_',
              _width_       : '_spc_rem_04_',
              _height_      : '_1d75rem_',
              _line_height_ : '_1d75rem_',
              _font_size_   : '_1d25rem_',
              _text_align_  : '_center_',
              _background_  : '_link_hex_',
              _color_       : '_area_hex_',
              _font_family_ : '_font_family_awesome_',
              _border_radius_ : [[ '_0_', '_0_', '_0_', '_radius_03_' ]],
              _text_shadow_ : '_txt_shdw_01_inv_',
              _cursor_      : '_pointer_'
            }
          },
          // . END shared toggle classes

          // BEGIN Shared action titles
          { _selector_str_ : __p('.{_p_}-_x_title_'),
            _rule_map_     : {
              _z_index_        : '_1_',
              _display_        : '_inline_block_',
              _margin_right_   : '_spc_rem_00_',
              _position_       : '_relative_',
              _line_height_    : '_spc_rem_04_',
              _font_size_      : '_spc_rem_02_',
              _vertical_align_ : '_top_',
              _word_break_     : '_break_word_',
              _text_shadow_    : '_txt_shdw_01_',
              _color_          : '_txt_xlt_hex_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_toggle_>li:hover'),
            _rule_map_     : {
              _background_  : '_link_dk_hex_',
              _color_       : '_area_hover_hex_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_toggle_>li.{_p_}-_x_txt_'),
            _rule_map_ : {
              _padding_top_ : '_d5rem_',
              _font_size_   : '_1rem_',
              _width_       : '_auto_',
              _color_       : '_txt_xlt_hex_',
              _background_  : '_transparent_',
              _margin_right_: '_spc_rem_01_',
              _text_shadow_ : '_txt_shdw_01_',
              _cursor_      : '_default_'
            }
          },
          // . END Shared action titles

          // BEGIN Shared generic modifiers
          { _selector_str_ : __p('.{_p_}-_x_noselect_'),
            _rule_map_     : {
              __webkit_user_select_ : '_none_',
              __moz_user_select_    : '_none_',
              __o_user_select_      : '_none_',
              _user_select_         : '_none_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_bold_'),
            _rule_map_     : {_font_weight_ : '_800_'}
          },
          { _selector_str_ : __p('.{_p_}-_x_clearfloat_'),
            _rule_map_     : {
              _visibility_ : [['_hidden_', '_important_']],
              _float_      : [['_none_', '_important_']],
              _height_     : [['_0_', '_important_']],
              _clear_      : [['_both_', '_important_']]
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_form_' ),
            _rule_map_ : { _min_width_ : [ '15rem' ] }
          },
          { _selector_str_ : __p('.{_p_}-_x_form_ input[type=text],'
              + '.{_p_}-_x_form_ input[type=password],'
              + '.{_p_}-_x_form_ textarea'
            ),
            _rule_map_     : {
              _padding_       : [ [ '_d5rem_', '_d75rem_' ] ],
              _margin_bottom_ : '_d75rem_',
              _width_         : '_100p_',
              _border_        : [[ '_txt_xlt_hex_', '_solid_', '_d0625rem_' ]],
              _background_    : '_area_accent_hex_',
              _color_         : '_txt_hex_'
            }
          },
          { _selector_str_ : __p('.{_p_}-_x_form_ textarea:focus,'
              + '.{_p_}-_x_form_ input:focus'),
            _rule_map_     : {
              _background_   : '_area_focus_hex_',
              _border_color_ : '_link_hex_'
            }
          },
          { _selector_str_ : __p( '.{_p_}-_x_form_ input[type=radio]' ),
            _rule_map_ : { _margin_right_ : '_d5rem_' }
          },
          { _selector_str_ : __p( '.{_p_}-_x_form_ label' ),
            _rule_map_ : {
              _cursor_       : '_pointer_',
              _margin_right_ : '_2rem_'
            }
          },
          { _selector_str_ : __p( '.{_p_}-_x_form_ label:hover' ),
            _rule_map_ : { _text_decoration_ : '_underline_' }
          }
          // . END Shared generic modifiers
          /* END {_p_}-_x_*_ selectors */
        ]
      },

      instanceMap, optionMap
      ;
    // == . END MODULE SCOPE VARIABLES =================================

    // == BEGIN PUBLIC METHODS =========================================
    instanceMap = {
      _globalMixinMap_ : configMap._global_mixin_map_,
      _selectorList_   : configMap._selector_list_,
      _paletteMapList_ : configMap._palette_map_list_
    };

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
// == . END MODULE xhi._05_02_css_base_ ===============================
