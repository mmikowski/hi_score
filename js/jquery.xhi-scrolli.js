/**
 *    jquery.xhi-scrolli.js
 *    Provides scrolli content indicators
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
    topCmap = {
      _margin_int_ : 16,
      _namespace_  : '.xhi-_scrolli_',
      _top_class_  : 'xhi-_x_top_on_',
      _btm_class_  : 'xhi-_x_btm_on_'
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
      $single = is_jquery ? list_data.index( idx ) : $( list_data[ idx ] );
      bound_fn( $single );
    }
  }
  // ====================== END UTILITY METHODS ========================

  // ====================== BEGIN EVENT HANDLERS =======================
  function onScrollDiv ( /*event_obj*/ ) {
    var
      $div          = $(this),
      scroll_top    = this.scrollTop,
      scroll_height = this.scrollHeight,
      div_ht_num    = $div.height(),
      show_ht_num   =
        scroll_height - scroll_top - topCmap._margin_int_
      ;

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
  // ======================= END EVENT HANDLERS ========================

  // ======================== BEGIN DOM METHODS ========================
  function addSingle( $single ) {
    var el = $single.get(0);
    if ( elList.indexOf( el ) > __n1 ) { return; }
    $single.on(
      'scroll' + topCmap._namespace_,
      $.debounce( 100, onScrollDiv )
    );
    elList.push( el );
    $single.trigger( 'scroll' + topCmap._namespace_ );
  }

  function recalcSingle( $single ) {
    $single.trigger( 'scroll' + topCmap._namespace_ );
  }

  function rmSingle( $single ) {
    var
      el  = $single.get(0),
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
      for ( i = 0; i < elList.length; i++ ) {
        el = elList[ i ];
        recalcSingle( $(el) );
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
