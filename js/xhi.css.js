/**
 *    xhi.css.js
 *    Controller for JS-driven CSS using PowerCSS
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
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
    __logObj = xhi._util_._getLogObj_(),
    __logIt  = __logObj._logIt_,

    topSmap = {
      _is_ready_  : __false,
      _theme_idx_ : __0
    };
  // ================== END MODULE SCOPE VARIABLES =====================

  // ===================== BEGIN UTILITY METHODS =======================
  // ====================== END UTILITY METHODS ========================

  // ======================= BEGIN DOM METHODS =========================
  // ======================== END DOM METHODS ==========================

  // ====================== BEGIN PUBLIC METHODS =======================
  // BEGIN public method /getThemeCount/
  function getThemeCount () {
    var
      theme_map_list = xhi._css_base_._themeMapList_;
    return theme_map_list[ vMap._length_ ];
  }
  // END public method /getThemeCount/

  // BEGIN public method /getThemeMixinMap/
  function getThemeMixinMap( arg_idx ) {
    var
      theme_map_list = xhi._css_base_._themeMapList_,
      theme_idx      = topSmap._theme_idx_;
    return theme_map_list[ theme_idx ];
  }
  // END public method /getThemeMixinMap/

  // BEGIN public method /setThemeIdx/
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
  // END public method /setThemeIdx/

  // BEGIN public method /initModule/
  function initModule ( arg_idx ) {
    var
      local_key = 'xhi-_theme_map_',
      theme_idx = __Number( arg_idx ) || __0,

      theme_json, theme_map_list, theme_map;

    if ( topSmap._is_ready_ === __true ) { return; }

    pcss._initModule_({ _style_el_prefix_ : 'xhi' });
    pcss._setGlobalMixinMap_({ _mixin_map_: xhi._css_base_._globalMixinMap_ });

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
      _vsheet_id_list_ : [ '_base_', '_lb_', '_shell_' ],
      _mixin_map_      : theme_map,
      _regen_type_     : '_use_'
    });
    topSmap._is_ready_ = __true;
  }
  // END public method /initModule/

  return {
    _getCssKeyMap_     : pcss._getCssKeyMap_,
    _getCssValMap_     : pcss._getCssValMap_,
    _getThemeCount_    : getThemeCount,
    _getThemeMixinMap_ : getThemeMixinMap,
    _setThemeIdx_      : setThemeIdx,

    _initModule_       : initModule
  };
  // ======================= END PUBLIC METHODS ========================
}());
