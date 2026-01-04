<template>
    <el-form :model="model" label-width="100px">
        <!-- 启动递归 -->
        <SchemaItem
            v-for="item in schema"
            :key="item.key || item.field"
            :item="item"
            :model="model"
        />
    </el-form>
</template>

<script setup>
/* 
入口组件变薄了，它主要负责两件事：
1. 启动递归
2. 递归清理脏数据（因为 Schema 变成树形了，清理逻辑也要升级为递归）
*/
import { watch } from 'vue';
import { ElForm } from 'element-plus';
import SchemaItem from './SchemaItem.vue';

const props = defineProps({
    schema: {
        type: Array,
        required: true
    },
    model: {
        type: Object,
        required: true
    }
});

// --- 脏数据清理逻辑 (升级为递归版) ---
// 辅助函数：递归遍历 Schema，检查隐藏项并重置
const cleanDataRecursive = (schemaItems) => {
    schemaItems.forEach(item => {
        // 1. 如果是布局组件，递归检查它的 children
        if (item.isLayout && item.children) {
            cleanDataRecursive(item.children);
            return; // 布局组件本身没有 value，处理完孩子就返回
        }

        // 2. 普通组件：检查显隐逻辑
        // 如果没有 showIf，默认是显示的（true）
        // 如果有 showIf，执行函数看结果
        const isVisible = !item.showIf || item.showIf(props.model);

        // 3. 如果隐藏且有值，则重置
        // 如果不可见（隐藏状态），但 model 里依然有值（脏数据）
        if (!isVisible && props.model[item.field]) {
            // 重置数据
            // 注意：根据类型重置，Select/Input 重置为 ''，Switch 重置为 false
            // 这里简单粗暴一点，设为 null 或 undefined，或者空字符串
            props.model[item.field] = null;
            console.log(`🧹 递归清理脏数据: ${item.field}`);
        }
    });
};


// 脏数据清理问题
// 在 SchemaForm 这种架构下，最优雅的解决方案是在**引擎层（SchemaForm 组件）**统一监听处理。
// 🔥【核心方案】自动清理脏数据
// 监听整个 model 的变化
watch(
    () => props.model,
    () => {
        cleanDataRecursive(props.schema);
    },
    { deep: true } // 必须开启深度监听，因为 model 是嵌套对象
);
</script>
