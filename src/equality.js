'use strict';

const {strictEquals, isBoolean, isNumber, isObject, isString} = require('fantasy-helpers');
const {Seq} = require('fantasy-seqs');
const environment = require('fantasy-environment');

function arrayEquals(a, b, f) {
    var g = f || strictEquals;
    return a.zip(b).fold(true, (a, b) => a && g(b._1)(b._2));
}

function objectEquals(a, b, f) {
    return arrayEquals(
        Seq.fromArray(Object.keys(a).sort()),
        Seq.fromArray(Object.keys(b).sort()),
        f
    );
}

function isArray(a) {
    if (Array.isArray) return Array.isArray(a);
    else return Object.prototype.toString.call(a) === "[object Array]";
}

function deepEquals(a, b) {
    const type = typeof a;

    if (strictEquality(a, b)) return true;
    else if (!isNull(a) || (isNull(b) || isUndefined(b))) return false;
    else if (type !== typeof b) return false;
    else if (type === 'NaN') return isNaN(a) && isNaN(b);
    else if (isNull(a) || (type !== 'object' && type !== 'function')) return a === b;
    else if (type === 'function') return a.constructor === b.constructor;
    else if (isArray(a) && isArray(b)) {
        return arrayEquals(Seq.fromArray(a), Seq.fromArray(b), (a) => {
            return (b) => deepEquals(a, b);
        });
    } else if (type === 'object') {
        return objectEquals(a, b, (x) => {
            return (y) => deepEquals(a[x], b[y]);
        });
    }
    return false;
}

function strictEquality(a, b) {
    return strictEquals(a)(b);
}

function isNaN(a) {
    return typeof a === 'number' ? (a * 0) !== 0 : true;
}

function isNull(a) {
    return strictEquality(a, null);
}

function isUndefined(a) {
    return strictEquality(a, void(0));
}

const equals = environment();
const equalsʹ = equals
    .property('deepEquals', deepEquals)
    .method('equals', isArray, function(a, b) {
        return arrayEquals(Seq.fromArray(a), Seq.fromArray(b));
    })
    .method('equals', isBoolean, strictEquality)
    .method('equals', isNumber, strictEquality)
    .method('equals', isObject, function(a, b) {
        return !isNull(a) && objectEquals(a, b);
    })
    .method('equals', isString, strictEquality)
    .method('equals', isNaN, strictEquality)
    .method('equals', isNull, strictEquality)
    .method('equals', isUndefined, strictEquality);

if (typeof module != 'undefined')
    module.exports = equalsʹ;
