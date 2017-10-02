/*global $, xhi, tb02, Audio*/
// == BEGIN MODULE tb02._07_shell_ ====================================
tb02._07_shell_ = (function () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    aMap      = tb02,
    aKey      = aMap._aKey_,

    nMap      = aMap._nMap_,
    vMap      = aMap._vMap_,

    __0       = nMap._0_,

    __Str     = vMap._String_,
    __setTo   = vMap._setTimeoutFn_,
    __$sub    = $[ vMap._gevent_ ][ vMap._subscribe_ ],

    __util    = aMap._01_util_,
    __logObj  = __util._getLogObj_(),
    __logMsg  = __logObj._logMsg_,
    __p       = __util._makeReplaceFn_( '_p_', aKey ),

    configMap = {
      _main_html_  : __p(
        '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" '
        + 'class="{_p_}-_shell_bg_svg_" '
        + 'viewbox="0 0 100 100" preserveAspectRatio="none">'
        + '<path d="M 0,0 40,100 0,100 M 100,0 60,100 100,100"></path>'
        + '</svg>'
        + '<div class="{_p_}-_shell_title_">TypeB'
        + '<span class="{_p_}-_x_down_">o</span>mb'
        + '<span class="{_p_}-_x_release_">beta</span>'
        + '</div>'
        + '<div class="{_p_}-_shell_subtext_"></div>'
        + '<div class="{_p_}-_shell_hi_score_">High Score</div>'
        + '<div class="{_p_}-_shell_level_">'
        + '<div class="{_p_}-_shell_level_label_">Level</div>'
        + '<div class="{_p_}-_shell_level_count_"></div>'
        + '</div>'
        + '<div class="{_p_}-_shell_lives_">'
        + '<div class="{_p_}-_shell_lives_count_"></div>'
        + '<div class="{_p_}-_shell_lives_gfx_"></div>'
        + '</div>'
        + '<div class="{_p_}-_shell_typebox_"></div>'
        + '<div class="{_p_}-_shell_score_">'
        + '<div class="{_p_}-_shell_score_label_">Score</div>'
        + '<div class="{_p_}-_shell_score_int_"></div>'
        + '</div>'
      ),
      _bomb_html_  : __p(
        '<div id="{_id_}" class="{_p_}-_shell_bomb_">{_label_str_}</div>'
      ),
      _start_html_ : 'Select start level: ',

      _bomb_id_prefix_  : aKey + '-_shell_bomb_-',
      _lives_char_code_ : '&#xf004;',
      _key_sound_map_   : {
        _bkspc_    : 'clack',
        _returnd_  : 'kick',
        _char_add_ : 'click',
        _at_limit_ : 'honk'
      }
    },
    $Map, playSoundFn, animateExplodeFn
  ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN UTILITY METHODS =========================================
  // == . END UTILITY METHODS =========================================

  // == BEGIN DOM METHODS =============================================
  // BEGIN DOM method /set$MapFn/
  function set$MapFn ( $body ) {
    var
      $hi_score    = $body[ vMap._find_ ]( __p( '.{_p_}-_shell_hi_score_' ) ),
      $level       = $body[ vMap._find_ ]( __p( '.{_p_}-_shell_level_' ) ),
      $lives       = $body[ vMap._find_ ]( __p( '.{_p_}-_shell_lives_' ) ),
      $score       = $body[ vMap._find_ ]( __p( '.{_p_}-_shell_score_' ) ),
      $subtext     = $body[ vMap._find_ ]( __p( '.{_p_}-_shell_subtext_' ) ),
      $title       = $body[ vMap._find_ ]( __p( '.{_p_}-_shell_title_' ) ),
      $sell_fields = $( [
        $hi_score[ vMap._get_ ]( __0 ),
        $title[ vMap._get_ ]( __0 ),
        $subtext[ vMap._get_ ]( __0 )
      ] );

    $Map = {
      _$body_        : $body,
      _$bg_svg_      : $body[ vMap._find_ ](
        __p( '.{_p_}-_shell_bg_svg_' )
      ),
      _$sell_fields_ : $sell_fields,
      _$hi_score_    : $hi_score,
      _$level_       : $level,
      _$level_count_ : $level[ vMap._find_ ](
        __p( '.{_p_}-_shell_level_count_' )
      ),
      _$lives_       : $lives,
      _$lives_count_ : $lives[ vMap._find_ ](
        __p( '.{_p_}-_shell_lives_count_' )
      ),
      _$lives_gfx_   : $lives[ vMap._find_ ](
        __p( '.{_p_}-_shell_lives_gfx_' )
      ),
      _$score_       : $score,
      _$score_int_   : $score[ vMap._find_ ](
        __p( '.{_p_}-_shell_score_int_' )
      ),
      _$subtext_     : $subtext,
      _$title_       : $title,
      _$typebox_     : $body[ vMap._find_ ](
        __p( '.{_p_}-_shell_typebox_' )
      )
    };
  }

  // . END DOM method /set$MapFn/

  // BEGIN DOM method /playSoundFn/
  playSoundFn = (function () {
    var
      sound_name_list = [
        'clack', 'click', 'honk', 'kick',
        'thunder', 'wind', 'wavechange', 'whoosh'
      ],
      sound_obj_map   = {},

      sound_count, init_sound_fn, play_sound_fn;

    // BEGIN init_sound_fn
    init_sound_fn = function () {
      var i, name_count, sound_name;
      if ( sound_count > __0 ) { return; }// already initialized

      name_count = sound_name_list[ vMap._length_ ];

      for ( i = __0; i < name_count; i++ ) {
        sound_name = sound_name_list[ i ];
        sound_obj_map[ sound_name ] = new Audio( 'sound/' + sound_name + '.mp3' );
      }
      sound_count = name_count;
    };
    // . END init_sound_fn

    // BEGIN play_sound_fn
    play_sound_fn = function ( sound_name ) {
      var sound_obj;

      // initialize if required
      if ( !sound_count ) { init_sound_fn(); }

      sound_obj = sound_obj_map[ sound_name ];
      if ( !sound_obj ) {
        throw '_sound_name_not_known_';
      }

      sound_obj.currentTime = __0;
      sound_obj.play();
    };
    // . END play_sound_fn

    return play_sound_fn;
  }());
  // . END DOM method /playSoundFn/

  // BEGIN DOM method /animateExplodeFn/
  animateExplodeFn = (function () {
    var flash_count, animate_explode;

    animate_explode = function () {
      var hex_list, i, hex_str;
      if ( flash_count === vMap._undef_ ) {
        flash_count = 20;
      }

      flash_count--;
      if ( flash_count < nMap._1_ ) {
        flash_count = vMap._undef_;
        $Map._$bg_svg_[ vMap._css_ ]( 'fill', vMap._blank_ );
        return;
      }

      hex_list = [];
      for ( i = __0; i < nMap._3_; i++ ) {
        hex_list[ vMap._push_ ](
          vMap._makeFloorNumFn_( vMap._makeRandomNumFn_() * 9.999 )
        );
      }

      hex_str = '#' + hex_list[ vMap._join_ ]( vMap._blank_ );
      $Map._$bg_svg_[ vMap._css_ ]( 'fill', hex_str );
      //noinspection DynamicallyGeneratedCodeJS
      __setTo( animate_explode, 50 );
    };
    return animate_explode;
  }());
  // . END DOM method /animateExplodeFn/

  // BEGIN DOM method /get$BombById/
  function get$BombByIdFn ( bomb_id ) {
    return $( '#' + configMap._bomb_id_prefix_ + bomb_id );
  }

  // . END DOM method /get$BombById/
  function updateLivesCountFn ( lives_count ) {
    var i, lives_list = [], lives_str;
    $Map._$lives_count_[ vMap._text_ ]( lives_count );
    for ( i = __0; i < lives_count; i++ ) {
      lives_list[ vMap._push_ ]( configMap._lives_char_code_ );
    }
    lives_str = lives_list[ vMap._join_ ]( ' ' );
    $Map._$lives_gfx_[ vMap._html_ ]( lives_str );
  }

  // == . END DOM METHODS =============================================

  // == BEGIN EVENT HANDLERS ==========================================
  // BEGIN browser-event handlers
  function onChangeLevelFn ( event_obj ) {
    var level_str = $( this )[ vMap._val_ ]();
    event_obj[ vMap._preventDefault_ ]();
    if ( level_str === '--' ) { return; }
    aMap._03_model_._startGameFn_( level_str );
  }

  function onKeypressFn ( event_obj ) {
    var key_code = event_obj.keyCode;
    event_obj[ vMap._preventDefault_ ]();
    aMap._03_model_._reportKeyPress_( key_code );
  }

  function onKeydownFn ( event_obj ) {
    var key_code = event_obj.keyCode;
    if ( key_code !== 8 ) { return; }
    event_obj[ vMap._preventDefault_ ]();
    aMap._03_model_._reportKeyPress_( key_code );
  }

  // . END browser-event handlers

  // BEGIN model-event handlers
  function onAcknowledgeKeyFn ( ignore_event_obj, key_name ) {
    var sound_name = configMap._key_sound_map_[ key_name ];
    playSoundFn( sound_name );
  }

  function onUpdateFieldFn ( ignore_event_obj, arg_map ) {
    var
      field_name = arg_map._field_name_,
      field_val  = arg_map._field_val_;

    switch ( field_name ) {
      case '_level_count_' :
        $Map._$level_count_[ vMap._text_ ]( __Str( field_val ) );
        break;
      case '_lives_count_' :
        updateLivesCountFn( field_val );
        break;
      case '_score_int_' :
        $Map._$score_int_[ vMap._text_ ]( __Str( field_val ) );
        break;
      case '_typebox_str_' :
        $Map._$typebox_[ vMap._text_ ]( field_val );
        break;
      case '_match_count_':
      case '_wave_count_':
      case '_weight_ratio_' :
        break;
      default :
        __logMsg( '_warn_', '_unknown_field_update_', field_name );
    }
  }

  function onSetModeFn ( ignore_event_obj, arg_map ) {
    var
      mode_str = arg_map._mode_str_,
      all_level_count, i, val_list, opt_html;


    switch ( mode_str ) {
      case '_sell_' :
        all_level_count = arg_map._all_level_count_;
        val_list        = [ '--' ];
        for ( i = __0; i < all_level_count; i++ ) {
          val_list[ vMap._push_ ]( i );
        }

        opt_html = __util._makeOptionHtml_( {
          _select_list_ : [ '--' ],
          _val_list_    : val_list
        } );

        $Map._$subtext_[ vMap._html_ ](
          configMap._start_html_ + ' <select>' + opt_html + '</select>'
        );
        $Map._$subtext_[ vMap._find_ ]( 'select' )[ vMap._on_ ](
          vMap._change_, onChangeLevelFn
        );
        $Map._$sell_fields_[ vMap._show_ ]();
        break;

      case '_play_' :
        $Map._$sell_fields_[ vMap._hide_ ]();
        break;

      case '_add_' :
        $Map._$hi_score_[ vMap._html_ ](
          'You have placed ' + __Str( arg_map._hi_score_idx_ + 1 )
          + ' on the hi-score list!<br/>\n'
          + vMap._data2strFn_( arg_map._hi_score_list_ ) + '<br/>'
          + 'Please enter your initials!'
        );
        $Map._$sell_fields_[ vMap._show_ ]();
        break;

      case '_weight_ratio_' :
        break;
      default:
        __logMsg( '_warn_', '_unknown_mode_str_', mode_str );
    }
  }

  function onWaveCompleteFn ( ignore_event_obj, level_count, wave_count ) {
    var msg_str = 'Completed level '
      + __Str( level_count )
      + ' wave '
      + __Str( wave_count );

    $Map._$subtext_[ vMap._text_ ]( msg_str )[ vMap._show_ ](
    )[ vMap._fadeOut_ ](
      5000, function () { $( this )[ vMap._hide_ ](); }
    );

    playSoundFn( 'wavechange' );
  }

  function onBombInitFn ( ignore_event_obj, bomb_obj ) {
    var lookup_map, filled_str, speed_ratio, class_str, $bomb, isBigBomb;

    lookup_map = {
      _id_        : configMap._bomb_id_prefix_ + bomb_obj._id_,
      _label_str_ : bomb_obj._label_str_
    };

    filled_str = __util._makeTmpltStr_( {
      _input_str_  : configMap._bomb_html_,
      _lookup_map_ : lookup_map
    } );

    isBigBomb   = bomb_obj._is_big_bomb_;
    speed_ratio = bomb_obj._speed_ratio_;
    class_str   = aKey + '-';
    class_str += isBigBomb === true ? '_x_big_bomb_'
      : speed_ratio < .33 ? '_x_fast_'
        : speed_ratio < .66 ? '_x_normal_' : '_x_slow_';

    $bomb = $( filled_str );
    $bomb[ vMap._addClass_ ]( class_str );

    $Map._$body_[ vMap._append_ ]( $bomb, null );
  }

  function onBombMoveFn ( ignore_event_obj, bomb_obj ) {
    var left_percent, btm_percent, $bomb, css_map;

    $bomb = get$BombByIdFn( bomb_obj._id_ );
    if ( !$bomb ) { return false; }

    btm_percent  = bomb_obj._y_ratio_ * nMap._100_;
    left_percent = bomb_obj._x_ratio_ * nMap._100_;
    css_map      = {
      left   : __Str( left_percent ) + '%',
      bottom : __Str( btm_percent ) + '%'
    };

    $bomb[ vMap._css_ ]( css_map );
  }

  function onBombExplodeFn ( ignore_event_obj, bomb_obj ) {
    var $bomb = get$BombByIdFn( bomb_obj._id_ );
    if ( !$bomb ) { return false; }

    $bomb[ vMap._remove_ ]();
    animateExplodeFn();
    playSoundFn( 'thunder' );
  }

  function onBombAllclearFn ( /* event_obj */ ) {
    var $all_bomb_list = $( '.tb02-_shell_bomb_' );
    $all_bomb_list[ vMap._remove_ ]();
  }

  function onBombDestroyFn ( ignore_event_obj, bomb_obj ) {
    var
      $bomb = get$BombByIdFn( bomb_obj._id_ ),
      animate_map;

    if ( !$bomb ) { return false; }

    playSoundFn( 'whoosh' );
    animate_map = {
      opacity : __0,
      left    : bomb_obj._x_ratio_ < nMap._d5_ ? '-=50%' : '+=50%'
    };

    $bomb.animate(
      animate_map, 1000,
      function () { this[ vMap._remove_ ](); }
    );
  }

  // . END model-event handlers
  // == . END EVENT HANDLERS ==========================================

  // == BEGIN PUBLIC METHODS ==========================================
  // BEGIN public method /initModuleFn/
  function initModuleFn () {
    var $body = $( 'body' );

    // Initialize styling
    tb02._06_css_._initModuleFn_();

    // Set up screen
    $body[ vMap._html_ ]( configMap._main_html_ );
    set$MapFn( $body );

    // BEGIN browser event bindings
    $body[ vMap._on_ ]( vMap._keypress_, onKeypressFn );
    $body[ vMap._on_ ]( vMap._keydown_, onKeydownFn );
    // . END browser event bindings

    // BEGIN model event bindings
    __$sub( $body, '_set_mode_', onSetModeFn );
    __$sub( $body, '_update_field_', onUpdateFieldFn );
    __$sub( $body, '_acknowledge_key_', onAcknowledgeKeyFn );

    __$sub( $body, '_wave_complete_', onWaveCompleteFn );
    __$sub( $body, '_bomb_init_', onBombInitFn );
    __$sub( $body, '_bomb_move_', onBombMoveFn );
    __$sub( $body, '_bomb_explode_', onBombExplodeFn );
    __$sub( $body, '_bomb_destroy_', onBombDestroyFn );
    __$sub( $body, '_bomb_allclear_', onBombAllclearFn );
    // . END model event bindings

    // Initialize litebox
    xhi._06_lb_._makeInstanceFn_( aMap );
    // Initialize model *after* we have subscribed all our handlers
    aMap._03_model_._initModuleFn_();

    // Open a lightbox to test
    aMap._06_lb_._showLbFn_( {
      _title_html_   : 'Example 01',
      _content_html_ :
      '<p><strong>hi_score</strong> appears to be properly installed!</p>'
      + '<p>The hi_score application map (app_map) attributes are as '
      + 'follows: <br>' + Object.keys( aMap ).join( '<br>' )
      + '</p><p>Drag the title bar to move this lightbox.</p>'
    } );
  }
  // . END public method /initModuleFn/
  return { _initModuleFn_ : initModuleFn };
  // == . END PUBLIC METHODS ==========================================
}());
// == . END MODULE tb02._07_shell_ ====================================
