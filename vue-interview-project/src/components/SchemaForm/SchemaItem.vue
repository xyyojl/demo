<template>
    <!-- 分支 1：布局组件（如 ElCard，ElRow） -->
    <!-- 逻辑：如果是布局组件，渲染它，并将 children 递归传给下一层 SchemaItem -->
    <component
        v-if="item.isLayout"
        :is="componentMap[item.component]"
        v-bind="item.props"
    >
        <!-- 如果布局组件有 label（如 Card 的标题），可以通过 slot 传入，这里简单处理 -->
        <template #header v-if="item.label">
            {{ item.label }}
        </template>

        <!-- 🔥 核心递归：遍历子节点，组件自己调用自己 -->
        <SchemaItem
            v-for="child in item.children"
            :key="child.key || child.field"
            :item="child"
            :model="model"
        />
    </component>

    <!-- 分支 2：普通表单项（如 Input, Select） -->
    <!-- 逻辑：使用 v-else-if 确保逻辑互斥 -->
    <!-- 如果没定义 showIf，或者 showIf(model) 返回 true，则显示 -->
    <el-form-item
        v-else-if="!item.showIf || item.showIf(model)"
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

<script setup>
import { shallowRef } from 'vue';
// 引入需要的组件
import { ElInput, ElSelect, ElSwitch, ElOption, ElCard, ElRow, ElCol } from 'element-plus';

// 定义组件名称，方便递归调试
defineOptions({
    name: 'SchemaItem'
});

const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    model: {
        type: Object,
        required: true
    }
});

// 组件映射表（Component Map）
// 作用：将 JSON 里的字符串 'Input' 映射为真实的组件对象
// 使用 shallowRef 优化性能（组件对象不需要深层响应式）
const componentMap = shallowRef({
    Input: ElInput,
    Select: ElSelect,
    Switch: ElSwitch,
    Card: ElCard, // 布局组件映射
    Row: ElRow,
    Col: ElCol
    // 这里可以无限扩展：DatePicker, Upload, RichText...
});
</script>

<style scoped>
.el-card {
    margin-bottom: 20px;
}
</style>