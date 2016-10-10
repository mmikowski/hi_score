/**
 *    xhi.utilb.js
 *    Utilities which require a browser and jQuery
 *    Michael S. Mikowski - mike.mikowski@gmail.com
 *
 *    These are routines I have created and updated
 *    since 1998, with inspiration from around the web.
 *    MIT License
*/
/*jslint         browser : true, continue : true,
   devel : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
   white : true,    todo : true,  unparam : true
*/
/*global jQuery, pcss, xhi */

xhi._utilb_ = (function ( $ ) {
  'use strict';
  // ================= BEGIN MODULE SCOPE VARIABLES ===================
  var
    nMap     = xhi._nMap_,
    vMap     = xhi._vMap_,
    cssKmap  = pcss._cfg_._cssKeyMap_,
    cssVmap  = pcss._cfg_._cssValMap_,

    __Str     = vMap._String_,
    __blank   = vMap._blank_,
    __docRef  = document,
    __false   = vMap._false_,
    __null    = vMap._null_,

    __0       = nMap._0_,
    __1       = nMap._1_,
    __10      = nMap._10_,

    __util = xhi._util_,
    // Add if needed from util: __getObjType
    // __getBool     = __util._getBool_,
    // __getFn       = __util._getFn_,
    // __getInt      = __util._getInt_,
    // __getNum      = __util._getNum_,
    // __getVarType  = __util._getVarType_,
    __getList     = __util._getList_,
    __getMap      = __util._getMap_,
    __getStr      = __util._getStr_,

    // topCmap = {
    //   _cookie_rx_tmplt_ : '\\s*{_attr_key_}\\s*=\\s*([^;]+)[;]*',
    // },
    onBufferReady
    ;

  // ================== END MODULE SCOPE VARIABLES ====================

  // ===================== BEGIN UTILITY METHODS ======================
  // ====================== END UTILITY METHODS =======================

  // ===================== BEGIN PUBLIC METHODS =======================
  // BEGIN Public method /decodeHtml/
  // Decodes HTML entities in a browser-friendly way
  // See http://stackoverflow.com/questions/1912501/\
  //   unescape-html-entities-in-javascript
  function decodeHtml ( str ) {
    return $('<div></div>').html(str||__blank).text();
  }
  // END Public method /decodeHtml/

  // BEGIN Public method /fillForm/
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
  // END Public method /fillForm/

  // BEGIN Public method /fixInputByType/
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
  // END Public method /fixInputByType/

  // BEGIN Public method /getFormMap/
  function getFormMap ( $elem ) {
    var form_map = {};

    $elem.find( 'input:not(:disabled):not(.xhi-_x_ignore_):not(td  > input)' )
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

    // Process array properties
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
  // END Public method /getFormMap/

  // BEGIN Public method /makeOptionHtml/
  function makeOptionHtml ( arg_map ) {
    // arg_match_str, value_list, arg_title_map ) {
    var
      select_str  = __getStr(  arg_map._select_str_, __blank ),
      title_map   = __getMap(  arg_map._title_map_,       {} ),
      value_list  = __getList( arg_map._value_list_,         [] ),
      html_str    = __blank,

      idx, value_str, title_text
      ;

    for ( idx = __0; idx < value_list[ vMap._length_ ]; idx++ ) {
      value_str  = __Str( value_list[ idx ] );
      title_text = title_map[ value_str ]
        || xhi._util_._makeUcFirstStr_( value_str );
      html_str   += '<option value="' + value_str + '"';
      if ( value_str === select_str ) {
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
        || xhi._util_._makeUcFirstStr_( match_str );
      html_str
        += '<label>'
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
  // END Public method /makeRadioHtml/

  // BEGIN Public method /onBufferReady/
  // Purpose : Executes a provided function only after the browser DOM
  //           has been updated.
  //
  onBufferReady = (function () {
    var
    // 10x10px transparent png
      blankImgStr  = __blank
        + 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAA'
        + 'CNMs+9AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3'
        + 'RJTUUH3woIAB8ceeNmxQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUF'
        + 'eBDhcAAAAOSURBVBjTY2AYBYMTAAABmgABC6KdHwAAAABJRU5ErkJggg==',
      bodyEl
      ;

    function onBuf ( arg_fn ) {
      var img_el, s_obj;

      if ( ! bodyEl ) {
        bodyEl = __docRef[ vMap._getElsByTagName_ ]( vMap._body_ )[__0];
        if ( ! bodyEl ) { return __false; }
      }

      img_el = new Image();
      s_obj  = img_el.style;

      s_obj[ cssKmap._position_ ] = cssVmap._absolute_;
      s_obj[ cssKmap._left_     ] = cssVmap._0_;
      s_obj[ cssKmap._top_      ] = cssVmap._0_;
      s_obj[ cssKmap._width_    ] = '1px';
      s_obj[ cssKmap._height_   ] = '1px';

      img_el[ vMap._onload_ ] = function () {
        bodyEl[ vMap._removeChild_]( img_el );
        arg_fn();
      };
      bodyEl[ vMap._appendChild_ ]( img_el );
      img_el[ vMap._src_ ] = blankImgStr;
    }

    return onBuf;
  }());
  // END Public method /onBufferReady/

  // BEGIN Public method /resizeTextarea/
  // Example:
  //   $foo.on( 'keyup', function () { resizeTextarea( this, 25 ); } );
  //
  function resizeTextarea ( $textarea, arg_max_ht_px ) {
    var
      max_ht_px     = arg_max_ht_px || 400,
      scroll_ht_px  = $textarea[ vMap._prop_ ]( vMap._scrollHeight_ ),
      outer_ht_px   = $textarea[ vMap._outerHeight_](),
      solve_ht_px
      ;

    if ( ( scroll_ht_px > outer_ht_px )
      || ( scroll_ht_px < outer_ht_px - 30 )
    ) { solve_ht_px = scroll_ht_px + 8; }
    else { return; }

    if ( solve_ht_px > max_ht_px ) { solve_ht_px = max_ht_px; }
    if ( solve_ht_px < 30 ) { solve_ht_px = 30; }

    $textarea[ vMap._css_ ]( cssKmap._height_, solve_ht_px );
  }
  // END Public method /resizeTextarea/


  return {
    _decodeHtml_     : decodeHtml,
    _fillForm_       : fillForm,
    _getFormMap_     : getFormMap,
    _makeOptionHtml_ : makeOptionHtml,
    _makeRadioHtml_  : makeRadioHtml,
    _onBufferReady_  : onBufferReady,
    _resizeTextarea_ : resizeTextarea
  };
  // ======================= END PUBLIC METHODS =======================
}( jQuery ));
