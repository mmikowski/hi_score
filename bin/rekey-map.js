#!/usr/bin/env node

// Use this script to convert key.json into runtime variables
// used by core.js. Replace {XXX-config-matrix-XXX} with the
// output of this file to test basic function.
//
/*global xhi*/
'use strict';

global[ 'xhi' ] = require( '../js/xhi/00_root.js' );
require( '../js/xhi/01_util.js' );

var
  keyMatrix = require( process.argv[2] ),
  srcMap    = keyMatrix.defaultValueMatrix,
  keyMap    = keyMatrix.keyMap,

  aMap      = xhi._00_root_._makeInstanceFn_( 'rekey' ),
  utilObj   = xhi._01_util_._makeInstanceFn_( aMap ),
  solveMap  = utilObj._makeRekeyMap_( srcMap, keyMap ),
  solveStr  = utilObj._safeJsonStringify_( solveMap, '_error_')
  ;

console.log( solveStr );
