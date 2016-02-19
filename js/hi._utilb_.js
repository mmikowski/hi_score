/**
 *   hi.util_b.js - utilities which require a browser.
 *
 *   Michael S. Mikowski - mike.mikowski@gmail.com
 *   These are routines I have created and updated
 *   since 1998, with inspiration from around the web.
 *   MIT License
 *
*/

/*jslint         browser : true, continue : true,
   devel : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
   white : true,    todo : true,  unparam : true
*/
/*global jQuery, sprintf, hi */

hi._utilb_ = (function ( $ ) {
  'use strict';
  // ================= BEGIN MODULE SCOPE VARIABLES ===================
  //noinspection MagicNumberJS
  var
    nMap     = hi._nMap_,
    vMap     = hi._vMap_,

    __blank  = vMap._blank_,
    __0      = nMap._0_,
    __1      = nMap._1_,

    configMap = {
      regex_tmplt        : /%!%([^%]+)%!%/g,
      regex_site         : new RegExp('\/\/([^/]*)\/'),
      regex_clean1       : /^[#!]*/,
      regex_clean2       : /\?[^?]*$/,
      regex_encode_html  : /[&"'><]/g,
      regex_encode_noamp : /["'><]/g,
      html_encode_map    : {
        '&' : '&#38;',
        '"' : '&#34;',
        "'" : '&#39;',
        '>' : '&#62;',
        '<' : '&#60;'
      },
      day_ms  : 86400000,
      popup_delay_ms : 200,
      min_sec : 60,
      offset_yr : 1900,
      half_num : 0.5
    },

    stateMap = { win_content : null },
    mathFloor = Math.floor,

    decodeHtml,     encodeHtml,
    fillForm,       fixInputByType,
    getFormMap,     makeOptionHtml,

    makePopup,      makeQueryMap,  makeQueryStr,
    makeRadioHtml,  makeUrlPopup,  onBufferReady,
    openWindow,     pollFunction
    ;

  configMap.h_encode_noamp = $.extend({},configMap.html_encode_map);
  delete configMap.h_encode_noamp['&'];
  // ================== END MODULE SCOPE VARIABLES ====================

  // ===================== BEGIN UTILITY METHODS ======================
  // BEGIN public utility |_decodeHtml_|
  // Decodes HTML entities in a browser-friendly way
  // See http://stackoverflow.com/questions/1912501/\
  //   unescape-html-entities-in-javascript
  function decodeHtml ( str ) {
    return $('<div></div>').html(str||'').text();
  };
  // END public utility |_decodeHtml_|

  // BEGIN public utility |_encodeHtml_|
  // This is single pass encoder for html entities and handles
  // an arbitrary number of characters to encode
  function encodeHtml ( arg_str, do_exclude_amp ) {
    var
      source_str = String(arg_str),
      regex, lookup_map
      ;

    if ( do_exclude_amp ) {
      lookup_map = configMap.h_encode_noamp;
      regex      = configMap.regex_encode_noamp;
    }
    else {
      lookup_map = configMap.html_encode_map;
      regex      = configMap.regex_encode_html;
    }
    return source_str.replace(regex,
      function ( match /*, name */ ) { return lookup_map[match] ||  ''; }
    );
  };
  // END public utility |_encodeHtml_|

  // BEGIN public utility |_fillForm_|
  function fillForm ( $form, value_map ) {
    $.each( value_map, function ( k, v ) {
      $form.find('[name=' + k + ']').each(function() {
        var
          $input = $( this ),
          current_str = $input.val()
          ;

        if ( $input.is( 'input:radio' ) ) {
          $input.attr( 'checked', ( current_str === v ) && 'checked' );
        }
        else if ( $input.is( 'input:checkbox' ) ) {
          $input.attr( 'checked', !! v );
        }
        else {
          $input.val( v );
        }
      });
    });
  };
  // END public utility |_fillForm_|

  // BEGIN public utility |_fixInputByType_|
  function fixInputByType ($elem) {
    var input_val = $elem.val().trim();
    if ( $elem.attr('data-type') === 'number' ) {
      input_val = parseFloat(input_val);
      if ( isNaN( input_val) ) { input_val = null; }
    }
    else if ( $elem.attr('data-type') === 'integer' ) {
      input_val = parseInt (input_val, 10);
      if ( isNaN( input_val) ) { input_val = null; }
    }
    else if ( $elem.attr('data-type') === 'string' ) {
      if ( input_val === '' ) { input_val = null; }
    }
    return input_val;
  };
  // END public utility |_fixInputByType_|


  // BEGIN public utility |_getFormMap_|
  function getFormMap ( $elem ) {
    var form_map = {};

    $elem.find( 'input:not(:disabled):not(.ao-_x_ignore_):not(td  > input)' )
      .each( function() {
        var $input = $( this ), input_val;
        if ( ! this.name ) { return; }

        if ( $input.is( 'input:checkbox' ) ) {
          form_map[ this.name ] = $input.is(':checked');
        }
        else if ( !  $input.is('input:radio') || $input.is(':checked') ) {
          input_val = fixInputByType( $input );
          form_map[ this.name ] = input_val;
        }
      });

    // TODO This selector can probably be combined with the previous one
    //
    $elem.find( 'select:not(td > select), textarea:not(td > textarea)' )
      .each( function() {
        var $input = $( this ), input_val;
        input_val = fixInputByType( $input );
        form_map[ this.name ] = input_val;
      }
    );

    // process array properties
    // For each table, get all the trs in tbody.  For each tr, if there's only
    // 1 column, push the value into the array.  Else, build an object that
    // represents each row and push the object into the array.
    $elem.find( 'table' ).each( function() {
      var table = $( this ), table_name = table.attr('data-name');
      form_map[ table_name ] = [];
      table.find( 'tbody tr' ).each( function() {
        var row_obj, $input, input_str,
          $input_list = $( this ).find( 'input, textarea, select' )
          ;
        if( $input_list[ vMap._length_ ] === __1 ) {
          $input = $( $input_list[ __0 ] );

          if ( $input.is( 'input:checkbox' ) ) {
            row_obj = $input.is( ':checked' );
          }
          else if ( ! $input.is( 'input:radio' ) || $input.is( ':checked' ) ) {
            row_obj = fixInputByType( $input );
          }
        }
        else {
          row_obj = {};
          $input_list.each( function () {
            $input = $( this );
            if ( ! this.name ) { return; }

            if ( $input.is( 'input:checkbox' ) ) {
              row_obj[ this.name ] = { value: $input.is( ':checked' ) };
            }
            else if ( !  $input.is('input:radio') || $input.is( ':checked' ) ) {
              input_str = fixInputByType( $input );
              row_obj[ this.name ] = { value: input_str };
            }
          });
        }
        form_map[ table_name ].push(row_obj);
      });
    });

    return form_map;
  };
  // END public utility |_getFormMap_|

  // BEGIN public utility |_makeOptionHtml_|
  function makeOptionHtml ( arg_match_str, value_list, arg_title_map ) {
    var
      html_str = '',
      title_map   = arg_title_map || {},
      target_str  = String(arg_match_str),
      idx, match_str, title_text
      ;

    for ( idx = __0; idx < value_list[ vMap._length_ ]; idx++ ) {
      match_str   = String(value_list[ idx ]);
      title_text     = title_map[ match_str ]
        || hi._util_._makeUcFirst_( match_str );
      html_str   += '<option value="' + match_str + '"';
      if ( match_str === target_str ) {
        html_str += ' selected="selected"';
      }
      html_str += '>' + title_text + '</option>';
    }
    return html_str;
  };
  // END public utility |_makeOptionHtml_|

  // BEGIN public utility |_makePopup_|
  // INPUT  :
  // arg_map with the following attributes:
  //   REQUIRED
  //   event      : event object, e.g. as returned from a click event
  //   height_px  : height, in pixels, for pop-up window
  //   width_px   : width, in pixels, for pop-up window
  //   s_content  : (required) html string of content
  //
  //   OPTIONAL
  //   title_text     : (default: '') pop-up title
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
      title_text   = arg_map.title_text    || '',
      content_html = arg_map.content_html  || '',
      css_lib_list = arg_map.css_lib_list  || [],
      js_lib_list  = arg_map.js_lib_list   || [],
      half_num     = configMap.half_num,

      screen_x_int
        = mathFloor(event.screenX - ( width_px * half_num ) + half_num ),
      screen_y_int
        = mathFloor(event.screenY - ( height_px * half_num ) + half_num ),
      win_props_text
        = 'height=' + height_px + ',width=' + width_px
        + ',top=' + String(screen_y_int) + ',left=' + String(screen_x_int)
        + ',wrap,scrollbars=' + scroll_text + ',resizable=yes',

      css_text = '',
      js_text  = '',

      win_content, populate_html
      ;

    if ( stateMap.win_content ) {
      stateMap.win_content.close();
      stateMap.win_content = null;
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

    win_content = window.open('','',win_props_text);

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
    };

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

    stateMap.win_content = win_content;

    return win_content;
  };
  // END _makePopup_

  // BEGIN public utility |_makeQueryMap_|
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
  };
  // END public utility |_makeQueryMap_|

  // BEGIN public utility |_makeQueryStr_|
  //
  // Purpose: Encodes key value pairs into a concatenated and encoded uri string
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
  };
  // END public utility |_makeQueryStr_|

  // BEGIN public utility |_makeRadioHtml_|
  // Purpose: make a an array of checkboxes from a list
  //
  function makeRadioHtml (
    checked_value_str, // used for name="..." property for radios
    arg_value_str,     // selected value
    match_array,       // array of potential values
    arg_title_map      // hash map of labels to values
  ) {
    var
      html_str     = '',
      title_map    = arg_title_map || {},
      idx, match_str, title_text
      ;
    for ( idx = __0; idx < match_array[ vMap._length_ ]; idx++ ) {
      match_str   = match_array[ idx ];
      title_text     = title_map[ match_str ]
        || hi._util_._makeUcFirst_( match_str );
      html_str
        +='<label>'
          + '<input type="radio" name="'
            + checked_value_str
          + '" value="' + match_str + '"'
          ;
       if ( match_str === arg_value_str ) {
        html_str += ' checked="checked"';
       }
       html_str += '/>' + title_text + '</label>';
    }
    return html_str;
  };
  // END public utility |_makeRadioHtml_|

  // BEGIN public utility |_makeUrlPopup_|
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
      half_num     = configMap.half_num,

      screen_x_int
        = mathFloor(event.screenX - ( width_px * half_num ) + half_num ),
      screen_y_int
        = mathFloor(event.screenY - ( height_px * half_num ) + half_num ),
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
      }, configMap.popup_delay_ms );
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
  };
  // END public utility |_makeUrlPopup_|

  // BEGIN public utility |_onBufferReady_|
  onBufferReady = (function () {
    var
    // 10x10px transparent png
      blankImgStr  = __blank
        + 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoA AAAKCAYAAA'
        + 'CNMs+9AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3'
        + 'RJTUUH3woIAB8ceeNmxQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBD'
        + 'hcAAAAOSURBVBjTY2AYBYMTAAABmgABC6KdHwAAAABJRU5ErkJggg==',
      bodyEl, onBuf;


    function onBuf ( arg_fn ) {
      var img_el, s_obj;


      if ( ! bodyEl ) {
        bodyEl = document.getElementsByTagName( 'body' )[__0];
        if ( !bodyEl ) { return false; }
      }

      img_el         = new Image();
      s_obj          = img_el.style;
      s_obj.width    = '1px';
      s_obj.height   = '1px';
      s_obj.position = 'absolute';
      s_obj.left     = '0';
      s_obj.top      = '0';

      img_el.onload = function () {
        bodyEl.removeChild( img_el );
        arg_fn();
      };
      bodyEl.appendChild( img_el );
      img_el.src = blankImgStr;
    };

    return onBuf;
  }());
  // END public utility |_onBufferReady_|

  // BEGIN public utility |_openWindow_|
  function openWindow ( url_str ) {
    var win = window.open( url_str, '_blank' );
    win.focus();
    return false;
  };
  // END public utility |_openWindow_|


  // BEGIN public utility |_pollFunction_|
  // Purpose: Run the <arg_fn> function every <arg_ms> milliseconds
  //   either <arg_count> number of times or until the function
  //   returns false, whichever comes first.
  // Arguments
  //   arg_fn    : function to poll, return false to stop polling
  //   arg_ms    : time between function invocation
  //   arg_count : (optional) Maximum number of times to run the function.
  //
  //
  function pollFunction ( arg_fn, arg_ms, arg_count ) {
    var count, set_time_fn;

    count = arg_count || null;

    function set_time_fn () {
      setTimeout(function() {
        var continue_poll = arg_fn();
        if ( continue_poll === false ) { return; }
        if ( count === null ) {
          set_time_fn();
          return;
        }
        if ( count > __0 ) {
          count -= __1;
          set_time_fn();
        }
      }, arg_ms );
    };
    set_time_fn();
  };
  // ====================== END UTILITY METHODS =======================

  return {
    _decodeHtml_     : decodeHtml,
    _encodeHtml_     : encodeHtml,
    _fillForm_       : fillForm,
    _getFormMap_     : getFormMap,
    _makeOptionHtml_ : makeOptionHtml,
    _makePopup_      : makePopup,
    _makeQueryMap_   : makeQueryMap,
    _makeQueryStr_   : makeQueryStr,
    _makeRadioHtml_  : makeRadioHtml,
    _makeUrlPopup_   : makeUrlPopup,
    _onBufferReady_  : onBufferReady,
    _openWindow_     : openWindow,
    _pollFunction_   : pollFunction
  };
}( jQuery ));
