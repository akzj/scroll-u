'use strict';

var clsx = require('./node_modules/clsx/dist/clsx.js');
var bundleMjs = require('./node_modules/tailwind-merge/dist/bundle-mjs.js');

function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return bundleMjs.twMerge(clsx.clsx(inputs));
}

exports.cn = cn;
//# sourceMappingURL=utils.js.map
