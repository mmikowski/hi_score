/**
 *   hi.utilb.js
 *   Utilities which require a browser and jQuery
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

    __Str     = vMap._String_,
    __blank   = vMap._blank_,
    __docRef  = vMap._docRef_,
    __false   = vMap._false_,
    __null    = vMap._null_,

    __0       = nMap._0_,
    __1       = nMap._1_,
    __10      = nMap._10_,

    topCmap = {
      regex_encode_html  : /[&"'><]/g,
      regex_encode_noamp : /["'><]/g,
      html_encode_map    : {
        '&' : '&#38;',
        '"' : '&#34;',
        "'" : '&#39;',
        '>' : '&#62;',
        '<' : '&#60;'
      },
    },
    onBufferReady
    ;

  topCmap.encode_noamp_map = $.extend({},topCmap.html_encode_map);
  delete topCmap.encode_noamp_map['&'];
  // ================== END MODULE SCOPE VARIABLES ====================

  // ===================== BEGIN UTILITY METHODS ======================
  // ====================== END UTILITY METHODS =======================

  // ===================== BEGIN PUBLIC METHODS =======================
  // BEGIN public method /decodeHtml/
  // Decodes HTML entities in a browser-friendly way
  // See http://stackoverflow.com/questions/1912501/\
  //   unescape-html-entities-in-javascript
  function decodeHtml ( str ) {
    return $('<div></div>').html(str||__blank).text();
  }
  // END public method /decodeHtml/

  // BEGIN public method /encodeHtml/
  // This is single pass encoder for html entities and handles
  // an arbitrary number of characters to encode
  function encodeHtml ( arg_str, do_exclude_amp ) {
    var
      source_str = __Str(arg_str),
      regex, lookup_map
      ;

    if ( do_exclude_amp ) {
      lookup_map = topCmap.encode_noamp_map;
      regex      = topCmap.regex_encode_noamp;
    }
    else {
      lookup_map = topCmap.html_encode_map;
      regex      = topCmap.regex_encode_html;
    }
    return source_str.replace(regex,
      function ( match /*, name */ ) { return lookup_map[match] || __blank; }
    );
  }
  // END public method /encodeHtml/

  // BEGIN public method /fillForm/
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
  }
  // END public method /fillForm/

  // BEGIN public method /fixInputByType/
  function fixInputByType ($elem) {
    var input_val = $elem.val().trim();
    if ( $elem.attr('data-type') === 'number' ) {
      input_val = parseFloat(input_val);
      if ( isNaN( input_val) ) { input_val = __null; }
    }
    else if ( $elem.attr('data-type') === 'integer' ) {
      input_val = parseInt (input_val, __10);
      if ( isNaN( input_val) ) { input_val = __null; }
    }
    else if ( $elem.attr('data-type') === 'string' ) {
      if ( input_val === __blank ) { input_val = null; }
    }
    return input_val;
  }
  // END public method /fixInputByType/

  // BEGIN public method /getFormMap/
  function getFormMap ( $elem ) {
    var form_map = {};

    $elem.find( 'input:not(:disabled):not(.hi-_x_ignore_):not(td  > input)' )
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
  }
  // END public method /getFormMap/

  // BEGIN public method /makeOptionHtml/
  function makeOptionHtml ( arg_match_str, value_list, arg_title_map ) {
    var
      html_str    = __blank,
      title_map   = arg_title_map || {},
      target_str  = __Str(arg_match_str),
      idx, match_str, title_text
      ;

    for ( idx = __0; idx < value_list[ vMap._length_ ]; idx++ ) {
      match_str      = __Str(value_list[ idx ]);
      title_text     = title_map[ match_str ]
        || hi._util_._makeUcFirst_( match_str );
      html_str   += '<option value="' + match_str + '"';
      if ( match_str === target_str ) {
        html_str += ' selected="selected"';
      }
      html_str += '>' + title_text + '</option>';
    }
    return html_str;
  }
  // END Public method /_makeOptionHtml_/

  // BEGIN Public method /_makeRadioHtml_/
  // Purpose: make a an array of checkboxes from a list
  //
  function makeRadioHtml (
    checked_value_str, // used for name="..." property for radios
    arg_value_str,     // selected value
    match_array,       // array of potential values
    arg_title_map      // hash map of labels to values
  ) {
    var
      html_str     = __blank,
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
  }
  // END public method /makeRadioHtml/

  // BEGIN public method /onBufferReady/
  // Purpose : Executes a provided function only after the browser DOM
  //           has been updated.
  //
  onBufferReady = (function () {
    var
    // 10x10px transparent png
      blankImgStr  = __blank
        + 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoA AAAKCAYAAA'
        + 'CNMs+9AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3'
        + 'RJTUUH3woIAB8ceeNmxQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUF'
        + 'eBDhcAAAAOSURBVBjTY2AYBYMTAAABmgABC6KdHwAAAABJRU5ErkJggg==',
      bodyEl
      ;

    function onBuf ( arg_fn ) {
      var img_el, s_obj;

      if ( ! bodyEl ) {
        bodyEl = __docRef[ vMap.__getElsByTagName_ ]( vMap._body_ )[__0];
        if ( ! bodyEl ) { return __false; }
      }

      img_el = new Image();
      s_obj  = img_el.style;

      s_obj[ vMap._position_ ] = 'absolute';
      s_obj[ vMap._left_     ] = '0';
      s_obj[ vMap._top_      ] = '0';
      s_obj[ vMap._width_    ] = '1px';
      s_obj[ vMap._height_   ] = '1px';

      img_el[ vMap._onload ] = function () {
        bodyEl[ vMap._removeChild_]( img_el );
        arg_fn();
      };
      bodyEl[ vMap._appendChild_ ]( img_el );
      img_el[ vMap._src_ ] = blankImgStr;
    }

    return onBuf;
  }());
  // END public method /onBufferReady/
  // ======================= END PUBLIC METHODS =======================

  return {
    _decodeHtml_     : decodeHtml,
    _encodeHtml_     : encodeHtml,
    _fillForm_       : fillForm,
    _getFormMap_     : getFormMap,
    _makeOptionHtml_ : makeOptionHtml,
    _makeRadioHtml_  : makeRadioHtml,
    _onBufferReady_  : onBufferReady
  };
}( jQuery ));
