'use strict';

var jsxRuntime = require('react/jsx-runtime');

var DefaultScrollBar = function (_a) {
    var height = _a.height, top = _a.top;
    return (jsxRuntime.jsx("div", { style: {
            position: 'absolute',
            right: 4,
            top: 0,
            width: 6,
            height: '100%',
            background: '#eee',
            borderRadius: 3,
            overflow: 'hidden',
            pointerEvents: 'none',
        }, children: jsxRuntime.jsx("div", { style: {
                position: 'absolute',
                width: '100%',
                height: "".concat(height, "px"),
                top: "".concat(top, "px"),
                background: '#007bff',
                borderRadius: 3,
                transition: 'top 0.2s ease-out',
            } }) }));
};

exports.DefaultScrollBar = DefaultScrollBar;
//# sourceMappingURL=scroll-bar.js.map
