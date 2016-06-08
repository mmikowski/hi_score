/*
 * xhi.css.js
 * Base class for JS-driven CSS
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
 */
/*jslint       browser : true, continue : true,
  devel : true, indent : 2,      maxerr : 50,
 newcap : true,  nomen : true, plusplus : true,
 regexp : true, sloppy : true,     vars : false,
  white : true,   todo : true,  unparam : true
*/
/*global jQuery, pcss, xhi */
xhi._css_ = (function () {
  // ================= BEGIN MODULE SCOPE VARIABLES ====================
   'use strict';
  var
    nMap = xhi._nMap_,
    vMap = xhi._vMap_,

    __0      = nMap._0_,
    __false  = vMap._false_,
    __true   = vMap._true_,
    __undef  = vMap._undef_,
    __Number = vMap._Number_,
    __logObj = xhi._util_._getLogUtilObj_(),
    __logIt  = __logObj._logIt_,

    topSmap = {
      _is_ready_  : __false,
      _theme_idx_ : __0
    }
    ;

  // ================== END MODULE SCOPE VARIABLES =====================

  // ===================== BEGIN UTILITY METHODS =======================
  // BEGIN TODO: Move font loading to separate pcss controlled stylesheet
  //topCmap = {
  //  _font_list_list_ : [
  //    [ 'xhi-fa-4-5-mod', 'app/font/'        ],
  //    [ 'OpenSans',      'app/font/vendor/' ],
  //    [ 'OpenSans-Bold', 'app/font/vendor/' ]
  //  ],
  //
  //  _font_src_tmplt_ : __blank
  //    + "url('{_font_path_}.eot?iefix=1') "
  //    + "format('embedded-opentype'),"
  //    + "url('{_font_path_}.woff') format('woff'),"
  //    + "url('{_font_path_}.ttf') format('truetype'),"
  //    + "url('{_font_path_}.svg') format('svg')"
  //};
  //function makeFontSelectorList () {
  //  var
  //    font_list_list = topCmap._font_list_list_,
  //    font_count     = font_list_list[ vMap._length_ ],
  //    font_sel_list  = [],
  //    pad_str        = __blank,
  //
  //    i, font_list, font_name,
  //    font_path,    src_str,
  //    selector_map
  //    ;
  //
  //  for ( i = __0; i < font_count; i++ ) {
  //    font_list = font_list_list[ i ];
  //    font_name = font_list[ __0 ];
  //    font_path = font_list[ __1 ];
  //
  //    src_str = xhi._util_._fillTmplt_({
  //      _input_str_  : topCmap._font_src_tmplt_,
  //      _lookup_map_ : {
  //        _font_name_ : font_name,
  //        _font_path_ : font_path + font_name
  //      }
  //    });
  //
  //    // Adding white-space to the selector makes it unique, which
  //    // allows us to add multiple @font-face rules.
  //    selector_map = { _selector_str_ : pad_str + '@font-face',
  //      _rule_map_ : {
  //        _font_family_ : [ font_name ],
  //        _src_         : [ src_str ]
  //      }
  //    };
  //    font_sel_list[ vMap._push_ ]( selector_map );
  //    pad_str += ' ';
  //  }
  //  return font_sel_list;
  //}
  // END TODO: Move font loading to separate pcss controlled stylesheet
  // ====================== END UTILITY METHODS ========================

  // ======================= BEGIN DOM METHODS =========================
  // ======================== END DOM METHODS ==========================

  // ====================== BEGIN PUBLIC METHODS =======================
  function initModule ( arg_idx ) {
    var
      local_key = 'xhi-_theme_map_',
      theme_idx = __Number( arg_idx ) || __0,

      theme_json, theme_map_list, theme_map;

    if ( topSmap._is_ready_ === __true ) { return; }

    pcss._initModule_({ _style_el_prefix_ : 'xhi' });
    pcss._setGlobalMixinMap_({ _mixin_map_: xhi._css_base_._globalMixinMap_ });

    //font_sel_list = makeFontSelectorList();
    //pcss._setVsheet_({
    //  _vsheet_id_     : '_font_',
    //  _mode_str_      : '_add_',
    //  _selector_list_ : font_sel_list
    //});

    pcss._setVsheet_({
      _vsheet_id_     : '_base_',
      _mode_str_      : '_add_',
      _selector_list_ : xhi._css_base_._selectorList_
    });

    pcss._setVsheet_({
     _vsheet_id_     : '_lb_',
     _mode_str_      : '_add_',
     _selector_list_ : xhi._css_lb_._selectorList_
    });

    pcss._setVsheet_({
      _vsheet_id_     : '_shell_',
      _mode_str_      : '_add_',
      _selector_list_ : xhi._css_shell_._selectorList_
    });

    pcss._setVsheet_({
     _vsheet_id_     : '_almd_',
     _mode_str_      : '_add_',
     _selector_list_ : xhi._css_almd_._selectorList_
    });

    // Begin use local theme map if available
    if ( localStorage[ vMap._hasOwnProp_ ]( local_key ) ) {
      theme_json = localStorage[ local_key ];
      try {
        theme_map = JSON[ vMap._parse_ ]( theme_json );
      }
      catch ( error ) {
        __logIt( '_error_', '_cannot_parse_local_theme_json_', error );
      }
    }

    theme_map_list = xhi._css_base_._themeMapList_;
    if ( ! theme_map ) {
      theme_map = theme_map_list[ theme_idx ];
      if ( ! theme_map ) {
        theme_idx = __0;
        theme_map = theme_map_list[ theme_idx ];
      }
    }

    pcss._setCascade_({
      _cascade_id_     : '_c01_',
      _mode_str_       : '_add_',
      _vsheet_id_list_ : [ '_base_', '_lb_', '_shell_', '_almd_' ],
      _mixin_map_      : theme_map,
      _regen_type_     : '_use_'
    });
    topSmap._is_ready_ = __true;
  }

  function getThemeCount () {
    var
      theme_map_list = xhi._css_base_._themeMapList_;
    return theme_map_list[ vMap._length_ ];
  }

  function setThemeIdx( arg_idx ) {
    var
      theme_map_list = xhi._css_base_._themeMapList_,
      theme_idx      = topSmap._theme_idx_,
      theme_count    = theme_map_list[ vMap._length_ ],
      idx            = Number( arg_idx ),
      theme_mixin_map;

    if ( idx === __undef ) { idx = __0; }
    if ( idx === theme_idx || idx > theme_count || idx < __0) { return; }

    theme_idx = idx;
    theme_mixin_map = theme_map_list[ theme_idx ];

    if ( ! theme_mixin_map ) {
      theme_idx       = __0;
      theme_mixin_map = theme_map_list[ __0 ] || {};
    }
    topSmap._theme_idx_ = theme_idx;

    pcss._setCascade_({
      _cascade_id_     : '_c01_',
      _mode_str_       : '_change_',
      _mixin_map_      : theme_mixin_map,
      _regen_type_     : '_use_'
    });
  }

  return {
    _initModule_    : initModule,
    _getThemeCount_ : getThemeCount,
    _setThemeIdx_   : setThemeIdx
  };
  // ======================= END PUBLIC METHODS ========================
}());
