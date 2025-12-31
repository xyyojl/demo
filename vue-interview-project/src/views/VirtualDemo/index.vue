<template>
    <div class="container">
        <div class="header">
            <button @click="loadData">🔥 加载 10 万条数据（小心死机）</button>
            <span v-if="renderTime">渲染耗时：{{ renderTime }} ms</span>
        </div>

        <!-- 这是一个普通的列表，没有任何优化 -->
        <div class="list-container">
            <div v-for="item in list" :key="item.id" class="list-item">
                {{ item.id }} - {{ item.content }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const list = ref([]);
const renderTime = ref(0);

const loadData = async () => {
    renderTime.value = 0;
    const data = [];
    // 模拟生成 10 万条数据
    for (let i = 0; i < 100000; i++) {
        data.push({ id: i, content: `我是第 ${i} 条数据` });
    }

    console.time('JS生成数据');
    list.value = data; // 这里 JS 很快，但 Vue 的响应式转换需要时间
    console.timeEnd('JS生成数据');

    // 记录开始渲染的时间
    const start = performance.now();

    // 等待 DOM 更新完毕
    await nextTick();

    const end = performance.now();
    renderTime.value = (end - start).toFixed(2);

    alert(`渲染完成！耗时 ${renderTime.value}ms。试着滚动一下？`);
};
</script>

<style scoped>
.list-container {
    height: 500px;
    overflow-y: auto;
    border: 1px solid #ccc;
    margin-top: 20px;
}
.list-item {
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    border-bottom: 1px solid #eee;
}
</style>