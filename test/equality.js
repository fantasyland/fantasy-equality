'use strict';

const λ = require('fantasy-check/src/adapters/nodeunit');
const {equals} = require('../fantasy-equality');

exports.equality = {
    'when testing the same arrays': λ.check(
        (a) => equals(a, a),
        [λ.arrayOf(λ.AnyVal)]
    ),
    'when testing the same objects': λ.check(
        (a) => equals(a, a),
        [λ.objectLike({
            a: Number,
            b: Object
        })]
    ),
    'when testing the same values': λ.check(
        (a) => equals(a, a),
        [λ.AnyVal]
    ),
    'when testing not null vs null': λ.check(
        (a) => !equals(a, null),
        [λ.AnyVal]
    ),
    'when testing not null vs undefined': λ.check(
        (a) => !equals(a, undefined),
        [λ.AnyVal]
    ),
    'when testing null vs not null': λ.check(
        (a) => !equals(null, a),
        [λ.AnyVal]
    ),
    'when testing null vs not undefined': λ.check(
        (a) => !equals(undefined, a),
        [λ.AnyVal]
    )
};
