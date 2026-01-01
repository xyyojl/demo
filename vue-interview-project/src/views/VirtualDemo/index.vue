<template>
    <div class="container">
        <!-- 给容器一个固定高度 -->
        <div class="wrapper">
            <VirtualList :listData="list" :itemSize="50">
                <!-- 使用作用域插槽自定义内容 -->
                    <template #default="{ item }">
                        <div class="my-item">
                            <strong>ID：{{ item.id }}</strong>
                            <span>{{ item.content }}</span>
                        </div>
                    </template>
            </VirtualList>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VirtualList from '@/components/VirtualList/index.vue';

const list = ref([]);

// 生成 10 万条数据
onMounted(() => {
    const data = [];
    for (let i = 0; i < 100000; i++) {
        data.push({ id: i, content: `虚拟列表测试数据 - ${i}` });
    }
    list.value = data;
});
</script>

<style scoped>
.wrapper {
    height: 500px; /* 必须给高度 */
    border: 1px solid #ccc;
    margin: 20px;
}
.my-item {
    height: 50px; /* 必须和 itemSize 一致 */
    line-height: 50px;
    padding: 0 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
}
</style>