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
    // core and util
    call       : fn,
    promisfy   : fn,

    catch_fn   : fn,
    then_fn    : fn,
    xhi_obj    : obj,
    alias_list : list,

    // package.json
    asset_group_table  : list,
    devDependencies    : map,
    packageMatrix      : map,
    xhi_02_SetupMatrix : map,
    xhi_commandTable   : map,

    asset_list     : list,
    asset_type     : str,
    dest_name      : str,
    dest_dirname   : str,
    dest_ext_str   : str,
    do_dir_copy    : bool,

    src_asset_name : str,
    src_dirname    : str,
    src_pkg_name   : str,

    check_filename : str,
    patch_dirname  : str,
    patch_filename : str,
    patch_map_list : list,
    patch_matrix   : map,
    pattern_str    : str,
    predo_list     : list,

    ignore_int : int,
    ignore_num : num,

    // jsonDataMap
    package_matrix : map,
    state_matrix   : map,
    // process.env
    PATH       : str,

    // nodejs
    process : { versions : { node : int } },

    // npmObj methods
    outdated : fn,
    all      : fn
  };
}());
