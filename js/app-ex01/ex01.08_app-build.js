/*
 * ex01-build.js
 * Example 01 application using xhi instances instead of modules.
 * This BUILD version excludes sources.
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*global xhiJQ, xhi:true, ex01 */
xhiJQ(function () {
  'use strict';
  var app_map = xhi._makeAppFn_( 'ex01' );
  ex01._07_shell_._initModuleFn_( xhiJQ('body') );
  ex01._06_lb_._showLbFn_({
    _title_html_ : 'Example 01',
    _content_html_ :
      '<p><strong>hi_score</strong> appears to be properly installed!</p>'
      + '<p>The hi_score application map (app_map) attributes are as '
      + 'follows: <br>' + Object.keys( app_map ).join('<br>')
      + '</p><p>Drag the title bar to move this lightbox.</p>'
  });
});
