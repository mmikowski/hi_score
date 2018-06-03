/*
 * 06_lb.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._06_lb_._makeInstanceFn_( app_map );
 * Synopsis : Add _06_lb_ capabilities to app_map
 * Provides : Flexible litebox UI interface
 * Requires :
 *   - aMap (app map) with symbols from 00_root._makeInstanceFn_()
 *   - aMap with symbols from 05_css_lb._makeInstanceFn_()
 *   - jQuery   (as xhiJQ )
 *   - PowerCSS (as xhiCSS)
 *
 * Instance overview.
 * See the inline API documents detailed use.
 *   - addLocalSpinFn   : Add a spinner to jquery collection
 *   - cleanUpFn        : Clean data and DOM after litebox hide
 *   - closeLbFn        : Remove litebox and content (config callback)
 *   - handleResizeFn   : Adjust litebox for screen size change
 *   - hideLbFn         : Remove litebox and content
 *   - hideBusyFn       : Hide a busy litebox
 *   - showBusyFn       : Show a busy litebox
 *   - showErrorTableFn : Show an error table
 *   - showLbFn         : Show litebox with content.
 *   - showSuccessFn    : Show a success message
 *
 *   - getMapFn         : Get internal map to inspect or change
 *   - initModuleFn     : Initialize DOM and state data if needed
*/
/*global xhiCSS, xhi, xhiJQ */

