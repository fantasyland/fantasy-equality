var helpers = require('fantasy-helpers'),
    environment = require('fantasy-environment'),
    seq = require('fantasy-seqs'),

    Seq = seq.Seq;

function arrayEquals(a, b, f) {
    var g = f || helpers.strictEquals;
    return a.zip(b).fold(true, function(a, b) {
        return a && g(b._1)(b._2);
    });
}

function objectEquals(a, b, f) {
    return arrayEquals(
        Seq.fromArray(Object.keys(a).sort()),
        Seq.fromArray(Object.keys(b).sort()),
        f
    );
}

function isArray(a) {
    if(Array.isArray) return Array.isArray(a);
    else return Object.prototype.toString.call(a) === "[object Array]";
}

function deepEquals(a, b) {
    var type = typeof a,
        result,
        o;

    if (helpers.strictEquals(a, b)) return true;
    else if (type !== typeof b) return false;
    else if(type === 'NaN') return isNaN(a) && isNaN(b);
    else if(a === null || (type !== 'object' && type !== 'function')) return a === b;
    else if(type === 'function') return a.constructor === b.constructor;
    else if(isArray(a) && isArray(b)) {
        return arrayEquals(Seq.fromArray(a), Seq.fromArray(b), function(a) {
            return function(b) {
                return deepEquals(a, b);
            };
        });
    } else if(type === 'object') {
        return objectEquals(a, b, function(x) {
            return function(y) {
                return deepEquals(a[x], b[y]);
            };
        });
    }
    return false;
}

var equals = environment();

equals = equals
    .property('deepEquals', deepEquals)
    .method('equals', helpers.isArray, function(a, b) {
        return arrayEquals(Seq.fromArray(a), Seq.fromArray(b));
    })
    .method('equals', helpers.isBoolean, function(a, b) {
        return a === b;
    })
    .method('equals', helpers.isNumber, function(a, b) {
        return a === b;
    })
    .method('equals', helpers.isObject, function(a, b) {
        return objectEquals(a, b);
    })
    .method('equals', helpers.isString, function(a, b) {
        return a === b;
    });

if (typeof module != 'undefined')
    module.exports = equals;
