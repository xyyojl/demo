<template>
    <!-- 1. 视口容器（Viewport） -->
    <!-- 监听 scroll 事件，高度固定，overflow-y: auto -->
    <!-- ref 用于获取高度和 scrollTop -->
    <div
        class="viewport"
        ref="viewportRef"
        @scroll="onScroll"
    >
        
        <!-- 2. 占位层（Phantom） -->
        <!-- 没有任何内容，只负责把滚动条撑开到 10万条数据的高度 -->
        <!-- 它的唯一作用是撑开滚动条，让用户感觉真的有 10 万条数据 -->
        <div class="phantom" :style="{ height: phantomHeight + 'px' }"></div>

        <!-- 3. 渲染层（Render List） -->
        <!-- 真正展示数据的地方，通过 transform 移动位置 -->
        <!-- 绝对定位，通过 transform 动态改变位置，永远出现在用户眼前 -->
        <div class="render-list" :style="{ transform: `translate3d(0, ${startOffset}px, 0)` }">
            <!-- 渲染具体的数据项 -->
            <div
                class="list-item"
                v-for="item in visibleData"
                :key="item.id"
                :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }"
            >
                <!-- 这里的 slot 支持自定义列表项内容 -->
                <slot :item="item">{{ item.id }} - {{ item.content }}</slot>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
    listData: { type: Array, default: () => [] }, // 数据源（10万条）
    itemSize: { type: Number, default: 50 },      // 每行固定高度
    buffer: { type: Number, default: 5 }          // 缓冲区（防止白屏）
});

// DOM 引用
const viewportRef = ref(null);

// 响应式状态
const screenHeight = ref(0); // 容器的高度
const start = ref(0);        // 当前渲染的起始索引（不含 buffer）
const startOffset = ref(0);  // 渲染层偏移量

// 1. 计算占位层（总数据量 * 单行高度）
const phantomHeight = computed(() => {
    return props.listData.length * props.itemSize;
});

// 2. 计算可视区能装下多少个元素（向上取整）
const visibleCount = computed(() => {
    return Math.ceil(screenHeight.value / props.itemSize);
});

// 3.【核心】计算当前真正需要渲染的数据（Visible Data）
const visibleData = computed(() => {
    // A. 加上缓冲区（Buffer）
    // 比如 start 是 10，buffer 是 5，那我们就从 5 开始渲染
    const realStart = Math.max(0, start.value - props.buffer);

    // B. 计算结束索引
    // 结束点 = 起始点 + 屏幕容量 + 缓冲区
    const end = Math.min(
        props.listData.length,
        start.value + visibleCount.value + props.buffer
    );

    return props.listData.slice(realStart, end);
    // 测试不加 Buffer 的效果
    // 当你快速拖动滚动条时，页面上下边缘会疯狂闪烁（因为渲染速度跟不上手速）
    // return props.listData.slice(start.value, start.value + visibleCount.value);
});

// 4. 滚动事件处理
const onScroll = () => {
    if (!viewportRef.value) return;

    // 获取当前卷去的高度
    const scrollTop = viewportRef.value.scrollTop;

    // 【公式 A】算出当前滚动到了第几个元素
    // 比如滚了 100px，每行 50px，那就是滚到了第 2 个
    start.value = Math.floor(scrollTop / props.itemSize);

    // 【公式 B】计算偏移量（核心视觉欺骗）
    // 如果我们从第 5 个开始渲染（realStart），那前 4 个的高度需要用 transform 补回来
    // 修正版公式：偏移量 = （实际渲染起点）* 单行高度
    const realStart = Math.max(0, start.value - props.buffer);
    startOffset.value = realStart * props.itemSize;
    // 测试不加 Buffer 的效果
    // startOffset.value = start.value * props.itemSize;
};

// 5. 初始化：获取容器高度
onMounted(() => {
    if (viewportRef.value) {
        screenHeight.value = viewportRef.value.clientHeight;
    }
});
</script>

<style scoped>
.viewport {
    height: 100%; /* 或者固定高度 */
    overflow-y: auto;
    position: relative; /* 关键：相对定位 */
}

.phantom {
    position: absolute; /* 关键：绝对定位，不占文档流，只撑高度 */
    left: 0;
    top: 0;
    right: 0;
    z-index: -1; /* 放在最底层 */
}

.render-list {
    position: absolute; /* 关键：绝对定位，随 scroll 移动 */
    left: 0;
    top: 0;
    right: 0;
    /* transform 会在 JS 里动态计算 */
}
</style>