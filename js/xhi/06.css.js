/*
 * 06.css.js
 *
 * Use     : xhi._makeCss_( app_map );
 * Synopsis: Add _css_ capabilities to app_map
 * Provides: Run-time CSS styling using PowerCSS
 *
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
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

// == BEGIN MODULE __NS._makeCss_ ======================================
__NS._makeCss_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    aKey   = aMap._aKey_,
    nMap   = aMap._nMap_,
    vMap   = aMap._vMap_,
    __util = aMap._util_,

    __0      = nMap._0_,
    __false  = vMap._false_,
    __true   = vMap._true_,
    __Number = vMap._Number_,
    __logObj = __util._getLogObj_(),
    __logMsg = __logObj._logMsg_,

    topSmap = {
      _is_ready_  : __false,
      _theme_idx_ : __0
    };
  // == . END MODULE SCOPE VARIABLES ===================================

  // == BEGIN UTILITY METHODS ==========================================
  // == . END UTILITY METHODS ==========================================

  // == BEGIN DOM METHODS ==============================================
  // == . END DOM METHODS ==============================================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN public method /getThemeCount/
  function getThemeCount () {
    var
      theme_map_list = aMap._css_base_._themeMapList_;
    return theme_map_list[ vMap._length_ ];
  }
  // . END public method /getThemeCount/

  // BEGIN public method /getThemeMixinMap/
  function getThemeMixinMap () {
    var
      theme_map_list = aMap._css_base_._themeMapList_,
      theme_idx      = topSmap._theme_idx_;
    return theme_map_list[ theme_idx ];
  }
  // . END public method /getThemeMixinMap/

  // BEGIN public method /setThemeIdx/
  function setThemeIdx( arg_idx ) {
    var
      idx            = __util._castInt_( arg_idx, 0 ),
      theme_map_list = aMap._css_base_._themeMapList_,
      theme_idx      = topSmap._theme_idx_,
      theme_count    = theme_map_list[ vMap._length_ ],
      theme_mixin_map;

    // Return current theme index if request is out of range
    // or matches existing.
    if ( idx === theme_idx || idx > theme_count || idx < __0 ) {
      return theme_idx;
    }

    // Get the mixin map for the requested idx.  If no map exists,
    // use the first theme map (0).
    theme_idx = idx;
    theme_mixin_map = theme_map_list[ theme_idx ];
    if ( ! theme_mixin_map ) {
      theme_idx       = __0;
      theme_mixin_map = theme_map_list[ __0 ] || {};
    }

    // Set the cascade and safe state. Return current them index.
    pcss._setCascade_({
      _cascade_id_     : '_c01_',
      _mode_str_       : '_change_',
      _mixin_map_      : theme_mixin_map,
      _regen_type_     : '_use_'
    });
    topSmap._theme_idx_ = theme_idx;
    return theme_idx;
  }
  // . END public method /setThemeIdx/

  // BEGIN public method /initModule/
  function initModule ( arg_idx ) {
    var
      local_key = aKey + '-_theme_map_',
      theme_idx = __Number( arg_idx ) || __0,

      theme_json, theme_map_list, theme_map;

    if ( topSmap._is_ready_ === __true ) { return; }

    pcss._initModule_({ _style_el_prefix_ : aKey });
    pcss._setGlobalMixinMap_({ _mixin_map_: aMap._css_base_._globalMixinMap_ });

    pcss._setVsheet_({
      _vsheet_id_     : '_base_',
      _mode_str_      : '_add_',
      _selector_list_ : aMap._css_base_._selectorList_
    });

    pcss._setVsheet_({
     _vsheet_id_     : '_lb_',
     _mode_str_      : '_add_',
     _selector_list_ : aMap._css_lb_._selectorList_
    });

    pcss._setVsheet_({
      _vsheet_id_     : '_shell_',
      _mode_str_      : '_add_',
      _selector_list_ : aMap._css_shell_._selectorList_
    });

    // Begin use local theme map if available
    if ( localStorage[ vMap._hasOwnProp_ ]( local_key ) ) {
      theme_json = localStorage[ local_key ];
      try {
        theme_map = JSON[ vMap._parse_ ]( theme_json );
      }
      catch ( error ) {
        __logMsg( '_error_', '_cannot_parse_local_theme_json_', error );
      }
    }

    theme_map_list = aMap._css_base_._themeMapList_;
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
  // . END public method /initModule/

  aMap._css_ = {
    _getCssKeyMap_     : pcss._getCssKeyMap_,
    _getCssValMap_     : pcss._getCssValMap_,
    _getThemeCount_    : getThemeCount,
    _getThemeMixinMap_ : getThemeMixinMap,
    _setThemeIdx_      : setThemeIdx,

    _initModule_       : initModule
  };
  // == . END PUBLIC METHODS ===========================================
};
// == . END MODULE __NS._makeCss_ ======================================

