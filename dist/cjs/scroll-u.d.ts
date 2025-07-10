import React from 'react';
export interface ScrollUProps<T = any> {
    className?: any;
    renderItem?: (direction: 'pre' | 'next', contextData?: T) => Promise<React.ReactNode[]>;
    initialItems?: React.ReactNode[];
    showScrollBar?: boolean;
    scrollBarRender?: (height: number, top: number) => React.ReactNode;
}
declare const ScrollU: <T = any>({ className, renderItem, initialItems, showScrollBar, scrollBarRender, ...props }: ScrollUProps<T>) => import("react/jsx-runtime").JSX.Element;
export { ScrollU };
