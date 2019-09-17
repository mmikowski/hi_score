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
  // Load libs (add fsObj with listing)
  // fsObj      = require( 'fs'          ),
  //
  bodyParserObj = require( 'body-parser' ),
  dotEnvMap     = require( 'dotenv'      ).config(),
  exprObj       = require( 'express'     ),
  mysqlObj      = require( 'mysql2'      ),
  pathObj       = require( 'path'        ),
  serveIdxObj   = require( 'serve-index' ),
  utilObj       = require( '../js/xhi/xhi-make-util' )(),

  exprAppObj    = exprObj(),

  // Define Paths
  fqRunPath  = __dirname,
  fqTopPath  = pathObj.dirname( __dirname ),

  // ConfigMap preparation (dMap = dotEnvMap, pMap = process.env map)
  dMap  = dotEnvMap.error ? {} : dotEnvMap.parsed,
  pMap  = process.env,

  // Prepare logging
  // emerg > alert > crit > err > warn > notice > info > debug
  logLevelKey = '_notice_',
  logObj      = utilObj._getLogObj_(),
  logFn       = logObj._logMsg_,

  dotEnvStr   = utilObj._safeJsonStringify_( dMap, '' ),

  // Begin configMap (example values below)
  configMap = {
    appName    : getAltFn( 'APP_NAME', 'hi_score_server'  ),
    dbConnectMap        : {
      database : getAltFn( 'DB_SELECT',      'MyDatabase' ),
      host     : getAltFn( 'DB_HOST',         '127.0.0.1' ),
      port     : getAltFn( 'DB_PORT',              '3306' ),
      password : getAltFn( 'DB_PASSWD'                    ),
      user     : getAltFn( 'DB_USER'                      )
    },
    fqRunPath    : fqRunPath,
    fqTopPath    : fqTopPath,
    listenPort   : 8080,
    mySqlQueryFn : mySqlQueryFn
  }
  // . End configMap
  ;

// Set working dir and log level
process.chdir( __dirname );
logObj._setLogLevel_( logLevelKey );
// == . END MODULE SCOPE VARIABLES ====================================

// == BEGIN UTILITY METHODS ===========================================
// BEGIN utility /mySqlQueryFn/
function mySqlQueryFn( query_str, param_list, callback_fn ) {
  const mysqlConnectObj = mysqlObj.createConnection( configMap.dbConnectMap );

  function onSqlReturnFn ( error_data, result_data ) {
    mysqlConnectObj.end();
    const result_list = Array.isArray( result_data ) ? result_data : [];
    callback_fn( error_data, result_list );
  }
  mysqlConnectObj.connect();
  mysqlConnectObj.query( query_str, param_list, onSqlReturnFn );
}
// . END utility /mySqlQueryFn/

// BEGIN utility method /getAltFn/
// Purpose: Get value from process.env map || .env file, || alternate
//   in that order.
function getAltFn ( key, alt_data ) {
  return pMap[ key ] || dMap[ key ] || alt_data || '';
}
// . END utility method /getAltFn/
// == . END UTILITY METHODS ===========================================


// == BEGIN MIDDLEWARE ================================================
// BEGIN middleware /noCacheFn/
function noCacheFn (req, res, next_fn) {
  res.header( 'Cache-Control', 'private, no-cache, no-store, must-revalidate' );
  res.header( 'Expires', '-1' );
  res.header( 'Pragma', 'no-cache' );

  // Set header for CORS; useful with ngrok
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next_fn();
}
// . END middleware /noCacheFn/
// == . END MIDDLEWARE ================================================

// == BEGIN START HTTP SERVER =========================================
function startServerFn () {
  // Configure
  exprAppObj.use( bodyParserObj.json() );
  exprAppObj.use( noCacheFn            );
  exprAppObj.use( '/', exprObj.static( fqTopPath ),
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
