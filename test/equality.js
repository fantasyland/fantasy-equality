var λ = require('fantasy-check/src/adapters/nodeunit'),
    equality = require('../fantasy-equality');

exports.equality = {
    'when testing the same arrays': λ.check(
        function(a) {
            return equality.equals(a, a);
        },
        [λ.arrayOf(λ.AnyVal)]
    ),
    'when testing the same objects': λ.check(
        function(a) {
            return equality.equals(a, a);
        },
        [λ.objectLike({
            a: Number,
            b: Object
        })]
    ),
    'when testing the same values': λ.check(
        function(a) {
            return equality.equals(a, a);
        },
        [λ.AnyVal]
    )
};
