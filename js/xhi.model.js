/**
 *    xhi.model.js
 *    Root model module, placeholder.
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true, todo    : true, unparam  : true
*/
/*global $ */

var __NS;
/* istanbul ignore next */
try          { __NS = global.xhi; }
catch ( e1 ) { __NS = window.xhi; }

// == BEGIN MODULE _makeModel_ =========================================
__NS._makeModel_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    aKey    = aMap._aKey_,
    vMap    = __NS._vMap_,
    nMap    = __NS._nMap_,

    __0     = nMap._0_,
    __1     = nMap._1_,
    __blank = vMap._blank_,

    __logObj = __NS._util_._getLogObj_(),
    __logMsg  = __logObj._logMsg_,

    topCmap = {},
    topSmap = {}
    ;
  // == END MODULE SCOPE VARIABLES =====================================

  // == BEGIN UTILITY METHODS ==========================================
  // == END UTILITY METHODS ============================================

  // == BEGIN EVENT HANDLERS ===========================================
  // == END EVENT HANDLERS =============================================

  // == BEGIN PUBLIC METHODS ===========================================
  function initModule ( $top_box ) {

    // Initial DOM content using methods above
    // and then set jQuery colection cache
    //
    __logMsg( '_info_', aKey, $,
      '__0 === ' + __0,
      '__1 === ' + __1,
      '__blank === ' + __blank,
      'Module config map === ', topCmap,
      'Module state  map === ', topSmap
    );
  }

  aMap._model_ = { _initModule_ : initModule };
  // == END PUBLIC METHODS =============================================
};
// == END MODULE _makeModel_ ===========================================

