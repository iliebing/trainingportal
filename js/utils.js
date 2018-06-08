(function (globalNS) {

    'use strict';
   
    function curry(fn) {
        return function c(...args) {
            if (args.length >= fn.length) {
                return fn(...args);
            } else {
                return (...args2) => c(...args, ...args2);
            }
        };
    }

    function composite (...fns) {
        return function (x) {
            fns.reduceRight((y, f) => f(y), x);
        };
    }

    globalNS.utils = {
        curry,
        composite
    };
   
   })(window.trainingPortal = (window.trainingPortal || {}));  