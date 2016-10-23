/**
 *    xhi-ws-context.js
 *    This file is used by WebStorm to resolve propoerties from AJAX.
 *    It is also useful as a reference.
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
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
    num  = 0.5,
    obj  = {},
    str  = ''
    ;

 return {
   // xhi.util.js argument keys
   // These should be deleted after all regression tests are implemented
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


   // xhi.lb.js argument keys
   _do_block_click_ : bool,
   _do_draggable_   : bool,
   _do_title_close_ : bool,
   _layout_key_     : str,
   _autoclose_ms_   : int,
   _position_map_   : map

 };
}());
