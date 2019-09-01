/*
 * MobileChat/server/index.js
 *
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Use      : node index
 * Synopsis : Development server
 * Provides : Basic web services 
 * Requires : xhi-make-util
 *
 *
*/
/*global*/
// == BEGIN MODULE SCOPE VARIABLES ====================================
'use strict';
const
  // Import code and set up methods
  bodyParserObj = require( 'body-parser' ),
  dotEnvMap     = require( 'dotenv'      ).config(),
  exprObj       = require( 'express'     ),
  fsObj         = require( 'fs'          ),
  pathObj       = require( 'path'        ),
  serveIdxObj   = require( 'serve-index' ),

  utilObj       = require( '../js/xhi/xhi-make-util' )(),
  exprAppObj    = exprObj(),

  // Define Paths
  fqRunPath  = __dirname,
  fqTopPath  = pathObj.dirname( __dirname ),

  // ConfigMap preparation (eMap = dotEnvMap, pMap = process.env map)
  eMap = dotEnvMap.error ? {} : dotEnvMap.parsed,
  pMap = process.env,

  // Prepare logging
  // emerg > alert > crit > err > warn > notice > info > debug
  logLevelKey = '_notice_',
  logObj      = utilObj._getLogObj_(),
  logFn       = logObj._logMsg_,
  dotEnvStr   = utilObj._safeJsonStringify_( eMap, '' ),

  // Begin configMap
  configMap = {
    appName    : getAltFn( 'appName', 'hi_score_server' ),
    fqRunPath  : fqRunPath,
    fqTopPath  : fqTopPath,
    listenPort : 8080
  }
  // . End configMap
  ;

// Set working dir and log level
process.chdir( __dirname );
logObj._setLogLevel_( logLevelKey );
// == . END MODULE SCOPE VARIABLES ====================================

// == BEGIN UTILITY METHODS ===========================================
// BEGIN utility method /getAltFn/
// Purpose: Get value from process.env || .env file, || alt || ''
function getAltFn ( key, alt_data ) {
  return pMap[ key ] || eMap[ key ] || alt_data || '';
}
// . END utility method /getAltFn/
// == . END UTILITY METHODS ===========================================


// == BEGIN MIDDLEWARE ================================================
// BEGIN middleware /noCacheFn/
function noCacheFn (req, res, next_fn) {
  res.header( 'Cache-Control', 'private, no-cache, no-store, must-revalidate' );
  res.header( 'Expires', '-1' );
  res.header( 'Pragma', 'no-cache' );
  next_fn();
}
// . END middleware /noCacheFn/
// == . END MIDDLEWARE ================================================

// == BEGIN START HTTP SERVER =========================================
function startServerFn () {
  // Set up
  exprAppObj.use( bodyParserObj.json() );
  exprAppObj.use( noCacheFn            );
  exprAppObj.use(
    '/',
    exprObj.static( fqTopPath ),
    serveIdxObj( fqTopPath, { 'icons': true } )
  );

  // Start
  logFn( '_notice_', '\n\n'
    + '=== Intercept server start sucessful =============================\n'
    + 'appName        : ' + configMap.appName        + '\n'
    + 'dotEnvStr      : ' + dotEnvStr                + '\n'
    + 'ListenPort     : ' + configMap.listenPort     + '\n'
    + 'UnixTimestamp  : ' + utilObj._getNowMs_()     + '\n'
    + '==================================================================\n\n'
  );
  exprAppObj.listen( configMap.listenPort );
}
// == . END START HTTP SERVER =========================================

// == BEGIN INITIALIZE ================================================
// This can be called in after other init if needed (e.g. after reading
// a module directory)
//
startServerFn( );
// == . END INITIALIZE ================================================
