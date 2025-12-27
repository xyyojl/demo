<template>
    <el-form :model="model" label-width="100px">
        <!-- 1. 遍历 Schema 数组 -->
        <template v-for="item in schema" :key="item.field">

            <!-- 2. 处理联动逻辑（showIf） -->
            <!-- 如果没定义 showIf，或者 showIf(model) 返回 true，则显示 -->
            <el-form-item
                v-if="!item.showIf || item.showIf(model)"
                :label="item.label"
                :prop="item.field"
                :rules="item.rules"
            >
                <!-- 3. 动态组件渲染核心（Engine Core） -->
                <!-- :is -> 从映射表中找到真实组件 -->
                <!-- v-model -> 绑定到 model[item.field] 实现双向绑定 -->
                <!-- v-bind -> 将 props 对象展开传给组件（placeholder 等） -->
                <component
                    :is="componentMap[item.component]"
                    v-model="model[item.field]"
                    v-bind="item.props"
                >
                    <!-- 4. 特殊处理：Select 的 options 需要渲染成子组件 -->
                    <!-- 只有当组件是 Select 时才执行这里 -->
                    <template v-if="item.component === 'Select'">
                        <el-option
                            v-for="opt in item.props.options"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                        />
                    </template>
                </component>
            </el-form-item>
        </template>
    </el-form>
</template>

<script setup>
import { shallowRef, watch } from 'vue';
// 引入 Element Plus 的组件（或者你自己的组件）
import { ElInput, ElSelect, ElSwitch } from 'element-plus';

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

// 5. 组件映射表（Component Map）
// 作用：将 JSON 里的字符串 'Input' 映射为真实的组件对象
// 使用 shallowRef 优化性能（组件对象不需要深层响应式）
const componentMap = shallowRef({
    Input: ElInput,
    Select: ElSelect,
    Switch: ElSwitch,
    // 这里可以无限扩展：DatePicker, Upload, RichText...
});

// 脏数据清理问题
// 在 SchemaForm 这种架构下，最优雅的解决方案是在**引擎层（SchemaForm 组件）**统一监听处理。
// 🔥【核心方案】自动清理脏数据
// 监听整个 model 的变化
watch(
    () => props.model,
    () => {
        // 遍历所有 schema 配置
        props.schema.forEach(item => {
            // 1. 判断当前是否应该显示
            // 如果没有 showIf，默认是显示的（true）
            // 如果有 showIf，执行函数看结果
            const isVisible = !item.showIf || item.showIf(props.model);

            // 2. 如果不可见（隐藏状态），但 model 里依然有值（脏数据）
            if (!isVisible && props.model[item.field]) {
                // 3. 重置数据
                // 注意：根据类型重置，Select/Input 重置为 ''，Switch 重置为 false
                // 这里简单粗暴一点，设为 null 或 undefined，或者空字符串
                props.model[item.field] = null;

                console.log(`🧹 自动清理了脏数据: ${item.field}`);
            }
        });
    },
    { deep: true } // 必须开启深度监听，因为 model 是嵌套对象
);
</script>
