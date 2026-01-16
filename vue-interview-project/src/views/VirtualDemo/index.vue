<template>
    <div class="page-container">
        <h2>🚀 高性能虚拟列表演示</h2>
        
        <!-- 模式切换 -->
        <div class="tabs">
            <button
                :class="{ active: mode === 'fixed' }"
                @click="switchMode('fixed')"
            >
                模式一：定高 (Fixed Height)
            </button>
            <button
                :class="{ active: mode === 'dynamic' }"
                @click="switchMode('dynamic')"
            >
                模式二：不定高 (Dynamic Height)
            </button>
        </div>

        <!-- 列表容器 -->
        <div class="wrapper">

            <!-- === 模式一：定高列表 === -->
            <!-- 传入 itemSize，不传 estimatedItemSize -->
            <VirtualList
                v-if="mode === 'fixed'"
                :listData="fixedList"
                :itemSize="50"
            >
                <template #default="{ item }">
                    <div class="fixed-item">
                        <span class="id-tag">#{{ item.id }}</span>
                        <span>{{ item.content }}</span>
                    </div>
                </template>
            </VirtualList>

            <!-- === 模式二：不定高列表 === -->
            <!-- 传入 estimatedItemSize (开启不定高模式) -->
            <VirtualList
                v-if="mode === 'dynamic'"
                :listData="dynamicList"
                :estimatedItemSize="80"
            >
                <template #default="{ item }">
                    <div class="dynamic-item">
                        <span class="id-tag">#{{ item.id }}</span>
                        <div class="content">
                            <p class="title">随机内容长度：</p>
                            <p>{{ item.content }}</p>
                        </div>
                    </div>
                </template>
            </VirtualList>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VirtualList from '@/components/VirtualList/index.vue';
import Mock from 'mockjs';

const mode = ref('fixed'); // 当前模式
const fixedList = ref([]);
const dynamicList = ref([]);

const switchMode = (newMode) => {
    mode.value = newMode;
};

// 生成 10 万条数据
onMounted(() => {
    // 1. 生成定高数据 (10万条)
    const fData = [];
    for (let i = 0; i < 100000; i++) {
        fData.push({ id: i, content: `我是定高数据 - 第 ${i} 行` });
    }
    fixedList.value = fData;

    // 2. 生成不定高数据 (1万条足够演示，内容随机)
    const dData = [];
    for (let i = 0; i < 10000; i++) {
        // 生成随机长度的句子
        dData.push({
            id: i,
            content: Mock.Random.sentence(5, 50) // 5到50个单词，长度随机
        });
    }
    dynamicList.value = dData;
});
</script>

<style scoped>
.page-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.tabs {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
}

button {
    padding: 8px 16px;
    cursor: pointer;
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
}
button.active {
    background: #409eff;
    color: white;
    border-color: #409eff;
}

.wrapper {
    height: 600px; /* 容器固定高度 */
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

/* 定高样式 */
.fixed-item {
    height: 50px; /* 必须固定，必须和 itemSize 一致 */
    line-height: 50px;
    padding: 0 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
}

/* 不定高样式 */
.dynamic-item {
    /* 不设 height，让内容撑开 */
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: flex-start;
}

.id-tag {
    display: inline-block;
    width: 60px;
    font-weight: bold;
    columns: #999;
    flex-shrink: 0;
}

.content .title {
    margin: 0 0 5px 0;
    font-size: 12px;
    color: #888;
}
.content p {
    margin: 0;
    line-height: 1.5; /* 文字行高 */
}
</style>