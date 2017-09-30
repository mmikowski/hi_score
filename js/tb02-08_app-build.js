/*
 * ex01-build.js
 * Example 01 application using xhi instances instead of modules.
 * This BUILD version excludes sources.
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true, todo    : true, unparam  : true
*/
/*global $, tb02 */
$(function () {
  'use strict';
  tb02._07_shell_._initModuleFn_();
  tb02._06_lb_._showLbFn_({
    _title_html_ : 'Example 01',
    _content_html_ :
      '<p>Typebomb 2 using <strong>hi_score</strong> appears to be '
      + ' properly installed!</p>'
      + '<p>The application map (tb02) attributes are as '
      + 'follows: <br>' + Object.keys( tb02 ).join('<br>')
      + '</p><p>Drag the title bar to move this lightbox.</p>'
  });
});
