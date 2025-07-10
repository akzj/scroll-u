"use client";
import { __rest, __awaiter, __assign, __generator, __spreadArray } from './_virtual/_tslib.js';
import { jsxs, jsx } from 'react/jsx-runtime';
import React, { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { DefaultScrollBar } from './scroll-bar.js';
import { cn } from './utils.js';

var ScrollU = function (_a) {
    var className = _a.className, renderItem = _a.renderItem, _b = _a.initialItems, initialItems = _b === void 0 ? [] : _b, _c = _a.showScrollBar, showScrollBar = _c === void 0 ? true : _c, _d = _a.scrollBarRender, scrollBarRender = _d === void 0 ? function (height, top) { return (jsx(DefaultScrollBar, { height: height, top: top })); } : _d, props = __rest(_a, ["className", "renderItem", "initialItems", "showScrollBar", "scrollBarRender"]);
    var containerRef = useRef(null);
    var contentRef = useRef(null);
    var _e = useState(0), translateY = _e[0], setTranslateY = _e[1];
    var _f = useState({ height: 0, top: 0 }), scrollBar = _f[0], setScroll = _f[1];
    var clearButtonTimer = useRef(null);
    var clearTopItemTimer = useRef(null);
    var _g = useState(initialItems), items = _g[0], setItems = _g[1];
    var _h = useState(false), isLoadingPre = _h[0], setIsLoadingPre = _h[1];
    var _j = useState(false), isLoadingNext = _j[0], setIsLoadingNext = _j[1];
    var lastPreMsgId = useRef(null);
    var lastNextMsgId = useRef(null);
    var firstItemRef = useRef(null);
    var lastItemRef = useRef(null);
    var rafId = useRef(null);
    var intersectionObserver = useRef(null);
    var _k = useState(false), pendingPreAdjust = _k[0], setPendingPreAdjust = _k[1];
    var handlePre = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var firstItemData, currentMsgId, newItems_1, currentTranslateY, oldHeight;
        var _a;
        return __generator(this, function (_b) {
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
                    setItems(function (prev) { return __spreadArray(__spreadArray([], newItems_1, true), prev, true); });
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoadingPre(false);
                    lastPreMsgId.current = null;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [isLoadingPre, renderItem, items, translateY]);
    var handleNext = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var lastItemData, currentMsgId, newItems_2;
        var _a;
        return __generator(this, function (_b) {
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
                    setItems(function (prev) { return __spreadArray(__spreadArray([], prev, true), newItems_2, true); });
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoadingNext(false);
                    lastNextMsgId.current = null; // reset
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [isLoadingNext, renderItem, items]);
    var setupIntersectionObserver = useCallback(function () {
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
    var cleanItemsFromButton = useCallback(function () {
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
    var cleanItemsFromTop = useCallback(function () {
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
    useEffect(function () {
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
    var handleScroll = useCallback(function (event) {
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
    useEffect(function () {
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
    useEffect(function () {
        setupIntersectionObserver();
        return function () {
            if (intersectionObserver.current) {
                intersectionObserver.current.disconnect();
            }
        };
    }, [items.length]);
    useLayoutEffect(function () {
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
    return (jsxs("div", __assign({ ref: containerRef, className: cn('relative', 'h-full', 'overflow-hidden', className) }, props, { children: [jsx("div", { ref: contentRef, style: {
                    transform: "translateY(".concat(translateY, "px)"),
                    willChange: 'transform'
                }, children: items.map(function (item, index) {
                    var isFirst = index === 0;
                    var isLast = index === items.length - 1;
                    if (isFirst || isLast) {
                        return (jsx("div", { ref: isFirst ? firstItemRef : lastItemRef, children: item }, index));
                    }
                    return jsx("div", { children: item }, index);
                }) }), showScrollBar && (scrollBarRender(scrollBar.height, scrollBar.top))] })));
};

export { ScrollU };
//# sourceMappingURL=scroll-u.js.map
