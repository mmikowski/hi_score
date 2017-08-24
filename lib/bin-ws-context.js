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
    // core and util
    call       : fn,
    promisfy   : fn,

    catch_fn   : fn,
    then_fn    : fn,
    xhi_obj    : obj,
    alias_list : list,

    // package.json
    pkgMatrix          : map,
    devDependencies    : map,
    xhi_commandTable   : map,
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

    check_filename : str,
    patch_dir_str  : str,
    patch_filename : str,
    patch_map_list : list,
    patch_matrix   : map,
    pattern_str    : str,

    ignore_int : int,
    ignore_num : num,

    // process.env
    PATH       : str,

    // npmObj methods
    outdated : fn,
    all      : fn
  };
}());
