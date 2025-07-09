'use client'
import React, { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // 假设你有这个工具函数
import { scrollUVariants, scrollUItemVariants, scrollUButtonVariants } from './variants';
import { ScrollUItemProps } from './scroll-u-item';

export interface ScrollUProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof scrollUVariants> {
  visibleItems?: number;
  scrollSpeed?: number;
  showButtons?: boolean;
  containerHeight?: number; // 直接指定容器高度
}

const ScrollU: React.FC<ScrollUProps> = ({
  children,
  variant,
  size,
  visibleItems = 5,
  scrollSpeed = 1,
  showButtons = true,
  className,
  containerHeight,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [calculatedHeight, setCalculatedHeight] = useState<number>(0);
  const [translateY, setTranslateY] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);
  const lastScrollTime = useRef<number>(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // 获取子组件列表
  const childCount = React.Children.count(children);
  const maxTranslateY = Math.max(0, (childCount - visibleItems) * (calculatedHeight / visibleItems));

  // 监听滚动事件
  const handleScroll = (event: WheelEvent) => {
    event.preventDefault();

    const deltaY = event.deltaY;
    
    setTranslateY(prevTranslateY => {
      

      // if (deltaY > 0) {
      //   // 向下滚动
      //   newTranslateY = Math.min(prevTranslateY + deltaY, maxTranslateY);
      // } else {
      //   // 向上滚动
      //   newTranslateY = Math.max(prevTranslateY + deltaY, 0);
      // }

      return prevTranslateY - deltaY;
    });
    
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
  }, [containerHeight, visibleItems, children]);

  const getContainerHeight = () => {
    console.log('Container height:', calculatedHeight, 'translateY:', translateY);
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
          transition: Math.abs(velocity) > 0.05 ? 'none' : 'transform 0.15s ease-out',
          willChange: 'transform'
        }}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              variant,
              size,
            } as Partial<ScrollUItemProps>);
          }
          return child;
        })}
      </div>


    </div>
  );
};

export { ScrollU, scrollUVariants, scrollUItemVariants };
