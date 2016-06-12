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
  var
    __n1    = -1,
    elList  = [],
    topCmap = {
      _margin_int_ : 16,
      _namespace_  : '.xhi-_scrolli_',
      _top_class_  : 'xhi-_x_top_on_',
      _btm_class_  : 'xhi-_x_btm_on_'
    },

    add$List,
    rm$List
    ;

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

  function wrapList ( $list ) {
    var do_fn = this;
    $list.each(function () { do_fn( $(this) ); });
  }

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
  
  function recalc$All () {
    var i, el;
    if ( elList && elList.length ) {
      for ( i = 0; i < elList.length; i++ ) {
        el = elList[ i ];
        recalcSingle( $(el) );
      }
    }
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
  
  add$List    = wrapList.bind( addSingle );
  rm$List     = wrapList.bind( rmSingle  );

  function reSet () { rm$List( elList ); }

  return {
    _add$List_    : add$List,
    _recalc$All_  : recalc$All,
    _rm$List_     : rm$List,
    _reSet_       : reSet
  };
}( jQuery ));
