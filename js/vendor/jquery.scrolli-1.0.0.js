/**
 *    jquery.scrolli.js
 *    Provides scroll content indicators
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
  white  : true,    todo : true,  unparam : true
*/
/*global jQuery */

jQuery.scrolli = (function ( $ ) {
  // ================= BEGIN MODULE SCOPE VARIABLES ====================
  //noinspection MagicNumberJS,MagicNumberJS
  'use strict';
  var
    __0     = 0,
    __n1    = -1,
    elList  = [],
    topSmap = {
      _last_recalc_ms_ : __n1,
      _recalc_toid_    : __n1
    },
    topCmap = {
      _margin_int_    : 32,
      _max_recalc_ms_ : 132,
      _namespace_     : '.p6-_scrolli_',
      _top_class_     : 'p6-_x_top_on_',
      _btm_class_     : 'p6-_x_btm_on_'
    };
  // ================== END MODULE SCOPE VARIABLES =====================

  // ===================== BEGIN UTILITY METHODS =======================
  function isjQuery ( obj ) {
    return obj && ( obj instanceof jQuery
      || obj.constructor.prototype.jquery )
      ;
  }

  function wrapList ( list_data ) {
    var
      bound_fn  = this,
      is_jquery = isjQuery( list_data ),
      el_count  = list_data.length,

      idx, $single
      ;

    for ( idx = __0; idx < el_count; idx++ ) {
      $single = is_jquery ? list_data.eq( idx ) : $( list_data[ idx ] );
      bound_fn( $single );
    }
  }

  function getNowMs () {
    if ( Date.now ) { return Date.now(); }
    return +new Date();
  }
  // ====================== END UTILITY METHODS ========================

  // ====================== BEGIN EVENT HANDLERS =======================
  function calcSingle () {
    var
      div_el        = this,
      $div          = $( div_el ),
      scroll_top    = div_el.scrollTop,
      scroll_height = div_el.scrollHeight,
      div_ht_num    = $div.outerHeight(),
      show_ht_num   = scroll_height - scroll_top - topCmap._margin_int_;

    if ( scroll_top > topCmap._margin_int_ ) {
      $div.addClass( topCmap._top_class_ );
    }
    else {
      $div.removeClass( topCmap._top_class_ );
    }
    if ( show_ht_num > div_ht_num ) {
      $div.addClass( topCmap._btm_class_ );
    }
    else {
      $div.removeClass( topCmap._btm_class_ );
    }
  }

  function onScrollDiv ( /*event_obj*/ ) {
    var
      div_el      = this,
      recalc_toid = topSmap._recalc_toid_,

      last_recalc_ms, now_ms, diff_ms
      ;

    if ( recalc_toid !== __n1 ) {
      clearTimeout( recalc_toid );
      topSmap._recalc_toid_ = __n1;
    }

    last_recalc_ms = topSmap._last_recalc_ms_;
    now_ms         = getNowMs();
    diff_ms        = now_ms - last_recalc_ms;

    if ( diff_ms > topCmap._max_recalc_ms_ ) {
      calcSingle.bind( div_el )();
      return topSmap._last_recalc_ms = getNowMs();
    }

    topSmap._recalc_toid_ = setTimeout(
      calcSingle.bind( div_el ),
      topCmap._max_recalc_ms_ - diff_ms
    );
  }
  // ======================= END EVENT HANDLERS ========================

  // ======================== BEGIN DOM METHODS ========================
  function addSingle( $single ) {
    var el = $single.get( __0 );
    if ( elList.indexOf( el ) > __n1 ) { return; }
    $single.on( 'scroll' + topCmap._namespace_, onScrollDiv );
    elList.push( el );
    calcSingle.bind( el )();
  }

  function rmSingle( $single ) {
    var
      el  = $single.get( __0 ),
      idx = elList.indexOf( el )
      ;

    if ( idx === __n1 ) { return; }
    $single.off( topCmap._namespace_  );
    $single.removeClass( topCmap._top_class_ + ' ' + topCmap._btm_class_ );
    elList.splice( idx, 1 );
  }
  // ========================= END DOM METHODS =========================

  // ====================== BEGIN PUBLIC METHODS =======================
  function recalc$All () {
    var i, el;
    if ( elList && elList.length ) {
      for ( i = __0; i < elList.length; i++ ) {
        el = elList[ i ];
        calcSingle.bind( el )();
      }
    }
  }

  function reSet () {
    wrapList.bind( elList ).call( null, elList );
  }

  return {
    _add$List_    : wrapList.bind( addSingle ),
    _recalc$All_  : recalc$All,
    _rm$List_     : wrapList.bind( rmSingle  ),
    _reSet_       : reSet
  };
  // ======================= END PUBLIC METHODS ========================
}( jQuery ));
