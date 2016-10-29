/**
 *    xhi.lb.js
 *    Litebox manager
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
   devel : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
   white : true,    todo : true,  unparam : true
*/
/*global pcss, jQuery, xhi */

xhi._lb_ = (function ( $ ) {
  // ================= BEGIN MODULE SCOPE VARIABLES ===================
  'use strict';
  //noinspection MagicNumberJS
  var
    vMap    = xhi._vMap_,
    nMap    = xhi._nMap_,
    cssKmap = pcss._cfg_._cssKeyMap_,
    cssVmap = pcss._cfg_._cssValMap_,

    __0     = nMap._0_,
    __2     = nMap._2_,

    __blank = vMap._blank_,
    __false = vMap._false_,
    __null  = vMap._null_,
    __true  = vMap._true_,
    __undef = vMap._undef_,

    __setTo   = vMap._fnSetTimeout_,
    __clearTo = vMap._fnClearTimeout_,

    __util     = xhi._util_,
    __castBool = __util._castBool_,
    __castFn   = __util._castFn_,
    __castJQ   = __util._castJQ_,
    __castInt  = __util._castInt_,
    __castList = __util._castList_,
    __castMap  = __util._castMap_,
    __castStr  = __util._castStr_,

    topSmap = {
      _cleanup_fn_   : __undef,  // Clean up function (bound)
      _cleanup_toid_ : __undef,  // Clean up timeout id
      _close_toid_   : __undef,  // Close timeout id
      _is_masked_    : __false,  // Mask-on flag
      _is_ready_     : __false,  // Has DOM been initialized?
      _is_busy_      : __false,  // Is litebox in use?
      _lb_class_str_ : __blank,  // Caller specified class(es) of lb
      _mod_class_str_: __blank,  // Caller specified modifier class(es) of lb
      _onclose_fn_   : __undef   // Callback function on close
    },

    $Map = {},

    topCmap = {
      _trans_ms_  : 350, // transition time
      _main_html_ : __blank
        + '<div id="xhi-_lb_mask_" class="xhi-_lb_mask_"></div>'
        + '<div id="xhi-_lb_spin_" class="xhi-_lb_spin_">'
          + '&#xf021;'
        + '</div>'
        + '<div id="xhi-_lb_"></div>',
      _spin_html_ : '<div class="xhi-_lb_spin_ xhi-_x_local_">'
        + '&#xf021;</div>',
      _local_tmplt_ : __blank
        + '<div class="xhi-_lb_mask_ xhi-_x_local_ xhi-_x_active_"></div>'
        + '<div class="xhi-_lb_spin_ xhi-_x_local_ xhi-_x_active_">'
          + '&#xf021;</div>',
      _success_tmplt_ : __blank
        + '<div class="xhi-_lb_success_">'
          + '<div class="xhi-_lb_success_title_">'
            + '{_msg_str_}'
          + '</div>'
        + '</div>',
      _erow_tmplt_ : __blank
        + '<div class="xhi-_lb_error_row_">'
          + '<div class="xhi-_lb_error_row_code_">{_code_}</div>'
          + '<div class="xhi-_lb_error_row_name_">{_name_}</div>'
          + '<div class="xhi-_lb_error_row_descr_">{_descr_}</div>'
        + '</div>',
      _error_tmplt_ : __blank
        + '<div class="xhi-_lb_error_">'
          + '<h1>Error</h1>'
          + '<div class="xhi-_lb_error_list_">'
            + '{_rows_html_}'
          + '</div>'
        + '</div>',

      _tmplt_map_ : {
        _all_ : '{_content_html_}',
        _btm_ : __blank
        + '<div class="xhi-_lb_content_">{_content_html_}</div>'
        + '<div class="xhi-_lb_title_">{_title_html_}</div>'
        + '<div class="xhi-_lb_close_">{_close_html_}</div>',
        _top_ : __blank
        + '<div class="xhi-_lb_title_">{_title_html_}</div>'
        + '<div class="xhi-_lb_close_">{_close_html_}</div>'
        + '<div class="xhi-_lb_content_">{_content_html_}</div>'
      }
    },

    coordDraggable
    ;
  // ================== END MODULE SCOPE VARIABLES ====================

  // ===================== BEGIN UTILITY METHODS ======================
  // ====================== END UTILITY METHODS =======================

  // ======================= BEGIN DOM METHODS ========================
  // BEGIN DOM method /set$Map/
  function set$Map () {
    $Map = {
      _$body_    : $( 'body'           ),
      _$litebox_ : $( '#xhi-_lb_'      ),
      _$mask_    : $( '#xhi-_lb_mask_' ),
      _$spin_    : $( '#xhi-_lb_spin_' )
    };
  }
  // END DOM method /set$Map/

  // BEGIN DOM method /initModule/
  // Checks to see if we have been initialized; if not, we do so
  function initModule () {
    if ( topSmap._is_ready_ ) { return; }
    $('body')[ vMap._append_ ]( topCmap._main_html_ );
    set$Map();
    $Map._$litebox_[ vMap._css_ ]( cssKmap._display_, cssVmap._none_ );
    $Map._$mask_[    vMap._css_ ]( cssKmap._display_, cssVmap._none_ );
    topSmap._is_ready_ = __true;
  }
  // END DOM method /initModule/

  // BEGIN DOM method /addLocalSpin/
  function addLocalSpin( arg_$box ) {
    var $box = __castJQ( arg_$box );
    if ( $box ) {
      $box.html( topCmap._local_tmplt_ );
    }
  }
  // END DOM method /addLocalSpin/

  // BEGIN DOM method /cleanUp/
  function cleanUp () {
    var
      smap = this;
      topSmap._cleanup_toid_  = __undef;

    /* istanbul ignore next */
    if ( ! smap ) { return; }

    $Map._$mask_[ vMap._removeAttr_ ]( vMap._style_ )[
      vMap._css_ ]( cssKmap._display_, cssVmap._none_ );
    $Map._$litebox_[ vMap._removeAttr_ ]( vMap._style_ )[
      vMap._css_ ]( cssKmap._display_, cssVmap._none_ )[
      vMap._removeClass_ ]( smap._lb_class_str_ )[
      vMap._removeClass_ ]( smap._mod_class_str_ );

    if ( $Map._$content_ ) {
      $Map._$content_[ vMap._removeAttr_ ]( vMap._style_ )[
        vMap._empty_ ]();
    }
    if ( $Map._$title_ ) {
      $Map._$title_[ vMap._removeAttr_ ]( vMap._style_ )[
        vMap._empty_ ]();
    }
    if ( $Map._$close_ ) {
      $Map._$close_[ vMap._removeAttr_ ]( vMap._style_ )[
        vMap._empty_ ]();
    }

    topSmap._mod_class_str_ = __blank;
    topSmap._lb_class_str_  = __blank;
    topSmap._is_busy_       = __false;

    if ( smap._callback_fn_ ) {
      smap._callback_fn_( $Map._$litebox_, $Map._$mask_ );
    }
  }
  // END DOM method /cleanUp/

  // BEGIN DOM method /hideIt/
  // This clears the litebox content
  function hideIt ( arg_callback_fn ) {
    var
      callback_fn = __castFn( arg_callback_fn ),
      clean_smap, clean_fn;

    initModule();

    if ( topSmap._close_toid_ ) {
      __clearTo( topSmap._close_toid_ );
      topSmap._close_toid_ = __undef;
    }

    clean_smap = {
      _callback_fn_   : callback_fn,
      _lb_class_str_  : topSmap._lb_class_str_,
      _mod_class_str_ : topSmap._mod_class_str_
    };

    topSmap._lb_class_str_ = __blank;
    topSmap._is_masked_    = __false;
    $Map._$litebox_[ vMap._removeClass_ ]( 'xhi-_x_active_' );
    $Map._$mask_[    vMap._removeClass_ ]( 'xhi-_x_active_' );

    clean_fn = cleanUp[ vMap._bind_ ]( clean_smap );
    topSmap._cleanup_fn_   = clean_fn;
    topSmap._cleanup_toid_ = __setTo( clean_fn, topCmap._trans_ms_ );
    return $Map._$litebox_;
  }
  // END DOM method /hideIt/

  // BEGIN DOM method /closeIt/
  // The difference between closeIt and hideIt is that close
  // fires the _onclose_fn_ callback, whereas hide does not
  //
  function closeIt () {
    initModule();
    // Do not close litebox on falsey return from _onclose_fn_
    if ( topSmap._onclose_fn_ ) {
      if ( topSmap._onclose_fn_( $Map._$litebox_, $Map._$mask_ ) ) {
        return hideIt();
      }
      return $Map._$litebox_;
    }
    return hideIt();
  }
  // END DOM method /closeIt/

  // BEGIN method /setCloseFn/
  function setCloseFn ( fn_cb ) {
    topSmap._onclose_fn_ = __castFn( fn_cb );
  }
  // END method /setCloseFn/

  // BEGIN method /showBusy/
  function showBusy ( /*busy_str*/ ) {
    initModule();
    $Map._$mask_[ vMap._css_ ]( cssKmap._display_, cssVmap._block_
      )[ vMap._addClass_ ]( 'xhi-_x_active_' );
    topSmap._is_masked_ = __true;
    $Map._$spin_[ vMap._addClass_ ]( 'xhi-_x_active_' );

    // TODO: Add this
    // if( busy_str )(
    //   $Map._$msg_[ vMap._text_ ]( busy_str );
    // )
  }
  // END method /showBusy/

  // BEGIN method /hideBusy/
  function hideBusy () {
    var
      $mask = $Map._$mask_,
      $spin = $Map._$spin_
      ;

    if ( ! $mask ) { return __false; }

    $mask[ vMap._removeClass_ ]( 'xhi-_x_active_' );
    $spin[ vMap._removeClass_ ]( 'xhi-_x_active_' );
    topSmap._is_masked_ = __false;

    __setTo(
      function () {
        $mask[ vMap._removeAttr_ ]( vMap._style_ )[
          vMap._css_ ]( cssKmap._display_, cssVmap._none_ );
      },
      topCmap._trans_ms_
    );
  }
  // END method /hideBusy/

  // BEGIN DOM method /afterShow/
  // Purpose: Finishes presentation of litebox after it is shown
  //
  function afterShow() {
    var
      smap = this,
      do_sizing = smap._do_sizing_,
      do_mask   = smap._do_mask_,
      $litebox  = smap._$litebox_,
      $mask     = smap._$mask_,
      onshow_fn = smap._onshow_fn_,

      margin_left_px, margin_top_px, css_map
      ;

    if ( do_sizing ) {
      margin_top_px  = ( __0 - $litebox[ vMap._outerHeight_ ]() / __2 );
      margin_left_px = ( __0 - $litebox[ vMap._outerWidth_  ]() / __2 );
      css_map = {
        'margin-top'  : margin_top_px,
        'margin-left' : margin_left_px,
        top           : cssVmap._50p_,
        left          : cssVmap._50p_
      };
      $litebox[ vMap._css_ ]( css_map );
    }
    $litebox[ vMap._addClass_ ]( 'xhi-_x_active_');
    if ( do_mask ) {
      $mask[ vMap._css_ ]( cssKmap._display_, cssVmap._block_ )[
        vMap._addClass_ ]( 'xhi-_x_active_' );
    }
    if ( onshow_fn ) {
      onshow_fn( $litebox, $mask );
    }
  }
  // END DOM method /afterShow/

  // BEGIN method /showIt/
  // Purpose  : Show a litebox of content.
  // Examples :
  //  xhi._lb_._showIt_({
  //    _layout_key_   : '_top_',
  //    _title_html_   : 'My title',
  //    _content_html_ : 'Content here',
  //  });
  //
  //  xhi._lb_._showIt_({
  //    _layout_key_   : '_top_',
  //    _title_html_   : 'My title',
  //    _content_html_ : 'Content here',
  //    _close_html_   : 'x',
  //    _position_map_ : {
  //      left : '50%',
  //      top  : '50%',
  //      marginLeft: '-10rem',
  //      marginTop : '-10rem',
  //      width : '20rem',
  //      height: '20rem'
  //    }
  //  });
  //
  // Defaults :
  //   * Layout: (_layout_key_ : '_top_' )
  //     +-- litebox -----+---------+
  //     | _title_        | _close_ |
  //     +----------------+---------+
  //     | _content_                |
  //     +--------------------------+
  //   * Position: center/center
  //   * Size: 50% width and natural height, max-height 50%
  //     (mobile: w x h is 90%/90%)
  //   * Overflow-y: auto; overflow-x hidden
  //
  // Options:
  //   * Layout:  ( _layout_key_ : '_all_' )
  //     +-- litebox -----+---------+
  //     | _content_                |
  //     +--------------------------+
  //   * Layout:  ( _layout_key_ : '_btm_' )
  //     +-- litebox -----+---------+
  //     | _content_                |
  //     +--------------------------+
  //     | _title_        | _close_ |
  //     +----------------+---------+
  //   * _autoclose_ms_ : cancels the window after a i seconds
  //   * _content_html_ - Primary content.  If not initially provided, will
  //       show a 50% height loading graphic.
  //   * _close_html_     - close symbol or text.  Blank omits a close button.
  //   * _do_block_click_ : This blocks the the user from clicking on the
  //       mask to close the litebox
  //   * _do_draggable_   - enable dragging of litebox by the title bar
  //   * _do_title_close_ - tap on title to close (overrides close symbol)
  //   * _do_mask_        - set to false to disable mask
  //   * _lb_class_str_   - replace stock litebox class with this
  //     ( separate multiple classes by a space, e.g. 'c1 c2 c3 ... ' )
  //   * _mod_class_str_  - augment stock litebox class with this
  //     ( separate multiple classes by a space, e.g. 'c1 c2 c3 ... ' )
  //   * _position_map_ - set this to override default positioning
  //     (mobile w x h stays 90%/90%)
  //   * Set is_overflow_y and is_overflow_x to override overflow defaults
  //   * _onclose_fn_     : function to call on close
  //     When provided, the function is fired on close, and if it returns
  //     a truthy value, the litebox is closed.  A FALSEY VALUES WILL
  //     retain the litebox.
  //   * _onshow_fn_      : function to after show is complete.
  //      The $lite_box and $mask are provided as positional arguments
  //      to this function.
  //   * _title_html_     : title string
  //
  // Returns  : $litebox
  //
  function showIt ( arg_map ) {
    initModule();
    var
      map = __castMap(  arg_map, {} ),

      close_html    = __castStr(  map._close_html_,    __blank ),
      content_html  = __castStr(  map._content_html_ )
        || topCmap._spin_html_,
      layout_key    = __castStr(  map._layout_key_ )   || '_top_',
      lb_class_str  = __castStr(  map._lb_class_str_ ) || 'xhi-_lb_',
      mod_class_str = __castStr(  map._mod_class_str_, __blank ),
      title_html    = __castStr(  map._title_html_,    __blank ),

      autoclose_ms  = __castInt(  map._autoclose_ms_ ),
      position_map  = __castMap(  map._position_map_ ),

      do_bclick     = __castBool( map._do_block_click_, __false ),
      do_draggable  = __castBool( map._do_draggable_,    __true ),
      do_mask       = __castBool( map._do_mask_,         __true ),
      do_tclose     = __castBool( map._do_title_close_,  __true ),
      onclose_fn    = __castFn(   map._onclose_fn_,      __null ),
      onshow_fn     = __castFn(   map._onshow_fn_,       __null ),

      $litebox      = $Map._$litebox_,
      $mask         = $Map._$mask_,

      do_sizing,  css_map,    inner_html,
      $title,     $close,     $content,
      aftershow_smap,  aftershow_fn
      ;

    // Close previously open lightbox
    if ( topSmap._is_busy_ ) { hideIt(); }

    // Clean-up any linger fades, etc
    if ( topSmap._cleanup_toid_ && topSmap._cleanup_fn_ ) {
      __clearTo( topSmap._cleanup_toid_ );
      topSmap._cleanup_fn_();
    }

    // Fill litebox content with desired layout
    inner_html = __util._makeTmpltStr_({
      _input_str_ : topCmap._tmplt_map_[ layout_key ],
      _lookup_map_ : {
        _close_html_   : close_html,
        _content_html_ : content_html,
        _title_html_   : title_html
      }
    });
    $litebox.html( inner_html );

    // Cache jQuery collections
    $close   = $litebox[ vMap._find_ ]( '.xhi-_lb_close_'   );
    $content = $litebox[ vMap._find_ ]( '.xhi-_lb_content_' );
    $title   = $litebox[ vMap._find_ ]( '.xhi-_lb_title_'   );

    $Map._$close_   = $close;
    $Map._$content_ = $content;
    $Map._$title_   = $title;

    $content.find( '.xhi-_lb_spin_' )[ vMap._addClass_ ]( 'xhi-_x_active_' );

    // Store close button function
    topSmap._onclose_fn_ = onclose_fn;

    // Hide or show close button
    if ( close_html ) {
      $close[ vMap._css_ ]( cssKmap._display_, cssVmap._block_  )[
        vMap._on_  ]( vMap._utap_, closeIt );
    }

    // Tap-on-title to close support
    if ( do_tclose && $title ) {
      $title[ vMap._css_ ]( cssKmap._display_, cssVmap._block_ )[
        vMap._on_  ]( vMap._utap_, closeIt );
    }

    // Configure mask tap
    if ( do_mask ) {
      $mask[ vMap._addClass_ ]( 'xhi-_x_active_' );
      if ( do_bclick ) {
        $mask[ vMap._addClass_ ]( 'xhi-_lb_x_noclick_' );
        $mask[ vMap._off_ ]( vMap._utap_, closeIt );
      }
      else {
        $mask.removeClass( 'xhi-_lb_x_noclick_' )[
          vMap._on_ ]( vMap._utap_, closeIt );
      }
    }

    // Autoclose
    if ( autoclose_ms ) {
      topSmap._close_toid_ = __setTo( closeIt, autoclose_ms );
    }

    // Handle position map
    if ( position_map ) {
      do_sizing = __false;
      css_map   = position_map;
    }
    else {
      do_sizing = __true;
      css_map = { top : '-100%', left : '-100%' };
    }
    css_map.display = cssVmap._block_;

    // Set specified class (or xhi-_lb_ default)
    $litebox[ vMap._addClass_ ]( lb_class_str  );
    $litebox[ vMap._addClass_ ]( mod_class_str );
    topSmap._lb_class_str_  = lb_class_str;
    topSmap._mod_class_str_ = mod_class_str;

    // Show and (if requested) size litebox
    aftershow_smap = {
      _$litebox_  : $litebox,
      _$mask_     : $mask,
      _do_mask_   : do_mask,
      _do_sizing_ : do_sizing,
      _onshow_fn_ : onshow_fn
    };
    aftershow_fn = afterShow[ vMap._bind_ ]( aftershow_smap );
    $litebox[ vMap._css_ ]( css_map )[ vMap._show_ ]( aftershow_fn );

    // Coordinate draggable if requested
    coordDraggable( $title, do_draggable );

    topSmap._is_busy_ = __true;
    return $litebox;
  }
  // END method /showIt/

  // ======================== END DOM METHODS =========================

  // =================== BEGIN EVENT HANDLERS =========================
  // The event handlers are impossible to test well without a browser.
  // Skipped in coverage.
  /* istanbul ignore next */
  function onDragstart( event_obj ) {
    var
      $target = $( event_obj.elem_target ),
      offset_map = $Map._$litebox_.offset();

    $target[ vMap._css_ ]( cssKmap._cursor_, cssVmap._move_ );
    topSmap._$drag_target_ = $target;

    offset_map[ cssKmap._right_  ] = __blank;
    offset_map[ cssKmap._bottom_ ] = __blank;
    $Map._$litebox_[ vMap._css_ ]( offset_map );
  }

  /* istanbul ignore next */
  function onDragmove ( event_obj ) {
    var offset_map = $Map._$litebox_.offset();
    offset_map.top  += event_obj.px_delta_y;
    offset_map.left += event_obj.px_delta_x;
    $Map._$litebox_[ vMap._css_ ]( offset_map );
  }

  /* istanbul ignore next */
  function onDragend ( /* event_obj */ ) {
    var $target = topSmap._$drag_target_;
    if ( $target ) {
      $target[ vMap._css_ ]( cssKmap._cursor_, __blank );
    }
    topSmap._$drag_target_ = __undef;
  }

  function onResize ( /*event_obj */ ) {
   if ( topSmap._resize_toid_ ) { return __false; }

   topSmap._resize_toid_ = __setTo(function () {
    var
      body_w_px  = $Map._$body_[ cssKmap._width_ ](),
      body_h_px  = $Map._$body_[ cssKmap._height_ ](),
      $litebox, w_px, h_px
      ;
      if ( topSmap._is_masked_ ) {
        $litebox = $Map._$litebox_;
        w_px     = $litebox[ cssKmap._width_  ]();
        h_px     = $litebox[ cssKmap._height_ ]();

        $litebox[ vMap._css_ ]({
          top  : vMap._fnGetFloor_(
            ( body_h_px - h_px ) / nMap._2_ + nMap._d5_
          ),
          left : vMap._fnGetFloor_(
            ( body_w_px - w_px ) / nMap._2_ + nMap._d5_
          )
        });
      }
      topSmap._body_w_px_   = body_w_px;
      topSmap._body_h_px_   = body_h_px;
      topSmap._resize_toid_ = __undef;
    }, nMap._200_ );
    return __true;
  }
  // ==================== END EVENT HANDLERS ==========================

  // ======================= BEGIN COORDINATORS ========================
  // These methods are here because they tie DOM methods to handlers.
  // We must assign these functions to variables that are declared earlier
  // so that static analysis does not fail.
  //
  function coordDraggable0 ( $title, do_draggable ) {
    if ( do_draggable ) {
      $title[ vMap._on_ ]( vMap._udragstart_, onDragstart );
      $title[ vMap._on_ ]( vMap._udragmove_,  onDragmove  );
      $title[ vMap._on_ ]( vMap._udragend_,   onDragend   );
    }
    else {
      $title[ vMap._off_ ]( vMap._udragstart_, onDragstart );
      $title[ vMap._off_ ]( vMap._udragmove_,  onDragmove  );
      $title[ vMap._off_ ]( vMap._udragend_,   onDragend   );
    }
  }
  coordDraggable = coordDraggable0;
  // ======================== END COORDINATORS =========================

  // =================== BEGIN PUBLIC METHODS =========================
  // BEGIN showSuccess
  function showSuccess ( arg_str ) {
    var
      msg_str = __castStr( arg_str, __blank ),
      content_html;

    initModule();

    content_html = __util._makeTmpltStr_({
      _input_str_  : topCmap._success_tmplt_,
      _lookup_map_ : { _msg_str_ : msg_str }
    });

    return showIt({ _content_html_ : content_html });
  }
  // END showSuccess

  function showErrorList ( arg_row_list ) {
    var
      row_list   = __castList( arg_row_list, [] ),
      row_count = row_list[ vMap._length_ ],
      rows_html  = __blank,

      idx, row_map, content_html;

    initModule();
    ROW: for ( idx = __0; idx < row_count; idx++ ) {
      row_map = __castMap( row_list[ idx ] );
      if ( ! row_map ) { continue ROW; }
      rows_html += __util._makeTmpltStr_({
        _input_str_  : topCmap._erow_tmplt_,
        _lookup_map_ : row_map
      });
    }

    content_html = __util._makeTmpltStr_({
      _input_str_  : topCmap._error_tmplt_,
      _lookup_map_ : { _rows_html_ : rows_html || 'unknown error' }
    });

    return showIt({ _content_html_ : content_html });
  }

  return {
    _onResize_      : onResize,

    _addLocalSpin_  : addLocalSpin,
    _closeIt_       : closeIt,
    _hideBusy_      : hideBusy,
    _hideIt_        : hideIt,
    _setCloseFn_    : setCloseFn,
    _showBusy_      : showBusy,
    _showErrorList_ : showErrorList,
    _showIt_        : showIt,
    _showSuccess_   : showSuccess,

    _initModule_    : initModule
  };
  // ==================== END PUBLIC METHODS ==========================
}( jQuery ));
// END xhi.lb.js
