<template>
    <div class="page-container">
        <h1>🛠️ 低代码表单引擎实战</h1>

        <!-- 渲染引擎 -->
        <SchemaForm :schema="formSchema" :model="formModel" />

        <!-- 实时调试区：让你亲眼看到数据变化 -->
        <div class="debug">
            <p>实时数据模型 (Model):</p>
            <pre>{{ formModel }}</pre>
        </div>
    </div>
</template>

<script setup>
import SchemaForm from '@/components/SchemaForm/index.vue';
import { formSchema } from './schema.js';
import { createInitModel } from './model.js';

// 初始化数据
const formModel = createInitModel();
</script>

<style>
.page-contaienr {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #eee;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.debug {
    margin-top: 20px;
    background: #2d2d2d;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
    font-size: 12px;
}
</style>