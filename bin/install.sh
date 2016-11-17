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

## BEGIN Layout variables ==================================================
GIT_EXE=$( which git );
LINK_PATH=$( readlink -f -- "${0}" );
BIN_PATH=$(  cd "${LINK_PATH%/*}" && echo "${PWD}" );
NPM_DIR=$(   dirname "${BIN_PATH}" );
APP_DIR="${NPM_DIR}";
PKG_FILE=$( find "${NPM_DIR}" -type f -wholename '*/package.json'  );
PKG_DIR=$(  dirname "${PKG_FILE}"  );
MOD_DIR=$( cd "${NPM_DIR}/.."; pwd );
# MOD_DIR=$( find "${NPM_DIR}" -type d \
#  |grep '/node_modules$' |grep -v '/node_modules/');
JSLINT_EXE="${MODS_DIR}/.bin/jslint";
NU_EXE="${MODS_DIR}/.bin/nodeunit";
VRS_STR="";
if [ -x "${GIT_EXE}" ]; then 
  TOP_DIR=$(git rev-parse --show-toplevel);
  if [ ! -z "${TOP_DIR}" ]; then
    GIT_DIR=$( cd "${TOP_DIR}" && pwd );
  fi
fi
## END Layout variables ====================================================

## BEGIN setVersStr() - Read package.json and parse ========================
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
##   END setVersStr() ======================================================

## BEGIN getVrs() - Look up version for requested package ==================
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
##   END getVrs() ==========================================================

## BEGIN main - Copy vendor assets and add commit hook =====================

  # === remove old dirs
  pushd "${APP_DIR}" > /dev/null;
  if [ -r "js/vendor" ]; then
    rm -rf "js/vendor";
  fi;
  if [ -r "css/vendor" ]; then
    rm -rf "css/vendor";
  fi;
 
  mkdir -p "js/vendor";
  mkdir -p "css/vendor";
  popd > /dev/null;

  # ==== vendors/js
  pushd "${APP_DIR}/js/vendor";

  vrs=$(getVrs jquery);
  cp "${MODS_DIR}/jquery/dist/jquery.js" "jquery-${vrs}.js";

  vrs=$(getVrs jquery.event.dragscroll);
  cp "${MODS_DIR}/jquery.event.dragscroll/jquery.event.dragscroll.js" \
    "jquery.event.dragscroll-${vrs}.js";

  vrs=$(getVrs jquery.event.gevent);
  cp "${MODS_DIR}/jquery.event.gevent/jquery.event.gevent.js" \
    "jquery.event.gevent-${vrs}.js";

  vrs=$(getVrs jquery.event.ue);
  cp "${MODS_DIR}/jquery.event.ue/jquery.event.ue.js" \
    "jquery.event.ue-${vrs}.js";

  vrs=$(getVrs jquery.scrolli);
  cp "${MODS_DIR}/jquery.scrolli/dist/jquery.scrolli.js" \
    "jquery.scrolli-${vrs}.js";

  vrs=$(getVrs jquery.urianchor);
  cp "${MODS_DIR}/jquery.urianchor/jquery.uriAnchor.js" \
    "jquery.urianchor-${vrs}.js";

  vrs=$(getVrs powercss);
  cp "${MODS_DIR}/powercss/dist/pcss.js" "pcss-${vrs}.js"
  cp "${MODS_DIR}/powercss/dist/pcss.cfg.js" "pcss.cfg-${vrs}.js"

  vrs=$(getVrs taffydb);
  cp "${MODS_DIR}/taffydb/taffy.js" "taffy-${vrs}.js";
  popd > /dev/null;

  # ==== vendors/css
  pushd "${APP_DIR}/css/vendor" > /dev/null;
  popd > /dev/null;

  # ==== add git commit hook if git is found
  if [ -w "${GIT_DIR}" ]; then
    PC_PATH="${GIT_DIR}/.git/hooks/pre-commit";
    if [ -L "${PC_PATH}" ]; then
      rm -f "${PC_PATH}";
    fi

    pushd "${GIT_DIR}/.git/hooks" > /dev/null;
    ln -s "../../bin/git-hook_pre-commit" "./pre-commit";
    popd > /dev/null;
  fi
##   END main ==============================================================
exit 0;

