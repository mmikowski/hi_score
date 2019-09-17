/*
 * xhi-make-util.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Summary   :
 *   utilObj = require( 'xhi-make-util' )( [ <namespace>, <do_force> ] );
 * Purpose   : Wrapper to create xhi util object for Node.js apps
 * Example   :
 *   const utilObj = require( 'xhi-make-util' )( '__xuu' );
 *   let str = utilObj._castStr_( input, '' );
 *
 * Requires  : xhi library set (./js/xhi) from hi_score
 * Arguments : (positional)
 *   <namespace> - A string that is the global namespace for the xhi
 *     instance. Default is '__xhi'.
 *   <do_force> - Force create of new instance instead of returning prior
 *     singleton. Default is false.
 * Returns   : aMap._01_util_ instance
 * Throws    : None
 *
*/
/*global*/
'use strict';
global[ 'xhi' ] = require( './00_root' );
require( './01_util' );

let utilObj, aMap;

module.exports = function ( ns_str, do_force ) {
  var xhi = global.xhi;
  if ( do_force || ! utilObj ) {
    aMap    = xhi._00_root_._makeInstanceFn_( ns_str || '__xhi' );
    utilObj = xhi._01_util_._makeInstanceFn_( aMap );
  }
  return utilObj;
};
