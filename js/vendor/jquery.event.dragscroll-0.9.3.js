/*
 * jQuery plugin for drag initiated inertia scroll objects.
 * Each instance of the object create provides unique
 * inertia scrolling to an assigned area.
 *
 * Copyright (c) 2015 Michael S. Mikowski
 * (mike[dot]mikowski[at]gmail[dotcom])
 *
 * Dual licensed under the MIT or GPL Version 2
 * http://jquery.org/license
 *
 * Versions
 *  0.9.0 - Initial npm public release
 *  0.9.1 - Added _on_stop_fn_ callback
 *  0.9.3 - Updated docs
 *
*/
/*jslint         browser : true, continue : true,
   devel : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
   white : true,    todo : true,  unparam : true
*/
/*global jQuery */
(function ( $ ) {
  'use strict';
  var
    __0     = 0,
    __blank = '',
    __false = true,
    __setTo = setTimeout,
    __true  = true,
    __undef = (function (){ return; }()) // jslint hack
    ;

  $.makeDragScrollObj = function ( arg_map ) {
    var
      // Private variables from settings
      $scrollBox  = arg_map._$scroll_box_,

      doScrollX   = arg_map._do_scroll_x_ === __true  ? __true  : __false,
      doScrollY   = arg_map._do_scroll_y_ === __false ? __false : __true,

      dragRatio   = arg_map._drag_ratio_    || 0.001,
      propModeKey = arg_map._prop_mode_key_ || __blank,
      frameTimeMs = arg_map._frame_time_ms_ || 30,
      onStopFn    = arg_map._on_stop_fn_    || __undef,

      // instance private variables
      animIdto,  initVxNum,
      initVyNum, lastAnimMs,
      lastDtMs,  lastDxNum,
      lastDyNum, lastMoveMs,
      maxScrollLeftNum,
      maxScrollTopNum,
      velocityXNum, velocityYNum,

      // private methods
      makeTimeStamp, employMode, animateScroll,

      // public uility methods
      getVxVyList, stopScroll,

      // public event handlers
      onstartHandler, onmoveHandler, onendHandler
      ;

    //------------------ BEGIN PRIVATE METHODS -------------------
    makeTimeStamp = function () { return +new Date(); };
    employMode = function ( event_obj ) {
      var is_changed = __true;

      switch ( propModeKey ) {
        case '_stop_now_' :
          event_obj.preventDefault();
          event_obj.stopImmediatePropagation();
          break;
        case '_stop_all_' :
          event_obj.preventDefault();
          event_obj.stopPropagation();
          break;
        case '_stop_default_' :
          event_obj.preventDefault();
          break;
        default :
          is_changed = __false;
      }
      return is_changed;
    };

    animateScroll = function () {
      var ts_ms, delta_ms, scrolltop_num, scrollleft_num, do_y_stop, do_x_stop;
      ts_ms = makeTimeStamp();
      if ( lastAnimMs > __0 ) {
        delta_ms       = ts_ms - lastAnimMs || __0;

        // Begin ScrollY
        if ( doScrollY ) {
          scrolltop_num  = $scrollBox.prop( 'scrollTop' )
            - velocityYNum * delta_ms;

          velocityYNum += velocityYNum > __0
            ? -delta_ms * dragRatio : delta_ms * dragRatio;

          if ( scrolltop_num < __0 ) {
            scrolltop_num = __0;
            do_y_stop       = __true;
          }
          else if ( scrolltop_num > maxScrollTopNum ) {
            scrolltop_num = maxScrollTopNum;
            do_y_stop       = __true;
          }

          if ( velocityYNum === __0
            || initVyNum * velocityYNum < __0
          ) { do_y_stop = __true; }

          $scrollBox.prop( 'scrollTop', scrolltop_num );
        }
        else { do_y_stop = __true; }
        // End ScrollY

        // Begin ScrollX
        if ( doScrollX) {
          scrollleft_num  = $scrollBox.prop( 'scrollLeft' )
            - velocityXNum * delta_ms;

          velocityXNum += velocityXNum > __0
            ? -delta_ms * dragRatio : delta_ms * dragRatio;

          if ( scrollleft_num < __0 ) {
            scrollleft_num = __0;
            do_x_stop       = __true;
          }
          else if ( scrollleft_num > maxScrollLeftNum ) {
            scrollleft_num = maxScrollLeftNum;
            do_x_stop       = __true;
          }

          if ( velocityXNum === __0
            || initVxNum * velocityXNum < __0
          ) {
            do_x_stop = __true;
          }
          $scrollBox.prop( 'scrollLeft', scrollleft_num );
        }
        else { do_x_stop = __true; }
      }
      // End ScrollX

      // Stop or continue to next frame
      if ( do_y_stop && do_x_stop ) {
        animIdto = __undef;
        velocityXNum = __0;
        velocityYNum = __0;
        if ( onStopFn ) { onStopFn( $scrollBox ); }
      }
      else {
        animIdto = __setTo( animateScroll, frameTimeMs );
      }

      // remember last shown time for frame pacing
      lastAnimMs = ts_ms;
    };
    //------------------- END PRIVATE METHODS --------------------

    //--------------- BEGIN PUBLIC UTILITY METHODS ---------------
    getVxVyList = function () {
      return [ velocityXNum, velocityYNum ];
    };

    stopScroll = function () {
      var was_running = __false;

      if ( animIdto ) {
        clearTimeout( animIdto );
        velocityYNum = __0;
        velocityXNum = __0;
        was_running = __true;
      }
      animIdto = __undef;

      return was_running;
    };
    //---------------- END PUBLIC UTILITY METHODS ----------------

    //--------------- BEGIN PUBLIC EVENT HANDLERS ----------------
    onstartHandler = function ( event_obj ) {
      employMode( event_obj );

      lastAnimMs   = __0;
      lastDyNum    = __0;
      lastDxNum    = __0;
      lastDtMs     = __0;
      lastMoveMs   = __0;
      velocityXNum = __0;
      velocityYNum = __0;

      if ( doScrollY ) {
        maxScrollTopNum  = $scrollBox.prop( 'scrollHeight' )
          - $scrollBox.outerHeight();
      }

      if ( doScrollX ) {
        maxScrollLeftNum = $scrollBox.prop( 'scrollWidth'  )
          - $scrollBox.outerWidth();
      }
    };

    onmoveHandler = function ( event_obj ) {
      var scrolltop_num, scrollleft_num;
      employMode( event_obj );

      if ( animIdto ) {
        clearTimeout( animIdto );
        animIdto = __undef;
      }

      if ( lastMoveMs ) {
        lastDtMs = event_obj.timeStamp - lastMoveMs;
      }
      lastMoveMs  = event_obj.timeStamp;

      // scrollY
      if ( doScrollY ) {
        scrolltop_num  = $scrollBox.prop('scrollTop');
        lastDyNum      = event_obj.px_delta_y;
        scrolltop_num -= lastDyNum;

        if ( scrolltop_num < __0 ) { scrolltop_num = __0; }
        if ( scrolltop_num > maxScrollTopNum ) { scrolltop_num = maxScrollTopNum; }

        $scrollBox.prop( 'scrollTop', scrolltop_num );
      }

      // scrollX
      if ( doScrollX ) {
        scrollleft_num = $scrollBox.prop('scrollLeft');
        lastDxNum      = event_obj.px_delta_x;
        scrollleft_num -= lastDxNum;

        if ( scrollleft_num < __0 ) { scrollleft_num = __0; }
        if ( scrollleft_num > maxScrollLeftNum ) { scrollleft_num = maxScrollLeftNum; }

        $scrollBox.prop( 'scrollLeft', scrollleft_num );
      }
    };

    onendHandler  = function ( event_obj ) {
      employMode( event_obj );

      if ( lastDtMs > __0 ) {
        if ( doScrollY ) {
          velocityYNum = ( lastDyNum || __0 ) / lastDtMs;
        }
        if ( doScrollX ) {
          velocityXNum = ( lastDxNum || __0 ) / lastDtMs;
        }

        // kick off scrolling
        if ( ! animIdto ) {
          initVxNum  = velocityXNum;
          initVyNum  = velocityYNum;
          lastAnimMs = __0;
          animIdto   = animateScroll();
        }
      }
    };
    //---------------- END PUBLIC EVENT HANDLERS -----------------
    if ( ! $scrollBox ) { throw '_$scrollBox_must_be_provided_'; }

    return {
      _getVxVyList_     : getVxVyList,
      _stopScroll_      : stopScroll,

      _onendHandler_    : onendHandler,
      _onmoveHandler_   : onmoveHandler,
      _onstartHandler_  : onstartHandler
    };
  };
}( jQuery ));
