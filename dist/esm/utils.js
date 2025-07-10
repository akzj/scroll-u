import { clsx } from './node_modules/clsx/dist/clsx.js';
import { twMerge } from './node_modules/tailwind-merge/dist/bundle-mjs.js';

function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return twMerge(clsx(inputs));
}

export { cn };
//# sourceMappingURL=utils.js.map
