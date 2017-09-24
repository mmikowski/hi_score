/*
 * 07.shell.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use     : xhi._makeShell_( app_map );
 * Synopsis: Add _shell_ capabilities to app_map
 * Provides: Page Shell controller
 *
*/
/*global $, xhi */

// == BEGIN MODULE xhi._makeShellFn_ ===================================
xhi._makeShellFn_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    aKey    = aMap._aKey_,
    vMap    = aMap._vMap_,
    nMap    = aMap._nMap_,
    __util  = aMap._util_,

    __data2strFn = vMap._data2strFn_,

    __0     = nMap._0_,
    __1     = nMap._1_,
    __blank = vMap._blank_,

    __logObj = __util._getLogObj_(),
    __logMsg = __logObj._logMsg_,

    configMap = {
      _main_tmplt_ : '<h1>Hello world from |'
        + aKey + '| namespace</h1>'
    },
    stateMap = {},

    $Map
    ;
 // == . END MODULE SCOPE VARIABLES ====================================

  // == BEGIN DOM METHODS ==============================================
  // Cache jQuery collections here
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
    aMap._css_._initModuleFn_();

    // Initial DOM content using methods above
    // and then set jQuery colection cache
    $top_box[ vMap._html_ ]( configMap._main_tmplt_ );
    set$Map( $top_box );

    // Report debug values
    __logMsg( '_info_', $,
      '\n  __0       === ' + __0,
      '\n  __1       === ' + __1,
      '\n  __blank   === ' + __blank,
      '\n  aKey      === ' +   aKey,
      '\n  $Map      === ' + __data2strFn( $Map      ),
      '\n  aMap      === ' + __data2strFn( aMap      ),
      '\n  configMap === ' + __data2strFn( configMap ),
      '\n  stateMap  === ' + __data2strFn( stateMap  )
    );

    // Bind shell event handlers (taps, drags, long-press, etc)
  }
  // . END Public method /initModuleFn/

  aMap._shell_ = { _initModuleFn_ : initModuleFn };
  // == . END PUBLIC METHODS ===========================================
};
// == . END MODULE xhi._makeShellFn_ ===================================
