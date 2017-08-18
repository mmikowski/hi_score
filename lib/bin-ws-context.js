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
    alias_list : list,
    catch_fn   : fn,
    then_fn    : fn,
    xhi_obj    : obj,

    // package.json
    pkgMatrix          : map,
    devDependencies    : map,
    xhi_02_SetupMatrix : map,

    asset_group_table  : list,

    asset_list     : list,
    dest_name      : str,
    dest_dir_str   : str,
    dest_ext_str   : str,
    do_dir_copy    : bool,

    src_asset_name : str,
    src_dir_str    : str,
    src_pkg_name   : str,

    patch_matrix   : map,
    patch_dir_str  : str,
    patch_map_list : list,
    check_filename : str,
    patch_filename : str,
    pattern_str    : str,

    ignore_int : int,
    ignore_num : num
  };
}());
