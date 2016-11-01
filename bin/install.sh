#!/bin/bash
# Wipe and re-copy vendor libs to the js/vendor and css/vendor directories
# using the current version from package.json.
#
# TODO:
# 1. Use the same configuration file as buildify / superpack
# 2. Auto-update links to these files using in index.html
#    (consider using sed -e 's/"<old_vrs_path>"/"<new_vrs_path>"/ index.html' )
#

set -u;

## BEGIN Layout variables ==================================================
LINK_PATH=$( readlink -f -- "${0}" );
BIN_PATH=$(  cd "${LINK_PATH%/*}" && echo "${PWD}" );
# BASE_DIR=$(  dirname "${BIN_PATH}" );
BASE_DIR=$( cd "$(git rev-parse --show-toplevel)" && pwd );

PKG_FILE=$( find "${BASE_DIR}" -type f -wholename '*/package.json'  );
PKG_DIR=$(  dirname "${PKG_FILE}"  );
MODS_DIR=$( find "${BASE_DIR}" -type d |grep '/node_modules$' |grep -v '/node_modules/');
JSLINT_EXE="${MODS_DIR}/.bin/jslint";
NU_EXE="${MODS_DIR}/.bin/nodeunit";
VRS_STR="";
## END Layout variables ====================================================

setVrsStr () {
  pushd "${BASE_DIR}/bin" > /dev/null;
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

## BEGIN main
  cd "${BASE_DIR}";
  if [ -r "js/vendor" ]; then
    mv "js/vendor" "js/vendor.$$";
  fi;
  if [ -r "css/vendor" ]; then
    mv "css/vendor" "css/vendor.$$";
  fi;

  mkdir -p "js/vendor";
  mkdir -p "css/vendor";

  cd "${BASE_DIR}/js/vendor";

  # ==== vendors/js
  vrs=$(getVrs jquery);
  cp "${MODS_DIR}/jquery/dist/jquery.js" "jquery-${vrs}.js"

  vrs=$(getVrs jquery.event.dragscroll);
  cp "${MODS_DIR}/jquery.event.dragscroll/jquery.event.dragscroll.js" \
    "jquery.event.dragscroll-${vrs}.js"

  vrs=$(getVrs jquery.event.gevent);
  cp "${MODS_DIR}/jquery.event.gevent/jquery.event.gevent.js" \
    "jquery.event.gevent-${vrs}.js"

  vrs=$(getVrs jquery.event.ue);
  cp "${MODS_DIR}/jquery.event.ue/jquery.event.ue.js" \
    "jquery.event.ue-${vrs}.js"

  vrs=$(getVrs jquery.scrolli);
  cp "${MODS_DIR}/jquery.scrolli/dist/jquery.scrolli.js" \
    "jquery.scrolli-${vrs}.js"

  vrs=$(getVrs jquery.urianchor);
  cp "${MODS_DIR}/jquery.urianchor/jquery.uriAnchor.js" \
    "jquery.urianchor-${vrs}.js"

  vrs=$(getVrs powercss);
  cp "${MODS_DIR}/powercss/dist/pcss.js" "pcss-${vrs}.js"
  cp "${MODS_DIR}/powercss/dist/pcss.cfg.js" "pcss.cfg-${vrs}.js"

  vrs=$(getVrs taffydb);
  cp "${MODS_DIR}/taffydb/taffy.js" "taffy-${vrs}.js"

  exit 0;
## END main

