
## 📄 ScrollU 组件简介（中文）

[live demo](https://akzj.github.io/scroll-u/)

`ScrollU` 是一个高性能的滚动列表组件，支持：

- **上下滚动加载数据**（通过 IntersectionObserver 和手动滚动）
- **动态插入与删除节点**
- **平滑动画与速度响应**
- **滚动条显示与自定义**
- **惯性滚动与边界回弹**

适用于聊天窗口、日志流、时间轴等需要动态加载和平滑滚动的场景。

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
  containerHeight={500}
  initialItems={[...]}
  renderItem={async (direction, data) => {
    // 返回新加载的节点
    return [<div key="1">Item</div>];
  }}
  showScrollBar
/>
```

---

## 🧠 特性亮点（Key Features）

| 特性 | 描述 |
|------|------|
| 动态加载 | 支持向上/向下滚动时加载新内容 |
| 动画优化 | 根据滚动速度动态启用/禁用过渡动画 |
| 滚动条 | 支持默认滚动条或自定义滚动条组件 |
| 性能优化 | 使用 IntersectionObserver 和节流处理 |
| 可扩展性 | 支持自定义渲染、样式、动画等 |
---
