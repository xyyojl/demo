<template>
    <!-- 1. 容器（Viewport） -->
    <!-- 监听 scroll 事件，高度固定，overflow-y: auto -->
    <div class="viewport" ref="viewportRef" @scroll="onScroll">
        
        <!-- 2. 占位层（Phantom） -->
        <!-- 没有任何内容，只负责把滚动条撑开到 10万条数据的高度 -->
        <div class="phantom" :style="{ height: phantomHeight + 'px' }"></div>

        <!-- 3. 渲染层（Render List） -->
        <!-- 真正展示数据的地方，通过 transform 移动位置 -->
        <div class="render-list" :style="{ transform: `translate3d(0, ${startOffset}px, 0)` }">
            <div
                class="list-item"
                v-for="item in visibleData"
                :key="item.id"
                :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }"
            >
                {{ item.value }}
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    itemSize: { type: Number, default: 50 } // 每行高度
});

// 这些变量明天我们会写逻辑来计算
const phantomHeight = ref(0); // 撑开的高度
const startOffset = ref(0);   // 偏移量
const visibleData = ref([]);  // 当前可见的数据

const onScroll = (e) => {
    // 明天的主战场
    const scrollTop = e.target.scrollTop;
    console.log('滚动了：', scrollTop);
};
</script>

<style scoped>
.viewport {
    height: 100%; /* 或者固定高度 */
    overflow-y: auto;
    position: relative; /* 关键：相对定位 */
    border: 1px solid #999;
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