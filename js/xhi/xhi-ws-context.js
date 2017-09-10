/*
 * xhi-ws-context.js
 * This file is used by WebStorm to resolve properties
 * key received from external sources such as AJAX.
 * It is also useful as a reference.
 * It should *NOT* be included in production code.
 *
 * JSLint settings found in config/jslint.conf
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
  white  : true,    todo : true,  unparam : true
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

    // __NS._util_
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

    // __NS._utilb_
    _select_str_ : str,
    _title_map_  : map,
    name : str,

    // _NS._lb_
    _do_block_click_ : bool,
    _do_draggable_   : bool,
    _do_title_close_ : bool,
    _layout_key_     : str,
    _autoclose_ms_   : int,
    _position_map_   : map
  };
}());
