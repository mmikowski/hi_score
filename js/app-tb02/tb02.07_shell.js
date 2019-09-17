/*global xhiJQ, tb02, Audio*/
// == BEGIN MODULE tb02._07_shell_ ====================================
tb02._07_shell_ = (function ( $ ) {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    // Set app symbols
    aMap = tb02,
    aKey = aMap._aKey_,
    nMap = aMap._nMap_,
    vMap = aMap._vMap_,

    // Set object symbols
    utilObj = aMap._01_util_,
    logObj  = utilObj._getLogObj_(),
    strObj  = vMap._String_,

    // Set function symbols
    logFn   = logObj._logMsg_,
    pFn     = utilObj._makeReplaceFn_( '_p_', aKey ),
    setToFn = vMap._setTimeoutFn_,
    sub$Fn  = $[ vMap._gevent_ ][ vMap._subscribe_ ],

    // Set num symbols
    __0 = nMap._0_,

    configMap = {
      // language=TEXT (intellij)
      _main_tmplt_  : pFn(
        '<div class="{_p_}-_shell_audio_"></div>'
        + '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" '
        +   'class="{_p_}-_shell_bg_svg_" '
        +   'viewbox="0 0 100 100" preserveAspectRatio="none">'
        +   '<path d="M 0,0 40,100 0,100 M 100,0 60,100 100,100"></path>'
        + '</svg>'
        + '<div class="{_p_}-_shell_title_">TypeB'
        +   '<span class="{_p_}-_x_down_">o</span>mb'
        +   '<span class="{_p_}-_x_release_">beta</span>'
        + '</div>'
        + '<div class="{_p_}-_shell_subtext_"></div>'
        + '<div class="{_p_}-_shell_hi_score_">High Score</div>'
        + '<div class="{_p_}-_shell_level_">'
        +   '<div class="{_p_}-_shell_level_label_">Level</div>'
        +   '<div class="{_p_}-_shell_level_count_"></div>'
        + '</div>'
        + '<div class="{_p_}-_shell_lives_">'
        +   '<div class="{_p_}-_shell_lives_count_"></div>'
        +   '<div class="{_p_}-_shell_lives_gfx_"></div>'
        + '</div>'
        + '<div class="{_p_}-_shell_typebox_"></div>'
        +   '<div class="{_p_}-_shell_score_">'
        +   '<div class="{_p_}-_shell_score_label_">Score</div>'
        +   '<div class="{_p_}-_shell_score_int_"></div>'
        + '</div>'
      ),
      _bomb_html_  : pFn(
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
      },
      _flash_count_   : 20,
      _ten_num_       : 9.99999,
      _d33_num_       : .333333,
      _d66_num_       : .666666,

      _anim_frame_ms_ : 33.33333,
      _fadeout_ms_    : 5000,
      _whoosh_ms_     : 1000
    },
    stateMap = { _is_user_init_ : false },

    $Map, playSoundFn, animateExplodeFn
  ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN UTILITY METHODS =========================================
  // == . END UTILITY METHODS =========================================

  // == BEGIN DOM METHODS =============================================
  // BEGIN DOM method /set$MapFn/
  function set$MapFn ( $body ) {
    var
      $audio       = $body[ vMap._find_ ]( pFn( '.{_p_}-_shell_audio_' ) ),
      $hi_score    = $body[ vMap._find_ ]( pFn( '.{_p_}-_shell_hi_score_' ) ),
      $level       = $body[ vMap._find_ ]( pFn( '.{_p_}-_shell_level_' ) ),
      $lives       = $body[ vMap._find_ ]( pFn( '.{_p_}-_shell_lives_' ) ),
      $score       = $body[ vMap._find_ ]( pFn( '.{_p_}-_shell_score_' ) ),
      $subtext     = $body[ vMap._find_ ]( pFn( '.{_p_}-_shell_subtext_' ) ),
      $title       = $body[ vMap._find_ ]( pFn( '.{_p_}-_shell_title_' ) ),
      $sell_fields = $( [
        $hi_score[ vMap._get_ ]( __0 ),
        $title[    vMap._get_ ]( __0 ),
        $subtext[  vMap._get_ ]( __0 )
      ] );

    $Map = {
      _$audio_       : $audio,
      _$body_        : $body,
      _$bg_svg_      : $body[ vMap._find_ ](
        pFn( '.{_p_}-_shell_bg_svg_' )
      ),
      _$sell_fields_ : $sell_fields,
      _$hi_score_    : $hi_score,
      _$level_       : $level,
      _$level_count_ : $level[ vMap._find_ ](
        pFn( '.{_p_}-_shell_level_count_' )
      ),
      _$lives_       : $lives,
      _$lives_count_ : $lives[ vMap._find_ ](
        pFn( '.{_p_}-_shell_lives_count_' )
      ),
      _$lives_gfx_   : $lives[ vMap._find_ ](
        pFn( '.{_p_}-_shell_lives_gfx_' )
      ),
      _$score_       : $score,
      _$score_int_   : $score[ vMap._find_ ](
        pFn( '.{_p_}-_shell_score_int_' )
      ),
      _$subtext_     : $subtext,
      _$title_       : $title,
      _$typebox_     : $body[ vMap._find_ ](
        pFn( '.{_p_}-_shell_typebox_' )
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
      is_init_done    = false
      ;

    // BEGIN initSoundFn
    function initSoundFn () {
      var i, name_count, sound_name, sound_obj;
      if ( is_init_done ) { return; }
      is_init_done = true;

      name_count = sound_name_list[ vMap._length_ ];
      for ( i = __0; i < name_count; i++ ) {
        sound_name    = sound_name_list[ i ];
        sound_obj     = new Audio();
        sound_obj.src = 'sound/' + sound_name + '.mp3';
        sound_obj_map[ sound_name ] = sound_obj;
        $Map._$audio_.append( sound_obj );
      }
    }
    // . END initSoundFn

    // BEGIN play_sound_fn
    function mainFn ( sound_name ) {
      var sound_obj;

      // initialize if required
      if ( ! is_init_done ) {
        return initSoundFn();
      }

      sound_obj = sound_obj_map[ sound_name ];
      if ( !sound_obj ) {
        return logFn( '_error_', '_sound_not_found_', sound_name );
      }

      if ( sound_obj.readyState !== 4 ) {
        return logFn( '_notice_', '_sound_not_ready_', sound_name );
      }

      sound_obj.pause();
      sound_obj.currentTime = __0;
      return sound_obj.play().catch(function () {
        logFn( '_error_', '_unexpected_audio_error_', arguments );
      });
    }
    // . END play_sound_fn

    return mainFn;
  }());
  // . END DOM method /playSoundFn/

  // BEGIN DOM method /animateExplodeFn/
  animateExplodeFn = (function () {
    var flash_count;

    function animateFn () {
      var hex_list, i, hex_str;
      if ( flash_count === vMap._undef_ ) {
        flash_count = configMap._flash_count_;
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
          vMap._makeFloorNumFn_(
            vMap._makeRandomNumFn_() * configMap._ten_num_ )
        );
      }

      hex_str = '#' + hex_list[ vMap._join_ ]( vMap._blank_ );
      $Map._$bg_svg_[ vMap._css_ ]( 'fill', hex_str );
      setToFn( animateFn, configMap._anim_frame_ms_ );
    }
    return animateFn;
  }());
  // . END DOM method /animateExplodeFn/

  // BEGIN DOM method /get$BombById/
  function get$BombByIdFn ( bomb_id ) {
    return $( '#' + configMap._bomb_id_prefix_ + bomb_id );
  }

  // . END DOM method /get$BombById/
  function updateLivesCountFn ( lives_count ) {
    // noinspection JSMismatchedCollectionQueryUpdate
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
  function onClickBodyFn () {
    if ( ! stateMap._is_user_init_ ) {
      playSoundFn( 'click' );
      stateMap._is_user_init_ = true;
    }
  }

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
        $Map._$level_count_[ vMap._text_ ]( strObj( field_val ) );
        break;
      case '_lives_count_' :
        updateLivesCountFn( field_val );
        break;
      case '_score_int_' :
        $Map._$score_int_[ vMap._text_ ]( strObj( field_val ) );
        break;
      case '_typebox_str_' :
        $Map._$typebox_[ vMap._text_ ]( field_val );
        break;
      case '_match_count_':
      case '_wave_count_':
      case '_weight_ratio_' :
        break;
      default :
        logFn( '_warn_', '_unknown_field_update_', field_name );
    }
  }

  function onSetModeFn ( ignore_event_obj, arg_map ) {
    var
      mode_str = arg_map._mode_str_,
      all_level_count, i, enum_tablet, opt_html;


    switch ( mode_str ) {
      case '_sell_' :
        all_level_count = arg_map._all_level_count_;
        enum_tablet = [ { _label_: '--', _value_ : '' } ];
        for ( i = __0; i < all_level_count; i++ ) {
          enum_tablet[ vMap._push_ ]({
            _label_ : strObj( i ),
            _value_ : strObj( i )
          });
        }

        opt_html = utilObj._makeOptionHtml_( {
          _enum_table_ : enum_tablet,
          _match_list_ : [ '--' ]
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
          'You have placed ' + strObj( arg_map._hi_score_idx_ + 1 )
          + ' on the hi-score list!<br/>\n'
          + vMap._data2strFn_( arg_map._hi_score_list_ ) + '<br/>'
          + 'Please enter your initials!'
        );
        $Map._$sell_fields_[ vMap._show_ ]();
        break;

      case '_weight_ratio_' :
        break;
      default:
        logFn( '_warn_', '_unknown_mode_str_', mode_str );
    }
  }

  function onWaveCompleteFn ( ignore_event_obj, level_count, wave_count ) {
    var msg_str = 'Completed level '
      + strObj( level_count )
      + ' wave '
      + strObj( wave_count );

    $Map._$subtext_[ vMap._text_ ]( msg_str )[ vMap._show_ ](
    )[ vMap._fadeOut_ ](
      configMap._fadeout_ms_,
      function () { $( this )[ vMap._hide_ ](); }
    );

    playSoundFn( 'wavechange' );
  }

  function onBombInitFn ( ignore_event_obj, bomb_obj ) {
    var lookup_map, filled_str, speed_ratio, class_str, $bomb;

    lookup_map = {
      _id_        : configMap._bomb_id_prefix_ + bomb_obj._id_,
      _label_str_ : bomb_obj._label_str_
    };

    filled_str = utilObj._makeTmpltStr_( {
      _input_str_  : configMap._bomb_html_,
      _lookup_map_ : lookup_map
    } );

    speed_ratio = bomb_obj._speed_ratio_;
    class_str   = aKey + '-';
    class_str += bomb_obj._is_big_bomb_ ? '_x_big_bomb_'
      : speed_ratio < configMap._d33_num_ ? '_x_fast_'
      : speed_ratio < configMap._d66_num_ ? '_x_normal_' : '_x_slow_';

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
      left   : strObj( left_percent ) + '%',
      bottom : strObj( btm_percent ) + '%'
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
      animate_map, configMap._whoosh_ms_,
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
    tb02._05_css_._initModuleFn_();

    // Set up screen
    $body[ vMap._html_ ]( configMap._main_tmplt_ );
    set$MapFn( $body );

    // Begin browser event bindings
    $body[ vMap._on_ ]( vMap._click_,    onClickBodyFn );
    $body[ vMap._on_ ]( vMap._keypress_, onKeypressFn  );
    $body[ vMap._on_ ]( vMap._keydown_,  onKeydownFn   );
    // . End browser event bindings

    // Begin model event bindings
    sub$Fn( $body, '_acknowledge_key_', onAcknowledgeKeyFn );
    sub$Fn( $body, '_set_mode_',        onSetModeFn        );
    sub$Fn( $body, '_update_field_',    onUpdateFieldFn    );

    sub$Fn( $body, '_bomb_allclear_',   onBombAllclearFn   );
    sub$Fn( $body, '_bomb_destroy_',    onBombDestroyFn    );
    sub$Fn( $body, '_bomb_explode_',    onBombExplodeFn    );
    sub$Fn( $body, '_bomb_init_',       onBombInitFn       );
    sub$Fn( $body, '_bomb_move_',       onBombMoveFn       );
    sub$Fn( $body, '_wave_complete_',   onWaveCompleteFn   );
    // . End model event bindings

    // Initialize model *after* we have subscribed all our handlers
    aMap._03_model_._initModuleFn_();

    // Begin greet player
    tb02._06_lb_._showLbFn_({
      _title_html_ : 'Welcome to Typebomb 2!',
      _content_html_ :
        '<p>Have fun while learning to type!</p>'

        + '<p>Click anywhere outside this lightbox to close it. '
        + 'Then click on the pulldown at the top-right to select a level.'
        + 'The game will begin. Type to remove bombs from the screen.</p>'

        + '<p>The levels have been researched and designed to progressively '
        + 'emphasize important fingering.</p>'
    });
    // . End greet player
  }
  // . END public method /initModuleFn/
  return { _initModuleFn_ : initModuleFn };
  // == . END PUBLIC METHODS ==========================================
}( xhiJQ ));
// == . END MODULE tb02._07_shell_ ====================================
