/*global xhi, tb02 */
// == BEGIN MODULE tb02 ===============================================
// Create root namespace map 'tb02'
xhi._00_root_._makeInstanceFn_( 'tb02' );
tb02._extendSymbolMapFn_(
  '_vMap_',
  { _appendChild     : 'appendChild',
    _change_         : 'change',
    _charAt_         : 'charAt',
    _fadeOut_        : 'fadeOut',
    _fromCharCode_   : 'fromCharCode',
    _gevent_         : 'gevent',
    _get_            : 'get',
    _hide_           : 'hide',
    _keypress_       : 'keypress',
    _keydown_        : 'keydown',
    _localStorage_   : localStorage,
    _preventDefault_ : 'preventDefault',
    _publish_        : 'publish',
    _remove_         : 'remove'
  }
);
// == . END MODULE tb02 ===============================================
