/*
 *    xhi.shell.js
 *    Shell module for xhi application
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
  white  : true,    todo : true,  unparam : true
*/
/*global jQuery, xhi */

var __ns = 'xhi', __NS;
/* istanbul ignore next */
try          { __NS = global[ __ns ]; }
catch ( e1 ) { __NS = window[ __ns ]; }

__NS._shell_ = (function ( $ ) {
  // ================= BEGIN MODULE SCOPE VARIABLES ====================
  'use strict';
  var
    vMap    = __NS._vMap_,
    nMap    = __NS._nMap_,

    __0     = nMap._0_,
    __1     = nMap._1_,
    __blank = vMap._blank_,

    __logObj = __NS._util_._getLogObj_(),
    __logMsg  = __logObj._logMsg_,

    topCmap = {
      _main_tmplt_ : '<h1>Hello world</h1>'
    },
    topSmap = {},

    $Map
    ;
  // ================== END MODULE SCOPE VARIABLES =====================
  // ======================= BEGIN DOM METHODS =========================
  // Cache jQuery collections here
  function set$Map ( $top_box ) {
    $Map = { _$top_box_ : $top_box };
  }
  // ======================== END DOM METHODS ==========================
  // ====================== BEGIN EVENT HANDLERS =======================
  // ======================= END EVENT HANDLERS ========================
  // ====================== BEGIN PUBLIC METHODS =======================
  function initModule ( $top_box ) {

    // Set styles
    //
    __NS._css_._initModule_();

    // Initial DOM content using methods above
    // and then set jQuery colection cache
    //
    $top_box[ vMap._html_ ]( topCmap._main_tmplt_ );

    set$Map( $top_box );
    __logMsg( '_info_',
      '__0 === ' + __0,
      '__1 === ' + __1,
      '__blank === ' + __blank,
      'Module config map === ', topCmap,
      'Module state  map === ', topSmap,
      '$Map:', $Map
    );

    // Bind shell event handlers (taps, drags, long-press, etc)
  }

  return { _initModule_ : initModule };
// ======================= END PUBLIC METHODS ========================
}(jQuery));
