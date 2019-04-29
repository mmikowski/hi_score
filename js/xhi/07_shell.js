/*
 * 07_shell.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._07_shell_._makeInstance_( app_map );
 * Synopsis : Add _07_shell_ capabilities to app_map
 * Provides : Browser shell controller
 * Requires :
 *   - aMap (app map) with instances of the following:
 *     00_root, 01_util, 03_model, 04_utilb,
 *     05_02_css_base, 05_03_css_lb, 05_04_css_shell, and 06_lb.
 *     02_data is NOT required
 *   - jQuery   (as xhiJQ )
 *   - PowerCSS (as xhiCSS)
*/
/*global xhi, xhiJQ */
// == BEGIN MODULE xhi._07_shell_ ======================================
xhi._07_shell_ = (function ( $ ) {
  function makeInstanceFn ( aMap, argOptionMap ) {
    // == BEGIN MODULE SCOPE VARIABLES ===================================
    'use strict';
    var
      // Set app symbols
      aKey    = aMap._aKey_,
      nMap    = aMap._nMap_,
      subName = '_07_shell_',
      vMap    = aMap._vMap_,

      // Set object symbols
      utilObj = aMap._01_util_,
      logObj  = utilObj._getLogObj_(),

      // Set function symbols
      data2strFn = vMap._data2strFn_,
      logFn      = logObj._logMsg_,

      // Set number symbols
      __0 = nMap._0_,
      __1 = nMap._1_,

      // Set string-ish symbols`
      __blank = vMap._blank_,
      __true  = vMap._true_,

      // Set config and state maps
      configMap = {
        _main_tmplt_ : '<h1>Hello world from |'
        + aKey + '| namespace</h1>'
      },
      stateMap = {},

      // Declare other module-wide variables
      $Map, optionMap, instanceMap
    ;
    // == . END MODULE SCOPE VARIABLES ===================================

    // == BEGIN DOM METHODS ==============================================
    // Cache xhiJQ  (jQuery) collections here
    function set$Map ( $top_box ) {
      $Map = { _$top_box_ : $top_box };
    }
    // == . END DOM METHODS ==============================================

    // == BEGIN EVENT HANDLERS ===========================================
    // == . END EVENT HANDLERS ===========================================

    // == BEGIN PUBLIC METHODS ===========================================
    // BEGIN Public method /initModuleFn/
    function initModuleFn ( $top_box ) {
      // Set styles
      aMap._05_css_._initModuleFn_();

      // Initial DOM content using methods above
      // and then set jQuery (xhiJQ) collection cache
      $top_box[ vMap._html_ ]( configMap._main_tmplt_ );
      set$Map( $top_box );

      // Report debug values
      logFn( '_info_', $,
        '\n  __0       === ' + __0,
        '\n  __1       === ' + __1,
        '\n  __blank   === ' + __blank,
        '\n  aKey      === ' +   aKey,
        '\n  $Map      === ' + data2strFn( $Map      ),
        '\n  aMap      === ' + data2strFn( aMap      ),
        '\n  configMap === ' + data2strFn( configMap ),
        '\n  stateMap  === ' + data2strFn( stateMap  )
      );
      // Bind shell event handlers (taps, drags, long-press, etc)
    }
    // . END Public method /initModuleFn/

    instanceMap = { _initModuleFn_ : initModuleFn };

    optionMap = utilObj._castMap_( argOptionMap, {} );
    if ( optionMap._dont_autoadd_ !== __true ) {
      aMap[ subName ] = instanceMap;
    }

    return instanceMap;
    // == . END PUBLIC METHODS ===========================================
  }
  return { _makeInstanceFn_ : makeInstanceFn };
}( xhiJQ ));
// == BEGIN MODULE xhi._07_shell_ ======================================
