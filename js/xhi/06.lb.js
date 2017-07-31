/*
 * 06.lb.js
 *
 * Use     : xhi._makeLb_( app_map );
 * Synopsis: Add _lb_ capabilities to app_map
 * Provides: Lightbox feature module
 *
 * JSLint settings found in cfg/jslint.conf
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint browser : true */
/*global $, pcss, xhi */

// == BEGIN MODULE xhi._makeLb_ =======================================
xhi._makeLb_ = function ( aMap ) {
  'use strict';
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  var
    aKey    = aMap._aKey_,
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
    __p        = __util._makeReplaceFn_( '_p_', aKey ),
    __tmplt    = __util._makeTmpltStr_,

    $Map      = {},
    configMap = {
      _trans_ms_ : 350, // transition time
      _active_class_ : aKey + '-_x_active_',
      _main_html_ : __p( __blank
        + '<div id="{_p_}-_lb_mask_" class="{_p_}-_lb_mask_"></div>'
        + '<div id="{_p_}-_lb_spin_" class="{_p_}-_lb_spin_">&#xf021;'
        + '</div><div id="{_p_}-_lb_"></div>'
      ),
      _spin_tmplt_ : __p(
        '<div class="{_p_}-_lb_spin_ {_p_}-_x_local_">&#xf021;</div>'
      ),
      _local_html_ : __p( __blank
        + '<div class="{_p_}-_lb_mask_ {_p_}-_x_local_ {_p_}-_x_active_">'
        + '</div>'
        + '<div class="{_p_}-_lb_spin_ {_p_}-_x_local_ {_p_}-_x_active_">'
        + '&#xf021;</div>'
      ),
      _success_tmplt_ : __p( __blank
        + '<div class="{_p_}-_lb_success_">'
          + '<div class="{_p_}-_lb_success_title_">'
            + '{_msg_str_}'
          + '</div>'
        + '</div>'
      ),
      _erow_tmplt_ : __p( __blank
        + '<div class="{_p_}-_lb_error_row_">'
          + '<div class="{_p_}-_lb_error_row_code_">{_code_}</div>'
          + '<div class="{_p_}-_lb_error_row_name_">{_name_}</div>'
          + '<div class="{_p_}-_lb_error_row_descr_">{_descr_}</div>'
        + '</div>'
      ),
      _error_tmplt_ : __p( __blank
        + '<div class="{_p_}-_lb_error_">'
          + '<h1>Error</h1>'
          + '<div class="{_p_}-_lb_error_list_">'
            + '{_rows_html_}'
          + '</div>'
        + '</div>'
      ),
      _tmplt_map_ : {
        _all_ : '{_content_html_}',
        _btm_ : __p( __blank
          + '<div class="{_p_}-_lb_content_">{_content_html_}</div>'
          + '<div class="{_p_}-_lb_title_">{_title_html_}</div>'
          + '<div class="{_p_}-_lb_close_">{_close_html_}</div>'
        ),
        _top_ : __p( __blank
          + '<div class="{_p_}-_lb_title_">{_title_html_}</div>'
          + '<div class="{_p_}-_lb_close_">{_close_html_}</div>'
          + '<div class="{_p_}-_lb_content_">{_content_html_}</div>'
        )
      }
    },
    stateMap = {
      _cleanup_fn_   : __undef,  // Clean up function (bound)
      _cleanup_toid_ : __undef,  // Clean up timeout id
      _close_toid_   : __undef,  // Close timeout id
      _is_masked_    : __false,  // Mask-on flag
      _is_ready_     : __false,  // Has DOM been initialized?
      _is_busy_      : __false,  // Is litebox in use?
      _mod_class_str_: __blank,  // Caller specified class(es) for lb
      _onclose_fn_   : __undef   // Callback function on close
    },
    coordDraggable
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN UTILITY METHODS =========================================
  // == . END UTILITY METHODS =========================================

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
  // . END DOM method /set$Map/

  // BEGIN DOM method /initModule/
  // Checks to see if we have been initialized; if not, we do so
  function initModule () {
    if ( stateMap._is_ready_ ) { return; }

    // Add to DOM
    $('body')[ vMap._append_ ]( configMap._main_html_ );

    // Cache jQuery collections and set state
    set$Map();
    $Map._$litebox_[ vMap._css_ ]( cssKmap._display_, cssVmap._none_ );
    $Map._$mask_[    vMap._css_ ]( cssKmap._display_, cssVmap._none_ );
    stateMap._is_ready_ = __true;
  }
  // . END DOM method /initModule/

  // BEGIN DOM method /addLocalSpin/
  function addLocalSpin( arg_$box ) {
    var $box = __castJQ( arg_$box );

    if ( $box ) { $box.html( configMap._local_html_ ); }
  }
  // . END DOM method /addLocalSpin/

  // BEGIN DOM method /cleanUp/
  function cleanUp () {
    var
      smap = this;
      stateMap._cleanup_toid_ = __undef;

    /* istanbul ignore next */
    if ( ! smap ) { return; }

    $Map._$mask_[ vMap._removeAttr_ ]( vMap._style_ )[
      vMap._css_ ]( cssKmap._display_, cssVmap._none_ );
    $Map._$litebox_[ vMap._removeAttr_ ]( vMap._style_ )[
      vMap._css_ ]( cssKmap._display_, cssVmap._none_ )[
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
    if ( smap._callback_fn_ ) {
      smap._callback_fn_( $Map._$litebox_, $Map._$mask_ );
    }
    stateMap._is_busy_       = __false;
    stateMap._mod_class_str_ = __blank;
    stateMap._is_masked_     = __false;
  }
  // . END DOM method /cleanUp/

  // BEGIN DOM method /hideLb/
  // This clears the litebox content
  function hideLb ( arg_callback_fn ) {
    var
      callback_fn  = __castFn( arg_callback_fn ),
      active_class = configMap._active_class_,
      clean_smap, clean_fn;

    initModule();

    if ( stateMap._close_toid_ ) {
      __clearTo( stateMap._close_toid_ );
      stateMap._close_toid_ = __undef;
    }

    if ( stateMap._is_busy_ === __true ) {
      clean_smap = {
        _callback_fn_   : callback_fn,
        _mod_class_str_ : stateMap._mod_class_str_
      };

      $Map._$litebox_[ vMap._removeClass_ ]( active_class );
      $Map._$mask_[    vMap._removeClass_ ]( active_class );

      clean_fn               = cleanUp[ vMap._bind_ ]( clean_smap );
      stateMap._cleanup_fn_   = clean_fn;
      stateMap._cleanup_toid_ = __setTo( clean_fn, configMap._trans_ms_ );
    }
    return $Map._$litebox_;
  }
  // . END DOM method /hideLb/

  // BEGIN DOM method /closeLb/
  // The difference between closeLb and hideLb is that close
  // fires the _onclose_fn_ callback, whereas hide does not
  //
  function closeLb () {
    var is_good;
    initModule();
    // Do not close litebox on falsey return from _onclose_fn_
    if ( stateMap._onclose_fn_ ) {
      is_good = stateMap._onclose_fn_( $Map._$litebox_, $Map._$mask_ );
      if ( is_good ) { return hideLb(); }
      return $Map._$litebox_;
    }
    return hideLb();
  }
  // . END DOM method /closeLb/

  // BEGIN method /setCloseFn/
  function setCloseFn ( fn_cb ) {
    stateMap._onclose_fn_ = __castFn( fn_cb );
  }
  // . END method /setCloseFn/

  // BEGIN method /showBusy/
  function showBusy ( /*msg_str*/ ) {
    var active_class = configMap._active_class_;
    initModule();
    hideLb();

    $Map._$mask_[ vMap._css_ ]( cssKmap._display_, cssVmap._block_ )[
      vMap._addClass_ ]( active_class );
    stateMap._is_masked_ = __true;
    $Map._$spin_[ vMap._addClass_ ]( active_class );

    // TODO 2017-07-21 mmikowski warn: Add litebox messages
    // if ( msg_str )(
    //   $Map._$msg_[ vMap._text_ ]( msg_str );
    // )
  }
  // . END method /showBusy/

  // BEGIN DOM method /afterShow/
  // Purpose: Finishes presentation of litebox after it is shown
  //
  function afterShow () {
    var
      smap        = this,
      do_sizing   = smap._do_sizing_,
      do_mask     = smap._do_mask_,
      $litebox    = smap._$litebox_,
      $mask       = smap._$mask_,
      onshow_fn   = smap._onshow_fn_,
      active_class = configMap._active_class_,

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

    if ( do_mask ) {
      $mask[ vMap._css_ ]( cssKmap._display_, cssVmap._block_ )[
        vMap._addClass_ ]( active_class );
    }

    if ( onshow_fn ) { onshow_fn( $litebox, $mask ); }

    $litebox[ vMap._addClass_ ]( active_class );
  }
  // . END DOM method /afterShow/

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
  // Options:
  //   * _autoclose_ms_   : (infinity) Cancels the window after n milliseconds
  //   * _content_html_   : (50% ht loading graphic) Content in main panel
  //   * _close_html_     : (blank) Close symbol or text
  //   * _do_block_click_ : (false) Block user click on mask to close?
  //   * _do_dflt_class_  : (true) Keep default lightbox class?
  //   * _do_draggable_   : (true) User drag by title bar?
  //   * _do_mask_        : (true) Show mask under litebox?
  //   * _do_title_close_ : (true) Tap on title to close?
  //   * _layout_key_ : ('_top_')
  //     '_top_'
  //       +-- litebox -----+--------------+
  //       | _title_html_   | _close_html_ |
  //       +----------------+--------------+
  //       | _content_html_                |
  //       +-------------------------------+
  //
  //     '_all_'
  //       +-- litebox --------------------+
  //       | _content_html_                |
  //       +-------------------------------+
  //
  //     '_btm_'
  //       +-- litebox -----+--------------+
  //       | _content_html_                |
  //       +-------------------------------+
  //       | _title_html_   | _close_html_ |
  //       +----------------+--------------+
  //   * _mod_class_str_  : ('') Augment stock litebox class string
  //     ( separate multiple classes by a space, e.g. 'c1 c2 c3 ... ' )
  //   * _position_map_   : (undef) CSS map to override standard
  //       position, size, and other attributes.
  //       Default position is centered.  Width is 50% of window, height
  //       is natural height required to contain content / max-height 50%.
  //       Constent scrolling is enabled veritcal and disabled horizontal.
  //       Mobile w x h is 90%/90%.
  //   * _onclose_fn_     : (null) A function called when close is requested.
  //       THE LITEBOX IS CLOSED IFF IT RETURNS A TRUTHY VALUE.
  //   * _onshow_fn_      : (null) A function to after rendering and
  //       animations are complete.
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
      mod_class_str = __castStr(  map._mod_class_str_, __blank ),
      title_html    = __castStr(  map._title_html_,    __blank ),

      autoclose_ms  = __castInt(  map._autoclose_ms_ ),
      position_map  = __castMap(  map._position_map_ ),

      do_bclick     = __castBool( map._do_block_click_, __false ),
      do_draggable  = __castBool( map._do_draggable_,    __true ),
      do_dflt_class = __castBool( map._do_dflt_class_,   __true ),
      do_mask       = __castBool( map._do_mask_,         __true ),
      do_tclose     = __castBool( map._do_title_close_,  __true ),
      onclose_fn    = __castFn(   map._onclose_fn_,      __null ),
      onshow_fn     = __castFn(   map._onshow_fn_,       __null ),

      active_class  = configMap._active_class_,
      $litebox      = $Map._$litebox_,
      $mask         = $Map._$mask_,

      do_sizing,  css_map,    inner_html,
      $title,     $close,     $content,
      aftershow_smap,  aftershow_fn
      ;

    // Close previously open lightbox
    if ( stateMap._is_busy_ ) { hideLb(); }

    // Clean-up any lingering fades, etc
    if ( stateMap._cleanup_toid_ && stateMap._cleanup_fn_ ) {
      __clearTo( stateMap._cleanup_toid_ );
      stateMap._cleanup_fn_();
    }

    // Fill litebox content with desired layout
    inner_html = __tmplt({
      _input_str_ : configMap._tmplt_map_[ layout_key ],
      _lookup_map_ : {
        _close_html_   : close_html,
        _content_html_ : content_html,
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
    stateMap._onclose_fn_ = onclose_fn;

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
      stateMap._close_toid_ = __setTo( closeLb, autoclose_ms );
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

    // Set classes
    if ( do_dflt_class )  {
      mod_class_str = aKey + '-_lb_ ' + mod_class_str;
    }
    $litebox[ vMap._addClass_ ]( mod_class_str );
    stateMap._mod_class_str_ = mod_class_str;

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

    stateMap._is_busy_ = __true;
    return $litebox;
  }
  // . END method /showLb/

  // == . END DOM METHODS =============================================

  // == BEGIN EVENT HANDLERS ==========================================
  // The event handlers are impossible to test well without a browser.
  // Skipped in coverage.
  /* istanbul ignore next */
  function onDragstart( event_obj ) {
    var
      $target = $( event_obj.elem_target ),
      offset_map = $Map._$litebox_.offset();

    $target[ vMap._css_ ]( cssKmap._cursor_, cssVmap._move_ );
    stateMap._$drag_target_ = $target;

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
    var $target = stateMap._$drag_target_;
    if ( $target ) {
      $target[ vMap._css_ ]( cssKmap._cursor_, __blank );
    }
    stateMap._$drag_target_ = __undef;
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

    if ( stateMap._is_masked_ ) {
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
    stateMap._body_w_px_   = body_w_px;
    stateMap._body_h_px_   = body_h_px;
    stateMap._resize_toid_ = __undef;
    return __true;
  }
  // == . END EVENT HANDLERS ==========================================

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
  // == . END COORDINATORS =============================================

  // == BEGIN PUBLIC METHODS ==========================================
  // BEGIN showSuccess
  function showSuccess ( arg_str ) {
    var
      msg_str      = __castStr( arg_str, __blank ),
      content_html = __tmplt({
        _input_str_  : configMap._success_tmplt_,
        _lookup_map_ : {
          _msg_str_ : msg_str,
        }
      });

    initModule();
    return showLb({ _content_html_ : content_html });
  }
  // . END showSuccess

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
      lookup_map = __util._cloneData_( row_map );

      rows_html += __tmplt({
        _input_str_  : configMap._erow_tmplt_,
        _lookup_map_ : lookup_map
      });
    }

    content_html = __tmplt({
      _input_str_  : configMap._error_tmplt_,
      _lookup_map_ : {
        _rows_html_ : rows_html || 'unknown error'
      }
    });

    return showLb({ _content_html_ : content_html });
  }

  aMap._lb_ = {
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
  // == . END PUBLIC METHODS ==========================================
};
// == . END MODULE xhi._makeLb_ =======================================

