"use client";
'use strict';

var _tslib = require('./_virtual/_tslib.js');
var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var scrollBar = require('./scroll-bar.js');
var utils = require('./utils.js');

var ScrollU = function (_a) {
    var className = _a.className, renderItem = _a.renderItem, _b = _a.initialItems, initialItems = _b === void 0 ? [] : _b, _c = _a.showScrollBar, showScrollBar = _c === void 0 ? true : _c, _d = _a.scrollBarRender, scrollBarRender = _d === void 0 ? function (height, top) { return (jsxRuntime.jsx(scrollBar.DefaultScrollBar, { height: height, top: top })); } : _d, props = _tslib.__rest(_a, ["className", "renderItem", "initialItems", "showScrollBar", "scrollBarRender"]);
    var containerRef = React.useRef(null);
    var contentRef = React.useRef(null);
    var _e = React.useState(0), translateY = _e[0], setTranslateY = _e[1];
    var _f = React.useState({ height: 0, top: 0 }), scrollBar$1 = _f[0], setScroll = _f[1];
    var clearButtonTimer = React.useRef(null);
    var clearTopItemTimer = React.useRef(null);
    var _g = React.useState(initialItems), items = _g[0], setItems = _g[1];
    var _h = React.useState(false), isLoadingPre = _h[0], setIsLoadingPre = _h[1];
    var _j = React.useState(false), isLoadingNext = _j[0], setIsLoadingNext = _j[1];
    var lastPreMsgId = React.useRef(null);
    var lastNextMsgId = React.useRef(null);
    var firstItemRef = React.useRef(null);
    var lastItemRef = React.useRef(null);
    var rafId = React.useRef(null);
    var intersectionObserver = React.useRef(null);
    var _k = React.useState(false), pendingPreAdjust = _k[0], setPendingPreAdjust = _k[1];
    var handlePre = React.useCallback(function () { return _tslib.__awaiter(void 0, void 0, void 0, function () {
        var firstItemData, currentMsgId, newItems_1, currentTranslateY, oldHeight;
        var _a;
        return _tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (isLoadingPre || !renderItem)
                        return [2 /*return*/];
                    firstItemData = items.length > 0 ? items[0] : undefined;
                    if (firstItemData && React.isValidElement(firstItemData)) {
                        currentMsgId = (_a = firstItemData.props) === null || _a === void 0 ? void 0 : _a.msgId;
                        if (typeof currentMsgId === 'number' && lastPreMsgId.current === currentMsgId) {
                            console.log('handlePre - Skipping duplicate request for msgId:', currentMsgId);
                            return [2 /*return*/];
                        }
                        lastPreMsgId.current = currentMsgId;
                    }
                    setIsLoadingPre(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, renderItem('pre', firstItemData)];
                case 2:
                    newItems_1 = _b.sent();
                    currentTranslateY = translateY;
                    oldHeight = contentRef.current ? contentRef.current.offsetHeight : 0;
                    setPendingPreAdjust({ oldHeight: oldHeight, currentTranslateY: currentTranslateY });
                    setItems(function (prev) { return _tslib.__spreadArray(_tslib.__spreadArray([], newItems_1, true), prev, true); });
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoadingPre(false);
                    lastPreMsgId.current = null;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [isLoadingPre, renderItem, items, translateY]);
    var handleNext = React.useCallback(function () { return _tslib.__awaiter(void 0, void 0, void 0, function () {
        var lastItemData, currentMsgId, newItems_2;
        var _a;
        return _tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (isLoadingNext || !renderItem)
                        return [2 /*return*/];
                    lastItemData = items.length > 0 ? items[items.length - 1] : undefined;
                    if (lastItemData && React.isValidElement(lastItemData)) {
                        currentMsgId = (_a = lastItemData.props) === null || _a === void 0 ? void 0 : _a.msgId;
                        if (typeof currentMsgId === 'number' && lastNextMsgId.current === currentMsgId) {
                            console.log('handleNext - Skipping duplicate request for msgId:', currentMsgId);
                            return [2 /*return*/];
                        }
                        lastNextMsgId.current = currentMsgId;
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 3, 4]);
                    setIsLoadingNext(true);
                    return [4 /*yield*/, renderItem('next', lastItemData)];
                case 2:
                    newItems_2 = _b.sent();
                    setItems(function (prev) { return _tslib.__spreadArray(_tslib.__spreadArray([], prev, true), newItems_2, true); });
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoadingNext(false);
                    lastNextMsgId.current = null; // reset
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [isLoadingNext, renderItem, items]);
    var setupIntersectionObserver = React.useCallback(function () {
        if (intersectionObserver.current) {
            intersectionObserver.current.disconnect();
        }
        intersectionObserver.current = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (entry.target === firstItemRef.current) {
                        handlePre();
                    }
                    else if (entry.target === lastItemRef.current) {
                        handleNext();
                    }
                }
            });
        }, {
            root: containerRef.current,
            rootMargin: '50px',
            threshold: 0.1
        });
        if (firstItemRef.current) {
            intersectionObserver.current.observe(firstItemRef.current);
        }
        else {
            console.log('First item ref is null');
        }
        if (lastItemRef.current) {
            intersectionObserver.current.observe(lastItemRef.current);
        }
        else {
            console.log('Last item ref is null');
        }
    }, [items.length]);
    var cleanItemsFromButton = React.useCallback(function () {
        var _a;
        var removeIndex = -1;
        var container = containerRef.current;
        var nodes = (_a = contentRef.current) === null || _a === void 0 ? void 0 : _a.children;
        if (container && nodes) {
            var containerRect = container.getBoundingClientRect();
            for (var i = nodes.length - 1; i >= 0; i--) {
                var node = nodes[i];
                if (!node)
                    continue;
                var itemRect = node.getBoundingClientRect();
                if (itemRect.top > containerRect.bottom) {
                    removeIndex = i;
                }
                else {
                    break;
                }
            }
        }
        if (removeIndex !== -1) {
            setItems(function (prev) { return prev.slice(0, removeIndex); });
        }
    }, [containerRef, contentRef]);
    var cleanItemsFromTop = React.useCallback(function () {
        var _a;
        var removeIndex = -1;
        var container = containerRef.current;
        var nodes = (_a = contentRef.current) === null || _a === void 0 ? void 0 : _a.children;
        if (container && nodes) {
            var containerRect = container.getBoundingClientRect();
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (!node)
                    continue;
                var itemRect = node.getBoundingClientRect();
                if (itemRect.bottom < containerRect.top) {
                    removeIndex = i;
                }
                else {
                    break;
                }
            }
        }
        if (removeIndex !== -1) {
            var currentTranslateY = translateY;
            var oldHeight = contentRef.current ? contentRef.current.offsetHeight : 0;
            setPendingPreAdjust({ oldHeight: oldHeight, currentTranslateY: currentTranslateY });
            setItems(function (prev) { return prev.slice(removeIndex); });
        }
    }, [containerRef, contentRef]);
    var startInertia = function (initialVelocity) {
        var velocity = initialVelocity;
        var animate = function () {
            if (Math.abs(velocity) < 0.1) {
                return;
            }
            setTranslateY(function (prev) {
                var next = prev - velocity;
                var max = containerRef.current.offsetHeight * 2 / 3;
                var min = containerRef.current.offsetHeight * 1 / 3 - contentRef.current.offsetHeight;
                var newTranslateY = Math.max(min, Math.min(max, next));
                return newTranslateY;
            });
            velocity *= 0.35;
            rafId.current = requestAnimationFrame(animate);
        };
        rafId.current = requestAnimationFrame(animate);
    };
    React.useEffect(function () {
        if (contentRef.current && containerRef.current) {
            var containerHeight = containerRef.current.offsetHeight;
            var contentHeight = contentRef.current.offsetHeight;
            var topHiddenHeight = Math.max(0, -translateY);
            var scrollBarHeight = (containerHeight / contentHeight) * containerHeight;
            var scrollBarTop = (topHiddenHeight / contentHeight) * containerHeight;
            setScroll({
                height: scrollBarHeight,
                top: scrollBarTop,
            });
        }
    }, [translateY, items]);
    var handleScroll = React.useCallback(function (event) {
        event.preventDefault();
        if (clearButtonTimer.current) {
            clearTimeout(clearButtonTimer.current);
        }
        clearButtonTimer.current = setTimeout(cleanItemsFromButton, 300);
        if (clearTopItemTimer.current) {
            clearTimeout(clearTopItemTimer.current);
        }
        clearTopItemTimer.current = setTimeout(cleanItemsFromTop, 500);
        var deltaY = event.deltaY;
        startInertia(deltaY);
    }, []);
    React.useEffect(function () {
        var container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleScroll, { passive: false });
            return function () {
                container.removeEventListener('wheel', handleScroll);
                if (clearButtonTimer.current) {
                    clearTimeout(clearButtonTimer.current);
                }
            };
        }
    }, [handleScroll]);
    React.useEffect(function () {
        setupIntersectionObserver();
        return function () {
            if (intersectionObserver.current) {
                intersectionObserver.current.disconnect();
            }
        };
    }, [items.length]);
    React.useLayoutEffect(function () {
        if (pendingPreAdjust && contentRef.current) {
            var newHeight = contentRef.current.offsetHeight;
            var heightDiff_1 = newHeight - pendingPreAdjust.oldHeight;
            if (heightDiff_1 !== 0) {
                setTranslateY(function (prevTranslateY) {
                    return prevTranslateY - heightDiff_1;
                });
            }
            setPendingPreAdjust(false);
        }
    }, [items, pendingPreAdjust]);
    return (jsxRuntime.jsxs("div", _tslib.__assign({ ref: containerRef, className: utils.cn('relative', 'h-full', 'overflow-hidden', className) }, props, { children: [jsxRuntime.jsx("div", { ref: contentRef, style: {
                    transform: "translateY(".concat(translateY, "px)"),
                    willChange: 'transform'
                }, children: items.map(function (item, index) {
                    var isFirst = index === 0;
                    var isLast = index === items.length - 1;
                    if (isFirst || isLast) {
                        return (jsxRuntime.jsx("div", { ref: isFirst ? firstItemRef : lastItemRef, children: item }, index));
                    }
                    return jsxRuntime.jsx("div", { children: item }, index);
                }) }), showScrollBar && (scrollBarRender(scrollBar$1.height, scrollBar$1.top))] })));
};

exports.ScrollU = ScrollU;
//# sourceMappingURL=scroll-u.js.map
