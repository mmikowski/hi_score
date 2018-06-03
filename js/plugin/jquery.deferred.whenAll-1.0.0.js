// See http://stackoverflow.com/questions/5824615
// Code  : https://gist.github.com/4341799
// Tests : https://gist.github.com/4341799
// $.whenAll extends $.when by only resolving or rejecting after
//   ALL promises have been resolved or rejected.  This avoids
//   race conditions.

/*global xhiJQ*/
// eslint-disable-next-line no-extra-semi
;(function($) {
  'use strict';
  var slice = [].slice;

  $.whenAll = function(array) {
    var
      resolveValues = arguments.length == 1 && $.isArray(array)
        ? array
        : slice.call(arguments)
      ,length = resolveValues.length
      ,remaining = length
      ,deferred = $.Deferred()
      ,i = 0
      ,failed = 0
      ,rejectContexts = Array(length)
      ,rejectValues = Array(length)
      ,resolveContexts = Array(length)
      ,value
    ;

    function updateFunc (index, contexts, values) {
      return function() {
        !(values === resolveValues) && failed++;
        deferred.notifyWith(
         contexts[index] = this
         ,values[index] = slice.call(arguments)
        );
        if (!(--remaining)) {
          deferred[(!failed ? 'resolve' : 'reject') + 'With'](contexts, values);
        }
      };
    }

    for (; i < length; i++) {
      if ((value = resolveValues[i]) && $.isFunction(value.promise)) {
        value.promise()
          .done(updateFunc(i, resolveContexts, resolveValues))
          .fail(updateFunc(i, rejectContexts, rejectValues))
        ;
      }
      else {
        deferred.notifyWith(this, value);
        --remaining;
      }
    }

    if (!remaining) {
      deferred.resolveWith(resolveContexts, resolveValues);
    }

    return deferred.promise();
  };
})(xhiJQ);
