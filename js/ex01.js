/**
 *    ex01.js
 *    Example 01 applicaton using xhi instances instead of modules.
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true, todo    : true, unparam  : true
*/
/*global $, xhi:true, ex01 */
$(function () {
  'use strict';
  var aMap = xhi._makeApp_( 'ex01' );
  aMap._shell_._initModule_( $('body') );
  aMap._lb_._showLb_({
    _title_html_ : 'Example 01',
    _content_html_ :
      '<p><strong>hi_score</strong> appears to be properly installed!</p>'
      + '<p>The hi_score application map (aMap) attributes are as follows: <br>'
      + Object.keys( aMap ).join('<br>')
      + '</p>'
      + '<p>Drag the title bar to move this lightbox.</p>'
  });
});
