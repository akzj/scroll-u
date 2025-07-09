'use client'
import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // 假设你有这个工具函数
import { scrollUVariants, scrollUItemVariants, scrollUButtonVariants } from './variants';
import { ScrollUItemProps } from './scroll-u-item';

export interface ScrollUProps<T = any>
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof scrollUVariants> {
  visibleItems?: number;
  scrollSpeed?: number;
  showButtons?: boolean;
  maxCacheItems?: number; // 最大缓存项目数
  containerHeight?: number; // 直接指定容器高度
  renderItem?: (direction: 'pre' | 'next', contextData?: T) => Promise<React.ReactNode>;
  initialItems?: React.ReactNode[];
}

const ScrollU = <T = any>({
  children,
  variant,
  size,
  visibleItems = 5,
  scrollSpeed = 1,
  showButtons = true,
  maxCacheItems = 10,
  className,
  containerHeight,
  renderItem,
  initialItems = [],
  ...props
}: ScrollUProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [calculatedHeight, setCalculatedHeight] = useState<number>(0);
  const [translateY, setTranslateY] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);
  const lastScrollTime = useRef<number>(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const [items, setItems] = useState<React.ReactNode[]>(initialItems);
  const [isLoadingPre, setIsLoadingPre] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const lastPreMsgId = useRef<number | null>(null);
  const lastNextMsgId = useRef<number | null>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  const [pendingPreAdjust, setPendingPreAdjust] = useState<false | { oldHeight: number, currentTranslateY: number }>(false);

  // 获取子组件列表
  const childCount = items.length;
  const maxTranslateY = Math.max(0, (childCount - visibleItems) * (calculatedHeight / visibleItems));



  // pre 函数：向下滚动，在顶端添加新节点
  const handlePre = useCallback(async () => {
    if (isLoadingPre || !renderItem) return;

    // 1. 先同步读取 oldHeight
    const oldHeight = contentRef.current ? contentRef.current.offsetHeight : 0;
    const currentTranslateY = translateY;

    // 获取当前第一个项目的数据作为上下文
    const firstItemData = items.length > 0 ? items[0] : undefined;

    // 防重复请求：检查是否已经请求过相同 ID 的消息
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
      console.log('handlePre - Current first item:', firstItemData);

      // 调用 renderItem，传递 'pre' 方向和上下文数据
      if (!renderItem) return;
      const newItem = await renderItem('pre', firstItemData as T);

      // 2. 先设置 pendingPreAdjust，带上 oldHeight
      setPendingPreAdjust({ oldHeight, currentTranslateY });
      console.log('handlePre - Pending pre adjust:', pendingPreAdjust);
      // 3. 再 setItems
      setItems(prev => [newItem, ...prev]);

      // 标记需要调整
    } finally {
      setIsLoadingPre(false);
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

    setIsLoadingNext(true);
    try {
      console.log('handleNext - Current last item:', lastItemData);

      // 调用 renderItem，传递 'next' 方向和上下文数据
      if (!renderItem) return;
      const newItem = await renderItem('next', lastItemData as T);

      // 将新项目添加到底部
      setItems(prev => {
        const newItems = [...prev, newItem]//.slice(-maxCacheItems);
        //console.log('handleNext - Updated items count:', newItems.length);
        return newItems;
      });

      // 使用 requestAnimationFrame 优化渲染流程
      requestAnimationFrame(() => {
        // 等待 DOM 更新完成
        requestAnimationFrame(() => {
          // 更新观察器
          updateObservers();
        });
      });
    } finally {
      setIsLoadingNext(false);
    }
  }, [isLoadingNext, renderItem, items]);

  // 更新观察目标
  const updateObservers = useCallback(() => {
    if (intersectionObserver.current) {
      // 停止观察当前元素
      intersectionObserver.current.disconnect();

      // 重新观察新的第一个和最后一个元素
      if (firstItemRef.current) {
        intersectionObserver.current.observe(firstItemRef.current);
      }
      if (lastItemRef.current) {
        intersectionObserver.current.observe(lastItemRef.current);
      }
    }
  }, []);

  // 设置 IntersectionObserver
  const setupIntersectionObserver = useCallback(() => {
    console.log('Setting up IntersectionObserver...', items.length);

    // 清理之前的 observer
    if (intersectionObserver.current) {
      intersectionObserver.current.disconnect();
    }

    // 创建新的 observer
    intersectionObserver.current = new IntersectionObserver(
      (entries) => {
        //console.log('IntersectionObserver entries:', entries);
        entries.forEach((entry) => {
          //console.log('Entry:', {
          //  target: entry.target,
          //  isIntersecting: entry.isIntersecting,
          //  intersectionRatio: entry.intersectionRatio,
          //  firstItemRef: firstItemRef.current,
          //  lastItemRef: lastItemRef.current
          //});

          if (entry.isIntersecting) {
            // 第一个元素可见，加载 pre 数据
            if (entry.target === firstItemRef.current) {
              //console.log('First item visible, loading pre data');
              handlePre();
            }
            // 最后一个元素可见，加载 next 数据
            else if (entry.target === lastItemRef.current) {
              //console.log('Last item visible, loading next data');
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
      //console.log('Observing first item:', firstItemRef.current);
      intersectionObserver.current.observe(firstItemRef.current);
    } else {
      console.log('First item ref is null');
    }

    if (lastItemRef.current) {
      //console.log('Observing last item:', lastItemRef.current);
      intersectionObserver.current.observe(lastItemRef.current);
    } else {
      console.log('Last item ref is null');
    }
  }, [items.length]); // 只依赖 items.length

  // 监听滚动事件（仅处理滚动位置，不处理数据加载）
  const handleScroll = async (event: WheelEvent) => {


    event.preventDefault();

    const deltaY = event.deltaY;

    setTranslateY(prevTranslateY => {
      const newTranslateY = prevTranslateY - deltaY;
      const maxHeight = containerRef.current!.offsetHeight * 2 / 3;
      const minHeight = containerRef.current!.offsetHeight * 1 / 3 - contentRef.current!.offsetHeight;
      if (newTranslateY > maxHeight) {
        return maxHeight;
      }
      if (newTranslateY < minHeight) {
        return minHeight;
      }
      return newTranslateY;
    });

    //  console.log('handleScroll', translateY);
    // 设置防抖定时器
    scrollTimeout.current = setTimeout(() => {
      setVelocity(0);
    }, 100);
  };

  // 添加滚动事件监听器
  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });

      return () => {
        container.removeEventListener('wheel', handleScroll);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
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

  // 计算容器高度
  useEffect(() => {
    if (containerHeight) {
      setCalculatedHeight(containerHeight);
    } else if (contentRef.current && contentRef.current.firstElementChild) {
      const firstItem = contentRef.current.firstElementChild as HTMLElement;
      setCalculatedHeight(firstItem.offsetHeight * visibleItems);
    }

    // 重置滚动位置
    setTranslateY(0);
  }, [containerHeight, visibleItems]);

  // pre 加载后自动平移
  useLayoutEffect(() => {
    if (pendingPreAdjust && contentRef.current) {
      const newHeight = contentRef.current.offsetHeight;

      const heightDiff = newHeight - pendingPreAdjust.oldHeight;
      if (heightDiff !== 0) {
        //setTranslateY(pendingPreAdjust.currentTranslateY - heightDiff);
        console.log('newHeight', newHeight, 'oldHeight', pendingPreAdjust.oldHeight, 'heightDiff', heightDiff);
        setTranslateY(prevTranslateY => {
          console.log('prevTranslateY', prevTranslateY);
          return prevTranslateY - heightDiff;
        });
      }
      setPendingPreAdjust(false);
    }
  }, [items, pendingPreAdjust]);

  const getContainerHeight = () => {
    // console.log('Container height:', calculatedHeight, 'translateY:', translateY);
    return calculatedHeight || 180; // 设置一个默认高度
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        scrollUVariants({ variant, size, className }),
        'relative'
      )}
      style={{
        height: `${getContainerHeight()}px`,
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
          //transition: Math.abs(velocity) > 0.05 ? 'none' : 'transform 0.15s ease-out',
          willChange: 'transform'
        }}
      >
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          //  console.log(`Rendering item ${index}, isFirst: ${isFirst}, isLast: ${isLast}`);

          // 为第一个和最后一个元素包装一个 div 来设置 ref
          if (isFirst || isLast) {
            return (
              <div
                key={index}
                ref={isFirst ? firstItemRef : lastItemRef}
                style={{ border: isFirst ? '2px solid red' : '2px solid blue' }}
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


    </div>
  );
};

export { ScrollU, scrollUVariants, scrollUItemVariants };
