/*
 * 08.app.js
 *
 * Use: xhi._makeApp_( '<namespace>' );
 * Synopsis: Assembles an application in the provided namespace
 * Provides: app_map which has the global name '<namespace>'
 *
 * JSLint settings found in cfg/jslint.conf
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint browser : true */
/*global $, xhi */
xhi._makeApp_ = function ( app_key ) {
  'use strict';

  // TODO 2017-02-27 mikem warn: Provide configuration options.
  // Calling routine should  be able to list modules or select
  // a pre-defined group that does not include everything.
  //
  // TODO 2017-07-13 mikem warn: Include library loader here?
  //
  var app_map = xhi._makeRoot_( app_key );
  xhi._makeUtil_(     app_map );
  xhi._makeData_(     app_map );
  xhi._makeModel_(    app_map );
  xhi._makeUtilb_(    app_map );
  xhi._makeCssBase_(  app_map );
  xhi._makeCssLb_(    app_map );
  xhi._makeCssShell_( app_map );
  xhi._makeCss_(      app_map );
  xhi._makeLb_(       app_map );
  xhi._makeShell_(    app_map );

  // Assign to global namespace for Node
  try { global[ app_key ] = app_map; }
  catch ( e ) { window[ app_key ] = app_map; }
  return app_map;
};
// == . END MODULE xhi._makeApp_ ======================================
