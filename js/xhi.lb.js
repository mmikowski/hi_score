/**
 *    xhi.lb.js
 *    Litebox manager
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true, todo    : true, unparam  : true
*/
/*global pcss, $ */

var __ns = 'xhi', __NS;
/* istanbul ignore next */
try          { __NS = global[ __ns ]; }
catch ( e1 ) { __NS = window[ __ns ]; }

// == BEGIN MODULE __NS._lb_ ==========================================
__NS._lb_ = (function () {
  'use strict';
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  //noinspection MagicNumberJS
  var
    aKey    = __ns,
    aMap    = __NS,

    vMap    = aMap._vMap_,
    nMap    = aMap._nMap_,
    __util  = aMap._util_,

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

    __castBool = __util._castBool_,
    __castFn   = __util._castFn_,
    __castJQ   = __util._castJQ_,
    __castInt  = __util._castInt_,
    __castList = __util._castList_,
    __castMap  = __util._castMap_,
    __castNum  = __util._castNum_,
    __castStr  = __util._castStr_,
    __tmplt    = __util._makeTmpltStr_,

    topSmap = {
      _cleanup_fn_   : __undef,  // Clean up function (bound)
      _cleanup_toid_ : __undef,  // Clean up timeout id
      _close_toid_   : __undef,  // Close timeout id
      _is_masked_    : __false,  // Mask-on flag
      _is_ready_     : __false,  // Has DOM been initialized?
      _is_busy_      : __false,  // Is litebox in use?
      _lb_class_str_ : __blank,  // Caller specified class(es) of lb
      _local_html_   : __undef,  // Cached local spin html with aKey
      _main_html_    : __undef,  // Cached main html with aKey
      _mod_class_str_: __blank,  // Caller specified modifier class(es) of lb
      _onclose_fn_   : __undef   // Callback function on close
    },

    $Map = {},

    topCmap = {
      _trans_ms_ : 350, // transition time
      _active_class_ : aKey + '-_x_active_',
      _main_tmplt_ : __blank
        + '<div id="{_ns_}-_lb_mask_" class="{_ns_}-_lb_mask_"></div>'
        + '<div id="{_ns_}-_lb_spin_" class="{_ns_}-_lb_spin_">'
          + '&#xf021;'
        + '</div>'
        + '<div id="{_ns_}-_lb_"></div>',
      _spin_tmplt_ : '<div class="{_ns_}-_lb_spin_ {_ns_}-_x_local_">'
        + '&#xf021;</div>',
      _local_tmplt_ : __blank
        + '<div class="{_ns_}-_lb_mask_ {_ns_}-_x_local_ {_ns_}-_x_active_"></div>'
        + '<div class="{_ns_}-_lb_spin_ {_ns_}-_x_local_ {_ns_}-_x_active_">'
          + '&#xf021;</div>',
      _success_tmplt_ : __blank
        + '<div class="{_ns_}-_lb_success_">'
          + '<div class="{_ns_}-_lb_success_title_">'
            + '{_msg_str_}'
          + '</div>'
        + '</div>',
      _erow_tmplt_ : __blank
        + '<div class="{_ns_}-_lb_error_row_">'
          + '<div class="{_ns_}-_lb_error_row_code_">{_code_}</div>'
          + '<div class="{_ns_}-_lb_error_row_name_">{_name_}</div>'
          + '<div class="{_ns_}-_lb_error_row_descr_">{_descr_}</div>'
        + '</div>',
      _error_tmplt_ : __blank
        + '<div class="{_ns_}-_lb_error_">'
          + '<h1>Error</h1>'
          + '<div class="{_ns_}-_lb_error_list_">'
            + '{_rows_html_}'
          + '</div>'
        + '</div>',
      _tmplt_map_ : {
        _all_ : '{_content_html_}',
        _btm_ : __blank
        + '<div class="{_ns_}-_lb_content_">{_content_html_}</div>'
        + '<div class="{_ns_}-_lb_title_">{_title_html_}</div>'
        + '<div class="{_ns_}-_lb_close_">{_close_html_}</div>',
        _top_ : __blank
        + '<div class="{_ns_}-_lb_title_">{_title_html_}</div>'
        + '<div class="{_ns_}-_lb_close_">{_close_html_}</div>'
        + '<div class="{_ns_}-_lb_content_">{_content_html_}</div>'
      }
    },

    coordDraggable
    ;
  // == END MODULE SCOPE VARIABLES ====================================

  // == BEGIN UTILITY METHODS =========================================
  // == END UTILITY METHODS ===========================================

  // == BEGIN DOM METHODS =============================================
  // BEGIN DOM method /set$Map/
  function set$Map () {
    $Map = {
      _$body_    : $( 'body' ),
      _$litebox_ : $( '#' + aKey + '-_lb_'      ),
      _$mask_    : $( '#' + aKey + '-_lb_mask_' ),
      _$spin_    : $( '#' + aKey + '-_lb_spin_' )
    };
  }
  // END DOM method /set$Map/

  // BEGIN DOM method /initModule/
  // Checks to see if we have been initialized; if not, we do so
  function initModule () {
    var main_html;
    if ( topSmap._is_ready_ ) { return; }

    // Add to DOM
    main_html = topSmap._main_html_;
    if ( ! main_html ) {
      main_html = __tmplt({
        _input_str_  : topCmap._main_tmplt_,
        _lookup_map_ : { _ns_ : aKey }
      });
      topSmap._main_html_ = main_html;
    }
    $('body')[ vMap._append_ ]( main_html );

    // Cache jQuery collections and set state
    set$Map();
    $Map._$litebox_[ vMap._css_ ]( cssKmap._display_, cssVmap._none_ );
    $Map._$mask_[    vMap._css_ ]( cssKmap._display_, cssVmap._none_ );
    topSmap._is_ready_ = __true;
  }
  // END DOM method /initModule/

  // BEGIN DOM method /addLocalSpin/
  function addLocalSpin( arg_$box ) {
    var
      $box       = __castJQ( arg_$box ),
      local_html = topSmap._local_html_
      ;

    if ( ! local_html ) {
      local_html = __tmplt({
        _input_str_  : topCmap._local_tmplt_,
        _lookup_map_ :  { _ns_ : aKey }
      });
      topSmap._local_html_ = local_html;
    }

    if ( $box ) { $box.html( local_html ); }
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

  // BEGIN DOM method /hideLb/
  // This clears the litebox content
  function hideLb ( arg_callback_fn ) {
    var
      callback_fn  = __castFn( arg_callback_fn ),
      active_class = topCmap._active_class_,
      clean_smap, clean_fn;

    initModule();

    if ( topSmap._close_toid_ ) {
      __clearTo( topSmap._close_toid_ );
      topSmap._close_toid_ = __undef;
    }

    if ( topSmap._is_busy_ === __true ) {
      clean_smap = {
        _callback_fn_   : callback_fn,
        _lb_class_str_  : topSmap._lb_class_str_,
        _mod_class_str_ : topSmap._mod_class_str_
      };

      topSmap._lb_class_str_ = __blank;
      topSmap._is_masked_    = __false;
      $Map._$litebox_[ vMap._removeClass_ ]( active_class );
      $Map._$mask_[ vMap._removeClass_ ]( active_class );

      clean_fn               = cleanUp[ vMap._bind_ ]( clean_smap );
      topSmap._cleanup_fn_   = clean_fn;
      topSmap._cleanup_toid_ = __setTo( clean_fn, topCmap._trans_ms_ );
    }
    return $Map._$litebox_;
  }
  // END DOM method /hideLb/

  // BEGIN DOM method /closeLb/
  // The difference between closeLb and hideLb is that close
  // fires the _onclose_fn_ callback, whereas hide does not
  //
  function closeLb () {
    var is_good;
    initModule();
    // Do not close litebox on falsey return from _onclose_fn_
    if ( topSmap._onclose_fn_ ) {
      is_good = topSmap._onclose_fn_( $Map._$litebox_, $Map._$mask_ );
      if ( is_good ) { return hideLb(); }
      return $Map._$litebox_;
    }
    return hideLb();
  }
  // END DOM method /closeLb/

  // BEGIN method /setCloseFn/
  function setCloseFn ( fn_cb ) {
    topSmap._onclose_fn_ = __castFn( fn_cb );
  }
  // END method /setCloseFn/

  // BEGIN method /showBusy/
  function showBusy ( /*busy_str*/ ) {
    var active_class = topCmap._active_class_;
    initModule();
    hideLb();

    $Map._$mask_[ vMap._css_ ]( cssKmap._display_, cssVmap._block_ )[
      vMap._addClass_ ]( active_class );
    topSmap._is_masked_ = __true;
    $Map._$spin_[ vMap._addClass_ ]( active_class );

    // TODO: Add this
    // if ( busy_str )(
    //   $Map._$msg_[ vMap._text_ ]( busy_str );
    // )
  }
  // END method /showBusy/

  // BEGIN DOM method /afterShow/
  // Purpose: Finishes presentation of litebox after it is shown
  //
  function afterShow() {
    var
      smap        = this,
      do_sizing   = smap._do_sizing_,
      do_mask     = smap._do_mask_,
      $litebox    = smap._$litebox_,
      $mask       = smap._$mask_,
      onshow_fn   = smap._onshow_fn_,
      active_class = topCmap._active_class_,

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
    $litebox[ vMap._addClass_ ]( active_class );
    if ( do_mask ) {
      $mask[ vMap._css_ ]( cssKmap._display_, cssVmap._block_ )[
        vMap._addClass_ ]( active_class );
    }
    if ( onshow_fn ) {
      onshow_fn( $litebox, $mask );
    }
  }
  // END DOM method /afterShow/

  // BEGIN method /showLb/
  // Purpose  : Show a litebox of content.
  // Examples :
  //  aMap._lb_._showLb_({
  //    _layout_key_   : '_top_',
  //    _title_html_   : 'My title',
  //    _content_html_ : 'Content here',
  //  });
  //
  //  aMap._lb_._showLb_({
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
  //   * _layout_key_ : '_top_'
  //
  //     +-- litebox -----+--------------+
  //     | _title_html_   | _close_html_ |
  //     +----------------+--------------+
  //     | _content_html_                |
  //     +-------------------------------+
  //   * Position: center/center
  //   * Size: 50% width and natural height, max-height 50%
  //     (mobile: w x h is 90%/90%)
  //   * Overflow-y: auto; overflow-x hidden
  //
  // Options:
  //   * _layout_key_ : '_all_'
  //
  //     +-- litebox --------------------+
  //     | _content_html_                |
  //     +-------------------------------+
  //
  //   * _layout_key_ : '_btm_'
  //
  //     +-- litebox -----+--------------+
  //     | _content_html_                |
  //     +-------------------------------+
  //     | _title_html_   | _close_html_ |
  //     +----------------+--------------+
  //
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
  function showLb ( arg_map ) {
    initModule();
    var
      map = __castMap(  arg_map, {} ),

      close_html    = __castStr(  map._close_html_,    __blank ),
      content_html  = __castStr(  map._content_html_,  __blank ),
      layout_key    = __castStr(  map._layout_key_ )   || '_top_',
      lb_class_str  = __castStr(  map._lb_class_str_ ) || aKey + '-_lb_',
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
      active_class  = topCmap._active_class_,

      $litebox      = $Map._$litebox_,
      $mask         = $Map._$mask_,

      do_sizing,  css_map,    inner_html,
      $title,     $close,     $content,
      aftershow_smap,  aftershow_fn
      ;

    // Close previously open lightbox
    if ( topSmap._is_busy_ ) { hideLb(); }

    // Clean-up any lingering fades, etc
    if ( topSmap._cleanup_toid_ && topSmap._cleanup_fn_ ) {
      __clearTo( topSmap._cleanup_toid_ );
      topSmap._cleanup_fn_();
    }

    // Fill litebox content with desired layout
    inner_html = __tmplt({
      _input_str_ : topCmap._tmplt_map_[ layout_key ],
      _lookup_map_ : {
        _close_html_   : close_html,
        _content_html_ : content_html,
        _ns_           : aKey,
        _title_html_   : title_html
      }
    });
    $litebox.html( inner_html );

    // Cache jQuery collections
    $close   = $litebox[ vMap._find_ ]( '.' + aKey + '-_lb_close_'   );
    $content = $litebox[ vMap._find_ ]( '.' + aKey + '-_lb_content_' );
    $title   = $litebox[ vMap._find_ ]( '.' + aKey + '-_lb_title_'   );

    $Map._$close_   = $close;
    $Map._$content_ = $content;
    $Map._$title_   = $title;

    $content.find( '.' + aKey + '-_lb_spin_' )[
      vMap._addClass_ ]( active_class );

    // Store close button function
    topSmap._onclose_fn_ = onclose_fn;

    // Hide or show close button
    if ( close_html ) {
      $close[ vMap._css_ ]( cssKmap._display_, cssVmap._block_  )[
        vMap._on_  ]( vMap._utap_, closeLb );
    }

    // Tap-on-title to close support
    if ( do_tclose && $title ) {
      $title[ vMap._css_ ]( cssKmap._display_, cssVmap._block_ )[
        vMap._on_  ]( vMap._utap_, closeLb );
    }

    // Configure mask tap
    if ( do_mask ) {
      $mask[ vMap._addClass_ ]( active_class );
      if ( do_bclick ) {
        $mask[ vMap._addClass_ ]( aKey + '-_lb_x_noclick_' );
        $mask[ vMap._off_ ]( vMap._utap_, closeLb );
      }
      else {
        $mask.removeClass( aKey + '-_lb_x_noclick_' )[
          vMap._on_ ]( vMap._utap_, closeLb );
      }
    }

    // Autoclose
    if ( autoclose_ms ) {
      topSmap._close_toid_ = __setTo( closeLb, autoclose_ms );
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

    // Set specified class (or aKey + '-_lb_' default)
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
  // END method /showLb/

  // == END DOM METHODS ===============================================

  // == BEGIN EVENT HANDLERS ==========================================
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
    offset_map[ cssKmap._margin_ ] = __0;
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

  // BEGIN public method /handleResize/
  // Synopsis : handleResize({ _body_h_px_ : 1280, _body_w_px_ : 768 });
  // Purpose  : Adjusts the lightbox and mask to provided body width and
  //   height.  This should be called when the window is resized, typically
  //   throttled using __util._makeThrottleFn_.
  //
  function handleResize ( arg_map ) {
    var
      map       = __castMap( arg_map,     {} ),
      body_h_px = __castNum( map._body_h_px_ ),
      body_w_px = __castNum( map._body_w_px_ ),
      $litebox  = $Map._$litebox_,

      h_px, w_px
      ;

    if ( ! ( body_h_px && body_w_px && $litebox ) ) { return __false; }

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
    return __true;
  }
  // == END EVENT HANDLERS ============================================

  // == BEGIN COORDINATORS =============================================
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
  // == END COORDINATORS ===============================================

  // == BEGIN PUBLIC METHODS ==========================================
  // BEGIN showSuccess
  function showSuccess ( arg_str ) {
    var
      msg_str = __castStr( arg_str, __blank ),
      content_html;

    initModule();

    content_html = __tmplt({
      _input_str_  : topCmap._success_tmplt_,
      _lookup_map_ : {
        _msg_str_ : msg_str,
        _ns_      : aKey
      }
    });

    return showLb({ _content_html_ : content_html });
  }
  // END showSuccess

  function showErrorList ( arg_row_list ) {
    var
      row_list   = __castList( arg_row_list, [] ),
      row_count = row_list[ vMap._length_ ],
      rows_html  = __blank,

      idx, row_map, lookup_map, content_html;

    initModule();
    ROW: for ( idx = __0; idx < row_count; idx++ ) {
      row_map = __castMap( row_list[ idx ] );

      if ( ! row_map ) { continue ROW; }
      lookup_map      = __util._cloneData_( row_map );
      lookup_map._ns_ = aKey;

      rows_html += __tmplt({
        _input_str_  : topCmap._erow_tmplt_,
        _lookup_map_ : lookup_map
      });
    }

    content_html = __tmplt({
      _input_str_  : topCmap._error_tmplt_,
      _lookup_map_ : {
        _ns_        : aKey,
        _rows_html_ : rows_html || 'unknown error'
      }
    });

    return showLb({ _content_html_ : content_html });
  }

  return {
    _addLocalSpin_  : addLocalSpin,
    _closeLb_       : closeLb,
    _handleResize_  : handleResize,
    _hideLb_        : hideLb,
    _setCloseFn_    : setCloseFn,
    _showBusy_      : showBusy,
    _showErrorList_ : showErrorList,
    _showLb_        : showLb,
    _showSuccess_   : showSuccess,

    _initModule_    : initModule
  };
  // == END PUBLIC METHODS ============================================
}());
// == END MODULE __NS._lb_ ============================================

