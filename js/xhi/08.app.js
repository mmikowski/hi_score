/*
 * 08.app.js
 *
 * Use: xhi._makeApp_( '<namespace>' );
 * Synopsis: Assembles an application in the provided namespace
 * Provides: app_map which has the global name '<namespace>'
 *
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true, todo    : true, unparam  : true
*/
/*global */

var __global, __NS;

/* istanbul ignore next */
try          { __global = global; }
catch ( e1 ) { __global = window; }

__NS = __global.xhi;

__NS._makeApp_ = function ( app_key ) {
  'use strict';

  // TODO 2017-02-27 mikem warn: provide user capability to define
  // desired modules through manual listing or pre-defined groups.
  //
  var app_map = __NS._makeRoot_( app_key );
  __NS._makeUtil_(     app_map );
  __NS._makeData_(     app_map );
  __NS._makeModel_(    app_map );
  __NS._makeUtilb_(    app_map );
  __NS._makeCssBase_(  app_map );
  __NS._makeCssLb_(    app_map );
  __NS._makeCssShell_( app_map );
  __NS._makeCss_(      app_map );
  __NS._makeLb_(       app_map );
  __NS._makeShell_(    app_map );

  // Assign to global namespace in Node or Browser
  __global[ app_key ] = app_map;
  return app_map;
};
// == . END MODULE __NS._makeApp_ ======================================
