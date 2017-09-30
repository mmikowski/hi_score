/*
 * xhi-module-tmplt.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Summary : cp xhi-module-tmplt.js <newfeature-file>
 * Purpose : Feature module template that embodies best practice
 * Example : cp xhi-module-tmplt.js 07.compass.js
 *
*/
/*global xhi */

// == BEGIN MODULE xhi._makeTmpltFn_ ===================================
xhi._makeTmpltFn_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    aKey     = aMap._aKey_,
    vMap     = aMap._vMap_,
    nMap     = aMap._nMap_,

    __data2strFn = vMap._data2strFn_,

    __0      = nMap._0_,
    __1      = nMap._1_,
    __blank  = vMap._blank_,

    __util   = aMap._01_util_,
    __logObj = __util._getLogObj_(),
    __logMsg = __logObj._logMsg_,

    $Map      = {},
    configMap = {},
    stateMap  = {}
    ;
  // == . END MODULE SCOPE VARIABLES ===================================

  // == BEGIN UTILITY METHODS ==========================================
  // == . END UTILITY METHODS ==========================================

  // == BEGIN DOM METHODS ==============================================
  // BEGIN DOM method /set$Map/
  // Summary   : set$Map( <jquery_obj> );
  // Purpose   : Set the module jQuery cache, $Map
  // Example   : set$Map( $top_box );
  // Arguments : (positional)
  //   0. $top_box - A jQuery object used to locate DOM elements.
  // Settings  : Module-scoped $Map is populated by this function.
  // Returns   : undef
  // Throws    : none
  // Technique : Merges a literal map to the module-scope $Map
  //
  function set$Map ( $top_box ) {
    __util._mergeMaps_( $Map, { _$top_box_ : $top_box } );
  }
  // . END DOM method /set$Map/
  // == . END DOM METHODS ==============================================

  // == BEGIN EVENT HANDLERS ===========================================
  // == . END EVENT HANDLERS ===========================================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN Public method /initModuleFn/
  function initModuleFn ( $top_box ) {
    // Initialize DOM content and set jQuery collection cache
    set$Map( $top_box );

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
  }
  // . END Public method /initModuleFn/

  aMap._makeTmpltFn_ = { _initModuleFn_ : initModuleFn };
  // == . END PUBLIC METHODS ===========================================
};
// == . END MODULE xhi._makeTmpltFn_ ===================================

