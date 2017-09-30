/*
 * tb02-03_model.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Typebomb 2 model component.
*/
/*global $, tb02*/
// == BEGIN MODULE tb02._03_model_ =====================================
tb02._03_model_ = (function () {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    // Declare local symbols
    aMap = tb02,
    aKey = aMap._aKey_,
    nMap = tb02._nMap_,
    vMap = tb02._vMap_,

    __0 = nMap._0_,
    __1 = nMap._1_,
    lMap = {
      _d04_ : .04,
      _d06_ : .06,
      _d08_ : .08,
      _d16_ : .16,
      _d66_ : .66,
      _d20_ : .20,
      _d24_ : .24,
      _d28_ : .28,
      _d32_ : .32
    },

    __Str         = vMap._String_,
    __clearTo     = vMap._clearTimeoutFn_,
    __setTo       = vMap._setTimeoutFn_,
    __$publishFn  = $[ vMap._gevent_ ][ vMap._publish_],
    __str2dataFn  = vMap._str2dataFn_,
    __data2strFn  = vMap._data2strFn_,

    __util        = aMap._01_util_,
    __getNowMsFn  = __util._getNowMs_,
    __castIntFn   = __util._castInt_,
    __castMapFn   = __util._castMap_,
    __castStrFn   = __util._castStr_,
    __cloneDataFn = __util._cloneData_,
    __logObj      = __util._getLogObj_(),
    __logMsg      = __logObj._logMsg_,

    // Declare configuration
    configMap   = {
      _end_map_ : {
        _typebox_str_ : 'Game Over'
      },
      _init_map_        : {
        _level_count_  : __0,
        _lives_count_  : nMap._5_,
        _match_count_  : __0,
        _score_int_    : __0,
        _typebox_str_  : 'Type here ...',
        _wave_count_   : __0,
        _weight_ratio_ : __0
      },
      _max_typebox_int_  : 32,
      _max_hi_score_int_ : nMap._10_,
      _storage_key_      : 'tb-hi-score-list',
      _timetick_ms_      : nMap._100_,

      _level_pause_ms_  : 10000,
      _level_score_int_ : 5000,
      _wave_pause_ms_   : 5000,

      _wave_key_list_ : [
        '_onscreen_count_',  // Number of bombs to try to keep onscreen
        '_drop_speed_num_',  // Max drop speed in percent of screen height
        '_drop_range_num_',  // Variation from max speed allowed
        '_match_goal_int_',  // Number of matched bombs to complete wave
        '_bomb_pause_ms_'    // Max pause before dropping new bomb
      ],
      _level_wave_list_ : [
        [ [ nMap._4_, lMap._d16_, lMap._d04_, 24, 2000 ],
          [ nMap._5_, lMap._d20_, lMap._d06_, 32, 1500 ],
          [ nMap._6_, lMap._d24_, lMap._d08_, 38, 1250 ],
          [ nMap._7_, lMap._d28_, lMap._d08_, 44, 1000 ],
          [ nMap._8_, lMap._d32_, lMap._d08_, 50,  800 ]
        ],
        [ [ nMap._4_, lMap._d16_, lMap._d04_, 24, 2000 ],
          [ nMap._5_, lMap._d20_, lMap._d06_, 32, 1500 ],
          [ nMap._6_, lMap._d24_, lMap._d08_, 38, 1250 ],
          [ nMap._7_, lMap._d28_, lMap._d08_, 44, 1000 ],
          [ nMap._8_, lMap._d32_, lMap._d08_, 50,  800 ]
        ],
        [ [ nMap._4_, lMap._d16_, lMap._d04_, 24, 2000 ],
          [ nMap._5_, lMap._d20_, lMap._d06_, 32, 1500 ],
          [ nMap._6_, lMap._d24_, lMap._d08_, 38, 1250 ],
          [ nMap._7_, lMap._d28_, lMap._d08_, 44, 1000 ],
          [ nMap._8_, lMap._d32_, lMap._d08_, 50,  800 ],
          [ nMap._9_, lMap._d32_, lMap._d08_, 60,  500 ]
        ],
        [ [ nMap._4_, lMap._d16_, lMap._d04_, 24, 2000 ],
          [ nMap._5_, lMap._d20_, lMap._d06_, 32, 1500 ],
          [ nMap._6_, lMap._d24_, lMap._d08_, 38, 1250 ],
          [ nMap._7_, lMap._d28_, lMap._d08_, 44, 1000 ],
          [ nMap._8_, lMap._d32_, lMap._d08_, 50,  800 ],
          [ nMap._9_, lMap._d32_, lMap._d08_, 60,  500 ]
        ],
        [ [ nMap._4_, lMap._d16_, lMap._d04_, 24, 2000 ],
          [ nMap._5_, lMap._d20_, lMap._d06_, 32, 1500 ],
          [ nMap._6_, lMap._d24_, lMap._d08_, 38, 1250 ],
          [ nMap._7_, lMap._d28_, lMap._d08_, 44, 1000 ],
          [ nMap._8_, lMap._d32_, lMap._d08_, 50,  800 ],
          [ nMap._9_, lMap._d32_, lMap._d08_, 60,  500 ]
        ],
        [ [ nMap._4_, lMap._d16_, lMap._d04_, 24, 2000 ],
          [ nMap._5_, lMap._d20_, lMap._d06_, 32, 1500 ],
          [ nMap._6_, lMap._d24_, lMap._d08_, 38, 1250 ],
          [ nMap._7_, lMap._d28_, lMap._d08_, 44, 1000 ],
          [ nMap._8_, lMap._d32_, lMap._d08_, 50,  800 ],
          [ nMap._9_, lMap._d32_, lMap._d08_, 60,  500 ]
        ],
        [ [ nMap._4_, lMap._d16_, lMap._d04_, 24, 2000 ],
          [ nMap._5_, lMap._d20_, lMap._d06_, 32, 1500 ],
          [ nMap._6_, lMap._d24_, lMap._d08_, 38, 1250 ],
          [ nMap._7_, lMap._d28_, lMap._d08_, 44, 1000 ],
          [ nMap._8_, lMap._d32_, lMap._d08_, 50,  800 ],
          [ nMap._9_, lMap._d32_, lMap._d08_, 60,  500 ]
        ],
        [ [ nMap._4_, lMap._d16_, lMap._d04_, 24, 2000 ],
          [ nMap._5_, lMap._d20_, lMap._d06_, 32, 1500 ],
          [ nMap._6_, lMap._d24_, lMap._d08_, 38, 1250 ],
          [ nMap._7_, lMap._d28_, lMap._d08_, 44, 1000 ],
          [ nMap._8_, lMap._d32_, lMap._d08_, 50,  800 ],
          [ nMap._9_, lMap._d32_, lMap._d08_, 60,  500 ]
        ]
      ],
      mode_str_list : [ '_sell_', '_play_', '_add_' ]
    },

    // Declare initial state
    stateMap = {
      _mode_str_        : '_sell_',
      _hi_score_list_   : vMap._undef_,
      _level_count_     : vMap._undef_,
      _level_wave_list_ : vMap._undef_,
      _lives_count_     : vMap._undef_,
      _match_count_     : vMap._undef_,
      _score_int_       : vMap._undef_,
      _tick_toid_       : vMap._undef_,
      _typebox_str_     : vMap._undef_,
      _wave_count_      : vMap._undef_,
      _weight_ratio_    : vMap._undef_
    },

    // Declare closure functions
    runTimeTick, bombMgrObj, reportKeyPressFn
    ;
  // == . END MODULE SCOPE VARIABLES ===================================

  // == BEGIN UTILITY METHODS ==========================================
  // BEGIN utility /setAddModeFn/
  function setAddModeFn ( hi_score_list, hi_score_idx ) {
    stateMap._mode_str_ = '_add_';
    __$publishFn( '_set_mode_', {
      _mode_str_      : '_add_',
      _hi_score_list_ : hi_score_list,
      _hi_score_idx_  : hi_score_idx
    });
  }
  // . END utility /setAddModeFn/

  // BEGIN utility /setPlayModeFn/
  function setPlayModeFn ( arg_req_level_idx  ) {
    var
      req_level_idx   = __castIntFn( arg_req_level_idx, __0 ),
      all_level_count = configMap._level_wave_list_[ vMap._length_ ]
      ;

    // Limit levell_idx to maximum allowed
    if ( req_level_idx > all_level_count ) {
      req_level_idx = all_level_count;
    }
    initGameFieldsFn( req_level_idx );

    // Publish events to set play mode
    stateMap._mode_str_ = '_play_';
    __$publishFn( '_set_mode_', { _mode_str_ : '_play_' } );

    // Kick-off run-time game heartbeat
    runTimeTick();
  }
  // . END utility /setPlayModeFn/

  // BEGIN utility /setSellModeFn/
  function setSellModeFn () {
    var all_level_count = configMap._level_wave_list_[ vMap._length_ ];

    stateMap._mode_str_ = '_sell_';
    __$publishFn( '_set_mode_', {
      _mode_str_        : '_sell_',
      _all_level_count_ : all_level_count
    });
  }
  // . END utility method /setSellModeFn/

  // BEGIN utility method /publishFieldMapFn/
  // Summary   : publishFieldMapFn( <field_map> );
  // Purpose   : Initialize game field values and publish events
  //           :   to notify UI of updates. Used to initialize game
  //           :   values and end of game.
  // Example   : publishFieldMapFn( { _level_count_ : 2 } );
  // Arguments : ( positional )
  //   0. field_map : A map of valid state_map values
  // Settings  : Compares keys against stateMap and refuses to update
  //           :   bad values.
  // Returns   : undef
  // Throws    : none
  //
  function publishFieldMapFn ( arg_field_map ) {
    var
      field_map  = __castMapFn( arg_field_map, {} ),
      name_list  = vMap._makeKeyListFn_( field_map ),
      name_count = name_list[ vMap._length_ ],

      field_name, idx
      ;

    for ( idx = __0; idx < name_count; idx++ ) {
      field_name = name_list[ idx ];
      stateMap[ field_name ] = field_map[ field_name ];
      if ( stateMap[ vMap._hasOwnProperty_ ]( field_name ) ) {
        __$publishFn( '_update_field_', {
          _field_name_: field_name,
          _field_val_ : stateMap[ field_name ]
        });
      }
      else {
        __logMsg( '_warn_', '_unsupported_state_key_skipped_', field_name );
      }
    }
  }

  // BEGIN utility method /initGameFieldsFn/
  // Summary   : initGameFieldsFn( <start_level_idx> );
  // Purpose   : Initialize game field values and publish events
  //           :   to notify UI of updates. Used prior to game.
  // Example   : initGameFieldsFn( 3 );
  // Arguments : ( positional )
  //   0. start_level_idx - A valid level index
  // Settings  : Uses configMap._init_map_
  // Returns   : undef
  // Throws    : none
  // Technique :
  //
  function initGameFieldsFn ( start_level_idx ) {
    var init_map = __cloneDataFn( configMap._init_map_ );
    if ( start_level_idx ) {
      init_map._level_count_ = start_level_idx;
      init_map._score_int_   = configMap._level_score_int_ * start_level_idx;
    }
    publishFieldMapFn( init_map );
  }
  // . END utility method /initGameFieldsFn/

  // BEGIN utility method /createLevelWaveList/
  // This converts the terse data structure (list->list->list)
  // in cMap._wave_level_list_ into a friendly structre
  // (list->list->map) stored in stateMap._level_wave_list_
  // so one can access the values like so:
  // stateMap._level_wave_list[ level_count ][ wave_count ]._onscreen_count_
  //
  function createLevelWaveList () {
    var
      level_list     = configMap._level_wave_list_,
      level_count    = level_list[ vMap._length_ ],
      wave_key_list  = configMap._wave_key_list_,
      wave_key_count = wave_key_list[ vMap._length_ ],

      gen_level_list,
      gen_wave_list, wave_list,    wave_count,
      value_list,    gen_wave_map, wave_key,
      i, j, k;

    gen_level_list = [];
    for ( i = __0; i < level_count; i++ ) {
      gen_wave_list = [];
      wave_list  = level_list[ i ];
      wave_count = wave_list[ vMap._length_ ];

      for ( j = __0; j < wave_count; j++ ) {
        value_list = wave_list[ j ];
        gen_wave_map = {};

        for ( k = __0; k < wave_key_count; k++ ) {
          wave_key = wave_key_list[ k ];
          switch( wave_key ) {
            case '_drop_speed_num_':
            case '_drop_range_num_':
              gen_wave_map[ wave_key ] = value_list[ k ] / nMap._100_;
              break;

            default:
              try { gen_wave_map[ wave_key ] = value_list[ k ]; }
              catch ( error_obj ) {
                throw error_obj;
              }
              break;
          }
        }
        gen_wave_list[ vMap._push_ ]( gen_wave_map );
      }
      gen_level_list[ vMap._push_ ]( gen_wave_list );
    }
    stateMap._level_wave_list_ = gen_level_list;
  }
  // . END utility method /createLevelWaveList/

  // BEING utility method /storeHiScoreListFn/
  function storeHiScoreListFn () {
    var
      hi_score_list = stateMap._hi_score_list_,
      store_obj     = vMap._localStorage_
      ;

    if ( ! ( hi_score_list && store_obj ) ) { return vMap._false_; }

    store_obj[ configMap. _storage_key_ ] = __data2strFn( hi_score_list );
    return vMap._true_;
  }
  // . END utility method /storeHiScoreListFn/

  // BEGIN utility method /getHiScoreList/
  // Purpose: Get the hi-score list from cache, or local storage.
  //
  function getHiScoreList () {
    var
      hi_score_list =  stateMap._hi_score_list_,
      store_obj     = vMap._localStorage_,
      json_str
      ;

    // Return cache results if found
    if ( hi_score_list) { return hi_score_list; }

    // If no local storage, set to empty array ...
    if ( ! store_obj ) { hi_score_list = []; }

    // If list not yet defined (e.g. not an empty array)
    // then try to the serialized list from local storage
    if ( ! hi_score_list ) {
      json_str = store_obj[ configMap._storage_key_ ];
      // If the serialization is empty, set to empty array
      if ( ! json_str ) { hi_score_list = []; }
    }

    // If list not yet defined (e.g. json_str is valid),
    // parse the json_str and sort the resulting list.
    if ( ! hi_score_list ) {
      hi_score_list = __str2dataFn( json_str );
      if ( __util._getVarType_( hi_score_list ) !== '_Array_' ) {
        hi_score_list = [];
      }
    }

    // Sort the list and store it in state map
    hi_score_list[ vMap._sort_ ]( sortHiScoreListFn );
    stateMap._hi_score_list_ = hi_score_list;
    storeHiScoreListFn();

    return hi_score_list;
  }
  // . END utility method /getHiScoreList/

  // BEGIN utility method /addHiScoreFn/
  // Purpose: Add score to hi score list, and then truncate it to
  // the maximum length.  If the added score is in the remaining list,
  // return the position in the list to the caller.
  //
  function addHiScoreFn ( arg_score_int, arg_username ) {
    var
      score_int = __castIntFn( arg_score_int,          __0 ),
      username  = __castStrFn( arg_username,  vMap._blank_ ),

      score_map = { _score_int_: score_int, _username_: username },
      hi_score_list = getHiScoreList(),
      score_idx
      ;

    hi_score_list[ vMap._push_ ]( score_map );
    hi_score_list[ vMap._sort_ ]( sortHiScoreListFn );
    if ( hi_score_list[ vMap._length_ ] > configMap._max_hi_score_int_) {
      hi_score_list[ vMap._length_] = configMap._max_hi_score_int_;
    }

    score_idx = hi_score_list[ vMap._indexOf_ ]( score_map );

    stateMap._hi_score_list_ = hi_score_list;
    return score_idx;
  }
  // . END utility method /addHiScoreFn/

  // BEGIN utility method /sortHiScoreListFn/
  // Purpose: Sort function: hi_score_list.sort( sortHiScoreListFn );
  //
  function sortHiScoreListFn ( a_map, b_map ) {
    return b_map._score_int_ - a_map._score_int_;
  }
  // . END utility method /sortHiScoreListFn/

  // BEGIN utility method /runTimeTick/
  // Purpose: Execute all game-based periodic actions.
  //   This function calls itself with time adjustments
  //   to ensure appropriate frame pacing.
  // We lookup symbols outside of the loop as this is time critical.
  //
  runTimeTick = (function () {
    var tick_ms, run_fn;

    run_fn = function () {
      var
        mode_str = stateMap._mode_str_,
        new_ms, elapsed_ms, adj_ticktime_ms;

      // do not run if not in game mode
      if ( mode_str !== '_play_') { return; }

      bombMgrObj._updateBombList_();
      new_ms = __getNowMsFn();

      elapsed_ms = tick_ms > __0
        ? new_ms - tick_ms
        : __0;

      // Compensate for elapsed time since the last invocation
      adj_ticktime_ms = configMap._timetick_ms_ - elapsed_ms;

      stateMap._tick_toid_ = __setTo( run_fn, adj_ticktime_ms );
      tick_ms = new_ms;
    };
    return run_fn;
  }());
  // . END utility method /runTimeTick/
  // == . END UTILITY METHODS ==========================================

  // == BEGIN utility object /bombMgrObj/ ==============================
  // BEGIN utility object /bombMgrObj/
  bombMgrObj = (function () {
    var
      sMap = {
        _addbomb_toid_    : vMap._undef_,
        _bomb_list_       : [],
        _bomb_int_        : __0,
        _next_wave_toid_  : vMap._undef_,
        _wave_map_        : vMap._undef_
      },
      bombProto
      ;

    function explodeFn () {
      var bomb_obj = getBombByKey( '_id_', this._id_, vMap._true_ );
      if ( ! bomb_obj ) { return; }

      stateMap._lives_count_--;
      __$publishFn( '_bomb_explode_', bomb_obj );
      __$publishFn( '_update_field_', {
        _field_name_ : '_lives_count_',
        _field_val_  :  stateMap._lives_count_
      });

      if ( stateMap._lives_count_ < __1 ) {
        stopGameFn();
      }
    }

    function bombMoveFn () {
      this._y_ratio_ += this._delta_y_num_;
      if ( this._y_ratio_ < __0 ) {
        this._explode_();
        return;
      }
      __$publishFn( '_bomb_move_', this );
    }

    // instance vars:
    //_id_          : 'tb-bb-<serial_num>', // eg. tb-bb-25
    //_delta_y_num_ : -<0-1> // move amount per tick, eg. -0.0016
    //_y_ratio_     : <0-1>  // btm of bomb.  1 = 100%
    //_x_ratio_     : <0-1>  // left position of bomb
    //
    bombProto = {
      _explode_ : explodeFn,
      _moveFn_  : bombMoveFn
    };

    function addBomb () {
      var
        wave_map, label_str, speed_ratio,
        drop_speed, x_ratio, bomb_obj, bomb_list
        ;

      wave_map  = sMap._wave_map_;
      label_str = aMap._03_model_._data_._getWord_(
        stateMap._level_count_, stateMap._weight_ratio_
      );
      if ( ! label_str ) { return; }

      x_ratio     = lMap._d16_ + lMap._d66_ * vMap._makeRandomNumFn_();
      speed_ratio = vMap._makeRandomNumFn_();
      drop_speed  = wave_map._drop_speed_num_
        - ( wave_map._drop_range_num_ * speed_ratio );
      drop_speed  = -drop_speed;

      bomb_obj = vMap._createObjectFn_( bombProto );

      bomb_obj._id_          = aKey + '-bb-' + __Str( sMap._bomb_int_ );
      bomb_obj._y_ratio_     = __1;
      bomb_obj._delta_y_num_ = drop_speed;
      bomb_obj._x_ratio_     = x_ratio;
      bomb_obj._speed_ratio_ = speed_ratio;
      bomb_obj._label_str_   = label_str;
      sMap._bomb_int_++;

      bomb_list = sMap._bomb_list_;
      bomb_list[ vMap._push_ ]( bomb_obj );

      __$publishFn( '_bomb_init_', bomb_obj );
      __$publishFn( '_bomb_move_', bomb_obj );
      sMap._addbomb_toid_ = vMap._undef_;
    }

    function doNextWave () {
      stateMap._match_count_ = __0;
      sMap._next_wave_toid_  = vMap._undef_;
    }

    function checkBombDestroy ( label_str ) {
      var
        wave_map = sMap._wave_map_,
        bomb_obj = getBombByKey( '_label_str_', label_str, true ),

        pause_ms, level_wave_list,
        level_count, wave_count,
        next_wave_map
        ;

      // Increment score and match count.
      // Publish events for score update and bomb destruction.
      //
      if ( bomb_obj ) {
        stateMap._score_int_   += 50;
        stateMap._match_count_ += __1;
        __$publishFn( '_bomb_destroy_', bomb_obj );
        __$publishFn( '_update_field_', {
          _field_name_ : '_score_int_',
          _field_val_  : stateMap._score_int_
        });
      }

      if ( stateMap._match_count_ < wave_map._match_goal_int_ ) { return; }

      // Start new level or wave if all bombs are cleared
      level_count = stateMap._level_count_;
      wave_count  = stateMap._wave_count_;
      __$publishFn( '_wave_complete_', [ level_count, wave_count ] );

      wave_count++;
      level_wave_list = stateMap._level_wave_list_;
      next_wave_map = level_wave_list[ level_count ][ wave_count ];

      // Increment to next wave if exists...
      //
      if ( next_wave_map ) {
        stateMap._wave_count_ = wave_count;
        sMap._wave_map_ = next_wave_map;
        pause_ms = configMap._wave_pause_ms_;
      }

      // ..otherwise increment level, wave 0
      //
      else {
        wave_count = __0;

        if ( level_wave_list[ level_count + __1 ] ) {
          level_count++;
        }
        else {
          //noinspection MagicNumberJS
          stateMap._weight_ratio_ += 0.2;
        }

        next_wave_map = level_wave_list[ level_count ][ wave_count ];

        stateMap._wave_count_  = wave_count;
        stateMap._level_count_ = level_count;
        sMap._wave_map_ = next_wave_map;
        pause_ms        = configMap._level_pause_ms_;
        __$publishFn( '_update_field_', {
          _field_name_ : '_level_count_',
          _field_val_  : level_count
        });
      }

      // Set pause and notify gui
      sMap._next_wave_toid_ = __setTo( doNextWave, pause_ms);
    }

    function clearBombList () {
      __$publishFn( '_bomb_allclear_' );
      sMap._bomb_list_[ vMap._length_ ] = __0;
      if ( sMap._addbomb_toid_ ) {
        __clearTo( sMap._addbomb_toid_ );
        sMap._addbomb_toid_ = vMap._undef_;
      }
    }

    function getBombByKey ( bomb_key, bomb_val, do_delete ) {
      var idx, bomb_list, bomb_list_count, bomb_obj, found_obj;

      bomb_list = sMap._bomb_list_;
      bomb_list_count = bomb_list[ vMap._length_ ];
      for ( idx = __0; idx < bomb_list_count; idx++ ) {
        bomb_obj = bomb_list[ idx ];
        if ( bomb_obj[ bomb_key ] === bomb_val ) {
          found_obj = bomb_obj;
          break;
        }
      }
      if ( found_obj && do_delete ) {
        bomb_list[ vMap._splice_ ]( idx, __1 );
      }
      return found_obj;
    }

    function getBombCount () {
      return sMap._bomb_list_[ vMap._length_ ];
    }

    // '_onscreen_count_',     // how many bombs to try to keep onscreen
    // '_word_complex_idx_',   // how difficult the words should be (0-5?)
    // '_drop_speed_num_',     // max drop speed in percent of screen height
    // '_drop_range_num_',     // variation from max speed allowed
    // '_match_goal_int_',     // number of matched bombs to complete wave
    // '_bomb_pause_ms_'       // max pause before dropping new bomb
    function updateBombList () {
      var
        idx, bomb_list, bomb_count, bomb_obj,
        wave_map, delay_ms;

      // do nothing of we have a wave break
      if ( sMap._next_wave_toid_ ) { return; }

      // Make sure we are initiated (this should not happen!)
      if ( stateMap._level_count_ === vMap._undef_ ) {
        createLevelWaveList();
        __logMsg( '_warn_', '_call_to_update_game_without_init_' );
      }

      // Move all bombs
      bomb_list = sMap._bomb_list_;
      bomb_count = bomb_list[ vMap._length_ ];
      for ( idx = __0; idx < bomb_count; idx++ ) {
        bomb_obj = bomb_list[ idx ];
        if ( bomb_obj ) { bomb_obj._moveFn_(); }
      }

      // Spawn a new bomb if we need a new one
      if ( ! sMap._addbomb_toid_ ) {
        wave_map = stateMap._level_wave_list_[
          stateMap._level_count_ ][
          stateMap._wave_count_];

        sMap._wave_map_ = wave_map;
        if ( stateMap._match_count_ + bomb_count < wave_map._match_goal_int_ ) {
          bomb_count = bombMgrObj._getBombCount_();
          if ( wave_map._onscreen_count_ > bomb_count ) {
            delay_ms = wave_map._bomb_pause_ms_ * vMap._makeRandomNumFn_();
            sMap._addbomb_toid_ = __setTo( addBomb, delay_ms );
          }
        }
      }
    }

    return {
      _checkBombDestroy_ : checkBombDestroy,
      _clearBombList_    : clearBombList,
      _getBombCount_     : getBombCount,
      _updateBombList_   : updateBombList
    };
  }());
  // == . END utility object /bombMgrObj/ ==============================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN public method /reportKeyPressFn/
  // If key press is actionable, return true
  reportKeyPressFn = (function _reportKeyPressFn () {
    var
      spc_code    = 32,
      bkspc_code  = 8,
      return_code = 13
      ;

    function report_keypress ( key_code ) {
      var typebox_str, type_length, end_idx, resp_name;

      // Do not handle if not in game.
      // TODO: when not in game, pass the key press to another routine
      // that will allow user to press 'i' for instructions, etc.
      //
      if ( stateMap._mode_str_ !== '_play_' ) { return vMap._false_; }

      // get typebox content and length
      typebox_str = stateMap._typebox_str_;
      type_length = typebox_str[ vMap._length_ ];

      // clear default text if present
      if ( typebox_str === configMap._init_map_._typebox_str_ ) {
        typebox_str = '';
        type_length = __0;
      }

      // prevent duplicate spaces
      if ( key_code === spc_code ) {
        end_idx = type_length - nMap._n1_;
        if ( typebox_str[ vMap._charAt_ ]( end_idx ) === ' ' ) {
          return vMap._true_;
        }
      }

      // handle character codes
      switch( key_code ) {
        case bkspc_code :
          if ( type_length > __0 ) {
            type_length--;
            resp_name = '_bkspc_';
          }
          break;

        case return_code :
          if ( type_length > __0 ) {
            bombMgrObj._checkBombDestroy_( typebox_str );
            typebox_str = '';
            type_length = __0;
            resp_name = '_returnd_';
          }
          break;

        default : // everything else
          typebox_str += __Str[ vMap._fromCharCode_ ]( key_code );
          type_length = typebox_str[ vMap._length_ ];
          resp_name = '_char_add_';
          break;
      }

      if ( type_length > configMap._max_typebox_int_ ) {
        type_length = configMap._max_typebox_int_;
        __$publishFn( '_acknowledge_key_', [ '_at_limit_' ]);
        return false;
      }

      // display revised string if needed
      typebox_str = typebox_str[ vMap._slice_]( __0, type_length );

      if ( typebox_str === stateMap._typebox_str_ ) {
        return false;
      }

      __$publishFn( '_update_field_', {
        _field_name_ : '_typebox_str_',
        _field_val_  : typebox_str + '|'
      });

      __$publishFn( '_acknowledge_key_', resp_name );
      stateMap._typebox_str_  = typebox_str;
      return vMap._true_;
    }

    return report_keypress;
  }());
  // . END public method /reportKeyPressFn/

  // BEGIN public method /stopGameFn/
  // Summary   : stopGameFn();
  // Purpose   : Clean up data and publish events to UI
  // Example   : stopGameFn();
  // Arguments : None
  // Settings  : Uses configMap._endMap_
  // Returns   : Undef
  // Throws    : None
  // Technique : Uses bombMgrObj._clearBombList_, set
  //
  function stopGameFn () {
    var score_int, hi_score_list, hi_score_idx;

    // Clean up game timer data
    if ( stateMap._tick_toid_ ) {
      __clearTo( stateMap._tick_toid_ );
      stateMap._tick_toid_ = vMap._undef_;
    }
    score_int  = stateMap._score_int_;

    // Clear bombs and fields
    bombMgrObj._clearBombList_();
    __$publishFn( '_bomb_allclear_' );
    publishFieldMapFn( configMap._end_map_ );

    hi_score_idx  = addHiScoreFn( score_int, '' );
    hi_score_list = stateMap._hi_score_list_;

    if ( hi_score_idx > nMap._n1_ ) {
      hi_score_list = getHiScoreList();
      setAddModeFn( hi_score_list, hi_score_idx );
    }
    else {
      setSellModeFn();
    }
  }
  // . END public method /stopGameFn/

  // BEGIN public method /startGameFn/
  function startGameFn ( level_count ) {
    if ( stateMap._mode_str_ !== '_sell_' ) { return; }

    if ( stateMap._level_wave_list_ === vMap._undef_ ) {
      createLevelWaveList();
    }
    // stateMap._level_count_   = level_count;
    // stateMap._wave_count_    = __0;
    // stateMap._weight_ratio_  = __0;
    // _init_map_      : {
    //   _level_count_ : __0,
    //   _lives_count_ : nMap._5_,
    //   _match_count_ : __0,
    //   _score_int_   : __0,
    //   _typebox_str_ : 'Type here ...',
    //   _wave_count_  : __0
    // },
    setPlayModeFn( level_count );
  }
  // . END public method /startGameFn/

  // BEGIN public method /initModuleFn/
  function initModuleFn () {
    aMap._03_model_._data_._initModuleFn_();
    stateMap._level_count_ = __0;
    setSellModeFn();
    initGameFieldsFn();
    __$publishFn( '_acknowledge_init_' );
  }
  // . END public method /initModuleFn/

  return {
    _initModuleFn_   : initModuleFn,
    _stopGameFn_     : stopGameFn,
    _startGameFn_    : startGameFn,
    _reportKeyPress_ : reportKeyPressFn
  };
  // == . END PUBLIC METHODS ===========================================
}());
// == . END MODULE tb02._03_model_ =====================================
