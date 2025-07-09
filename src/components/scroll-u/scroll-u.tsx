'use client'
import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // 假设你有这个工具函数
import { scrollUVariants, scrollUItemVariants, scrollUButtonVariants } from './variants';
import { DefaultScrollBar } from './scroll-bar';



export interface ScrollUProps<T = any>
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof scrollUVariants> {
  visibleItems?: number;
  showButtons?: boolean;
  maxCacheItems?: number; // 最大缓存项目数
  containerHeight?: number; // 直接指定容器高度
  renderItem?: (direction: 'pre' | 'next', contextData?: T) => Promise<React.ReactNode[]>;
  initialItems?: React.ReactNode[];
  showScrollBar?: boolean;
  scrollBarRender?: (height: number, top: number) => React.ReactNode;
}

const ScrollU = <T = any>({
  children,
  variant,
  size,
  visibleItems = 5,
  showButtons = true,
  maxCacheItems = 10,
  className,
  containerHeight = 500,
  renderItem,
  initialItems = [],
  showScrollBar = true,
  scrollBarRender = (height: number, top: number) => (
    <DefaultScrollBar height={height} top={top} />
  ),
  ...props
}: ScrollUProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);
  const [scrollBar, setScroll] = useState<{ height: number, top: number }>({ height: 0, top: 0 });

  const clearButtonTimer = useRef<NodeJS.Timeout | null>(null);
  const clearTopItemTimer = useRef<NodeJS.Timeout | null>(null);
  const [items, setItems] = useState<React.ReactNode[]>(initialItems);
  const [isLoadingPre, setIsLoadingPre] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const lastPreMsgId = useRef<number | null>(null);
  const lastNextMsgId = useRef<number | null>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const rafId = useRef<number | null>(null);
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  const [pendingPreAdjust, setPendingPreAdjust] = useState<false | { oldHeight: number, currentTranslateY: number }>(false);



  // pre 函数：向下滚动，在顶端添加新节点
  const handlePre = useCallback(async () => {
    if (isLoadingPre || !renderItem) return;
    const firstItemData = items.length > 0 ? items[0] : undefined;
    if (firstItemData && React.isValidElement(firstItemData)) {
      const currentMsgId = (firstItemData as any).props?.msgId;
      if (typeof currentMsgId === 'number' && lastPreMsgId.current === currentMsgId) {
        console.log('handlePre - Skipping duplicate request for msgId:', currentMsgId);
        return;
      }
      lastPreMsgId.current = currentMsgId;
    }

    setIsLoadingPre(true);
    try {
      const newItems = await renderItem('pre', firstItemData as T);
      // 2. 先设置 pendingPreAdjust，带上 oldHeight
      const currentTranslateY = translateY;
      const oldHeight = contentRef.current ? contentRef.current.offsetHeight : 0;
      setPendingPreAdjust({ oldHeight, currentTranslateY });
      // 3. 再 setItems
      setItems(prev => [...newItems, ...prev]);
    } finally {
      setIsLoadingPre(false);
      lastPreMsgId.current = null;
    }
  }, [isLoadingPre, renderItem, items, translateY]);

  // next 函数：向上滚动，在末尾添加新节点
  const handleNext = useCallback(async () => {
    if (isLoadingNext || !renderItem) return;

    // 获取当前最后一个项目的数据作为上下文
    const lastItemData = items.length > 0 ? items[items.length - 1] : undefined;

    // 防重复请求：检查是否已经请求过相同 ID 的消息
    if (lastItemData && React.isValidElement(lastItemData)) {
      const currentMsgId = (lastItemData as any).props?.msgId;
      if (typeof currentMsgId === 'number' && lastNextMsgId.current === currentMsgId) {
        console.log('handleNext - Skipping duplicate request for msgId:', currentMsgId);
        return;
      }
      lastNextMsgId.current = currentMsgId;
    }

    try {
      setIsLoadingNext(true);
      const newItems = await renderItem('next', lastItemData as T);
      setItems(prev => [...prev, ...newItems]);
    } finally {
      setIsLoadingNext(false);
      lastNextMsgId.current = null; // reset
    }
  }, [isLoadingNext, renderItem, items]);

  // 设置 IntersectionObserver
  const setupIntersectionObserver = useCallback(() => {
    // 清理之前的 observer
    if (intersectionObserver.current) {
      intersectionObserver.current.disconnect();
    }

    // 创建新的 observer
    intersectionObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 第一个元素可见，加载 pre 数据
            if (entry.target === firstItemRef.current) {
              handlePre();
            }
            // 最后一个元素可见，加载 next 数据
            else if (entry.target === lastItemRef.current) {
              handleNext();
            }
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: '50px', // 提前 50px 触发
        threshold: 0.1 // 10% 可见就触发
      }
    );

    // 观察第一个和最后一个元素
    if (firstItemRef.current) {
      intersectionObserver.current.observe(firstItemRef.current);
    } else {
      console.log('First item ref is null');
    }

    if (lastItemRef.current) {
      intersectionObserver.current.observe(lastItemRef.current);
    } else {
      console.log('Last item ref is null');
    }
  }, [items.length]); // 只依赖 items.length


  const cleanItemsFromButton = useCallback(() => {
    let removeIndex = -1;
    const container = containerRef.current;
    const nodes = contentRef.current?.children;

    if (container && nodes) {
      const containerRect = container.getBoundingClientRect();

      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i] as HTMLElement;
        if (!node) continue;

        const itemRect = node.getBoundingClientRect();
        if (itemRect.top > containerRect.bottom) {
          removeIndex = i;
        } else {
          break;
        }
      }
    }
    if (removeIndex !== -1) {
      setItems(prev => prev.slice(0, removeIndex));
    }
  }, [containerRef, contentRef]);

  const cleanItemsFromTop = useCallback(() => {
    let removeIndex = -1;
    const container = containerRef.current;
    const nodes = contentRef.current?.children;

    if (container && nodes) {
      const containerRect = container.getBoundingClientRect();

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i] as HTMLElement;
        if (!node) continue;

        const itemRect = node.getBoundingClientRect();
        if (itemRect.bottom < containerRect.top) {
          removeIndex = i;
        } else {
          break;
        }
      }
    }
    if (removeIndex !== -1) {
      const currentTranslateY = translateY;
      const oldHeight = contentRef.current ? contentRef.current.offsetHeight : 0;
      setPendingPreAdjust({ oldHeight, currentTranslateY });
      setItems(prev => prev.slice(removeIndex,));
    }
  }, [containerRef, contentRef]);



  const startInertia = (initialVelocity: number) => {
    let velocity = initialVelocity;
    setIsScrolling(true);

    const animate = () => {
      if (Math.abs(velocity) < 0.1) {
        setIsScrolling(false);
        return;
      }

      setTranslateY(prev => {
        const next = prev - velocity;
        // 边界处理
        const max = containerRef.current!.offsetHeight * 2 / 3;
        const min = containerRef.current!.offsetHeight * 1 / 3 - contentRef.current!.offsetHeight;
        const newTranslateY = Math.max(min, Math.min(max, next));
        return newTranslateY;
      });

      velocity *= 0.35; // 模拟摩擦力
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (contentRef.current && containerRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const contentHeight = contentRef.current.offsetHeight;

      const topHiddenHeight = Math.max(0, -translateY);
      const bottomHiddenHeight = Math.max(0, contentHeight - containerHeight - topHiddenHeight);
      const visibleHeight = Math.min(containerHeight, contentHeight - topHiddenHeight);

      const scrollBarHeight = (containerHeight / contentHeight) * containerHeight;
      const scrollBarTop = (topHiddenHeight / contentHeight) * containerHeight;

      setScroll({
        height: scrollBarHeight,
        top: scrollBarTop,
      });
    }
  }, [translateY, items]);

  // 监听滚动事件（仅处理滚动位置，不处理数据加载）
  const handleScroll = useCallback((event: WheelEvent) => {
    event.preventDefault();
    if (clearButtonTimer.current) {
      clearTimeout(clearButtonTimer.current);
    }
    clearButtonTimer.current = setTimeout(cleanItemsFromButton, 300);

    if (clearTopItemTimer.current) {
      clearTimeout(clearTopItemTimer.current);
    }
    clearTopItemTimer.current = setTimeout(cleanItemsFromTop, 500);

    const deltaY = event.deltaY;
    startInertia(deltaY);
  }, []
  );

  // 添加滚动事件监听器
  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });

      return () => {
        container.removeEventListener('wheel', handleScroll);
        if (clearButtonTimer.current) {
          clearTimeout(clearButtonTimer.current);
        }
      };
    }
  }, [handleScroll]);

  // 初始化 IntersectionObserver
  useEffect(() => {
    //console.log('Initializing IntersectionObserver, items count:', items.length);
    setupIntersectionObserver();

    return () => {
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }
    };
  }, [items.length]); // 只依赖 items.length

  // pre 加载后自动平移
  useLayoutEffect(() => {
    if (pendingPreAdjust && contentRef.current) {
      const newHeight = contentRef.current.offsetHeight;

      const heightDiff = newHeight - pendingPreAdjust.oldHeight;
      if (heightDiff !== 0) {
        //setTranslateY(pendingPreAdjust.currentTranslateY - heightDiff);
        //console.log('newHeight', newHeight, 'oldHeight', pendingPreAdjust.oldHeight, 'heightDiff', heightDiff);
        setTranslateY(prevTranslateY => {
          return prevTranslateY - heightDiff;
        });
      }
      setPendingPreAdjust(false);
    }
  }, [items, pendingPreAdjust]);

  return (
    <div
      ref={containerRef}
      className={cn(
        scrollUVariants({ variant, size, className }),
        'relative'
      )}
      style={{
        height: `${containerHeight}px`,
        border: '2px solid red',
        overflow: 'hidden'
      }}
      tabIndex={0}
      onFocus={() => console.log('Container focused')}
      onBlur={() => console.log('Container blurred')}
      {...props}
    >

      <div
        ref={contentRef}
        className="scroll-u-content"
        style={{
          transform: `translateY(${translateY}px)`,
          willChange: 'transform'
        }}
      >
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          // 为第一个和最后一个元素包装一个 div 来设置 ref
          if (isFirst || isLast) {
            return (
              <div
                key={index}
                ref={isFirst ? firstItemRef : lastItemRef}
              //style={{ border: isFirst ? '2px solid red' : '2px solid blue' }}
              >
                {item}
              </div>
            );
          }

          return <div key={index}>{item}</div>;
        })}
        {(isLoadingPre || isLoadingNext) && (
          <div className="flex justify-center items-center py-4 text-gray-500">
            {isLoadingPre ? '加载历史消息...' : '加载更多消息...'}
          </div>
        )}
      </div>
      {showScrollBar && (scrollBarRender(scrollBar.height,scrollBar.top))}
    </div>
  );
};

export { ScrollU, scrollUVariants, scrollUItemVariants };
