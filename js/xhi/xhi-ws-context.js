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
    // svg
    correspondingUseElement : obj,
    getYear          : fn,

    // aMap._01_util_
    _attr_list_      : list,
    _char_limit_int_ : num,
    _do_encode_html_ : bool,
    _do_warn_        : bool,
    _example_obj_    : obj,
    _example_str_    : str,
    _filter_rx_      : rx,
    _input_map_      : map,
    _is_empty_ok_    : bool,
    _max_ms_         : num,
    _min_length_     : int,
    _max_length_     : int,
    _target_map_     : map,
    _tgt_count_      : num,

    // aMap._02_data_
    _full_url_ : str,
    _content_type_ : str,

    // aMap._04_utilb_
    _name_       : str,
    _select_str_ : str,
    _title_map_  : map,

    // aMap._06_lb_
    _do_block_click_ : bool,
    _do_dflt_class_  : bool,
    _do_draggable_   : bool,
    _do_title_close_ : bool,
    _dont_autoadd_   : bool,
    _layout_key_     : str,
    _autoclose_ms_   : int,
    _position_map_   : map,

    _bool_  : bool,
    _fn_    : fn,
    _int_   : int,
    _list_  : list,
    _map_   : map,
    _num_   : num,
    _obj_   : obj,
    _rx_    : rx,
    _str_   : str
  };
}());
