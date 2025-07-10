import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';

interface ScrollUProps<T = any> {
    className?: any;
    renderItem?: (direction: 'pre' | 'next', contextData?: T) => Promise<React.ReactNode[]>;
    initialItems?: React.ReactNode[];
    showScrollBar?: boolean;
    scrollBarRender?: (height: number, top: number) => React.ReactNode;
}
declare const ScrollU: <T = any>({ className, renderItem, initialItems, showScrollBar, scrollBarRender, ...props }: ScrollUProps<T>) => react_jsx_runtime.JSX.Element;

interface ScrollBarRenderProps {
    height: number;
    top: number;
}
declare const DefaultScrollBar: ({ height, top, }: ScrollBarRenderProps) => react_jsx_runtime.JSX.Element;

export { DefaultScrollBar, ScrollU };
export type { ScrollBarRenderProps, ScrollUProps };