// == BEGIN MODULE xhi._06_lb_ =========================================
xhi._06_lb_ = (function ( $ ) {
  'use strict';
  // == BEGIN public method /makeInstanceFn/ ===========================
  function makeInstanceFn ( aMap, argOptionMap ) {
    // == BEGIN MODULE SCOPE VARIABLES =================================
    var
      subName = '_06_lb_',
      aKey    = aMap._aKey_,
      vMap    = aMap._vMap_,
      nMap    = aMap._nMap_,

      cssKmap = xhiCSS._cfg_._cssKeyMap_,
      cssVmap = xhiCSS._cfg_._cssValMap_,

      __0 = nMap._0_,
      __2 = nMap._2_,

      __blank = vMap._blank_,
      __false = vMap._false_,
      __null  = vMap._null_,
      __true  = vMap._true_,
      __undef = vMap._undef_,

      __setTo    = vMap._setTimeoutFn_,
      __clearTo  = vMap._clearTimeoutFn_,

      __util     = aMap._01_util_,
      __logObj   = __util._getLogObj_(),
      __logMsg   = __logObj._logMsg_,
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

      configMap  = {
        _trans_ms_      : 350, // transition time
        _active_class_  : aKey + '-_x_active_',
        _main_tmplt_     : __p( __blank
          + '<div id="{_p_}-_lb_mask_" class="{_p_}-_lb_mask_"></div>'
          + '<div id="{_p_}-_lb_spin_" class="{_p_}-_lb_spin_">&#xf021;'
          + '</div><div id="{_p_}-_lb_"></div>'
        ),
        _local_tmplt_    : __p( __blank
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
        _erow_tmplt_    : __p( __blank
          + '<div class="{_p_}-_lb_error_row_">'
          + '<div class="{_p_}-_lb_error_row_code_">{_code_}</div>'
          + '<div class="{_p_}-_lb_error_row_name_">{_name_}</div>'
          + '<div class="{_p_}-_lb_error_row_descr_">{_descr_}</div>'
          + '</div>'
        ),
        _error_tmplt_   : __p( __blank
          + '<div class="{_p_}-_lb_error_">'
          + '<h1>Error</h1>'
          + '<div class="{_p_}-_lb_error_list_">'
          + '{_inner_html_}'
          + '</div>'
          + '</div>'
        ),
        _tmplt_map_     : {
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
        },

        // These are used for autosizing
        _small_w_px_    : 677,
        _med_w_px_      : 900,
        _small_w_ratio_ : 0.90,
        _med_w_ratio_   : 0.75,
        _lg_w_ratio_    : 0.50
      },
      stateMap   = {
        _cleanup_fn_    : __undef,  // Clean up function (bound)
        _cleanup_toid_  : __undef,  // Clean up timeout id
        _close_toid_    : __undef,  // Close timeout id
        _is_masked_     : __false,  // Mask-on flag
        _is_ready_      : __false,  // Has DOM been initialized?
        _is_busy_       : __false,  // Is litebox in use?
        _mod_class_str_ : __blank,  // Caller specified class(es) for lb
        _onclose_fn_    : __undef   // Callback function on close
      },
      $Map,

      coordDraggable, instanceMap, optionMap
    ;
    // == . END MODULE SCOPE VARIABLES =================================

    // == BEGIN UTILITY METHODS ========================================
    // == . END UTILITY METHODS ========================================

    // == BEGIN DOM METHODS ============================================
    // BEGIN DOM method /set$Map/
    function set$Map () {
      $Map = {
        _$view_     : $( window ),
        _$body_     : $( 'body' ),
        _$litebox_  : $( '#' + aKey + '-_lb_' ),
        _$mask_     : $( '#' + aKey + '-_lb_mask_' ),
        _$spin_     : $( '#' + aKey + '-_lb_spin_' )
      };
    }
    // . END DOM method /set$Map/

    // BEGIN DOM method /getBodyScrollPx/
    // Purpose : Fixes scroll number for Firefox
    function getBodyScrollPx () {
      return window.pageYOffset
        || window.document.documentElement.scrollTop
        || $Map._$body_[ vMap._prop_ ]( vMap._scrollTop_ )
        || __0;
    }
    // END DOM meethod /getBodyScrollPx/

    // BEGIN DOM method /initModuleFn/
    // Summary   : initModuleFn()
    // Purpose   : Initialize DOM and state data if needed
    // Example   : initModuleFn();
    // Arguments : None
    // Returns   : undefined
    // Throws    : None
    //
    function initModuleFn () {
      if ( stateMap._is_ready_ ) { return; }

      // Add to DOM
      $( vMap._body_ )[ vMap._append_ ]( configMap._main_tmplt_ );

      // Cache jQuery (xhiJQ) collections and set state
      set$Map();
      $Map._$litebox_[ vMap._css_ ]( cssKmap._display_, cssVmap._none_ );
      $Map._$mask_[ vMap._css_ ]( cssKmap._display_, cssVmap._none_ );
      stateMap._is_ready_ = __true;
    }
    // . END DOM method /initModuleFn/

    // BEGIN DOM method /addLocalSpinFn/
    // Summary   : addLocalSpinFn( <jquery_obj> )
    // Purpose   : Add a spinner to jquery collection
    // Example   : addLocalSpinFn( $my_box );
    // Arguments : (positional)
    //   <jquery_obj> - Object to add local spin html
    // Settings  : uses configMap
    // Returns   : undefined
    // Throws    : None
    //
    function addLocalSpinFn ( arg_$box ) {
      var $box = __castJQ( arg_$box );

      if ( $box ) { $box[ vMap._html_ ]( configMap._local_tmplt_ ); }
    }    // . END DOM method /addLocalSpinFn/

    // BEGIN DOM method /cleanUpFn/
    // Summary   : cleanUpFn()
    // Purpose   : Clean data and DOM after litebox hide
    // Example   : cleanUpFn()
    // Arguments : None
    // Settings  : Changes stateMap, $Map
    // Returns   : undefined
    // Throws    : None
    //
    function cleanUpFn () {
      var ctx_obj = this;
      stateMap._cleanup_toid_ = __undef;

      /* istanbul ignore next */
      if ( !ctx_obj ) { return; }

      $Map._$mask_[ vMap._removeAttr_ ]( vMap._style_ )[
        vMap._css_ ]( cssKmap._display_, cssVmap._none_ );
      $Map._$litebox_[ vMap._removeAttr_ ]( vMap._style_ )[
        vMap._css_ ]( cssKmap._display_, cssVmap._none_ )[
        vMap._removeClass_ ]( ctx_obj._mod_class_str_ );

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
      if ( ctx_obj._callback_fn_ ) {
        ctx_obj._callback_fn_( $Map._$litebox_, $Map._$mask_ );
      }
      stateMap._is_busy_       = __false;
      stateMap._mod_class_str_ = __blank;
      stateMap._is_masked_     = __false;
      $Map._$litebox_[ vMap._off_ ]();
    }
    // . END DOM method /cleanUpFn/

    // BEGIN DOM method /hideLbFn/
    // Summary   : hideLbFn( <cleanup_fn> )
    // Purpose   : Remove litebox and content
    // Example   : hideLbFn( onHideLitebox );
    // Arguments : (positional)
    //   <cleanup_fn> - Function to execute on cleanup.
    //   This callback receives no arguments.
    // Settings  : Changes stateMap, $Map
    // Returns   : $Map._$litebox_
    // Throws    : None
    //
    function hideLbFn ( arg_callback_fn ) {
      var
        callback_fn  = __castFn( arg_callback_fn ),
        active_class = configMap._active_class_,
        clean_smap, clean_fn;

      initModuleFn();

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
        $Map._$mask_[ vMap._removeClass_ ]( active_class );

        clean_fn                = cleanUpFn[ vMap._bind_ ]( clean_smap );
        stateMap._cleanup_fn_   = clean_fn;
        stateMap._cleanup_toid_ = __setTo( clean_fn, configMap._trans_ms_ );
      }
      return $Map._$litebox_;
    }
    // . END DOM method /hideLbFn/

    // BEGIN DOM method /closeLbFn/
    // Summary   : closeLbFn( <cleanup_fn> )
    // Purpose   : Remove litebox and content
    // Example   : closeLbFn( onHideLitebox );
    // Arguments : (positional)
    //   <callback_fn> - function after cleanup.
    //   This callback receives no arguments.
    // Settings  : Changes stateMap, $Map
    //   Unlike /hideLbFn/, if configMap._onclose_fn_ exists
    //   this callback is fired BEFORE and DOM manipulation.
    //   It receives the $litebox and $mask pointers.
    // Returns   : $Map._$litebox_
    // Throws    : None
    //
    function closeLbFn ( cleanup_fn ) {
      var is_good;
      initModuleFn();
      // Do not close litebox on falsey return from _onclose_fn_
      if ( configMap._onclose_fn_ ) {
        is_good = configMap._onclose_fn_( $Map._$litebox_, $Map._$mask_ );
        if ( is_good ) { return hideLbFn( cleanup_fn ); }
        return $Map._$litebox_;
      }
      return hideLbFn( cleanup_fn );
    }
    // . END DOM method /closeLbFn/

    // BEGIN method /showBusyFn/
    // Summary   : showBusyFn( <msg_str> )
    // Purpose   : Show a busy litebox
    // Example   : showBusyFn( 'Why am I so busy?' );
    // Arguments : (positional)
    //   <msg_str> - Message content for busy
    // Settings  : Changes stateMap, $Map
    // Returns   : undefined
    // Throws    : None
    function showBusyFn ( /*msg_str*/ ) {
      var active_class = configMap._active_class_;
      initModuleFn();
      hideLbFn();

      $Map._$mask_[ vMap._css_ ]( cssKmap._display_, cssVmap._block_ )[
        vMap._addClass_ ]( active_class );
      stateMap._is_masked_ = __true;
      $Map._$spin_[ vMap._addClass_ ]( active_class );

      // TODO 2017-07-21 mmikowski warn: Add litebox messages
      // if ( msg_str )(
      //   $Map._$msg_[ vMap._text_ ]( msg_str );
      // )
    }
    // . END method /showBusyFn/

    // BEGIN method /hideBusyFn/
    // Summary   : hideBusyFn()
    // Purpose   : Hides busy indicator
    // Example   : hideBusyFn();
    // Arguments : none
    // Settings  : Changes stateMap, $Map
    // Returns   : undefined
    // Throws    : None
    //
    function hideBusyFn () {
      var active_class = configMap._active_class_;
      initModuleFn();
      hideLbFn();

      $Map._$mask_[ vMap._css_ ]( cssKmap._display_, cssVmap._none_ )[
        vMap._removeClass_ ]( active_class );
      stateMap._is_masked_ = __false;
      $Map._$spin_[ vMap._removeClass_ ]( active_class );
    }
    // . END method /hideBusyFn/

    // BEGIN DOM method /afterShowFn/
    // Purpose   : Finish presentation of litebox after it is shown
    //
    function afterShowFn () {
      var
        ctx_obj      = this,
        do_abs_pos   = ctx_obj._do_abs_pos_,
        do_sizing    = ctx_obj._do_sizing_,
        do_mask      = ctx_obj._do_mask_,
        $litebox     = ctx_obj._$litebox_,
        $mask        = ctx_obj._$mask_,
        onshow_fn    = ctx_obj._onshow_fn_,
        active_class = configMap._active_class_,

        lb_h_px, lb_w_px, view_h_px, view_w_px,
        max_w_px, margin_left_px, margin_top_px, css_map
        ;

        view_h_px = $Map._$view_[ vMap._outerHeight_ ]();
        view_w_px = $Map._$view_[ vMap._outerWidth_  ]();

      if ( do_sizing ) {
        lb_h_px   = $litebox[ vMap._outerHeight_ ]();
        lb_w_px   = $litebox[ vMap._outerWidth_  ]();

        // Begin fix width if too large for window
        if ( view_w_px < configMap._small_w_px_ ) {
          max_w_px = view_w_px * configMap._small_w_ratio_;
        }
        else if ( view_w_px < configMap._med_w_px_ ) {
          max_w_px = view_w_px * configMap._med_w_ratio_;
        }
        else {
          max_w_px = view_w_px * configMap._lg_w_ratio_;
        }
        if ( lb_w_px > max_w_px ) {
          $litebox[ vMap._css_ ]( cssKmap._width_, max_w_px );
          lb_h_px   = $litebox[ vMap._outerHeight_ ]();
          lb_w_px   = $litebox[ vMap._outerWidth_  ]();
        }
        // End fix width if too large for window

        margin_left_px = - ( lb_w_px / 2 );
        margin_top_px  = - ( lb_h_px / 2 );

        css_map = {
          'margin-top'  : margin_top_px,
          'margin-left' : margin_left_px,
          left          : Math.round( view_w_px / __2 ),
          top           : Math.round( view_h_px / __2 )
        };
        if ( do_abs_pos ) {
          css_map.top += getBodyScrollPx();
        }
        $litebox[ vMap._css_ ]( css_map );
      }

      if ( do_mask ) {
        $mask[ vMap._css_ ]( cssKmap._display_, cssVmap._block_ )[
          vMap._addClass_ ]( active_class );
      }

      if ( onshow_fn ) { onshow_fn( $litebox, $mask ); }

      $litebox[ vMap._addClass_ ]( active_class );
    }
    // . END DOM method /afterShowFn/

    // BEGIN method /showLbFn/
    // Summary   : showLbFn( <arg_map> );
    // Purpose   : Show litebox with content.
    // Examples  :
    //  aMap._06_lb_._showLbFn_({
    //    _layout_key_   : '_top_',
    //    _title_html_   : 'My title',
    //    _content_html_ : 'Content here',
    //  });
    //
    //  aMap._06_lb_._showLbFn_({
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
    // Arguments (named) :
    //   * _autoclose_ms_   : (infinity) Cancels the window after n milliseconds
    //   * _content_html_   : (50% ht loading graphic) Content in main panel
    //   * _close_html_     : (blank) Close symbol or text
    //   * _do_abs_pos_     : (false) Use absolute position to body
    //   * _do_block_click_ : (false) Block user click on mask to close?
    //   * _do_dflt_class_  : (true) Keep default litebox class?
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
    //       Default position is centered and natural width.
    //       Width is limited to 50% on large windows, 75% on medium, and
    //       90% on small (see configMap._small_w_ratio_, etc)
    //   * _onclose_fn_     : (null) A function called when close is requested.
    //       THE LITEBOX IS CLOSED IFF IT RETURNS A TRUTHY VALUE.
    //   * _onshow_fn_      : (null) A function to after rendering and
    //       animations are complete.
    //      The $lite_box and $mask are provided as positional arguments
    //      to this function.
    //   * _title_html_     : title string
    //
    // Settings  : Changes stateMap, $Map
    // Returns   : $litebox
    // Throws    : None
    //
    function showLbFn ( arg_map ) {
      initModuleFn();
      var
        map           = __castMap( arg_map, {} ),
        close_html    = __castStr( map._close_html_, __blank ),
        content_html  = __castStr( map._content_html_, __blank ),
        layout_key    = __castStr( map._layout_key_ ) || '_top_',
        mod_class_str = __castStr( map._mod_class_str_, __blank ),
        title_html    = __castStr( map._title_html_, __blank ),

        autoclose_ms  = __castInt( map._autoclose_ms_ ),
        position_map  = __castMap( map._position_map_ ),

        do_abs_pos    = __castBool( map._do_abs_pos_, __false ),
        do_bclick     = __castBool( map._do_block_click_, __false ),
        do_draggable  = __castBool( map._do_draggable_, __true ),
        do_dflt_class = __castBool( map._do_dflt_class_, __true ),
        do_mask       = __castBool( map._do_mask_, __true ),
        do_tclose     = __castBool( map._do_title_close_, __true ),
        onclose_fn    = __castFn( map._onclose_fn_, __null ),
        onshow_fn     = __castFn( map._onshow_fn_, __null ),

        active_class  = configMap._active_class_,
        $litebox      = $Map._$litebox_,
        $mask         = $Map._$mask_,

        do_sizing, css_map, inner_html,
        $title, $close, $content,
        aftershow_smap, aftershow_fn
      ;

      // Close previously open litebox
      if ( stateMap._is_busy_ ) { hideLbFn(); }

      // Clean-up any lingering fades, etc
      if ( stateMap._cleanup_toid_ && stateMap._cleanup_fn_ ) {
        __clearTo( stateMap._cleanup_toid_ );
        stateMap._cleanup_fn_();
      }

      // Fill litebox content with desired layout
      inner_html = __tmplt( {
        _input_str_  : configMap._tmplt_map_[ layout_key ],
        _lookup_map_ : {
          _close_html_   : close_html,
          _content_html_ : content_html,
          _title_html_   : title_html
        }
      } );
      $litebox[ vMap._html_ ]( inner_html );

      // Cache jQuery (xhiJQ) collections
      $close   = $litebox[ vMap._find_ ]( '.' + aKey + '-_lb_close_' );
      $content = $litebox[ vMap._find_ ]( '.' + aKey + '-_lb_content_' );
      $title   = $litebox[ vMap._find_ ]( '.' + aKey + '-_lb_title_' );

      $Map._$close_   = $close;
      $Map._$content_ = $content;
      $Map._$title_   = $title;

      $content[ vMap._find_ ]( '.' + aKey + '-_lb_spin_' )[
        vMap._addClass_ ]( active_class );

      // Store close button function
      configMap._onclose_fn_ = onclose_fn;

      // Hide or show close button
      if ( close_html ) {
        $close[ vMap._css_ ]( cssKmap._display_, cssVmap._block_ )[
          vMap._on_ ]( vMap._utap_, closeLbFn );
      }

      // Tap-on-title to close support
      if ( do_tclose && $title ) {
        $title[ vMap._css_ ]( cssKmap._display_, cssVmap._block_ )[
          vMap._on_ ]( vMap._utap_, closeLbFn );
      }

      // Configure mask tap
      if ( do_mask ) {
        $mask[ vMap._addClass_ ]( active_class );
        if ( do_bclick ) {
          $mask[ vMap._addClass_ ]( aKey + '-_lb_x_noclick_' );
          $mask[ vMap._off_ ]( vMap._utap_, closeLbFn );
        }
        else {
          $mask[ vMap._removeClass_ ]( aKey + '-_lb_x_noclick_' )[
            vMap._on_ ]( vMap._utap_, closeLbFn );
        }
      }

      // Handle autoclose
      if ( autoclose_ms ) {
        stateMap._close_toid_ = __setTo( closeLbFn, autoclose_ms );
      }

      // Handle position map
      if ( position_map ) {
        do_sizing = __false;
        css_map   = position_map;
      }
      else {
        do_sizing = __true;
        css_map   = { top : '-100%', left : '-100%' };
      }
      css_map.display = cssVmap._block_;

      // Prepend default class if do_dflt_class is true
      if ( do_dflt_class ) {
        mod_class_str = aKey + '-_lb_ ' + mod_class_str;
      }

      // Prepend local class if do_abs_pos_ is true
      stateMap._do_abs_pos_ = do_abs_pos;
      if ( do_abs_pos ) {
        mod_class_str = aKey + '-_x_local_ ' + mod_class_str;
      }
      $litebox[ vMap._addClass_ ]( mod_class_str );
      stateMap._mod_class_str_ = mod_class_str;

      // Show and (if requested) size litebox
      aftershow_smap = {
        _$litebox_  : $litebox,
        _$mask_     : $mask,
        _do_mask_   : do_mask,
        _do_sizing_ : do_sizing,
        _do_abs_pos_ : do_abs_pos,
        _onshow_fn_ : onshow_fn
      };
      aftershow_fn   = afterShowFn[ vMap._bind_ ]( aftershow_smap );
      $litebox[ vMap._css_ ]( css_map )[ vMap._show_ ]( aftershow_fn );

      // Coordinate draggable if requested
      coordDraggable( $title, do_draggable );

      stateMap._is_busy_ = __true;
      return $litebox;
    }
    // . END method /showLbFn/
    // == . END DOM METHODS =============================================

    // == BEGIN EVENT HANDLERS ==========================================
    // The event handlers are impossible to test well without a browser.
    // Skipped in coverage.
    /* istanbul ignore next */
    function onDragstart ( event_obj ) {
      var
        $target    = $( event_obj.elem_target ),
        offset_map = $Map._$litebox_.offset();

      $target[ vMap._css_ ]( cssKmap._cursor_, cssVmap._move_ );
      stateMap._$drag_target_ = $target;
      stateMap._body_scroll_px_ = getBodyScrollPx();

      offset_map[ cssKmap._right_ ]  = __blank;
      offset_map[ cssKmap._bottom_ ] = __blank;
      offset_map[ cssKmap._margin_ ] = __0;
      if ( ! stateMap._do_abs_pos_ ) {
        offset_map[ cssKmap._top_ ] -= stateMap._body_scroll_px_;
      }
      $Map._$litebox_[ vMap._css_ ]( offset_map );
    }

    /* istanbul ignore next */
    function onDragmove ( event_obj ) {
      var offset_map = $Map._$litebox_.offset();
      if ( ! stateMap._do_abs_pos_ ) {
        offset_map.top -= stateMap._body_scroll_px_;
      }
      offset_map.top += event_obj.px_delta_y;
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

    // BEGIN public method /handleResizeFn/
    // Summary   : handleResizeFn( <size_map> )
    // Purpose   : Adjust litebox for screen size change
    // Example   : handleResizeFn({ _window_h_px_ : 1280, _window_w_px_ : 768 });
    // Arguments : (named)
    //   _window_h_px_ : Window height in pixels
    //   _window_w_px_ : Window width in pixels
    // Settings  : Changes stateMap, $Map
    // Returns   :
    //   true  - resize successful
    //   false - no resize processed
    // Throws    : None
    //   Adjusts the litebox and mask to provided window width and
    //   height.  This should be called when the window is resized, typically
    //   throttled using __util._makeThrottleFn_.
    //
    function handleResizeFn ( arg_map ) {
      var
        map       = __castMap( arg_map, {} ),
        window_h_px = __castNum( map._window_h_px_ ),
        window_w_px = __castNum( map._window_w_px_ ),
        $litebox  = $Map._$litebox_,

        h_px, w_px
      ;

      if ( !( window_h_px && window_w_px && $litebox ) ) { return __false; }

      if ( stateMap._is_masked_ ) {
        $litebox = $Map._$litebox_;
        w_px     = $litebox[ cssKmap._width_ ]();
        h_px     = $litebox[ cssKmap._height_ ]();

        $litebox[ vMap._css_ ]( {
          top  : vMap._makeFloorNumFn_(
            ( window_h_px - h_px ) / __2 + nMap._d5_
          ),
          left : vMap._makeFloorNumFn_(
            ( window_w_px - w_px ) / __2 + nMap._d5_
          )
        } );
      }
      stateMap._window_w_px_   = window_w_px;
      stateMap._window_h_px_   = window_h_px;
      stateMap._resize_toid_ = __undef;
      return __true;
    }
    // . END public method /handleResizeFn/
    // == . END EVENT HANDLERS ==========================================

    // == BEGIN COORDINATORS =============================================
    // This method is here because they tie DOM methods to handlers.
    // We must assign this functions to a variable declared earlier
    // so that static analysis does not fail.
    //
    function coordDraggable0 ( $title, do_draggable ) {
      if ( do_draggable ) {
        $title[ vMap._on_ ]( vMap._udragstart_, onDragstart );
        $title[ vMap._on_ ]( vMap._udragmove_, onDragmove );
        $title[ vMap._on_ ]( vMap._udragend_, onDragend );
      }
      else {
        $title[ vMap._off_ ]( vMap._udragstart_, onDragstart );
        $title[ vMap._off_ ]( vMap._udragmove_, onDragmove );
        $title[ vMap._off_ ]( vMap._udragend_, onDragend );
      }
    }
    coordDraggable = coordDraggable0;
    // == . END COORDINATORS =============================================

    // == BEGIN PUBLIC METHODS ==========================================
    // BEGIN public method /showSuccessFn/
    // Summary   : showSuccessFn( <success_msg> )
    // Purpose   : Show a success message
    // Example   : showSuccessFn( 'This works!' );
    // Arguments : (positional)
    //   <success_msg> - String to display
    // Settings  : Wraps showLbFn
    // Returns   : $litebox
    // Throws    : None
    //
    function showSuccessFn ( arg_str ) {
      var
        msg_str      = __castStr( arg_str, __blank ),
        content_html = __tmplt( {
          _input_str_  : configMap._success_tmplt_,
          _lookup_map_ : {
            _msg_str_ : msg_str
          }
        } );

      initModuleFn();
      return showLbFn( { _content_html_ : content_html } );
    }
    // . END public method /showSuccessFn/

    // BEGIN public method /showErrorTableFn/
    // Summary   : showErrorTableFn( <error_table> )
    // Purpose   : Show an error table
    // Example   : showErrorTableFn([
    //     { _code_ : 'xyz', _name_ : 'Oops!', _descr_ : 'Goofy' }
    //   ]);
    // Arguments : (positional)
    //   <error_table> - List of maps to display
    // Settings  : Wraps showLbFn
    // Returns   : $litebox
    // Throws    : None
    //
    function showErrorTableFn ( arg_error_table ) {
      var
        error_table = __castList( arg_error_table, [] ),
        row_count   = error_table[ vMap._length_ ],
        inner_html  = __blank,

        idx, row_map, lookup_map, content_html;

      initModuleFn();
      ROW: for ( idx = __0; idx < row_count; idx++ ) {
        row_map = __castMap( error_table[ idx ] );

        if ( !row_map ) { continue ROW; }
        lookup_map = __util._cloneData_( row_map );

        inner_html += __tmplt( {
          _input_str_  : configMap._erow_tmplt_,
          _lookup_map_ : lookup_map
        } );
      }

      content_html = __tmplt( {
        _input_str_  : configMap._error_tmplt_,
        _lookup_map_ : {
          _inner_html_ : inner_html || 'unknown error'
        }
      } );
      return showLbFn( { _content_html_ : content_html } );
    }
    // . END public method /showErrorTableFn/

    // BEGIN Public method /getMapFn/
    // Summary   : getMapFn( <type_str_> );
    // Purpose   : Get stateMap or configMap to inspect or change
    // Example   : getMapFn( '_configMap_' );
    // Arguments : (positional)
    //   <type_str> - Either '_configMap_' or '_stateMap_'
    // Settings  : Relies on configMap and stateMap
    // Returns   : Requested map, undefined if not found
    // Throws    : None
    //
    function getMapFn ( type_str ) {
      if ( type_str === '_configMap_' ) {
        return configMap;
      }
      if ( type_str === '_stateMap_' ) {
        return stateMap;
      }
      if ( type_str === '_$map_' ) {
        return $Map;
      }
      __logMsg( '_warn_', '_requested_map_not_available_', type_str );
    }
    // . END Public method /getMapFn/

    // BEGIN Public method /setConfigMapFn/
    function setConfigMapFn ( arg_set_map ) {
      return __util._setConfigMap_({
        _input_map_    : arg_set_map,
        _settable_map_ : { _onclose_fn_ : __true },
        _config_map_   : configMap
      });
    }
    // . END Public method /setConfigMapFn/

    instanceMap = {
      _addLocalSpinFn_  : addLocalSpinFn,
      _closeLbFn_       : closeLbFn,
      _getMapFn_        : getMapFn,
      _handleResizeFn_  : handleResizeFn,
      _hideBusyFn_       : hideBusyFn,
      _hideLbFn_        : hideLbFn,
      _setConfigMapFn_  : setConfigMapFn,
      _showBusyFn_      : showBusyFn,
      _showErrorTableFn_ : showErrorTableFn,
      _showLbFn_        : showLbFn,
      _showSuccessFn_   : showSuccessFn,

      _initModuleFn_ : initModuleFn
    };

    optionMap = __util._castMap_( argOptionMap, {} );
    if ( optionMap._dont_autoadd_ !== __true ) {
      aMap[ subName ] = instanceMap;
    }

    return instanceMap;
    // == . END PUBLIC METHODS =========================================
  }
  // == . END public method /makeInstanceFn/ ===========================
  return { _makeInstanceFn_ : makeInstanceFn };
}( xhiJQ ));
// == . END MODULE xhi._06_lb_ =========================================

