/*
 * ex02.js
 * Example 02 application using xhi instances instead of modules.
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true, todo    : true, unparam  : true
*/
/*global $, xhi:true, ex02 */
(function () {
  'use strict';
  var
    libList = [
      'js/vendor/taffy-2.7.3.js',
      'js/vendor/jquery-3.2.1.js',
      'js/vendor/pcss-1.4.2.js',
      'js/vendor/pcss.cfg-1.4.2.js',
      'js/plugin/jquery.deferred.whenAll-1.0.0.js',
      'js/vendor/jquery.event.dragscroll-1.0.0.js',
      'js/vendor/jquery.event.gevent-1.1.6.js',
      'js/vendor/jquery.event.ue-1.3.2.js',
      'js/vendor/jquery.scrolli-1.0.1.js',
      'js/vendor/jquery.urianchor-1.3.5.js',
      'js/xhi/00.js',
      'js/xhi/01.util.js',
      'js/xhi/02.data.js',
      'js/xhi/02.fake.js',
      'js/xhi/03.model.js',
      'js/xhi/04.utilb.js',
      'js/xhi/05.css_base.js',
      'js/xhi/05.css_lb.js',
      'js/xhi/05.css_shell.js',
      'js/xhi/06.css.js',
      'js/xhi/06.lb.js',
      'js/xhi/07.shell.js',
      'js/xhi/08.app.js'
    ],
    libCount  = libList.length,
    loadCount = 0,
    loadDelayMs = 100,

    $, scriptObj, libIdx, libSrcStr;

  function main () {
    var app_map = xhi._makeApp_( 'ex02' );
    ex02._shell_._initModule_( $('body') );
    ex02._lb_._showLb_({
      _title_html_ : 'Example 02',
      _content_html_ :
        '<p><strong>hi_score</strong> appears to be properly installed!</p>'
      + '<p>The hi_score application map (app_map) attributes are as '
      + 'follows: <br>' + Object.keys( app_map ).join('<br>')
      + '</p><p>Drag the title bar to move this lightbox.</p>'
    });
  }

  function testLoad() {
    if ( window.$ ) {
      $ = window.$;
      $( main );
    }
    else {
      console.warn( 'reload...' );
      setTimeout( testLoad, loadDelayMs );
      loadDelayMs *= 1.5;
    }
  }

  function onLoadInc() {
    loadCount++;
    if ( loadCount === libCount ) { testLoad(); }
  }

  for ( libIdx = 0; libIdx < libCount; libIdx++ ) {
    libSrcStr = libList[ libIdx ];
    scriptObj        = document.createElement( 'script' );
    scriptObj.type   = 'text/javascript';
    scriptObj.async  = false;
    scriptObj.src    = libSrcStr;
    scriptObj.onload = onLoadInc;
    document.head.appendChild( scriptObj );
  }
}());
