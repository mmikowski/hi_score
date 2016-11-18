/**
 *    xhi.data.js
 *    Data transmission module, placeholder
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

var __ns = 'xhi', __NS;
/* istanbul ignore next */
try          { __NS = global[ __ns ]; }
catch ( e1 ) { __NS = window[ __ns ]; }

// == BEGIN MODULE _makeData_ =========================================
__NS._makeData_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  //noinspection MagicNumberJS
  var
    aKey    = aMap._aKey_,
    vMap    = aMap._vMap_,
    nMap    = aMap._nMap_,
    __util  = aMap._util_,

    __0     = nMap._0_,
    __1     = nMap._1_,
    __blank = vMap._blank_,

    __logObj = __util._getLogObj_(),
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
  function initModule () {

    __logMsg(
      aKey, '_info_', $,
      '__0 === ' + __0,
      '__1 === ' + __1,
      '__blank === ' + __blank,
      'Module config map === ', topCmap,
      'Module state  map === ', topSmap
    );
  }

  aMap._data_ = { _initModule_ : initModule };
  // == END PUBLIC METHODS =============================================
};
// == END MODULE _makeData_ ============================================

