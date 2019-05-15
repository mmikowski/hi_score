/*
 * 05_css.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._05_css_._makeInstanceFn_( app_map, option_map );
 * Synopsis : Add _css_ capabilities to app_map
 * Provides : Run-time CSS styling using PowerCSS
 * Requires : aMap (app map) with symbols from 00_root._makeInstanceFn_(),
 *            PowerCSS (patched as xhiCSS)
*/
/*global xhiCSS, xhi */

// == BEGIN MODULE xhi._05_css_ ==========================================
xhi._05_css_ = (function () {
  'use strict';
  // == BEGIN public method /makeInstanceFn/ =============================
  function makeInstanceFn ( aMap, argOptionMap ) {
    // == BEGIN MODULE SCOPE VARIABLES ===================================
    var
      // Set app symbols
      aKey      = aMap._aKey_,
      nMap      = aMap._nMap_,
      subName   = '_05_css_',
      vMap      = aMap._vMap_,

      // Set object symbols
      utilObj    = aMap._01_util_,
      logObj  = utilObj._getLogObj_(),

      // Set function symbols
      logFn     = logObj._logMsg_,
      castIntFn = utilObj._castInt_,

      // Set number symbols
      __n1      = nMap._n1_,
      __0       = nMap._0_,

      // Set string-like symbols
      __false   = vMap._false_,
      __true    = vMap._true_,
      __undef   = vMap._undef_,

      // Set module config and state maps
      stateMap  = {
        _is_ready_    : __false,
        _palette_idx_ : __undef
      },

      instanceMap, optionMap
      ;
    // == . END MODULE SCOPE VARIABLES ===================================

    // == BEGIN UTILITY METHODS ==========================================
    // == . END UTILITY METHODS ==========================================

    // == BEGIN DOM METHODS ==============================================
    // == . END DOM METHODS ==============================================

    // == BEGIN PUBLIC METHODS ===========================================
    // BEGIN public method /getPaletteCount/
    function getPaletteCount () {
      var
        palette_map_list = aMap._05_02_css_base_._paletteMapList_;
      return palette_map_list[ vMap._length_ ];
    }

    // . END public method /getPaletteCount/

    // BEGIN public method /getPaletteMixinMap/
    function getPaletteMixinMap () {
      var
        palette_map_list = aMap._05_02_css_base_._paletteMapList_,
        palette_idx      = stateMap._palette_idx_;
      return palette_map_list[ palette_idx ];
    }

    // . END public method /getPaletteMixinMap/

    // BEGIN public method /setPaletteIdx/
    function setPaletteIdx ( arg_idx ) {
      var
        idx              = utilObj._castInt_( arg_idx, 0 ),
        palette_map_list = aMap._05_02_css_base_._paletteMapList_,
        palette_count    = palette_map_list[ vMap._length_ ],

        palette_idx, palette_mixin_map;

      // Return current palette index if request is out of range
      // or matches existing.
      if ( idx === stateMap._palette_idx_
        || idx > palette_count || idx < __0
      ) {
        return stateMap._palette_idx_;
      }

      // Get the mixin map for the requested idx.  If no map exists,
      // use the first palette map (0).
      palette_idx       = idx;
      palette_mixin_map = palette_map_list[ palette_idx ];
      if ( !palette_mixin_map ) {
        palette_idx       = __0;
        palette_mixin_map = palette_map_list[ __0 ] || {};
      }

      // Set the cascade and safe state. Return current them index.
      xhiCSS._setCascade_( {
        _cascade_id_ : '_c01_',
        _mode_str_   : '_change_',
        _mixin_map_  : palette_mixin_map,
        _regen_type_ : '_use_'
      } );
      stateMap._palette_idx_ = palette_idx;
      return palette_idx;
    }

    // . END public method /setPaletteIdx/

    // BEGIN utility /initPaletteMap/
    // Summary   : initPaletteMap( <arg_idx> ];
    // Purpose   : Initialize palette_map in the following priority:
    //   1. Parameter specifying argument: palette_list[ <arg_idx> ]
    //   2. Local store map: Localstorage.<key>-_palette_map_
    //   3. Local store index: palette_list[ Localstorage.<key>-_palette_idx_ ]
    //   4. Default index (0)
    // Example   : var palette_map = initPaletteMap();
    // Arguments : ( positional )
    //   0. arg_idx : (optional) Override palette index to use
    //      In the future we may also support an explicit map.
    // Settings  : Uses stateMap and configMap from context.
    // Returns   : undef
    // Throws    : none
    //
    function initPaletteMap ( arg_palette_idx ) {
      var
        input_palette_idx = castIntFn( arg_palette_idx, __n1 ),
        local_map_key     = aKey + '-_palette_map_',
        local_idx_key     = aKey + '-_palette_idx_',
        palette_map_list  = aMap._05_02_css_base_._paletteMapList_,
        palette_map_count = palette_map_list[ vMap._length_ ],

        solve_idx, solve_map,
        local_json, local_idx
      ;

      function cleanup_fn () {
        stateMap._palette_idx_ = solve_idx;
        stateMap._palette_map_ = solve_map;
        return solve_map;
      }

      // 1. Use parameter specifying argument: palette_list[ <arg_idx> ]
      if ( input_palette_idx > __n1 ) {
        solve_idx = input_palette_idx >= palette_map_count
          ? palette_map_count + __n1 : input_palette_idx
        ;
        solve_map = palette_map_list[ solve_idx ];
        return cleanup_fn();
      }

      // 2. Use local store map: Localstorage.<key>-_palette_map_
      if ( localStorage[ vMap._hasOwnProperty_ ]( local_map_key ) ) {
        local_json = localStorage[ local_map_key ];
        try {
          solve_map = vMap._str2dataFn_( local_json );
        }
        catch ( error ) {
          logFn( '_error_', '_cannot_parse_local_palette_json_', error );
        }
        if ( solve_map ) {
          solve_idx = __n1;
          return cleanup_fn();
        }
      }

      // 3. Use local store index: Localstorage.<key>-_palette_idx_
      if ( localStorage[ vMap._hasOwnProperty_ ]( local_idx_key ) ) {
        local_idx = castIntFn( localStorage[ local_idx_key ], __0 );
        solve_idx = local_idx > palette_map_count
          ? palette_map_count - 1 : local_idx < __0
            ? __0 : local_idx
        ;
      }
      // 4. Use default index (__0)
      else {
        solve_idx = __0;
      }
      solve_map = palette_map_list[ solve_idx ];
      return cleanup_fn();
    }

    // . END utility /initPaletteMap/

    // BEGIN public method /initModuleFn/
    function initModuleFn ( arg_palette_idx ) {
      var palette_map;
      if ( stateMap._is_ready_ === __true ) { return; }

      palette_map = initPaletteMap( arg_palette_idx );
      xhiCSS._initModule_( { _style_el_prefix_ : aKey } );
      xhiCSS._setGlobalMixinMap_( {
        _mixin_map_ : aMap._05_02_css_base_._globalMixinMap_
      } );

      xhiCSS._setVsheet_( {
        _vsheet_id_     : '_base_',
        _mode_str_      : '_add_',
        _selector_list_ : aMap._05_02_css_base_._selectorList_
      } );

      xhiCSS._setVsheet_( {
        _vsheet_id_     : '_lb_',
        _mode_str_      : '_add_',
        _selector_list_ : aMap._05_03_css_lb_._selectorList_
      } );

      xhiCSS._setVsheet_( {
        _vsheet_id_     : '_shell_',
        _mode_str_      : '_add_',
        _selector_list_ : aMap._05_04_css_shell_._selectorList_
      } );

      xhiCSS._setCascade_( {
        _cascade_id_     : '_c01_',
        _mode_str_       : '_add_',
        _vsheet_id_list_ : [ '_base_', '_lb_', '_shell_' ],
        _mixin_map_      : palette_map,
        _regen_type_     : '_use_'
      } );
      stateMap._is_ready_ = __true;
    }

    // . END public method /initModuleFn/

    instanceMap = {
      _getCssKeyMap_       : xhiCSS._getCssKeyMap_,
      _getCssValMap_       : xhiCSS._getCssValMap_,
      _getPaletteCount_    : getPaletteCount,
      _getPaletteMixinMap_ : getPaletteMixinMap,
      _setPaletteIdx_      : setPaletteIdx,

      _initModuleFn_ : initModuleFn
    };

    optionMap = utilObj._castMap_( argOptionMap, {} );
    if ( optionMap._dont_autoadd_ !== __true ) {
      aMap[ subName ] = instanceMap;
    }

    return instanceMap;
    // == . END PUBLIC METHODS ===========================================
  }
  // == . END public method /makeInstanceFn/ =============================
  return { _makeInstanceFn_ : makeInstanceFn };
}());
// == . END MODULE xhi._05_css_ ==========================================

