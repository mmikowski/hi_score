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
  var aMap = xhi._makeRoot_( 'ex01' );
  xhi._makeUtil_(     aMap );
  xhi._makeData_(     aMap );
  xhi._makeModel_(    aMap );
  xhi._makeUtilb_(    aMap );
  xhi._makeCssBase_(  aMap );
  xhi._makeCssLb_(    aMap );
  xhi._makeCssShell_( aMap );
  xhi._makeCss_(      aMap );
  xhi._makeLb_(       aMap );
  xhi._makeShell_(    aMap );
  aMap._shell_._initModule_( $('body') );
  aMap._lb_._showLb_({
    _title_html_ : 'Example Application',
    _content_html_ :
      '<p>The applicaiton appears to be properly installed!</p>'
      + '<p>Here are the aMap methods: <br>'
      + Object.keys( aMap ).join(', ')
      + '</p>'
      + '<p>Grab this lightbox by the title bar to drag</p>'
  });
});
