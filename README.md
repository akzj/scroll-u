
## 📄 ScrollU 组件简介（中文）

[live demo](https://akzj.github.io/scroll-u/)

`ScrollU` 是一个高性能的滚动列表组件，支持：

- **上下滚动加载数据**（通过 IntersectionObserver 和手动滚动）
- **动态插入与删除节点**
- **平滑动画与速度响应**
- **滚动条显示与自定义**
- **惯性滚动与边界回弹**

适用于聊天窗口、日志流、时间轴等需要动态加载和平滑滚动的场景。


| 特性      | scroll-u     | react-window   | react-virtualized   |
| ------- | --------- | -------------- | ------------------- |
| 双向无限滚动  | ✅ 原生支持    | ❌ 需要hack       | ❌ 需要hack            |
| 动态清理DOM | ✅ 自动      | ✅ 自动           | ✅ 自动                |
| 自定义滚动条  | ✅ 支持      | ❌ 不支持          | ❌ 不支持               |
| 速度响应动画  | ✅ 支持      | ❌ 不支持          | ❌ 不支持               |
| 学习成本    | 低（API简单）  | 中等             | 高                   |


---

## 📄 ScrollU Component Summary (English)

`ScrollU` is a high-performance scrollable list component that supports:

- **Loading data on scroll up/down** (via IntersectionObserver and manual scroll)
- **Dynamic item insertion and removal**
- **Smooth animations and velocity-based transitions**
- **Scroll bar display and customization**
- **Inertia scrolling and boundary bounce effects**

Ideal for chat windows, log feeds, timelines, and other scenarios requiring dynamic loading and smooth scrolling.

---

## ✅ 示例用法（Usage Example）

```tsx
<ScrollU
  initialItems={[...]}
  renderItem={async (direction, data) => {
    // 返回新加载的节点
    return [<div key="1">Item</div>];
  }}
  showScrollBar
/>
```

---
