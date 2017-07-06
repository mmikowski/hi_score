/*
 * ex02-build.js
 * Example 02 application using xhi instances instead of modules.
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
/*global $, xhi:true, ex02 */

$(function () {
  'use strict';
  var app_map = xhi._makeApp_( 'ex02' );
  ex02._shell_._initModule_( $('body') );
  ex02._lb_._showLb_({
    _title_html_ : 'Example 01',
    _content_html_ :
      '<p><strong>hi_score</strong> appears to be properly installed!</p>'
      + '<p>The hi_score application map (app_map) attributes are as follows: <br>'
      + Object.keys( app_map ).join('<br>')
      + '</p>'
      + '<p>Drag the title bar to move this lightbox.</p>'
  });
});
