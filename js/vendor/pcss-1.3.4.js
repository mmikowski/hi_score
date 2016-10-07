/* PowerCSS - pcss.js
 * Run-time generated and managed CSS
 * Michael S. Mikowski - mike.mikowski@gmail.com
 * See README.md for further documentation.
*/
/*jslint        browser : true, continue : true,
  devel : true,  indent : 2,      maxerr : 50,
  newcap : true,  nomen : true, plusplus : true,
  regexp : true, sloppy : true,     vars : false,
  white : true,    todo : true,  unparam : true
*/
/*global Event, pcss:true */

var pcss = (function () {
  'use strict';
  // 1. MODULE SCOPE VARIABLES ============================
  //noinspection MagicNumberJS
  var
    __keys = Object.keys,
    __Str  = String,

    __j2str     = JSON.stringify,
    __str2j     = JSON.parse,

    __docRef    = document,
    __isArray   = Array.isArray,
    __false     = false,
    __null      = null,
    __true      = true,
    __timeStamp = Date.now,
    __winRef    = window,

    vMap = {
      _appendChild_    : 'appendChild',
      _apply_          : 'apply',
      _array_          : 'array',
      _bind_           : 'bind',
      _childNodes_     : 'childNodes',
      _console_        : 'console',
      _createElement_  : 'createElement',
      _createEvent_    : 'createEvent',
      _createTextNode_ : 'createTextNode',
      _cssText_        : 'cssText',
      _disabled_       : 'disabled',
      _dispatchEvent_  : 'dispatchEvent',
      _getElById_      : 'getElementById',
      _hasOwnProp_     : 'hasOwnProperty',
      _head_           : 'head',
      _id_             : 'id',
      _indexOf_        : 'indexOf',
      _innerHTML_      : 'innerHTML',
      _innerText_      : 'innerText',
      _join_           : 'join',
      _length_         : 'length',
      _log_            : 'log',
      _nodeValue_      : 'nodeValue',
      _object_         : 'object',
      _pop_            : 'pop',
      _push_           : 'push',
      _setAttribute_   : 'setAttribute',
      _sheet_          : 'sheet',
      _shift_          : 'shift',
      _slice_          : 'slice',
      _splice_         : 'splice',
      _string_         : 'string',
      _styleSheets_    : 'styleSheets',
      _textContent_    : 'textContent',
      _text_           : 'text',
      _text_css_       : 'text/css',
      _type_           : 'type',
      _undefined_      : 'undefined'
    },

    __0       = 0,
    __1       = 1,
    __2       = 2,
    __n1      = -1,
    __blank   = '',
    __undef   = __winRef[ vMap._undefined_ ],
    __console = __winRef[ vMap._console_ ],

    // Top Confiruration Map (topCmap)
    topCmap = {
      _max_resolve_count_ : 10000,
      _regen_type_list_ : [
        '_none_', '_merge_', '_prepare_', '_all_', '_use_'
      ]
    },

    // Top State Map (topSmap) dynamic data structure
    //  _vsheet_map_map_
    //    +- `vsheet_id1`
    //       |- _vsheet_id_     : `vsheet_id1`
    //       |- _selector_list_ : `selector_list`
    //       |- _selector_ms_   : `timestamp`
    //       |- _mixin_map_     : `mixin_map`
    //       +- _mixin_ms_      : `timestamp`
    //
    // _cascade_map_map_
    //   +- `cascade_id1`
    //      |- _cascade_id_           : `cascade_id1`
    //      |- _vsheet_id_list_       : `vsheet_id_list`
    //      |- _vsheet_ms_            : `timestamp`
    //      |- _mixin_map_            : {...}
    //      |- _mixin_ms_             : `timestamp`
    //      |- _merged_selector_list_ : `merged_selector_list`
    //      |- _merged_mixin_map_     : `merged_mixin_map`
    //      |- _merged_selector_ms_   : `timestamp`
    //      |- _css_str_              : `cascade_css`
    //      +- _css_ms_               : `timestamp`

    topSmap = {
      _is_enabled_       : __true,
      _is_init_          : __false,
      _el_cascade_list_  : [],

      _global_mixin_map_ : {},
      _global_mixin_ms_  : __0,

      _vsheet_map_map_   : {},
      _cascade_map_map_  : {},
      _rule_list_        : __undef,
      _style_el_list_    : __undef,
      _style_el_prefix_  : __undef,
      _style_el_idx_     : __n1
    },

    cssKeyMap, cssValMap, publishEvent
    ;
  // end 1. MODULE SCOPE VARIABLES ========================

  // 2. PRIVATE METHODS ===================================
  // 2.1 Private method /cloneData/
  function cloneData ( data ) {
    if ( ! data ) { return data; }
    //noinspection NestedFunctionCallJS
    return __str2j( __j2str( data ) );
  }
  // end 2.1 Private method /cloneData/

  // 2.2 Private method /getVarType/
  function getVarType ( arg ) {
    return __isArray( arg ) ? vMap._array_ : ( typeof arg );
  }
  // end 2.2

  // 2.3 Private method /logIt/
  function logIt () {
    // IE9 does not have a console object unless dev tools are open
    if ( __console ) {
      __console.log[ vMap._apply_ ]( __console, arguments );
    }
  }
  // end 2.3

  // 2.4 Private method /makeValList/
  function makeValList( map, key_list ) {
    var
      val_list  = [],
      key_count = key_list.length,
      i, key, val_data;

    for ( i = __0; i < key_count; i++ ) {
      key           = key_list[ i ];
      val_data      = map[ key ];
      val_list[ i ] = val_data;
    }
    return val_list;
  }
  // end 2.4

  // 2.5 Private method /publishEvent/
  publishEvent = (function publishEvent () {
    var
      initEventName = '_pcss_init_',

      initEventObj,   isCapable,
      createError,    createModeStr,
      dispatchError,  dispatchModeStr
      ;

    // Determine createModeStr
    if ( __docRef[ vMap._createEvent_ ] ) {
      try {
        createModeStr = '_ms_';
        initEventObj = __docRef[ vMap._createEvent_ ]('HTMLEvents');
        initEventObj.initEvent( initEventName, true, true );
      }
      catch( error ) { createError = error; }
    }
    else if ( Event ) {
      try {
        createModeStr = '_wk_';
        initEventObj = new Event( name );
      }
      catch( error ) { createError = error; }
    }

    if ( createError ) {
      logIt( '_create_event_error_', createError );
      isCapable = __false;
    }
    else {
      isCapable = __true;
    }

    if ( isCapable ) {
      // Determine dispatchModeStr
      if ( __docRef[ vMap._dispatchEvent_ ] ) {
        try {
          dispatchModeStr = '_wk_';
          __docRef[ vMap._dispatchEvent_ ]( initEventObj );
        }
        catch( error ) { dispatchError = error; }
      }
      else if ( __docRef[ name ] ) {
        try {
          dispatchModeStr = '_ms_';
          __docRef[ name ]();
        }
        catch( error ) { dispatchError = error; }
      }
      else if ( __docRef[ 'on' + name ] ) {
        try {
          dispatchModeStr = '_mson_';
          __docRef[ 'on' + name ]();
        }
        catch( error ) { dispatchError = error; }
      }
      else {
        dispatchError = '_events_not_supported_';
      }

      if ( dispatchError ) {
        logIt( '_dispatch_event_error_', dispatchError );
        isCapable = __false;
      }
    }

    function publishMain ( name, data ) {
      var event_obj;
      if ( ! isCapable ) { return __false; }
      switch( createModeStr ) {
        case '_wk_' : event_obj = new Event( name ); break;
        case '_ms_' :
          event_obj = __docRef[ vMap._createEvent_ ]('HTMLEvents');
          event_obj.initEvent( name, true, true );
          break;
        default :
          logIt( '_unsupported_', createModeStr );
          return __false;
      }
      event_obj._data_ = data;

      switch( dispatchModeStr ) {
        case '_wk_' :
          __docRef[ vMap._dispatchEvent_ ]( event_obj );
          break;
        case '_ms_' : __docRef[ name ](); break;
        case '_mson_' : __docRef[ 'on' + name ](); break;
        default :
          logIt( '_unsupported_', dispatchModeStr );
          return false;
      }
      return __true;
    }

    return publishMain;
  }());
  // end 2.5

  // 2.6 Private method /writeToStyleEl/
  // TODO: Profile on major browsers
  // This function updates the css_str in the style element
  // ONLY if it appears changed.  This SHOULD be much faster
  // than blindly writing the css_str. However, browsers may already
  // do this check, so it may be redundant. Profile to determine answer.
  //
  function writeToStyleEl ( style_el, css_str ) {
    var text_el, childnode_list;
    // Old Firefox and IE
    if ( style_el[ vMap._hasOwnProp_ ]( vMap._cssText_ ) ) {
      if ( style_el[ vMap._cssText_ ] !== css_str ) {
        style_el[ vMap._cssText_ ] = css_str;
      }
    }
    // New Firefox
    else if ( style_el[ vMap._hasOwnProp_ ]( vMap._textContent_ ) ) {
      if ( style_el[ vMap._textContent_ ] !== css_str ) {
        style_el[ vMap._textContent_ ] = css_str;
      }
    }
    // Webkit
    else {
      childnode_list = style_el[ vMap._childNodes_ ];
      if ( childnode_list && childnode_list[ vMap._length_ ] > __0 ) {
        text_el = childnode_list[ __0 ];
        if ( text_el[ vMap._nodeValue_ ] !== css_str ) {
          text_el[ vMap._nodeValue_ ] = css_str;
        }
      }
      else {
        text_el = __docRef[ vMap._createTextNode_ ]( css_str );
        style_el[ vMap._appendChild_ ]( text_el );
      }
    }
  }
  // end 2.6 Private method /writeToStyleEl/

  // 2.7 Private method /initStyleEls/
  function initStyleEls () {
    var
      head_el         = __docRef[ vMap._head_ ],
      style_el_prefix = topSmap._style_el_prefix_,
      style_el_list   = [],

      i, style_el_id, style_el
      ;

    for ( i = __0; i < __2; i++ ) {
      style_el_id = style_el_prefix +  __Str( i );
      if ( !! __docRef[ vMap._getElById_ ]( style_el_id ) ) {
        throw '_sheet_id_is_already_in_use_ ' + style_el_id;
      }
      // Create element and set properties
      style_el = __docRef[ vMap._createElement_ ]( 'style' );
      style_el[ vMap._setAttribute_ ]( vMap._type_, vMap._text_css_ );
      style_el[ vMap._setAttribute_ ]( vMap._id_, style_el_id );

      // Add to head
      head_el[ vMap._appendChild_ ]( style_el );
      style_el[ vMap._sheet_ ][ vMap._disabled_ ] = __true;
      style_el_list[ vMap._push_ ]( style_el );
    }
    topSmap._style_el_list_ = style_el_list;
  }
  // end 2.7 Private method /initStyleEls/

  // 2.8 Private method /checkVsheetIds/
  function checkVsheetIds( vsheet_id_list ) {
    var
      vsheet_map_map  = topSmap._vsheet_map_map_,
      vsheet_id_count = vsheet_id_list[ vMap._length_ ],
      unknown_id_list = [],

      i, vsheet_id
      ;

    for ( i = __0; i < vsheet_id_count; i++ ) {
      vsheet_id = vsheet_id_list[ i ];
      if ( vsheet_map_map[ vMap._hasOwnProp_ ]( vsheet_id ) ) {
        continue;
      }
      unknown_id_list[ vMap._push_ ]( vsheet_id );
    }
    return unknown_id_list;
  }
  // end 2.8

  // 2.9 Private and Public method /extendRuleMap/
  // Example   : pcss._extendRuleMap_( rule_map, { _color_ : '_x444_' } );
  // Purpose   : A utility to extend a rule_map with new or revised
  //             values. Providing a value of 'null' deletes a key.
  //             pcss._extendRuleMap_( rule_map, { _color_ : null } );
  // Arguments : (positional)
  //             0 : base_map   - the map to be extended
  //             1 : extend_map - the map containing new key-value pairs
  // Settings  : none
  // Throws    : none
  // Returns   : none
  //   base_map is modified, extend_map is not.
  //
  function extendRuleMap ( base_map, arg_extend_map ) {
    var
      extend_map,
      key_list,  key_count,
      rule_key,  rule_data, i
      ;

    // return undef if objects are not provided
    if ( getVarType( base_map       ) !== vMap._object_
      || getVarType( arg_extend_map ) !== vMap._object_
    ) { return; }

    extend_map = cloneData( arg_extend_map );
    key_list   = __keys( extend_map );
    key_count  = key_list[ vMap._length_ ];

    _KEY_: for ( i = __0; i < key_count; i++ ) {
      rule_key = key_list[ i ];
      rule_data = extend_map[ rule_key ];
      // delete keys will the value of __null
      if ( rule_data === __null ) {
        delete base_map[ rule_key ];
        continue _KEY_;
      }
      base_map[ rule_key ] = extend_map[ rule_key ];
    }
    return base_map;
  }
  // end 2.9 Private and Public method /extendRuleMap/

  // 2.10 Private method /mergeCascade/
  function mergeCascade ( arg_vsheet_id_list, arg_mixin_map ) {
    // 2.10.1 init and args
    var
      vsheet_map_map       = topSmap._vsheet_map_map_,
      vsheet_count         = arg_vsheet_id_list[ vMap._length_ ],
      seen_selector_map    = {},
      merged_selector_list = [],

      merged_mixin_map,
      global_mixin_map,

      i,
      vsheet_id,   vsheet_map,
      selector_list,  vsheet_mixin_map,
      selector_count, namespace_str,
      cond_stack,

      j,
      selector_map,    selector_str,
      fq_selector_str, pop_str,
      begin_cond_str,  end_cond_str,
      rule_lock_list,  rule_map,

      merged_rpt_map,
      merged_selector_map,
      merged_lock_list,
      merged_rule_map,

      n,
      rule_key_list, rule_key_count,
      rule_key,      clone_selector_map
      ;
    // end 2.10.1 init and args

    // 2.10.2 merge global and cascade mixin map
    global_mixin_map  = topSmap._global_mixin_map_ || {};
    merged_mixin_map  = cloneData( global_mixin_map );
    extendRuleMap( merged_mixin_map, arg_mixin_map );

    // 2.10.3 Consider each vsheet selector_list in the cascade list
    _VSHEET_: for ( i = __0; i < vsheet_count; i++ ) {
      vsheet_id        = arg_vsheet_id_list[ i ];
      vsheet_map       = vsheet_map_map[ vsheet_id ];
      if ( ! vsheet_map ) {
        logIt( '_cannot_find_vsheet_map_for_id_', vsheet_map );
        continue _VSHEET_;
      }

      // 2.10.3.1 merge vsheet mixin map
      vsheet_mixin_map = vsheet_map._mixin_map_;
      extendRuleMap( merged_mixin_map, vsheet_mixin_map );

      // 2.10.3.2 Consider each selector_map in the selector_list
      selector_list  = vsheet_map._selector_list_ || [];
      selector_count = selector_list[ vMap._length_ ];
      namespace_str  = __blank;
      cond_stack     = [];

      _SELECT_MAP0_: for ( j = __0; j < selector_count; j++ ) {
        // 2.10.3.2.1 Init selector_map vars
        selector_map   = selector_list[ j ];
        begin_cond_str = selector_map._begin_cond_str_;
        end_cond_str   = selector_map._end_cond_str_;
        selector_str   = selector_map._selector_str_;
        rule_lock_list = selector_map._rule_lock_list_;
        rule_map       = selector_map._rule_map_;
        // end 2.10.3.2.1

        // 2.10.3.2.2 Namespace per condition stack
        if ( begin_cond_str ) {
          cond_stack[ vMap._push_ ]( begin_cond_str );
          namespace_str = cond_stack[ vMap._join_ ](':');
          merged_selector_list[ vMap._push_]( selector_map );
          seen_selector_map[ namespace_str ] = selector_map;
          continue _SELECT_MAP0_;
        }

        if ( end_cond_str !== __undef ) {
          merged_selector_list[ vMap._push_]( selector_map );
          pop_str = cond_stack[ vMap._pop_ ]();
          if ( end_cond_str && pop_str !== end_cond_str ) {
            logIt( '_end_cond_str_does_not_match_begin_', pop_str, end_cond_str );
          }
          namespace_str = cond_stack[ vMap._join_ ](':');
          continue _SELECT_MAP0_;
        }

        if ( selector_str ) {
          fq_selector_str = namespace_str + ':' + selector_str;
        }
        else {
          logIt( '_useless_selector_map_', selector_map );
          continue _SELECT_MAP0_;
        }
        // 2.10.3.2.2 Namespace per condition stack

        // 2.10.3.2.3 Use previously seen selector data
        merged_rpt_map = seen_selector_map[ fq_selector_str ];
        if ( merged_rpt_map ) {
          merged_selector_map = merged_rpt_map._selector_map_;
          merged_lock_list    = merged_rpt_map._rule_lock_list_;
          merged_rule_map     = merged_selector_map._rule_map_;

          // 2.10.3.2.3.1 Merge in latest locks
          if ( rule_lock_list ) {
            merged_lock_list[ vMap._push_ ][ vMap._apply_
              ]( merged_lock_list, rule_lock_list );
            merged_rpt_map[ '_lock_on_ ' + __Str( i ) ]
              = __j2str( rule_lock_list );
          }
          // end 2.10.3.2.3.1

          // 2.10.3.2.3.2 Merge rules unless they are locked
          rule_key_list  = ( rule_map && __keys( rule_map )) || [];
          rule_key_count = rule_key_list[ vMap._length_ ];
          for ( n = __0; n < rule_key_count; n++ ) {
            rule_key = rule_key_list[ n ];
            if ( merged_lock_list[ vMap._indexOf_ ]( rule_key ) > __n1 ) {
              logIt(
                '_rule_key_locked_for_selector_', fq_selector_str, rule_key
              );
            }
            else {
              merged_rule_map[ rule_key ] = rule_map[ rule_key ];
            }
          }
          // end 2.10.3.2.3.2
          //
          // 2.10.3.2.3.3 move this selector_map to the end of the
          // merged_selector_list
        }
        // end 2.10.3.2.3

        // 2.10.3.2.4 Init new selector data
        else {
          // 2.10.3.2.4.1 Set up merged_rpt_map
          clone_selector_map = cloneData( selector_map );
          merged_rpt_map     = { _selector_map_ : clone_selector_map };
          // end 2.10.3.2.4.1

          // 2.10.3.2.4.2 Init lock list data
          if ( rule_lock_list ) {
            merged_rpt_map._rule_lock_list_ = cloneData( rule_lock_list );
            merged_rpt_map[ '_lock_on_' + __Str( i ) ]
              = __j2str( rule_lock_list );
          }
          else {
            merged_rpt_map._rule_lock_list_ = [];
          }
          // end 2.10.3.2.4.2

          // 2.10.3.2.4.3 store key and merged_rpt_map
          seen_selector_map[ fq_selector_str ] = merged_rpt_map;
          merged_selector_list[ vMap._push_]( clone_selector_map );
          // end 2.10.3.4.3
        }
        // end 2.10.3.2.4
      }
      // end 2.10.3.2 Consider each selector_map in the selector_list
    }
    // end 2.10.3 Consider each vsheet in the cascade list

    // 2.10.4 return map of results
    return {
      _merged_selector_list_ : merged_selector_list,
      _merged_mixin_map_     : merged_mixin_map
    };
  }
  // end 2.10 Private method /mergeCascade/

  // 2.11 Private method /makeRuleMapStr/
  function makeRuleMapStr ( rule_map, merged_mixin_map ) {
    var
      frame_stack       = [],
      max_resolve_count = topCmap._max_resolve_count_,

      key_list,
      val_list, rule_key,
      frame_obj, orig_obj,
      prior_frame_obj, k,

      val_data, val_data_type,
      tmp_data, tmp_data_type,
      solve_data, solve_key,

      alt_list, alt_type,
      first_data, first_type
      ;


    key_list  = __keys( rule_map );
    if ( key_list[ vMap._length_ ] === __0 ) { return __blank; }

    val_list  = makeValList( rule_map, key_list );
    rule_key  = key_list[ __0 ];
    solve_key = cssKeyMap[ rule_key ];
    if ( solve_key === __undef ) {
      logIt( '_unsupported_rule_key_symbol_', rule_key );
    }

    frame_obj = {
      _type_       : '_base_',
      _key_list_   : key_list,
      _rule_key_   : rule_key,
      _solve_key_  : solve_key,
      _val_idx_    : __0,
      _val_list_   : val_list,
      _val_count_  : key_list[ vMap._length_],
      _solve_list_ : [],
      _solve_str_  : __blank
    };
    orig_obj = frame_obj;

    // We use a while loop to prevent an infinite loop
    k = __0;
    _RESOLVE_: while( k < max_resolve_count ) {
      k++;
      if ( frame_obj._val_idx_ >= frame_obj._val_count_ ) {
        prior_frame_obj = frame_obj;
        if ( prior_frame_obj._type_ === '_concat_' ) {
          prior_frame_obj._solve_str_
            += prior_frame_obj._solve_list_[ vMap._join_ ](' ');
        }
        else {
          prior_frame_obj._solve_str_
            += frame_obj._solve_list_[ vMap._join_ ](';');
        }

        frame_obj = frame_stack[ vMap._pop_ ]();
        if ( ! frame_obj ) { break _RESOLVE_; }

        if ( prior_frame_obj._type_ === '_alt_list_'
          || frame_obj._solve_key_  === __undef
        ) {
          frame_obj._solve_list_[ vMap._push_ ]( prior_frame_obj._solve_str_ );
        }
        else {
          frame_obj._solve_list_[ vMap._push_ ](
            frame_obj._solve_key_ + ':' + prior_frame_obj._solve_str_
          );
        }
        frame_obj._val_idx_++;
        continue _RESOLVE_;
      }

      if ( frame_obj._type_ === '_base_' ) {
        rule_key  = frame_obj._key_list_[ frame_obj._val_idx_ ];
        frame_obj._rule_key_  = rule_key;

        solve_key = cssKeyMap[ rule_key ];
        if ( solve_key === __undef ) {
          logIt( '_unsupported_rule_key_symbol_', rule_key );
        }
        frame_obj._solve_key_ = solve_key;
      }

      val_data      = frame_obj._val_list_[ frame_obj._val_idx_ ];
      val_data_type = getVarType( val_data );

      // support for complex data expansion
      if ( val_data_type === vMap._string_ ) {
        if ( merged_mixin_map[ vMap._hasOwnProp_ ]( val_data ) ) {
          tmp_data = merged_mixin_map[ val_data ];
        }
        else if ( cssValMap[ vMap._hasOwnProp_ ]( val_data ) ) {
          tmp_data = cssValMap[ val_data ];
        }
        if ( tmp_data !== __undef ) {
          tmp_data_type = getVarType( tmp_data );
          if ( tmp_data_type !== vMap._string_ ) {
            val_data      = tmp_data;
            val_data_type = tmp_data_type;
          }
        }
      }

      solve_data = __undef;
      _TYPE_: switch ( val_data_type ) {
        // Resolve alternate lists
        case vMap._object_ :
          if ( val_data === __null ) {
            logIt( '_null_object_found_', frame_obj );
            break _TYPE_;
          }
          alt_list = val_data._alt_list_;
          alt_type = getVarType( alt_list );

          if ( alt_type === vMap._array_ ) {
            frame_stack[ vMap._push_ ]( frame_obj );

            frame_obj = {
              _type_       : '_alt_list_',
              _solve_key_  : frame_obj._solve_key_,
              _val_idx_    : __0,
              _val_list_   : alt_list,
              _val_count_  : alt_list[ vMap._length_ ],
              _solve_list_ : [],
              _solve_str_  : __blank
            };
            continue _RESOLVE_;
          }
          logIt( '_unsupported_object_', val_data );
          break _TYPE_;

        // Resolve concat-lists and literals
        case vMap._array_ :
          if ( val_data[ vMap._length_ ] === __1 ) {
            first_data = val_data[ __0 ];
            first_type = getVarType( first_data );

            // Resolve concat-list
            if ( first_type === vMap._array_ ) {
              frame_stack[ vMap._push_ ]( frame_obj );
              frame_obj = {
                _type_       : '_concat_',
                _val_idx_    : __0,
                _val_list_   : first_data,
                _val_count_  : first_data[ vMap._length_ ],
                _solve_list_ : [],
                _solve_str_  : __blank
              };
              continue _RESOLVE_;
            }
            // Resolve literal
            solve_data = first_data;
          }
          else {
            logIt( '_unsupported_array_', val_data );
          }
          break _TYPE_;

        // Resolve value symbol subsitution
        default :
          if ( merged_mixin_map[ vMap._hasOwnProp_ ]( val_data ) ) {
            solve_data = merged_mixin_map[ val_data ];
          }
          else if ( cssValMap[ vMap._hasOwnProp_ ]( val_data ) ) {
            solve_data = cssValMap[ val_data ];
          }
          else {
            logIt( '_value_symbol_not_found_', val_data );
          }
          break _TYPE_;
      }

      if ( solve_data ) {
        if ( frame_obj._type_ === '_concat_'
          || frame_obj._solve_key_ === __undef
        ) {
          frame_obj._solve_list_[ vMap._push_ ]( solve_data );
        }
        else {
          frame_obj._solve_list_[ vMap._push_ ](
            frame_obj._solve_key_ + ':' + solve_data
          );
        }
      }
      frame_obj._val_idx_++;
    }
    if ( k === max_resolve_count ) {
      logIt( '_maximum_resolve_operations_exceeded_', k );
    }
    return orig_obj._solve_str_;
  }
  // end 2.11 Private method /makeRuleMapStr/

  // 2.12 Private method /makeCssStr/
  function makeCssStr ( merged_selector_list, merged_mixin_map ) {
    // 2.12.1 init and args
    var
      cond_stack = [],

      i,
      selector_count, selector_map,
      selector_str,   begin_cond_str,
      end_cond_str,   pop_str,
      selector_idx,   last_str,
      rule_map,       rule_str,

      solve_selector_list,
      solve_selector_str
      ;

    selector_count      = merged_selector_list[ vMap._length_ ];
    solve_selector_list = [];
    // end 2.12.1

    // 2.12.2 Consider each selector map in list
    _SELECT_MAP1_:for ( i = __0; i < selector_count; i++ ) {
      // 2.12.2.1 Init selector_map vars
      selector_map    = merged_selector_list[ i ];
      begin_cond_str  = selector_map._begin_cond_str_;
      end_cond_str    = selector_map._end_cond_str_;
      selector_str    = selector_map._selector_str_;
      rule_map        = selector_map._rule_map_;
      // end 2.12.2.1

      // 2.12.2.2 add conditional css syntax
      if ( begin_cond_str ) {
        cond_stack[ vMap._push_ ]( begin_cond_str );
        solve_selector_list[ vMap._push_ ]( begin_cond_str );
        solve_selector_list[ vMap._push_ ]( '{' );
        continue _SELECT_MAP1_;
      }

      if ( end_cond_str !== __undef ) {
        pop_str = cond_stack[ vMap._pop_ ]();
        if ( end_cond_str && pop_str !== end_cond_str ) {
          logIt( '_end_cond_str_does_not_match_begin_', pop_str, end_cond_str );
        }
        selector_idx = solve_selector_list[ vMap._length_ ] - __1;
        last_str     = solve_selector_list[ selector_idx  ];
        if ( last_str === '{' ) {
          selector_idx--;
          solve_selector_list[ vMap._length_ ] = selector_idx;
        }
        else {
          solve_selector_list[ vMap._push_ ]( '}' );
        }
        continue _SELECT_MAP1_;
      }

      if ( selector_str ) { solve_selector_str = selector_str; }
      else {
        logIt( '_useless_selector_map_', selector_map );
        continue _SELECT_MAP1_;
      }
      // end 2.12.2.2

      // 2.12.2.3 add rule map and store
      if ( rule_map ) {
        rule_str = makeRuleMapStr( rule_map, merged_mixin_map );
        solve_selector_str += '{' + rule_str + '}';
      }
      solve_selector_list[ vMap._push_ ]( solve_selector_str );
      // end 2.12.2.3
    }
    // end 2.12.2 Consider each selector map in list

    // 2.12.3 return CSS string
    return solve_selector_list[ vMap._join_]( __blank );
  }
  // end 2.12 Private method /makeCssStr/

  // 2.13 Private method /regenCascade/
  function regenCascade( cascade_map, regen_type ) {
    var
      now_ms     = __timeStamp(),
      cascade_id = cascade_map._cascade_id_,

      merged_ms, result_map, style_el, write_idx, write_el;

    // 2.13.1 Bail on unrecognized regen type
    if ( topCmap._regen_type_list_[ vMap._indexOf_ ]( regen_type )
      === __n1
    ) {
      logIt( '_regen_type_not_supported_', regen_type );
      return;
    }

    // 2.13.2 _none_ level regen_type
    if ( regen_type === '_none_' ) { return regen_type; }

    // 2.13.3 _merge_ level regen_type
    merged_ms = cascade_map._merged_selector_ms_;
    if ( merged_ms <= cascade_map._vsheet_ms_
      || merged_ms <= cascade_map._mixin_ms_
      || merged_ms <= topSmap._global_mixin_ms_
    ) {
      result_map = mergeCascade(
        cascade_map._vsheet_id_list_, cascade_map._mixin_map_
      );
      cascade_map._merged_selector_list_ = result_map._merged_selector_list_;
      cascade_map._merged_mixin_map_     = result_map._merged_mixin_map_;
      cascade_map._merged_selector_ms_   = now_ms;
      cascade_map._mixin_ms_             = now_ms;
      publishEvent( '_pcss_merged_', cascade_id );
    }
    if ( regen_type === '_merge_' ) { return regen_type; }
    // end 2.13.3

    // 2.13.4 _prepare_ level regen_type
    if ( cascade_map._css_ms_ < cascade_map._merged_selector_ms_ ) {
      cascade_map._css_str_ = makeCssStr(
        cascade_map._merged_selector_list_,
        cascade_map._merged_mixin_map_
      );
      cascade_map._css_ms_ = now_ms;
      publishEvent( '_pcss_prepared_', cascade_id );
    }
    if ( regen_type === '_prepare_' ) { return regen_type; }
    // end 2.13.4

    // 2.13.5 _all_ and _use_ level regen
    if ( regen_type === '_use_' || (
      topSmap._el_cascade_list_[ topSmap._style_el_idx_ ] === cascade_id
    ) ) {
      style_el  = topSmap._style_el_list_[ topSmap._style_el_idx_ ];
      switch( topSmap._style_el_idx_ ) {
        case     __0 : write_idx = __1; break;
        case     __1 : write_idx = __0; break;
        default      : write_idx = __0; break;
      }
      write_el  = topSmap._style_el_list_[ write_idx ];
      writeToStyleEl ( write_el, cascade_map._css_str_ );

      if ( style_el ) {
        style_el[ vMap._sheet_ ][ vMap._disabled_ ] = __true;
      }
      write_el[ vMap._sheet_ ][ vMap._disabled_ ] = ! topSmap._is_enabled_;

      topSmap._style_el_idx_    = write_idx;
      topSmap._active_rule_map_ = __undef;
      topSmap._el_cascade_list_[ write_idx ] = cascade_id;
      publishEvent( '_pcss_used_', cascade_id );
    }
    // end 2.13.5
    return regen_type;
  }
  // end 2.13 Private method /regenCascade/

  function setActiveRuleMap () {
    var
      style_el    = topSmap._style_el_list_[ topSmap._style_el_idx_ ],
      sheet_list  = __docRef[ vMap._styleSheets_ ],
      sheet_count = sheet_list[ vMap._length_ ],
      active_rule_map = {},

      idx, sheet_obj, solve_sheet_obj,
      rule_list, rule_count, rule_obj,
      selector_str
      ;

    for ( idx = __0; idx < sheet_count; idx++ ) {
      sheet_obj = sheet_list[ idx ];
      if ( sheet_obj.ownerNode === style_el ) {
        solve_sheet_obj = sheet_obj; break;
      }
    }
    if ( ! solve_sheet_obj ) { return; }

    rule_list  = solve_sheet_obj.rules || solve_sheet_obj.cssRules;
    if ( ! rule_list ) { return; }

    rule_count = rule_list[ vMap._length_ ];
    for ( idx = __0; idx < rule_count; idx++ ) {
      rule_obj  = rule_list[ idx ];
      selector_str = rule_obj.selectorText;
      if ( selector_str ) {
        active_rule_map[ selector_str ] = rule_obj;
      }
    }
    topSmap._active_rule_map_ = active_rule_map;
    return active_rule_map;
  }

  function setStyleAttr ( arg_map ) {
    var
      selector_str    = arg_map._selector_str_,
      attr_key        = arg_map._attr_key_,
      attr_val        = arg_map._attr_val_,
      active_rule_map = topSmap._active_rule_map_,
      rule_obj, style_obj
      ;

    if ( ! active_rule_map ) { active_rule_map = setActiveRuleMap(); }
    if ( ! active_rule_map ) { return; }
    rule_obj  = active_rule_map[ selector_str ];
    style_obj = rule_obj && rule_obj.style;

    if ( style_obj && style_obj[ vMap._hasOwnProp_ ]( attr_key ) ) {
      style_obj[ attr_key ] = attr_val;
    }
  }
  // 2.14 Private method /initCheck/
  // Wrapper function that checks init before proceeding
  //
  function initCheck () {
    var target_fn = this;
    if ( ! topSmap._style_el_prefix_ ) {
      throw '_please_run_initmodule_first_';
    }
    return target_fn[ vMap._apply_ ]( this, arguments );
  }
  // end 2.14
  // end 2. PRIVATE METHODS ===================================

  // 3. EVENT HANDLERS ========================================
  //
  // end 3. EVENT HANDLERS ====================================

  // 4. PUBLIC METHODS ========================================
  // 4.1 Public method /initModule/
  // ------------------------------
  // Example   | pcss._initModule_({ _style_el_prefix_ : 'ns' });
  // Purpose   | Initializes style elements using the provided prefix
  // Arguments | _style_el_prefix_ :
  //           | Optional: A prefix to name-space the two style elements
  //           | If not provided, the prefix 'pcss' will be used.
  // Settings  | none
  // Throws    | A string error object if style elements already exist
  // Returns   | The style prefix, e.g. 'ns-'
  //
  function initModule ( arg_map ) {
    // 4.1.1 init and args
    var
      opt_map         = arg_map || {},
      style_el_prefix = opt_map._style_el_prefix_ || 'pcss',
      css_key_map     = opt_map._css_key_map_,
      css_val_map     = opt_map._css_val_map_
      ;

    // 4.1.2 Init element prefix
    if ( ! topSmap._style_el_prefix_ ) {
      style_el_prefix += '-';
      topSmap._style_el_prefix_ = style_el_prefix;
      // Create two style elements '<prefix>-0' and '<prefix>-1'
      initStyleEls();
    }

    // 4.1.3 Initialize cssKeyMap and cssValMap
    if ( ! css_key_map ) {
      css_key_map = pcss._cfg_ && pcss._cfg_._cssKeyMap_;
    }
    if ( ! css_val_map ) {
      css_val_map = pcss._cfg_ && pcss._cfg_._cssValMap_;
    }

    if ( ! ( css_key_map && css_val_map ) ) { return; }
    cssKeyMap = css_key_map;
    cssValMap = css_val_map;

    // 4.1.4 return prefix
    topSmap._is_init_ = __true;
    return topSmap._style_el_prefix_;
  }
  // end 4.1 Public method /initModule/

  // 4.2 Public method /togglePcss/
  // ------------------------------
  // Example   | pcss._togglePcss_( true );
  // Purpose   | Enable or disable PowerCSS
  // Arguments | boolean (optional)
  //           | If not provided, will toggle PowerCSS on or off.
  //           | If provided, true will turn PowerCSS on, and false
  //           | will turn PowerCSS off.
  // Settings  | none
  // Throws    | none
  // Returns   | true (enabled) or false (disabled)
  //
  function togglePcss( arg_do_enable ) {
    var
      style_el  = topSmap._style_el_list_[ topSmap._style_el_idx_ ],
      do_disable;

    do_disable = ( arg_do_enable === __undef )
      ? topSmap._is_enabled_ : ! arg_do_enable;

    if ( style_el ) {
      style_el[ vMap._sheet_ ][ vMap._disabled_ ] = do_disable;
    }

    topSmap._is_enabled_ = ! do_disable;
    return topSmap._is_enabled_;
  }
  // end 4.2 Public method /togglePcss/

  // 4.3 Public method /setGlobalMixinMap/
  // -------------------------------------
  // Example   | pcss._setGlobalMixinMap_({
  //           |   _mode_type_ : 'add',
  //           |   _mixin_map_ : mixin_map
  //           | });
  // Purpose   | Add, change, delete, or update process status for
  //           | a global mixin map id.
  //           |
  // Arguments | _mode_type_  (req) '_add_', '_change_', or '_delete_'
  //           | _mixin_map_  (opt)
  //           | _regen_type_ (opt) '_none_', '_merge_', '_prepare_', or '_all_'
  // Notes     | _regen_type_ defaults to '_all_' if not provided.
  // Settings  | none
  // Throws    | none
  // Returns   | The number of vsheets affected by the change
  //
  function setGlobalMixinMap ( arg_opt_map ) {
    // 4.3.1 Init and arguments
    var
      opt_map    = arg_opt_map || {},

      mixin_map  = opt_map._mixin_map_  || {},
      regen_type = opt_map._regen_type_ || '_all_',

      cascade_map_map = topSmap._cascade_map_map_,

      cascade_id_list, cascade_id_count,
      i, cascade_id,   cascade_map
      ;

    if ( regen_type === '_use_' ) {
      logIt( '_regen_type_use_not_supported_for_this_method_' );
      return;
    }
    // end 4.3.1

    // 4.3.2 Set mixin map
    topSmap._global_mixin_map_ = cloneData( mixin_map );
    topSmap._global_mixin_ms_  = __timeStamp();

    // 4.3.3 Regenerate cascade maps to regen_type level
    cascade_id_list  = __keys( cascade_map_map );
    cascade_id_count = cascade_id_list[ vMap._length_ ];
    for ( i = __0; i < cascade_id_count; i++ ) {
      cascade_id     = cascade_id_list[ i ];
      cascade_map    = cascade_map_map[ cascade_id ];
      regenCascade( cascade_map, regen_type );
    }
    return cascade_id_count;
  }
  // end 4.3 Public method /setGlobalMixinMap/

  // 4.4 Public method /getAssetIdList/
  // ----------------------------------
  // Example   | vsheet_id_list = pcss._getAssetIdList_({
  //           |   _asset_type_ : '_vsheet_'
  //           | });
  //           | cascade_id_list = pcss._getAssetIdList_({
  //           |   _asset_id_ : '_cascade_'
  //           | });
  // Purpose   | Return the list of all vsheets or cascades.
  // Arguments | _asset_type_ (req), either '_vsheet_' or '_cascade_'
  // Settings  | none
  // Throws    | none
  // Returns   | A list of the asset IDs requested. PowerCSS will
  //           | NEVER use this list pointer, so you may mutate as
  //           | you please.
  //
  function getAssetIdList ( arg_opt_map ) {
    // 4.4.1 Init and arguments
    var
      opt_map    = arg_opt_map || {},
      asset_type = opt_map._asset_type_,
      asset_map_map
      ;
    // end 4.4.1 Init and arguments

    // 4.4.2 Set asset_map
    switch ( asset_type ) {
      case '_cascade_' :
        asset_map_map = topSmap._cascade_map_map_;
        break;
      case '_vsheet_' :
        asset_map_map = topSmap._vsheet_map_map_;
        break;
      default :
        logIt( '_asset_type_not_found_', asset_type );
        asset_map_map = {};
        break;
    }
    // end 4.4.2

    // 4.4.3 return list of keys
    return __keys( asset_map_map );
  }
  // end 4.4 Public method /getAssetIdList/

  // 4.5 Public method /getAssetJson/
  // Example   | pcss._getAssetJson_({
  //           |   _asset_id_      : '_c01_',
  //           |   _asset_type_    : '_cascade_'
  //           |   _asset_subtype_ : '_vsheet_id_list_'
  //           | })
  // Purpose   | Return a JSON snapshot of a vsheet or cascade.
  // Arguments | _asset_id_ (req) The existing ID of either a cascade
  //           |  or a vsheet.
  //           | _asset_type_ (req) '_vsheet_', '_cascade_',
  //           |   '_global_mixin_', '_el_cascade_list_',
  //           | _asset_subtype_ (opt)
  //           |   '_vsheet_' supports:
  //           |      _vsheet_id_,    _selector_list_,
  //           |      _selector_ms_,  _mixin_map_,
  //           |      _mixin_ms_
  //           |   '_cascade_' supports
  //           |      _cascade_id_,       _vsheet_id_list_
  //           |      _vsheet_ms_,        _mixin_map_
  //           |      _mixin_ms_,         _merged_selector_list_
  //           |      _merged_mixin_map_, _merged_selector_ms_
  //           |      _css_str_          _css_ms_
  // Settings  | none
  // Throws    | none
  // Returns   | A JSON string of the requested asset.
  //           | If there is no corresponding asset, the JSON string
  //           | returned is 'undefined'.
  //
  function getAssetJson ( arg_opt_map ) {
    // 4.5.1 Init and arguments
    var
      opt_map       = arg_opt_map || {},
      asset_type    = opt_map._asset_type_,
      asset_subtype = opt_map._asset_subtype_,
      asset_id      = opt_map._asset_id_,
      asset_map
      ;
    // end 4.5.1 Init and arguments

    // 4.5.2 Set asset_map
    switch ( asset_type ) {
      case '_cascade_' :
        asset_map = topSmap._cascade_map_map_[ asset_id ];
        break;
      case '_vsheet_' :
        asset_map = topSmap._vsheet_map_map_[ asset_id ];
        break;
      case '_global_mixin_' :
        return __j2str( topSmap._global_mixin_map_ );
      case '_el_cascade_list_' :
        return __j2str( topSmap._el_cascade_list_ );
      default :
        logIt( '_asset_type_not_found_', asset_type );
        asset_map = {};
        break;
    }
    // end 4.5.2

    // 4.5.3 Return if no subtype
    if ( ! asset_subtype ) { return __j2str( asset_map ); }

    // 4.5.4 Handle subtype
    if ( asset_map && asset_map[ vMap._hasOwnProp_ ]( asset_subtype ) ) {
      return __j2str( asset_map[ asset_subtype ] );
    }
    return __undef;
  }
  // end 4.5 Public method /getAssetJson/

  // 4.6 Public method /setVsheet/
  // Example   | pcss._setVsheet_({
  //           |   _vsheet_id_     : '_base_',
  //           |   _mode_str_      : '_add_',
  //           |   _selector_list_ : base_selector_list,
  //           |   _mixin_map_     : {},
  //           |   _regen_type_    : '_merge_'
  //           | });
  // Purpose   | Adds, changes, or deletes a vsheet
  // Arguments | _vsheet_id_    (req) The ID for a vsheet
  //           | _mode_str_     (req) '_add_', '_change_', or '_delete_'
  //           | _selector_list (opt) List of selectors this vsheet will
  //           |   represent in PowerCSS format.
  //           | _mixin_map_    (opt) The mixin_map for this vsheet.
  //           | _regen_type_   (opt) '_none_', '_merge_', '_prepare_',
  //           |                      or '_all_'
  // Notes     | _regen_type_ defaults to '_merge_' on Add, '_all_'
  //           | on other operations.
  // Settings  | none
  // Throws    | none
  // Returns   | vsheet_id, or undef on failure
  //
  function setVsheet ( arg_opt_map ) {
    // 4.6.1 Init and arguments
    var
      vsheet_map_map  = topSmap._vsheet_map_map_,
      cascade_map_map = topSmap._cascade_map_map_,

      opt_map         = arg_opt_map || {},
      vsheet_id       = opt_map._vsheet_id_,
      mode_str        = opt_map._mode_str_,
      selector_list   = opt_map._selector_list_,
      mixin_map       = opt_map._mixin_map_,
      regen_type      = opt_map._regen_type_,

      now_ms          = __timeStamp(),

      vsheet_map,       cascade_id_list,
      cascade_id_count, i,
      cascade_id,       cascade_map,
      vsheet_id_list,   vsheet_index
      ;

    if ( regen_type === '_use_' ) {
      logIt( '_regen_type_use_not_supported_for_this_method_' );
      return;
    }

    if ( ! regen_type ) {
      regen_type = mode_str === '_change_' ? '_all_' : '_merge_';
    }
    // end 4.6.1

    //  4.6.2 Get existing vsheet_map and stop forbidden action
    vsheet_map = vsheet_map_map[ vsheet_id ];
    switch ( mode_str ) {
      // If found log warning and return undef
      case '_add_' :
        if ( vsheet_map ) {
          logIt( '_vsheet_already_exists_for_id_', vsheet_id );
          return;
        }
        vsheet_map = { _vsheet_id_ : vsheet_id };
        vsheet_map_map[ vsheet_id ] = vsheet_map;
        break;
      // If not found log warning and return undef
      case '_change_' :
      case '_delete_' :
        if ( ! vsheet_map ) {
          logIt( '_no_vsheet_exists_for_id_', vsheet_id );
          return;
        }
        break;
      default :
        logIt( '_mode_not_supported_', mode_str );
        return;
    }
    // end 4.6.2

    // 4.6.3 Delete, change, or add data as provided
    if ( mode_str === '_delete_' ) {
      delete vsheet_map_map[ vsheet_id ];
    }
    else {
      if ( selector_list ) {
        vsheet_map._selector_list_ = cloneData( selector_list );
        vsheet_map._selector_ms_   = now_ms;
      }
      if ( mixin_map ) {
        vsheet_map._mixin_map_ = cloneData( mixin_map );
        vsheet_map._mixin_ms_  = now_ms;
      }
    }
    // regen has no effect for _add_ mode
    if ( mode_str === '_add_' ) { return vsheet_id; }
    // end 4.6.3

    // 4.6.4 Consider each cascade_map in _cascade_map_map
    cascade_id_list  = __keys( cascade_map_map );
    cascade_id_count = cascade_id_list[ vMap._length_ ];
    for ( i = __0; i < cascade_id_count; i++ ) {
      cascade_id     = cascade_id_list[ i ];
      cascade_map    = cascade_map_map[ cascade_id ];
      vsheet_id_list = cascade_map._vsheet_id_list_;

      // 4.6.4.1 Update _vsheet_ms_ if vsheet_id in vsheet_id_list
      vsheet_index = vsheet_id_list[ vMap._indexOf_ ]( vsheet_id );
      if ( vsheet_index > __n1 ) {
        cascade_map._vsheet_ms_ = now_ms;

        // 4.6.4.1.1 Remove vsheet id if _delete_
        if ( mode_str === '_delete_' ) {
          vsheet_id_list[ vMap._splice_ ]( vsheet_index, __1 );
        }
        // 4.6.4.1.2 Regenerate to specified level
        regenCascade( cascade_map, regen_type );
      }
      // end 4.6.4.1
    }
    // end 4.6.4
    return vsheet_id;
  }
  // end 4.6 Public method /setVsheet/

  // 4.7 Public method /setCascade/
  // Example   | pcss._setCascade_({
  //           |   _cascade_id_     : '_c01_',
  //           |   _mode_str_       : '_add_',
  //           |   _vsheet_id_list_ : [ '_base_', '_box_' ],
  //           |   _mixin_map_      : {},
  //           |   _regen_type_     : '_none_'
  //           | });
  // Purpose   | Adds, changes, or deletes a cascade
  // Arguments | _cascade_id_     (req) The ID for a cascade
  //           | _mode_str_       (req) '_add_', '_change_', or '_delete_'
  //           | _vsheet_id_list_ (opt) List of vsheet ids in order of
  //           |   application.
  //           | _mixin_map_      (opt) The mixin_map for this cascade.
  //           | _regen_type_     (opt) '_none_', '_merge_', '_prepare_',
  //           |                      or '_all_' (default is _merge_)
  // Notes     | _regen_type_ defaults to '_merge_' on Add, '_all_'
  //           | on other operations.
  // Settings  | none
  // Throws    | none
  // Returns   | cascade_id, or undef on failure
  //
  function setCascade ( arg_opt_map ) {
    // 4.7.1 Init and arguments
    var
      opt_map         = arg_opt_map || {},
      cascade_id      = opt_map._cascade_id_,
      mode_str        = opt_map._mode_str_,
      vsheet_id_list  = opt_map._vsheet_id_list_,
      mixin_map       = opt_map._mixin_map_,
      regen_type      = opt_map._regen_type_,

      cascade_map_map = topSmap._cascade_map_map_,
      now_ms          = __timeStamp(),

      cascade_map, unknown_id_list,
      style_el,    style_el_idx
      ;

    if ( ! regen_type ) {
      regen_type = mode_str === '_change_' ? '_all_' : '_merge_';
    }
    // end 4.7.1

    //  4.7.2 Get existing cascade_map and stop forbidden action
    cascade_map = cascade_map_map[ cascade_id ];
    switch ( mode_str ) {
      // If found log warning and return undef
      case '_add_' :
        if ( cascade_map ) {
          logIt( '_cascade_already_exists_for_id_', cascade_id );
          return;
        }
        cascade_map = {
          _cascade_id_           : cascade_id,
          _vsheet_id_list_       : __undef,
          _vsheet_ms_            : __0,
          _mixin_map_            : __undef,
          _mixin_ms_             : __0,
          _merged_selector_list_ : __undef,
          _merged_mixin_map_     : __undef,
          _merged_selector_ms_   : __0,
          _css_str_              : __blank,
          _css_ms_               : __0
        };
        cascade_map_map[ cascade_id ] = cascade_map;
        break;
      // If not found log warning and return undef
      case '_change_' :
      case '_delete_' :
        if ( ! cascade_map ) {
          logIt( '_no_cascade_exists_for_id_', cascade_id );
          return;
        }
        break;
      default :
        logIt( '_mode_not_supported_', mode_str );
        return;
    }
    // end 4.7.2

    // 4.7.3 Delete, change, or add data as provided
    if ( mode_str === '_delete_' ) {
      delete cascade_map_map[ cascade_id ];
      style_el_idx = topSmap._style_el_idx_;
      if ( topSmap[ style_el_idx ] === cascade_id ) {
        style_el = topSmap._style_el_list_[ style_el_idx ];
        writeToStyleEl( style_el, __blank );
      }
      return cascade_id;
    }

    if ( vsheet_id_list ) {
      unknown_id_list = checkVsheetIds( vsheet_id_list );
      if ( unknown_id_list[ vMap._length_ ] > __0 ) {
        logIt( '_unknown_vsheet_id_provided_', unknown_id_list );
        return;
      }
      cascade_map._vsheet_id_list_ = cloneData( vsheet_id_list );
      cascade_map._vsheet_ms_      = now_ms;
    }
    if ( mixin_map ) {
      cascade_map._mixin_map_ = cloneData( mixin_map );
      cascade_map._mixin_ms_  = now_ms;
    }
    // end 4.7.3

    regenCascade( cascade_map, regen_type );
    return cascade_id;
  }
  // end 4.7 Public method /setCascade/

  // 4.8 Public method /getCssKeyMap/
  function getCssKeyMap () { return cssKeyMap; }

  // 4.9 Public method /getCssValMap/
  function getCssValMap () { return cssValMap; }

  // 4.10 Public method /getGlobalMixinMap/
  function getGlobalMixinMap () { return topSmap._global_mixin_map_; }

  // end 4. PUBLIC METHODS ====================================
  return {
    _initModule_        : initModule,

    _extendRuleMap_     : extendRuleMap,
    _togglePcss_        : initCheck[ vMap._bind_ ]( togglePcss        ),
    _setGlobalMixinMap_ : initCheck[ vMap._bind_ ]( setGlobalMixinMap ),
    _getAssetIdList_    : initCheck[ vMap._bind_ ]( getAssetIdList    ),
    _getAssetJson_      : initCheck[ vMap._bind_ ]( getAssetJson      ),
    _setVsheet_         : initCheck[ vMap._bind_ ]( setVsheet         ),
    _setCascade_        : initCheck[ vMap._bind_ ]( setCascade        ),
    _getCssValMap_      : initCheck[ vMap._bind_ ]( getCssValMap      ),
    _getCssKeyMap_      : initCheck[ vMap._bind_ ]( getCssKeyMap      ),
    _getGlobalMixinMap_ : initCheck[ vMap._bind_ ]( getGlobalMixinMap ),
    _setStyleAttr_      : initCheck[ vMap._bind_ ]( setStyleAttr      )
  };
}());
