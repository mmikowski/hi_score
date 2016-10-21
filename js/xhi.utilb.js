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

var __ns = 'xhi', __NS;
/* istanbul ignore next */
try { __NS = window[ __ns ]; }
catch ( error ) { __NS = global[ __ns ]; }

__NS._utilb_ = (function ( $ ) {
  'use strict';
  // ================= BEGIN MODULE SCOPE VARIABLES ===================
  var
    nMap     = __NS._nMap_,
    vMap     = __NS._vMap_,
    cssKmap  = pcss._cfg_._cssKeyMap_,
    cssVmap  = pcss._cfg_._cssValMap_,

    __blank  = vMap._blank_,
    __docRef = vMap._document_,
    __false  = vMap._false_,
    __true   = vMap._true_,

    __0      = nMap._0_,
    __1      = nMap._1_,

    __util   = __NS._util_,

    // Add as needed __castBool, __castList, __castObj,  __getVarType
    __castJQ   = __util._castJQ_,
    __castFn   = __util._castFn_,
    __castInt  = __util._castInt_,
    __castNum  = __util._castNum_,
    __castMap  = __util._castMap_,
    __castStr  = __util._castStr_,

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
  function decodeHtml ( arg_str ) {
    var str = __castStr( arg_str, __blank );
    return $('<div></div>').html(str||__blank).text();
  }
  // END Public method /decodeHtml/

  // BEGIN Public method /fillForm/
  function fillForm ( arg_$form, arg_map ) {
    var
      lookup_map = __castMap( arg_map, {} ),
      $form      = __castJQ( arg_$form )
      ;

    if ( ! $form ) { return; }
    $.each( lookup_map, function ( k, v ) {
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
  function fixInputByType ( arg_$input ) {
    var
      $elem     = __castJQ( arg_$input ),
      input_str, data_type, solve_data
      ;

    if ( ! $elem ) { return; }

    input_str = $elem[ vMap._val_ ][ vMap._trim_ ]();
    data_type = $elem[ vMap._attr_ ]( 'data-type' );

    switch ( data_type ) {
      case 'number':
        solve_data = __castNum( input_str, __0 );
        break;
      case 'integer':
        solve_data = __castInt( input_str, __0 );
        break;
      default:
        solve_data = __castStr( input_str, __blank );
        break;
    }
    return solve_data;
  }
  // END Public method /fixInputByType/

  // BEGIN Public method /getFormMap/
  function getFormMap ( arg_$form ) {
    var
      $form    = __castJQ( arg_$form ),
      form_map = {};

    if ( ! $form ) { return; }

    $form
      .find( 'input:not(:disabled):not(.' + __ns
        + '-_x_ignore_):not(td  > input)' )
      .each( function () {
        var
          $input     = $( this ),
          field_name = $input[ vMap._attr_ ]( 'name' )
          ;

        if ( ! field_name ) { return; }
        if ( $input.is( 'input:checkbox' ) ) {
          form_map[ field_name ] = $input.is(':checked');
        }
        else if ( !  $input.is('input:radio') || $input.is(':checked') ) {
          form_map[ field_name ]   = fixInputByType( $input );
        }
      });

    // TODO This selector can probably be combined with the previous one
    //
    $form
      .find( 'select:not(td > select), textarea:not(td > textarea)' )
      .each( function() {
        var
          $input     = $( this ),
          field_name = $input[ vMap._attr_ ]( 'name' )
          ;
        form_map[ field_name ] = fixInputByType( $input );
      }
    );

    // Process array properties
    // For each table, get all the trs in tbody.  For each tr, if there's only
    // 1 column, push the value into the array.  Else, build an object that
    // represents each row and push the object into the array.
    $form
      .find( 'table' )
      .each( function() {
        var $table = $( this ), table_name = $table.attr('data-name');
        form_map[ table_name ] = [];
        $table
          .find( 'tbody tr' )
          .each( function() {
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

  // BEGIN Public method /onBufferReady/
  // Purpose : Executes a provided function only after the browser DOM
  //           has been updated.
  //
  onBufferReady = (function () {
    var
    // 10 x 10px transparent png
      blankImgStr  = __blank
        + 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAA'
        + 'CNMs+9AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3'
        + 'RJTUUH3woIAB8ceeNmxQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUF'
        + 'eBDhcAAAAOSURBVBjTY2AYBYMTAAABmgABC6KdHwAAAABJRU5ErkJggg==',
      bodyEl
      ;

    function onBuf ( arg_fn ) {
      var
        callback_fn = __castFn( arg_fn ),
        img_el, s_obj;

      if ( ! bodyEl ) {
        bodyEl = __docRef[ vMap._getElsByTagName_ ]( vMap._body_ )[__0];
      }
      if ( ! ( callback_fn && bodyEl ) ) { return __false; }

      img_el = new Image();
      s_obj  = img_el[ vMap._style_ ];

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
      return __true;
    }

    return onBuf;
  }());
  // END Public method /onBufferReady/

  // BEGIN Public method /resizeTextarea/
  // Example:
  //   $foo.on( 'keyup', function () { resizeTextarea( this, 25 ); } );
  //
  function resizeTextarea ( arg_$textarea, arg_max_ht_px ) {
    var
      $textarea = __castJQ( arg_$textarea ),
      max_ht_px = __castInt( arg_max_ht_px, 400 ),

      scroll_ht_px, outer_ht_px, solve_ht_px
      ;

    if ( ! $textarea ) { return; }

    scroll_ht_px  = $textarea[ vMap._prop_ ]( vMap._scrollHeight_ );
    outer_ht_px   = $textarea[ vMap._outerHeight_]();

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
    _onBufferReady_  : onBufferReady,
    _resizeTextarea_ : resizeTextarea
  };
  // ======================= END PUBLIC METHODS =======================
}( jQuery ));
