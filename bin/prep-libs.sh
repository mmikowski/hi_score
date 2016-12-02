#!/bin/bash
# 1. Wipe and re-copy vendor libs to the js/vendor and css/vendor directories
#    using the current version from package.json.
# 2. Install the commit hook if git is detected.
#
# TODO:
# 1. Use the same configuration file as buildify / superpack
# 2. Auto-update links to these files using in index.html
#    (consider using sed -e 's/"<old_vrs_path>"/"<new_vrs_path>"/ index.html' )
#

set -u;

  ## == BEGIN Layout variables ===============================================
  echo;
  echo "start prep-libs";
  echo "  > layout vars";
    GIT_EXE=$(   which git );
    PATCH_EXE=$( which patch );

    LN_PATH=$( readlink -f -- "${0}" );
    ORI_DIR=$( pwd );

    BIN_DIR=$( cd "${LN_PATH%/*}" && echo "${PWD}" );
    NPM_DIR=$( dirname "${BIN_DIR}" );

    APP_DIR="${NPM_DIR}";
    GIT_DIR="";
    MOD_DIR="${NPM_DIR}/node_modules";
    PKG_FILE="${NPM_DIR}/package.json";
    UGLY_DIR="${MOD_DIR}/uglifyjs";
    SCOPE_FILE="${UGLY_DIR}/lib/scope.js";

    VRS_STR="";
    PATCH_STR="// BEGIN hi_scope patch line 249";
    PATCH_FILE="${NPM_DIR}/patch/uglifyjs-2.4.10.patch";
  # echo "  < layout vars";
  ## == END Layout variables =================================================

  ## == BEGIN setVersStr() - Read package.json and parse =====================
  setVrsStr () {
    pushd "${NPM_DIR}/bin" > /dev/null;
    VRS_STR=$(
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
  ## == END setVersStr() =====================================================

  ## == BEGIN getVrs() - Look up version for requested package ===============
  getVrs () {
    local IFS='';
    MATCH="$*";
    if [ "${VRS_STR}" == "" ]; then setVrsStr; fi;
    echo "${VRS_STR}" |sed -e 's/ /\n/g'| while read LINE; do
      KEY=$(echo "${LINE}" |cut -f1 -d':' );
      VAL=$(echo "${LINE}" |cut -f2 -d':' );
      if [ "${KEY}" == "${MATCH}" ]; then
        echo -e "${VAL}";
      fi;
    done
  }
  ## == END getVrs() =========================================================

  ## == BEGIN main - Copy vendor assets and add commit hook ==================
  echo "  > main";
  echo "  >> main / verify env";
    if [ -x "${GIT_EXE}" ]; then 
      TOP_DIR=$(git rev-parse --show-toplevel);
      if [ ! -z "${TOP_DIR}" ]; then
        GIT_DIR=$( cd "${TOP_DIR}" && pwd );
      fi
    fi

    if [ ! -x "${PATCH_EXE}" ]; then
      echo "  !! FAIL: Could not find patch executable."
      echo "       Please install patch."
      exit 1;
    fi

    if [ ! -w "${SCOPE_FILE}" ]; then
      echo "  !! FAIL: Cannot write to ${SSOPE_FILE}.";
      echo "        Did you forget to run 'npm install' first?";
      exit 1;
    fi
  # echo "  << main / verify env";
  

  echo "  >> main / remove dirs";
    cd "${APP_DIR}";
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
    cd "${APP_DIR}/js/vendor";
    vrs=$(getVrs jquery);
    cp "${MOD_DIR}/jquery/dist/jquery.js" "jquery-${vrs}.js";

    vrs=$(getVrs jquery.event.dragscroll);
    cp "${MOD_DIR}/jquery.event.dragscroll/jquery.event.dragscroll.js" \
      "jquery.event.dragscroll-${vrs}.js";

    vrs=$(getVrs jquery.event.gevent);
    cp "${MOD_DIR}/jquery.event.gevent/jquery.event.gevent.js" \
      "jquery.event.gevent-${vrs}.js";

    vrs=$(getVrs jquery.event.ue);
    cp "${MOD_DIR}/jquery.event.ue/jquery.event.ue.js" \
      "jquery.event.ue-${vrs}.js";

    vrs=$(getVrs jquery.scrolli);
    cp "${MOD_DIR}/jquery.scrolli/dist/jquery.scrolli.js" \
      "jquery.scrolli-${vrs}.js";

    vrs=$(getVrs jquery.urianchor);
    cp "${MOD_DIR}/jquery.urianchor/jquery.uriAnchor.js" \
      "jquery.urianchor-${vrs}.js";

    vrs=$(getVrs powercss);
    cp "${MOD_DIR}/powercss/dist/pcss.js" "pcss-${vrs}.js"
    cp "${MOD_DIR}/powercss/dist/pcss.cfg.js" "pcss.cfg-${vrs}.js"

    vrs=$(getVrs taffydb);
    cp "${MOD_DIR}/taffydb/taffy.js" "taffy-${vrs}.js";

    # ----

    cd "${APP_DIR}/css/vendor";
    vrs=$(getVrs font-awesome);
    cp "${MOD_DIR}/font-awesome/css/font-awesome.css" "font-awesome-${vrs}.css";

    # ----

    cd "${APP_DIR}/font/vendor";
    vrs=$(getVrs font-awesome);
    cp -a "${MOD_DIR}/font-awesome/fonts" "font-awesome-${vrs}";

    vrs=$(getVrs open-sans-fontface);
    cp -a "${MOD_DIR}/open-sans-fontface/fonts" "open-sans-fontface-${vrs}";
  # echo "  << main / copy vendor libs"; 

  echo "  >> main / add git hook"; 
    if [ ! -z "${GIT_DIR}" ]; then
      PC_FILE="${GIT_DIR}/.git/hooks/pre-commit";
      if [ -L "${PC_FILE}" ]; then
        rm -f "${PC_FILE}";
      fi

      cd "${GIT_DIR}/.git/hooks" \
        && ln -s "../../bin/git-hook_pre-commit" "./pre-commit" \
        && echo "  ? INFO installed git hook.";
    else
      echo "  !  WARN: Could not install git hook.";
      echo "           Once you have checked in your code "
      echo "           you may run 'npm run prep-libs' again "
      echo "           to install the commit hook."
    fi
  # echo "  << main / add git hook"; 

  # Patch reference:
  # http://www.thegeekstuff.com/2014/12/patch-command-examples
  # diff -Naur old_dir new_dir > file.patch

  echo "  >> main / patch uglifyjs";
    if ( grep -q "${PATCH_STR}" "${SCOPE_FILE}" ); then
      echo "  ? INFO: Uglify patch already applied.";
    else
      cd "${MOD_DIR}";
      "${PATCH_EXE}" -p0 < "${PATCH_FILE}";
      echo "  ? INFO: ${PFX} Uglify patch applied";
    fi
  # echo "  << main / patch uglifyjs";
  echo;

  cd "${ORI_DIR}";
  # echo "  <  main"
  echo "end prep-libs";
  echo;

  exit 0;
## == END main =============================================================

