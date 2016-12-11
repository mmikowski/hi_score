#!/bin/bash

## See style-guide
## https://google.github.io/styleguide/shell.xml#Function_Names
## http://www.davidpashley.com/articles/writing-robust-shell-scripts.html

## Exit when encountering undeclared variables
## The -e check ( exit when encountering a non-zero exit status )
## As we do our own checking 
set -u;

# 1. Wipes and copy vendor libs to the js/vendor, css/vendor, and
#    font/vendor directories using the current version from package.json.
# 2. Install the commit hook if git is detected.
#
# TODO:
# 1. Use the same configuration file as buildify / superpack
# 2. Auto-update links to these files using in index.html
#    (consider using sed -e 's/"<old_vrs_path>"/"<new_vrs_path>"/ index.html' )
#

  ## == BEGIN Layout variables ===============================================
  _app_name=$( basename $0 );
  _orig_dir=$( pwd );
  echo "start ${_app_name}";
  echo "  > layout vars";

    # app path and name
    _app_link=$( readlink -f -- "${0}" );
    _bin_dir=$( cd "${_app_link%/*}" && echo "${PWD}" );

    # npm module paths
    _git_dir=''; # initialize
    _npm_dir=$( dirname "${_bin_dir}" );
    _mod_dir="${_npm_dir}/node_modules";
    _app_dir="${_npm_dir}";
    _pkg_file="${_npm_dir}/package.json";
    _ugly_dir="${_mod_dir}/uglifyjs";
    _scope_file="${_ugly_dir}/lib/scope.js";

    _version_str="";
    _patch_str="// BEGIN hi_scope patch line 249";
    _patch_file="${_npm_dir}/patch/uglifyjs-2.4.10.patch";

    # executables
    _git_exe=$(   which git );
    _patch_exe=$( which patch );

  # echo "  < layout vars";
  ## == END Layout variables =================================================

  ## == BEGIN _parse_version_file_fn () - Read package.json and parse ========
  _parse_version_file_fn () {
    pushd "${_npm_dir}/bin" > /dev/null;
    _version_str=$(
      node -e '
        var fs = require( "fs" );
        fs.readFile(
          "../package.json",
          "utf8",
          function( error, json_str ) {
            var
              vrs_rx   = /[^\d\.]/g,
              out_list = [],
              pkg_map, dev_map, key_list,
              key_count, idx;
            if ( error ) { return console.error( error ); }
            pkg_map = JSON.parse( json_str );
            dev_map = pkg_map.devDependencies;
            if ( dev_map ) {
              key_list  = Object.keys( dev_map );
              key_count = key_list.length;
              for ( idx = 0; idx < key_count; idx++ ) {
                key     = key_list[ idx ];
                vrs_str = dev_map[ key ].replace( vrs_rx, "" );
                out_list.push( key + ":" + vrs_str );
              }
            }
            console.log( out_list.join(" ") );
          }
        );
      '
    );
    popd > /dev/null;
  }
  ## == END _parse_version_file_fn () ========================================

  ## == BEGIN _get_version_fn() - Look up version for requested package ======
  _get_version_fn () {
    local IFS='';
    _match_str="$*";
    if [ "${_version_str}" == "" ]; then _parse_version_file_fn; fi;
    echo "${_version_str}" |sed -e 's/ /\n/g'| while read _line_str; do
      _key=$(echo "${_line_str}" |cut -f1 -d':' );
      _val=$(echo "${_line_str}" |cut -f2 -d':' );
      if [ "${_key}" == "${_match_str}" ]; then
        echo -e "${_val}";
      fi;
    done
  }
  ## == END _get_version_fn() ================================================

  ## == BEGIN main - Copy vendor assets and add commit hook ==================
  echo "  > main";
  echo "  >> main / verify env";
    if [ -x "${_git_exe}" ]; then 
      _top_dir=$( ${_git_exe} rev-parse --show-toplevel 2>/dev/null );
      if [ ! -z "${_top_dir}" ]; then
        _git_dir=$( cd "${_top_dir}" && pwd );
      fi
    fi

    if [ ! -x "${_patch_exe}" ]; then
      echo "  !! FAIL: Could not find patch executable."
      echo "       Please install patch."
      exit 1;
    fi

    if [ ! -w "${_scope_file}" ]; then
      echo "  !! FAIL: Cannot write to ${_scope_file}.";
      echo "        Did you forget to run 'npm install' first?";
      exit 1;
    fi
  # echo "  << main / verify env";
  
  echo "  >> main / remove dirs";
    cd "${_app_dir}";
    if [ -r "js/vendor" ]; then
      rm -rf "js/vendor";
    fi
    if [ -r "css/vendor" ]; then
      rm -rf "css/vendor";
    fi
    if [ -r "font/vendor" ]; then
      rm -rf "font/vendor";
    fi
 
    mkdir -p "js/vendor";
    mkdir -p "css/vendor";
    mkdir -p "font/vendor";
  # echo "  << main / remove dirs";

  echo "  >> main / copy vendor libs"; 
    cd "${_app_dir}/js/vendor";

    vrs=$(_get_version_fn powercss);
    cp "${_mod_dir}/powercss/dist/pcss.js" "pcss-${vrs}.js"
    cp "${_mod_dir}/powercss/dist/pcss.cfg.js" "pcss.cfg-${vrs}.js"

    vrs=$(_get_version_fn jquery);
    cp "${_mod_dir}/jquery/dist/jquery.js" "jquery-${vrs}.js";

    vrs=$(_get_version_fn jquery.event.dragscroll);
    cp "${_mod_dir}/jquery.event.dragscroll/jquery.event.dragscroll.js" \
      "jquery.event.dragscroll-${vrs}.js";

    vrs=$(_get_version_fn jquery.event.gevent);
    cp "${_mod_dir}/jquery.event.gevent/jquery.event.gevent.js" \
      "jquery.event.gevent-${vrs}.js";

    vrs=$(_get_version_fn jquery.event.ue);
    cp "${_mod_dir}/jquery.event.ue/jquery.event.ue.js" \
      "jquery.event.ue-${vrs}.js";

    vrs=$(_get_version_fn jquery.scrolli);
    cp "${_mod_dir}/jquery.scrolli/dist/jquery.scrolli.js" \
      "jquery.scrolli-${vrs}.js";

    vrs=$(_get_version_fn jquery.urianchor);
    cp "${_mod_dir}/jquery.urianchor/jquery.uriAnchor.js" \
      "jquery.urianchor-${vrs}.js";

    vrs=$(_get_version_fn taffydb);
    cp "${_mod_dir}/taffydb/taffy.js" "taffy-${vrs}.js";

    # ----

    cd "${_app_dir}/css/vendor";
    vrs=$(_get_version_fn font-awesome);
    cp "${_mod_dir}/font-awesome/css/font-awesome.css" "font-awesome-${vrs}.css";

    # ----

    cd "${_app_dir}/font/vendor";
    vrs=$(_get_version_fn font-awesome);
    cp -a "${_mod_dir}/font-awesome/fonts" "font-awesome-${vrs}";

    vrs=$(_get_version_fn open-sans-fontface);
    cp -a "${_mod_dir}/open-sans-fontface/fonts" "open-sans-fontface-${vrs}";
  # echo "  << main / copy vendor libs"; 

  echo "  >> main / add git hook"; 
    if [ ! -z "${_git_dir}" ]; then
      _precommit_file="${_git_dir}/.git/hooks/pre-commit";
      if [ -L "${_precommit_file}" ]; then
        rm -f "${_precommit_file}";
      fi

      cd "${_git_dir}/.git/hooks" \
        && ln -s "../../bin/git-hook_pre-commit" "./pre-commit" \
        && echo "  ? INFO installed git hook.";
    else
      echo "  ?  INFO : Git hook not installed."
      echo "            Run 'npm run ${_app_name}' again once checked-in to git."
    fi
  # echo "  << main / add git hook"; 

  # Patch reference:
  # http://www.thegeekstuff.com/2014/12/patch-command-examples
  # diff -Naur old_dir new_dir > file.patch

  echo "  >> main / patch uglifyjs";
    if ( grep -q "${_patch_str}" "${_scope_file}" ); then
      echo "  ? INFO: Uglify patch already applied.";
    else
      cd "${_mod_dir}";
      "${_patch_exe}" -p0 < "${_patch_file}";
      echo "  ? INFO: Uglify patch applied";
    fi
  # echo "  << main / patch uglifyjs";
  echo;

  cd "${_orig_dir}";
  # echo "  <  main"
  echo "end ${_app_name}";
  echo;

  exit 0;
## == END main =============================================================

