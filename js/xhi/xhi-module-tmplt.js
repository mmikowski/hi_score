/*
 * xhi-module-tmplt.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Summary : cp xhi-module-tmplt.js <newfeature-file>
 * Purpose : Feature module template that embodies best practice
 * Example : cp xhi-module-tmplt.js todo.07_01_shell_compass.js
 *
*/
/*global xhi */
// == BEGIN MODULE xhi._makeTmpltFn_ ===================================
xhi._makeTmpltFn_ = function makeTmpltFn ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    // Set app symbols
    aKey     = aMap._aKey_,
    nMap     = aMap._nMap_,
    vMap     = aMap._vMap_,

    // Set object symbols
    utilObj = aMap._01_util_,
    logObj  = utilObj._getLogObj_(),

    // Set function symbols
    data2strFn = vMap._data2strFn_,
    logFn      = logObj._logMsg_,

    // Set number symbols
    __0 = nMap._0_,
    __1 = nMap._1_,

    // Set scalar symbols
    __blank  = vMap._blank_,

    // Set config and state maps
    configMap = {},
    stateMap  = {},

    // Initialize jQuery object cache
    $Map = {}

    // Declare other module-scope variables
    ;
  // == . END MODULE SCOPE VARIABLES ===================================

  // == BEGIN UTILITY METHODS ==========================================
  // == . END UTILITY METHODS ==========================================

  // == BEGIN DOM METHODS ==============================================
  // BEGIN DOM method /set$Map/
  // Summary   : set$Map( <jquery_obj> );
  // Purpose   : Set the module jQuery (xhiJQ) cache, $Map
  // Example   : set$Map( $top_box );
  // Arguments : (positional)
  //   0. $top_box - A jQuery (xhiJQ) object used to locate DOM elements.
  // Settings  : Module-scoped $Map is populated by this function.
  // Returns   : undef
  // Throws    : none
  // Technique : Merges a literal map to the module-scope $Map
  //
  function set$Map ( $top_box ) {
    utilObj._mergeMaps_( $Map, { _$top_box_ : $top_box } );
  }
  // . END DOM method /set$Map/
  // == . END DOM METHODS ==============================================

  // == BEGIN EVENT HANDLERS ===========================================
  // == . END EVENT HANDLERS ===========================================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN Public method /initModuleFn/
  function initModuleFn ( $top_box ) {
    // Initialize DOM content and set jQuery (xhiJQ) collection cache
    set$Map( $top_box );

    logFn( '_info_', $,
      '\n  __0       === ' + __0,
      '\n  __1       === ' + __1,
      '\n  __blank   === ' + __blank,
      '\n  aKey      === ' + aKey,
      '\n  $Map      === ' + data2strFn( $Map      ),
      '\n  aMap      === ' + data2strFn( aMap      ),
      '\n  configMap === ' + data2strFn( configMap ),
      '\n  stateMap  === ' + data2strFn( stateMap  )
    );
  }
  // . END Public method /initModuleFn/

  aMap._makeTmpltFn_ = { _initModuleFn_ : initModuleFn };
  // == . END PUBLIC METHODS ===========================================
};
// == . END MODULE xhi._makeTmpltFn_ ===================================


// COMMENTS-ONLY

// == BEGIN MODULE xhi._makeTmpltFn_ ===================================
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  // 'use strict';
    // Set app symbols
    // Set object symbols
    // Set function symbols
    // Set number symbols
    // Set scalar symbols
    // Set config and state maps
    // Initialize jQuery object cache
    // Declare other module-scope variables
  // == . END MODULE SCOPE VARIABLES ===================================

  // == BEGIN UTILITY METHODS ==========================================
  // == . END UTILITY METHODS ==========================================

  // == BEGIN DOM METHODS ==============================================
  // BEGIN DOM method /set$Map/
  // Summary   : set$Map( <jquery_obj> );
  // Purpose   : Set the module jQuery (xhiJQ) cache, $Map
  // Example   : set$Map( $top_box );
  // Arguments : (positional)
  //   0. $top_box - A jQuery (xhiJQ) object used to locate DOM elements.
  // Settings  : Module-scoped $Map is populated by this function.
  // Returns   : undef
  // Throws    : none
  // Technique : Merges a literal map to the module-scope $Map
  //
  // . END DOM method /set$Map/
  // == . END DOM METHODS ==============================================

  // == BEGIN EVENT HANDLERS ===========================================
  // == . END EVENT HANDLERS ===========================================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN Public method /initModuleFn/
  // . END Public method /initModuleFn/
  // == . END PUBLIC METHODS ===========================================
// == . END MODULE xhi._makeTmpltFn_ ===================================

