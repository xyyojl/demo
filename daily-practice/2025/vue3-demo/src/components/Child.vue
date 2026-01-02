<template>
    <div class="child">
        <!-- 重点：这里可以直接 v-model 绑定 computed 出来的 proxy -->
        <!-- 当用户输入时，proxy 的 set 触发 -> emit -> 父组件更新 -> props 更新 -> proxy 的 get 更新 -->
        <input v-model="proxyValue">
        <p>子组件内部：{{ proxyValue }}</p>
    </div>
</template>

<script setup>
import { useVModel } from '@/hooks/useVModel';

// 1. 定义 Props 和 Emit
const props = defineProps({
    modelValue: String // 默认 v-model
});
const emit = defineEmits(['update:modelValue']);

// 2. 使用 Hook
// proxyValue 现在是一个“可写的 computed”
const proxyValue = useVModel(props, 'modelValue', emit);
</script>
