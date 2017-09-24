/*
 * 08.app.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use: xhi._makeApp_( '<namespace>' );
 * Synopsis: Assembles an application in the provided namespace
 * Provides: app_map which has the global name '<namespace>'
 *
*/
/* global xhi */

// == BEGIN MODULE xhi._makeAppFn_ ====================================
xhi._makeAppFn_ = function ( app_key ) {
  'use strict';

  // TODO 2017-02-27 mmikowski warn: Provide configuration options.
  // Calling routine should be able to list modules or select
  // a pre-defined group that does not include everything.
  // Example concept:
  // For the call: app_map = xhi._makeAppFn_('tb02',['util','data','model']);
  // We first list all module functions:
  //   module_list = [ [ 'util', '_makeUtilFn_' ], [ 'data', '_makeDataFn_' ] ]
  // When the call is recieved we loop through module_list and if
  //   arg_module_list includes the key, we invoke that module.
  //   e.g. xhi[ solve_key ]( app_map );
  // Notice we probably should provide more options for each makeModule
  //   option. Something like this:
  // app_map = xhi._makeAppFn_( 'tb02', [
  //   [ 'util', { ...util options...} ],
  //   [ 'data', { ...data options...} ],
  //   ...
  // ]
  // TODO 2017-07-13 mmikowski warn: Include library loader here?
  //
  var app_map = xhi._makeRootFn_( app_key );
  xhi._makeUtilFn_(     app_map );
  xhi._makeDataFn_(     app_map );
  xhi._makeModelFn_(    app_map );
  xhi._makeUtilbFn_(    app_map );
  xhi._makeCssBaseFn_(  app_map );
  xhi._makeCssLbFn_(    app_map );
  xhi._makeCssShellFn_( app_map );
  xhi._makeCssFn_(      app_map );
  xhi._makeLbFn_(       app_map );
  xhi._makeShellFn_(    app_map );

  // Assign to global namespace for Node
  try { global[ app_key ] = app_map; }
  catch ( e ) { window[ app_key ] = app_map; }
  return app_map;
};
// == . END MODULE xhi._makeAppFn_ ====================================
