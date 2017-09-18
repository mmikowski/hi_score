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

// == BEGIN MODULE xhi._makeTmplt_ =====================================
xhi._makeTmplt_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    aKey     = aMap._aKey_,
    vMap     = aMap._vMap_,
    nMap     = aMap._nMap_,
    __util   = aMap._util_,

    __j2str = vMap._JSON_[ vMap._stringify_ ],

    __0      = nMap._0_,
    __1      = nMap._1_,
    __blank  = vMap._blank_,

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
  // Method    : Merges a literal map to the module-scope $Map
  //
  function set$Map ( $top_box ) {
    __util._mergeMaps_( $Map, { _$top_box_ : $top_box } );
  }
  // . END DOM method /set$Map/
  // == . END DOM METHODS ==============================================

  // == BEGIN EVENT HANDLERS ===========================================
  // == . END EVENT HANDLERS ===========================================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN Public method /initModule/
  function initModule ( $top_box ) {
    // Initialize DOM content and set jQuery collection cache
    set$Map( $top_box );

    __logMsg( '_info_', $,
      '\n  __0       === ' + __0,
      '\n  __1       === ' + __1,
      '\n  __blank   === ' + __blank,
      '\n  aKey      === ' +   aKey,
      '\n  $Map      === ' + __j2str( $Map      ),
      '\n  aMap      === ' + __j2str( aMap      ),
      '\n  configMap === ' + __j2str( configMap ),
      '\n  stateMap  === ' + __j2str( stateMap  )
    );
  }
  // . END Public method /initModule/

  aMap._makeTmplt_ = { _initModule_ : initModule };
  // == . END PUBLIC METHODS ===========================================
};
// == . END MODULE xhi._makeTmplt_ =====================================

