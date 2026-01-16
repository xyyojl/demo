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
            <!-- 使用 data-index 绑定绝对索引 -->
            <div
                class="list-item"
                v-for="item in visibleData"
                :key="item._index"
                :data-index="item._index"
                ref="itemsRef"
            >
                <slot :item="item"></slot>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated, watch } from 'vue';

const props = defineProps({
    listData: { type: Array, default: () => [] }, // 数据源（10万条）
    itemSize: { type: Number, default: 50 },      // 定高模式：每行固定高度
    estimatedItemSize: { type: Number, default: 0 },      // 不定高模式：预估高度 (开关)
    buffer: { type: Number, default: 5 }          // 缓冲区（防止白屏）
});

// DOM 引用
const viewportRef = ref(null);
const itemsRef = ref([]); // 拿到所有渲染出来的 DOM 节点

// 响应式状态
const screenHeight = ref(0); // 容器的高度
const start = ref(0);        // 当前渲染的起始索引（不含 buffer）
const startOffset = ref(0);  // 渲染层偏移量
// --- 核心状态：位置缓存数组 (不定高专用) ---
// 结构: [ { index, top, bottom, height }, ... ]
const positions = ref([]);

// 判断是否为不定高模式
const isDynamic = computed(() => props.estimatedItemSize > 0);

// --- 1. 初始化 / 数据源变化 ---
const initPositions = () => {
    if (!isDynamic.value) return;

    // 使用预估高度生成初始位置信息
    positions.value = props.listData.map((_, index) => ({
        index,
        height: props.estimatedItemSize,
        top: index * props.estimatedItemSize,
        bottom: (index + 1) * props.estimatedItemSize
    }));
};

watch(() => props.listData, initPositions, { immediate: true });

// --- 2. 计算属性 ---

// 列表总高度 (Phantom)
const phantomHeight = computed(() => {
    if (isDynamic.value && positions.value.length > 0) {
        // 不定高：取最后一项的 bottom
        return positions.value[positions.value.length - 1].bottom;
    }
    // 定高
    return props.listData.length * props.itemSize;
});

// 计算可视区能装下多少个元素（向上取整）
const visibleCount = computed(() => {
    const size = isDynamic.value ? props.estimatedItemSize : props.itemSize;
    return Math.ceil(screenHeight.value / size);
});

// 【核心】计算当前真正需要渲染的数据（Visible Data）
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

    // 注入原始索引 _index，方便后续通过 data-index 获取 DOM
    return props.listData.slice(realStart, end).map((item, i) => ({
        ...item,
        _index: realStart + i // 【关键】映射回大数组的真实索引
    }));

    // 测试不加 Buffer 的效果
    // 当你快速拖动滚动条时，页面上下边缘会疯狂闪烁（因为渲染速度跟不上手速）
    // return props.listData.slice(start.value, start.value + visibleCount.value);
});

// --- 3. 核心算法区域 ---

// 二分查找：找到第一个 bottom > scrollTop 的项 (O(log n))
const getStartIndex = (scrollTop) => {
    let low = 0;
    let high = positions.value.length - 1;
    let res = -1; // 存储找到的结果

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        // 假设 scrollTop = 100
        // 如果中间项的 bottom 是 150 (150 > 100)
        if (positions.value[mid].bottom > scrollTop) {
            res = mid; // 找到了一个潜在目标！先记下来。
            high = mid - 1; // 但是前面可能还有？往左边找找看 (尝试找更小的索引)
        } else {
            // 如果中间项 bottom 是 50 (50 <= 100)
            // 说明这个元素已经完全滚出去了，目标肯定在右边
            low = mid + 1;
        }
    }
    return res;
};

// 滚动事件处理
const onScroll = () => {
    if (!viewportRef.value) return;

    // 获取当前卷去的高度
    const scrollTop = viewportRef.value.scrollTop;

    if (isDynamic.value) {
        // --- 不定高逻辑 ---
        start.value = getStartIndex(scrollTop);
        const realStart = Math.max(0, start.value - props.buffer);
        // 偏移量 = 渲染起点的 top 值
        startOffset.value = positions.value[realStart] ? positions.value[realStart].top : 0;
    } else {
        // --- 定高逻辑 (保持不变) ---
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
    }
};

// --- 4. 动态修正 (The Magic) ---
// 每次渲染完成后，测量真实高度，更新 positions
onUpdated(() => {
    if (!isDynamic.value || itemsRef.value.length === 0) return;

    // 获取当前渲染的节点
    const nodes = itemsRef.value;
    nodes.forEach(node => {
        // 拿到真实 DOM 高度
        const rect = node.getBoundingClientRect();
        const height = rect.height;
        // 拿到在数据源中的索引
        const index = +node.dataset.index; // 拿到 _index
        const oldHeight = positions.value[index].height;

        // 【优化逻辑】Diff = 新 - 旧
        const diff = height - oldHeight;

        if (diff !== 0) {
            // 1. 更新当前项
            positions.value[index].height = height;
            positions.value[index].bottom += diff; // 底部变了

            // 2. 更新后续所有项（链式反应）
            // 注意：这里简单循环更新，在 10w 条数据下 JS 计算依然很快（几ms）
            // 只有 DOM 操作才慢，纯数值计算很快
            for (let k = index + 1; k < positions.value.length; k++) {
                positions.value[k].top = positions.value[k - 1].bottom;
                positions.value[k].bottom = positions.value[k].top + positions.value[k].height;
            }
        }
    });
});

// 初始化：获取容器高度
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