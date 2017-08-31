// I created this to test closure speed on nodejs.
// Using anonymous closures has no substantial performance benefit
// for the subroutines tested (makeTmpltStr, makeGuidStr).
//

var 
  makeGuidStr, startMsInt, endMsInt,
  elapseMsInt, tgtFn, i, str;

makeGuidStr = (function () {
    /*jslint bitwise: true*/
    function makePart () {
      //noinspection NonShortCircuitBooleanExpressionJS,MagicNumberJS
      return ((( 1 + Math.random() ) * 0x10000 )|0
      ).toString( 16 ).substr( 1 );
    }
    /*jslint bitwise: false*/

    function mainFn () {
      return makePart() + makePart()
        + '-' + makePart()
        + '-' + makePart()
        + '-' + makePart()
        + '-' + makePart() + makePart() + makePart()
        ;
    }
    return mainFn;
}());

function makeGgggStr () {
    /*jslint bitwise: true*/
    function makePart () {
      //noinspection NonShortCircuitBooleanExpressionJS,MagicNumberJS
      return ((( 1 + Math.random() ) * 0x10000 )|0
      ).toString( 16 ).substr( 1 );
    }
    /*jslint bitwise: false*/

    return makePart() + makePart()
      + '-' + makePart()
      + '-' + makePart()
      + '-' + makePart()
      + '-' + makePart() + makePart() + makePart()
      ;
}
// tgtFn = makeGuidStr;

while ( tgtFn ) {
  startMsInt = Date.now();
  for ( i = 0; i < 1000000; i++ ) {
    str = tgtFn();
  }
  endMsInt = Date.now();
  elapseMsInt = ( ( endMsInt - startMsInt ) / 1000 );
  console.warn( tgtFn.name, 'Elapsed', elapseMsInt );

  if ( tgtFn === makeGgggStr ) {
    tgtFn = null;
  }
  else {
    tgtFn = makeGgggStr;
  }
}


// BEGIN utility /makeTmpltStr1/
var makeTmpltStr1 = (function () {
  function lookupFn ( ignore_str, lookup_name ) {
    var
      lookup_map   = this,
      lookup_list  = lookup_name.split( '.' ),
      lookup_count = lookup_list.length,
      idx, key_name
    ;

    for ( idx = 0; idx < lookup_count; idx++ ) {
      key_name = lookup_list[ idx ];
      lookup_map = ( lookup_map && lookup_map[ key_name ] );
    }
    return String( lookup_map ) || '';
  }

  function mainFn ( arg_map ) {
    // noinspection Annotator
    var
      map        = arg_map || {},
      input_str  = map._input_str_  || '',
      lookup_map = map._lookup_map_ || {},

      tmplt_rx   = /\{\{([^}]*[^}]+[^}]*)\}\}/g,
      bound_fn   = lookupFn.bind( lookup_map )
    ;

    return input_str.replace( tmplt_rx, bound_fn );
  }
  return mainFn;
}());
// . END utility /makeTmpltStr1/

// BEGIN utility /makeTmpltStr2/
function makeTmpltStr2 ( arg_map ) {
  var
    map        = arg_map || {},
    input_str  = map._input_str_  || '',
    lookup_map = map._lookup_map_ || {},

    tmplt_rx   = /\{\{([^}]*[^}]+[^}]*)\}\}/g,
    bound_fn   = lookupFn.bind( lookup_map )
    ;

  function lookupFn ( ignore_str, lookup_name ) {
    var
      lookup_map   = this,
      lookup_list  = lookup_name.split( '.' ),
      lookup_count = lookup_list.length,
      idx, key_name
    ;

    for ( idx = 0; idx < lookup_count; idx++ ) {
      key_name = lookup_list[ idx ];
      lookup_map = ( lookup_map && lookup_map[ key_name ] );
    }
    return String( lookup_map ) || '';
  }

  bound_fn   = lookupFn.bind( lookup_map )
  return input_str.replace( tmplt_rx, bound_fn );
}
// . END utility /makeTmpltStr2/

var tmplt_rx   = /\{\{([^}]*[^}]+[^}]*)\}\}/g;

// BEGIN utility /makeTmpltStr3/
function makeTmpltStr3 ( arg_map ) {
  var
    map        = arg_map || {},
    input_str  = map._input_str_  || '',
    lookup_map = map._lookup_map_ || {},
    bound_fn   = lookupFn.bind( lookup_map )
    ;

  function lookupFn ( ignore_str, lookup_name ) {
    var
      lookup_map   = this,
      lookup_list  = lookup_name.split( '.' ),
      lookup_count = lookup_list.length,
      idx, key_name
    ;

    for ( idx = 0; idx < lookup_count; idx++ ) {
      key_name = lookup_list[ idx ];
      lookup_map = ( lookup_map && lookup_map[ key_name ] );
    }
    return String( lookup_map ) || '';
  }

  bound_fn   = lookupFn.bind( lookup_map )
  return input_str.replace( tmplt_rx, bound_fn );
}
// . END utility /makeTmpltStr3/

var fnList = [ makeTmpltStr1, makeTmpltStr2, makeTmpltStr3 ];

tgtFn = fnList.pop();
while ( tgtFn ) {
  startMsInt = Date.now();
  for ( i = 0; i < 1000000; i++ ) {
    str = tgtFn({
      _input_str_  : 'fred is {{_key_}} and {{_foo_}}',
      _lookup_map_ : {
        _key_ : 'happy',
        _foo_ : 'sad'
      }
    });
  }
  endMsInt = Date.now();
  elapseMsInt = ( ( endMsInt - startMsInt ) / 1000 );
  console.warn( tgtFn.name, 'Elapsed', elapseMsInt );
  tgtFn = fnList.pop();
}
