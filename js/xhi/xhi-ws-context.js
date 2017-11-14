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
    list = [],
    map  = {},
    fn   = Function,
    int  = 1,
    num  = 1 / 2,
    obj  = {},
    str  = ''
    ;

  return {
    // svg
    correspondingUseElement : obj,

    // aMap._01_util_
    _attr_list_      : list,
    _bool_           : bool,
    _fn_             : fn,
    _int_            : int,
    _example_str_    : str,
    _example_obj_    : obj,
    _char_limit_int_ : num,
    _input_map_      : map,
    _max_ms_         : num,
    _target_map_     : map,
    _tgt_count_      : num,

    // aMap._02_data_
    _full_url_ : str,
    _content_type_ : str,

    // aMap._04_utilb_
    _select_str_ : str,
    _title_map_  : map,
    name : str,

    // aMap._06_lb_
    _do_block_click_ : bool,
    _do_dflt_class_  : bool,
    _do_draggable_   : bool,
    _do_title_close_ : bool,
    _dont_autoadd_   : bool,
    _layout_key_     : str,
    _autoclose_ms_   : int,
    _position_map_   : map
  };
}());
