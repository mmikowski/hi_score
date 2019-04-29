/*
 * 08_app.js
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
  // Something like this:
  //   app_map = xhi._08_app_._makeInstanceFn_({
  //     _namespace_key_ : 'xxx',
  //     _module_list_   : [
  //       [ '_00_root_', { ...root_options...} ],
  //       [ '_01_util_', { ...util_options...} ],
  //       [ '_02_data_', { ...data_options...} ],
  //       ...
  //     ]
  //   });
  //
  // })
  // TODO 2017-07-13 mmikowski warn: Include library loader here?
  //
  var app_map = xhi._00_root_._makeInstanceFn_( app_key );

  xhi._01_util_         ._makeInstanceFn_( app_map );
  xhi._02_data_         ._makeInstanceFn_( app_map );
  xhi._03_model_        ._makeInstanceFn_( app_map );
  xhi._04_utilb_        ._makeInstanceFn_( app_map );
  xhi._05_02_css_base_  ._makeInstanceFn_( app_map );
  xhi._05_03_css_lb_    ._makeInstanceFn_( app_map );
  xhi._05_04_css_shell_ ._makeInstanceFn_( app_map );
  xhi._05_css_          ._makeInstanceFn_( app_map );
  xhi._06_lb_           ._makeInstanceFn_( app_map );
  xhi._07_shell_        ._makeInstanceFn_( app_map );

  // Assign to global namespace for Node
  // try { global[ app_key ] = app_map; }
  // catch ( e ) { window[ app_key ] = app_map; }
  return app_map;
};
// == . END MODULE xhi._makeAppFn_ ====================================
