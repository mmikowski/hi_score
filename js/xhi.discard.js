/**
 *    xhi.discard.js - discarded utilities
 *
 *    These may come in handy again.
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
 *    These are routines I have created and updated
 *    since 1998, with inspiration from around the web.
 *    MIT License
 *
*/
/*jslint         browser : true, continue : true,
   devel : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
   white : true,    todo : true,  unparam : true
*/
/*global jQuery, xhi */

xhi._discard_ = (function ( $ ) {
  'use strict';
  // ================= BEGIN MODULE SCOPE VARIABLES ===================
  //noinspection MagicNumberJS
  var
    nMap     = xhi._nMap_,
    vMap     = xhi._vMap_,

    __blank  = vMap._blank_,
    __0      = nMap._0_,
    __1      = nMap._1_,
    __floor  = Math.floor,

    topCmap = { _popup_delay_ms_ : 200 },
    topSmap = { win_content : null }
    ;
  // ================== END MODULE SCOPE VARIABLES ====================

  // ===================== BEGIN UTILITY METHODS ======================
  // ====================== END UTILITY METHODS =======================

  // ===================== BEGIN PUBLIC METHODS =======================
  // BEGIN Public method |_makePopup_|
  // INPUT  :
  // arg_map with the following attributes:
  //   REQUIRED
  //   event      : event object, e.g. as returned from a click event
  //   height_px  : height, in pixels, for pop-up window
  //   width_px   : width, in pixels, for pop-up window
  //   s_content  : (required) html string of content
  //
  //   OPTIONAL
  //   title_text     : (default: __blank ) pop-up title
  //   do_scrollbar   : (default: false ) boolean indicating scrollbar
  //   css_lib_list   : (default: []  ary of css libs to include
  //   js_lib_list    : (default: []) ary of javascript libs to include
  //
  // PROCESS:
  //   Presents content in pop-up window
  //
  // RETURNS:
  //   win, the DOM object of the pop-up window
  //
  function makePopup ( arg_map ) {
    var
      event        = arg_map.event,
      height_px    = arg_map.height_px,
      width_px     = arg_map.width_px,
      scroll_text  = arg_map.do_scrollbar === true ? 'yes' : 'no',
      title_text   = arg_map.title_text    || __blank,
      content_html = arg_map.content_html  || __blank,
      css_lib_list = arg_map.css_lib_list  || [],
      js_lib_list  = arg_map.js_lib_list   || [],
      half_num     = nMap._d5_,

      screen_x_int
        = __floor(event.screenX - ( width_px * half_num ) + half_num ),
      screen_y_int
        = __floor(event.screenY - ( height_px * half_num ) + half_num ),
      win_props_text
        = 'height=' + height_px + ',width=' + width_px
        + ',top=' + String(screen_y_int) + ',left=' + String(screen_x_int)
        + ',wrap,scrollbars=' + scroll_text + ',resizable=yes',

      css_text = __blank,
      js_text  = __blank,

      win_content
      ;

    if ( topSmap.win_content ) {
      topSmap.win_content.close();
      topSmap.win_content = null;
    }

    // populate css libs
    /*jslint unparam: true*/
    $.each(css_lib_list, function( idx, text) {
      css_text
        += '<link rel="stylesheet" href="'
        + text + '" type="text/css"/>\n'
      ;
    });

    // populate js libs
    $.each(js_lib_list, function( idx, text) {
      js_text += '<script src="' + text+ '"></script>\n';
    });
    /*jslint unparam: false*/

    win_content = window.open(__blank,__blank,win_props_text);

    function populate_html ( content_html ) {
      win_content.document.write(
        '<html>'
        + '<head>'
        + '<title>' + title_text + '</title>'
        + '<meta http-equiv="X-UA-Compatible" content="IE=8"/>'
        + css_text
        + js_text
        + '<style>'
        + 'body { padding: 12px; }'
        + '</style>'
        + '</head>'
        + '<body>'
        + content_html
        + '<div style="text-align: right">'
        + '<input type="button" value=" Close " onclick="self.close();"/>'
        + '</div>'
        + '</body>'
        + '</html>'
      );
    }

    if ( content_html ) {
      populate_html( content_html );
    } else {
      arg_map.populate_callback_function( populate_html );
    }

    if ( ! win_content ) {
      alert(
        'You browser is blocking pop-ups. '
        + 'Please disable blocking to enable this function.'
      );
      return null;
    }

    // close write
    win_content.document.close();

    // focus this window
    win_content.window.focus();

    topSmap.win_content = win_content;

    return win_content;
  }
  // END _makePopup_

  // BEGIN Public method |_makeQueryMap_|
  // OBSOLETE  : See jquery.uriAnchor
  // Example   : query_map _makeQueryMap_( '?is_fake_data=true,config=dev' )
  //   Returns query_map = { is_fake_data : true, config : 'dev' };
  // Summary   :
  //   Given a query argument string, parses it into key-value pairs
  //   and returns a map.
  // Arguments :
  //   arg_query_str - an URI encoded query string
  // Output    :
  //   A map of query arguments
  // Throws    : none
  //
  function makeQueryMap ( arg_query_str ) {
    var
      query_str, param_list, i, list_count,
      bit_list, key, val,
      param_map = {};

    if ( ! arg_query_str ) { return {}; }

    query_str = arg_query_str[ vMap._indexOf_ ]( '?' ) === __0
      ? arg_query_str.slice( __1 )
      : arg_query_str.slice( __0 );

    param_list = query_str.split( /\&amp;|\&/ );

    list_count = param_list[ vMap._length_ ];

    BIT:
      for ( i = __0; i < list_count; i++ ) {
        bit_list = param_list[ i ].split( '=' );
        key = bit_list[ __0 ];
        val = bit_list[ __1 ];

        if ( ! key ) { continue BIT; }

        key = decodeURIComponent( key );
        if ( ! val ) {
          param_map[ key ] = true;
          continue BIT;
        }

        if ( val === 'true' ) {
          param_map[ key ] = true;
          continue BIT;
        }

        if ( val === 'false' ) {
          param_map[ key ] = false;
        }

        val = decodeURIComponent( val );
        param_map[ key ] = val;
      }

    return param_map;
  }
  // END Public method |_makeQueryMap_|

  // BEGIN Public method |_makeQueryStr_|
  // OBSOLETE  : See jquery.uriAnchor
  // Purpose   : Encodes key value pairs into a 
  //             concatenated and encoded uri string.
  //
  function makeQueryStr ( arg_param_map ) {
    var
      param_list = [],
      param_str, param_key, param_val;

    for ( param_str in arg_param_map ) {
      if ( arg_param_map.hasOwnProperty( param_str ) ) {
        param_key = encodeURIComponent( param_str );
        param_val = encodeURIComponent( arg_param_map[ param_str ] );
        param_list.push( param_key + '=' + param_val );
      }
    }
    return param_list.join('&');
  }
  // END Public method |_makeQueryStr_|

  // BEGIN Public method |_makeUrlPopup_|
  // INPUT  :
  // arg_map with the following attributes:
  //   event : (required) event object, e.g. as returned from a click event
  //   height_px  : (required) height, in pixels, for pop-up window
  //   width_px  : (required) width, in pixels, for pop-up window
  //   do_scrollbar : (default: false ) boolean indicating scrollbar
  //   target_url : (required) url of target content
  //
  // PROCESS:
  //   Presents URL in pop-up window
  //
  // RETURNS:
  //   win, the DOM object of the pop-up window
  //
  function makeUrlPopup ( arg_map ) {
    var
      event        = arg_map.event,
      height_px    = arg_map.height_px,
      width_px     = arg_map.width_px,
      scroll_text  = arg_map.do_scrollbar ? 'yes' : 'no',
      target_url   = arg_map.target_url,
      half_num     = nMap._d5_,

      screen_x_int
        = __floor(event.screenX - ( width_px * half_num ) + half_num ),
      screen_y_int
        = __floor(event.screenY - ( height_px * half_num ) + half_num ),
      win_props_text
         = 'height=' + height_px + ',width=' + width_px
         + ',top=' + String(screen_y_int) + ',left=' + String(screen_x_int)
         + ',wrap,scrollbars=' + scroll_text + ',resizable=yes',
      win
      ;

    if ( window.top.butil_win_url ) {
      window.top.butil_win_url.close();
      setTimeout( function () {
        win = window.open(target_url,'butil_win_url',win_props_text);
      }, topCmap._popup_delay_ms_ );
    }
    else {
      win = window.open(target_url,'butil_win_url',win_props_text);
      if ( ! win ) { win = window.open(target_url,'_blank'); }
    }
    if ( ! win ) {
      alert(
        'You browser is blocking pop-ups. '
        + 'Please disable blocking to enable this function.'
      );
      return null;
    }
    win.focus();
    return win;
  }
  // END Public method |_makeUrlPopup_|

  // BEGIN Public method |_openWindow_|
  function openWindow ( url_str ) {
    var win = window.open( url_str, '_blank' );
    win.focus();
    return false;
  }
  // END Public method |_openWindow_|
  // ======================= END PUBLIC METHODS =======================

  return {
    _makePopup_      : makePopup,
    _makeQueryMap_   : makeQueryMap,
    _makeQueryStr_   : makeQueryStr,
    _makeUrlPopup_   : makeUrlPopup,
    _openWindow_     : openWindow
  };
}( jQuery ));
