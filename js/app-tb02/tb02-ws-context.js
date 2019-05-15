/*
 * xhi-ws-context.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * This file is used by WebStorm to resolve properties
 * key received from external sources such as AJAX.
 * It is also useful as a reference.
 * It should *NOT* be included in production code.
 *
*/
(function () {
  'use strict';
  var
    bool = true,
    fn   = Function,
    int  = 1,
    list = [],
    map  = {},
    num  = 1 / 2,
    obj  = {},
    rx   = new RegExp(''),
    str  = ''
    ;

  return {
    // Basics
    _bool_  : bool,
    _fn_    : fn,
    _int_   : int,
    _list_  : list,
    _map_   : map,
    _num_   : num,
    _obj_   : obj,
    _rx_    : rx,
    _str_   : str,

    // tb02.03_model.js
    _drop_range_num_ : num,
    _drop_speed_num_ : num,
    _match_goal_int_ : int,
    _onscreen_count_ : int,
    _bomb_pause_ms_  : int,
    _ignore_fn_ : fn,

    // tb02.07_shell.js
    _is_big_bomb_ : bool
  };
}());
