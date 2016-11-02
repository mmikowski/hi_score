/**
 *    xhi.fake.js
 *    Fake data for unit tests
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
   devel : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
   white : true,    todo : true,  unparam : true
*/
/*global xhi */

xhi.fake = (function () {
  // ================= BEGIN MODULE SCOPE VARIABLES ====================
  'use strict';
  //noinspection MagicNumberJS
  var
    __logObj = xhi._util_._getLogObj_(),
    __logMsg  = __logObj._logMsg_
    ;
  // ================== END MODULE SCOPE VARIABLES =====================

  // ==================== BEGIN UTILITY METHODS ========================
  // ===================== END UTILITY METHODS =========================

  // ======================= BEGIN DOM METHODS =========================
  // ======================== END DOM METHODS ==========================

  // ====================== BEGIN PUBLIC METHODS =======================
  function fetchExampleMap () {
    __logMsg( '_warn_', '_place_mock_fetch_here_' );
  }

  function configModule () {
    __logMsg( '_warn_', '_place_mock_config_here_' );
  }
  // ======================= END PUBLIC METHODS ========================
  return {
    _fetchExampleMap_ : fetchExampleMap,
    _configModule_    : configModule
  };
}());
