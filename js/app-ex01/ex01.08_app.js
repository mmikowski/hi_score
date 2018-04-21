/**
 * ex01.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Example 01 application using xhi instances instead of modules.
 *
*/
/*global $, xhi:true, ex01 */
(function () {
  'use strict';
  var
    libList = [
      'js/vendor/taffy-2.7.3.js',
      'js/vendor/pcss-1.4.5.js',
      'js/vendor/pcss.cfg-1.4.5.js',
      'js/vendor/jquery-3.3.1.js',
      'js/plugin/jquery.deferred.whenAll-1.0.0.js',
      'js/vendor/jquery.event.dragscroll-1.0.0.js',
      'js/vendor/jquery.event.gevent-1.1.6.js',
      'js/vendor/jquery.event.ue-1.3.2.js',
      'js/vendor/jquery.scrolli-1.0.1.js',
      'js/vendor/jquery.urianchor-1.3.5.js',
      'js/xhi/00_root.js',
      'js/xhi/01_util.js',
      'js/xhi/02_data.js',
      'js/xhi/02_fake.js',
      'js/xhi/03_model.js',
      'js/xhi/04_utilb.js',
      'js/xhi/05_css_base.js',
      'js/xhi/05_css_lb.js',
      'js/xhi/05_css_shell.js',
      'js/xhi/06_css.js',
      'js/xhi/06_lb.js',
      'js/xhi/07_shell.js',
      'js/xhi/08_app.js'
    ],
    libCount    = libList.length,
    loadCount   = 0,
    loadDelayMs = 100,

    $, scriptObj, libIdx, libSrcStr;

  function main () {
    var app_map = xhi._makeAppFn_( 'ex01' );
    ex01._07_shell_._initModuleFn_( $('body') );
    ex01._06_lb_._showLbFn_({
      _title_html_ : 'Example 01',
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
