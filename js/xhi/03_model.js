/*
 * 03_model.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : xhi._03_model_._makeInstanceFn_( app_map );
 * Synopsis : Add _03_model_ capabilities to app_map
 * Provides : Business logic methods. See API documentation in-line
 *   below for additional details.
 *     _getMapFn_       : Gets stateMap or configMap
 *     _getStateDataFn_ : Returns a value of a stateMap property
 *     _setConfigMapFn_ : Used to set configMap values
 *
 *     _addHandlerFn_   : Add handler function for named event
 *     _rmHandlerFn_    : Remove handler function for named event
 *
 *     _publishEventFn_    : Publish a named event
 *     _toggleStateKeyFn_  : Set a state flag *and* publish event
 *     _toggleStateListFn_ : Set a number of state flags and publish
 *                           all associated events
 *     _initModuleFn_ : Initialize this module
 * Requires : aMap (app map) with symbols from 00_root._makeInstanceFn_()
 *
*/
/*global xhi */
// == BEGIN MODULE xhi._03_model_ =====================================
xhi._03_model_ = (function () {
  'use strict';
  // == BEGIN /makeInstanceFn/ ========================================
  function makeInstanceFn ( aMap, argOptionMap ) {
    // == BEGIN MODULE SCOPE VARIABLES ================================
    var
      // Set app symbols
      // aKey = aMap._aKey_,
      nMap    = aMap._nMap_,
      vMap    = aMap._vMap_,

      // Set object symbols
      utilObj = aMap._01_util_,
      logObj  = utilObj._getLogObj_(),

      // Set function symbols
      logFn   = logObj._logMsg_,

      // Set number symbols
      __n1 = nMap._n1_,
      __0  = nMap._0_,
      __1  = nMap._1_,
      __3  = nMap._3_,

      // Set scalar symbols
      __apply   = vMap._apply_,
      __blank   = vMap._blank_,
      __false   = vMap._false_,
      __length  = vMap._length_,
      __true    = vMap._true_,
      __push    = vMap._push_,
      __undef   = vMap._undef_,

      // Init config and state maps
      configMap = {
        _event_handler_map_ : {},
        _event_name_list_   : [],
        _handler_map_       : {},
        _toggle_key_map_    : {}
      },
      stateMap  = {
        _do_event_log_ : __false,
        _event_log_list_ : []
      },

      eventProto, instanceMap, optionMap
      ;
    // == . END MODULE SCOPE VARIABLES ================================

    // == BEGIN UTILITY METHODS =======================================
    // BEGIN utility proto /eventProto/
    eventProto = {
      // _checkIsDone_  : function () { return this._is_done_; },
      // _getData_      : function () { return this._data_; },
      // _getTimestamp_ : function () { return this._timestamp_; },
      // _getType_      : function () { return this._type_; },
      // _runOnDone_    : function ( callback_fn, param_list, callback_this ) {
      //   this._run_list_[ __push ]( {
      //     _callback_fn_   : callback_fn,
      //     _param_list_    : param_list   || [],
      //     _context_data_  : context_data || __undef
      //   } );
      // },
      // _setData_ : function ( data ) { this._data_ = data; },
      // _setIsDone_    : function ( was_stopped ) {
      //   var
      //     event_obj = this,
      //     run_list  = event_obj._run_list_,
      //     cb_count  = run_list[ __length ],
      //
      //     run_row,    callback_fn,
      //     param_list, context_data, i;
      //
      //   if ( event_obj._is_done_ ) { return this._is_done_; }
      //
      //   // Run fns set by 'runOnDone' event object method
      //   for ( i = __0; i < cb_count; i++ ) {
      //     run_row = run_list[ i ];
      //     context_data  = run_row._context_data_;
      //     callback_fn   = run_row._callback_fn_;
      //     param_list    = [ was_stopped ][ vMap._concat_ ]( run_row._param_list_ );
      //     callback_fn[ __apply ]( context_data, param_list );
      //   }
      //   event_obj._is_done_ = __true;
      //   return event_obj._is_done_;
      // }
      //
      _initEvent_ : function ( event_type ) {
        var event_obj = this;
        utilObj._mergeMaps_( event_obj, {
          _timestamp_ : utilObj._getNowMs_(),
          _is_done_   : __false,
          _run_list_  : [],
          _type_      : event_type || __blank
        });
      },
      _setIsDone_ : function () {
        var event_obj = this;
        event_obj._is_done_ = __true;
        return __true;
      }
    };
    // . END utility proto /eventProto/
    // == . END UTILITY METHODS =========================================

    // == BEGIN PUBLIC METHODS ========================================
    // BEGIN Public method /getMapFn/
    function getMapFn ( type_str ) {
      if ( type_str === '_configMap_' ) {
        return configMap;
      }
      if ( type_str === '_stateMap_' ) {
        return stateMap;
      }
      logFn( '_warn_', '_requested_map_not_available_', type_str );

    }
    // . END Public method /getMapFn/

    // BEGIN Public method /getStateDataFn/
    // Purpose: Provide access to state data structures
    //
    function getStateDataFn ( key ) {
      return stateMap[ key ];
    }
    // . END Public method /getStateDataFn/

    // BEGIN Public method /setConfigMapFn/
    function setConfigMapFn ( arg_set_map ) {
      return utilObj._setConfigMap_({
        _input_map_    : arg_set_map,
        _settable_map_ : { _auth_key_ : __true },
        _config_map_   : configMap
      });
    }
    // . END Public method /setConfigMapFn/

    // BEGIN Public method /addHandlerFn/
    // Example : addHandler(
    //   '_report_ready_',             // event_name   (required)
    //   wrapper_obj._wrapper_fn_,     // handler_fn   (required)
    //   wrapper_obj,                  // handler_this (default undef)
    //   1,                            // priority_idx (default 3)
    // );
    // Priority_idx provides what priority slot to append to. Allowed values
    // are [ -1, -2, -3, 1, 2, 3 ]. A negative number directs the function
    // unshift the handler to the *top* of a priority group, whereas a positive
    // number directs the function to push to the end of a priority group.
    //
    //  Invocation   Priority | Function
    //      |        ---------+------------ <-- Top of group 3
    //      |               3 | doThisFn
    //      |               3 | doThatFn    <-- Bottom of group 3
    //      |        ---------+------------ <-- Top of group 2
    //      |               2 | makeCallFn
    //      |               2 | fakeCallFn
    //      |               2 | takeCallFn  <-- Bottom of group 2
    //      |        ---------+------------ <-- Top of group 1
    //      |               1 | makeBurpFn
    //      |               1 | fakeBurpFn
    //      |               1 | takeBurpFn  <-- Bottom of group 1
    //      V        ---------+------------
    //
    //
    function addHandlerFn (
      arg_event_name, arg_handler_fn, arg_handler_this, arg_priority_idx
    ) {
      var
        event_name   = utilObj._castStr_( arg_event_name ),
        handler_fn   = utilObj._castFn_( arg_handler_fn ),
        handler_this = arg_handler_this,
        priority_idx = utilObj._castInt_(
          vMap._makeAbsNumFn_( arg_priority_idx ),
          __3, { _min_num_ : __1, __max_num_ : __3 }
        ),

        handler_map      = configMap._event_handler_map_,
        event_name_list  = configMap._event_name_list_,

        do_ontop = arg_priority_idx < __0,

        solve_map, row_count,    add_before_idx,
        is_added,  handler_list, idx,
        row_map
      ;

      // Bail if no function provided
      if ( ! handler_fn ) {
        logFn( '_error_', '_invalid_function_', arg_handler_fn );
        return __false;
      }

      // Get or init list of handlers for event_name
      handler_list = handler_map[ event_name ];
      if ( ! handler_list ) {
        // Bail if event name not registered
        if ( event_name_list[ vMap._indexOf_ ]( event_name ) === __n1 ) {
          logFn( '_error_', '_event_name_not_registered_', event_name );
          return __false;
        }
        handler_list = [];
        handler_map[ event_name ] = handler_list;
      }

      // Create event object
      solve_map = {
        _handler_this_ : handler_this,
        _handler_fn_   : handler_fn,
        _priority_idx_ : priority_idx
      };

      // Begin Iterate through list and insert as directed
      row_count = handler_list[ __length ];
      add_before_idx = do_ontop ? priority_idx + __1 : priority_idx;

      is_added = __false;
      for ( idx = __0; idx < row_count; idx++ ) {
        row_map = handler_list[ idx ];
        if ( add_before_idx > row_map._priority_idx_ ) {
          handler_list[ vMap._splice_]( idx, __0, solve_map );
          is_added = __true;
          break;
        }
      }
      if ( ! is_added ) {
        handler_list[ __push ]( solve_map );
      }
      // . End Iterate through list and event object as directed
      return __true;
    }
    // . END Public method /addHandlerFn/

    // BEGIN Public method /rmHandlerFn/
    function rmHandlerFn ( arg_event_name, arg_handler_fn ) {
      var
        handler_map   = configMap._event_handler_map_,
        handler_list  = utilObj._castList_( handler_map[ arg_event_name ], [] ),
        handler_count = handler_list[ __length ],
        i, row_map;

      if ( utilObj._getVarType_( handler_list ) !== '_Array_' ) {
        return __false;
      }

      for ( i = __0; i < handler_count; i++ ) {
        row_map = handler_list[ i ];
        if ( row_map._handler_fn_ === arg_handler_fn || ! arg_handler_fn ) {
          handler_list[ vMap._splice_ ]( i, __1 );
          handler_count--;
        }
      }
      return __true;
    }
    // . END Public method /rmHandlerFn/

    // BEGIN Public method /publishEventFn/
    // Examples  :
    //   publishEvent( '_report_ready_', data_map );
    //   publishEvent( '_report_complete_' );
    // Purpose   : Calls the named event handler stack
    // Arguments :
    //   The first argument determines the event stack to call e.g.
    //   '_report_ready_'. The remaining argument as passed onto the
    //   handlers as the arguments *after* the event object.
    //   A handler that returns 'false' will terminate the stack.
    // Settings :
    //   configMap._event_handler_map_ must be a map
    // Throws    : none
    // Returns   : true when the handler stack is applied
    //   (even if empty).
    //
    function publishEventFn () {
      var
        arg_list   = utilObj._makeArgList_( arguments ),
        event_name = arg_list[ vMap._shift_ ](),

        handler_map  = configMap._event_handler_map_,
        handler_list = handler_map[ event_name ] || [],
        end_count    = handler_list[ __length ] + __n1,

        event_log_list = stateMap._event_log_list_,

        event_obj,    loop_idx,   row_map,
        handler_this, handler_fn, call_arg_list,
        ret_data
        ;

      // Create event_obj and init use
      event_obj = vMap._createObjectFn_( eventProto );
      event_obj._initEvent_( event_name );

      // Prepare arguments for handler functions if any
      call_arg_list = [ event_obj ][ vMap._concat_ ]( arg_list );

      for ( loop_idx = end_count; loop_idx > __n1; loop_idx-- ) {
        // addHandlerFn ensures the validity of these attributes
        row_map      = handler_list[ loop_idx ];
        handler_this = row_map._handler_this_;
        handler_fn   = row_map._handler_fn_;
        ret_data     = handler_fn[ __apply ]( handler_this, call_arg_list );
        // Break out of stack if return value is false
        if ( ret_data === __false ) { break; }
      }

      // Only populate test object if in developer mode
      if ( stateMap._do_event_log_ ) {
        event_log_list[ __push ]( {
          _event_name_ : event_name,
          _arg_list_   : call_arg_list
        } );
      }

      // Fire any callbacks set by eventObj._runOnDone_()
      event_obj._setIsDone_();
    }
    // . END Public method /publishEventFn/

    // BEGIN Public method /toggleStateKeyFn/
    // Summary    :
    //   toggleStateKeyFn(
    //       <key>,  [ <boolean|undef|'_same_'>, <data_list>, <do_force> ]
    //   );
    // Purpose    : Set state boolean key
    // Examples   :
    //   // Set key to true and force publish
    //   toggleStateKeyFn( '_is_slider_open_',  __true, __undef, __true );
    //
    //   // Toggle key from present value
    //   toggleStateKeyFn( '_is_slider_open_' );
    //
    //   // Keep current value but force event publication
    //   toggleStateKeyFn( '_is_slider_open_', '_same_', __undef, __true );
    //
    //   // Publish additional information to handler
    //   // Handler receives <event>, __true
    //   toggleStateKeyFn(
    //      '_is_footer_shown_', __true, [ powered_html ]
    //   );
    //
    // Arguments : ( positional )
    //   0. arg_key      : The stateMap[ arg_key ] to set.
    //   1. arg_value    : Value to set state key. Values include:
    //     - __true or __false: Set state key to specified value
    //     - '_same_'    : Keep existing value (used to publish value)
    //     - (all other) : Toggle existing value
    //   2. data_list    : List of additional arguments to publish with event
    //   3. do_force     : Force publication of key even if not changed.
    // Settings  : Module-scoped stateMap is modified by this routine.
    //           : Publish keys are found in configMap._toggle_key_map_.
    // Returns   : undef
    // Throws    : none
    // Technique : Will not publish a change event IFF provided boolean value
    //   is the same as the existing value (see argument 0 above).
    //
    function toggleStateKeyFn (
      arg_state_key, arg_bool, arg_data_list, arg_do_force
    ) {
      var
        data_list    = utilObj._castList_( arg_data_list, [] ),
        current_bool = stateMap[ arg_state_key ],
        pub_key      = configMap._toggle_key_map_[ arg_state_key ],
        solve_bool, param_list;

      if ( ! pub_key ) {
        return logFn( '_error_', '_state_key_not_found_', arg_state_key );
      }

      if ( arg_bool === '_same_' ) {
        solve_bool = !! current_bool; // Ensure boolean value
      }
      else {
        solve_bool = utilObj._castBool_( arg_bool, ! current_bool );
      }

      // Do not update key unless value changed or force flag set
      if ( solve_bool === current_bool && ! arg_do_force ) { return; }

      stateMap[ arg_state_key ] = solve_bool;
      param_list = [ pub_key, stateMap[ arg_state_key ] ][ vMap._concat_ ](
        data_list );

      publishEventFn[ vMap._apply_ ]( __undef, param_list );
    }
    // . END Public method /toggleStateKeyFn/

    // BEGIN Public method /toggleStateListFn/
    // Summary    : toggleStateListFn( <argList1>, <argList2>, ... );
    // Purpose    : Wrap toggleStateKeyFn to process mutiple keys at once
    //
    function toggleStateListFn () {
      var
        wrap_list = utilObj._makeArgList_( arguments ),
        wrap_count = wrap_list[ __length ],
        idx;

      for ( idx = __0; idx < wrap_count; idx++ ) {
        toggleStateKeyFn[ __apply ]( __undef, wrap_list[ idx ] );
      }
    }
    // . END Public method /toggleStateListFn/

    // BEGIN Public method /initModuleFn/
    function initModuleFn () {
      var
        log_level_idx = logObj._getLevelIdx_(),
        log_warn_idx  = logObj._getIdxByName_( '_warn_' )
        ;

      // If log_level is > warn ( _notice_, _info_, or _debug_ ),
      // then log events for debugging purposes.
      //
      stateMap._do_event_log_ = ( log_level_idx > log_warn_idx );

      return __true;
    }
    // . END Public method /initModuleFn/

    // BEGIN instance map
    instanceMap = {
      _getMapFn_       : getMapFn,
      _getStateDataFn_ : getStateDataFn,
      _setConfigMapFn_ : setConfigMapFn,

      _addHandlerFn_   : addHandlerFn,
      _rmHandlerFn_    : rmHandlerFn,

      _publishEventFn_    : publishEventFn,
      _toggleStateKeyFn_  : toggleStateKeyFn,
      _toggleStateListFn_ : toggleStateListFn,

      _initModuleFn_   : initModuleFn
    };
    // . END instance map

    optionMap = utilObj._castMap_( argOptionMap, {} );
    if ( optionMap._dont_autoadd_ !== __true ) {
      aMap[ '_03_model_' ] = instanceMap;
    }

    return instanceMap;
    // == . END PUBLIC METHODS ========================================
  }
  // == . END /makeInstanceFn/ ========================================
  return { _makeInstanceFn_ : makeInstanceFn };
}());
// == . END MODULE xhi._03_model_ ======================================
