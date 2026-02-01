<template>
    <button class="el-badge">
        <slot></slot>
        <span :class="{'el-badge-num': true, [`el-badge-${type}`]: type }">{{ value }}</span>
    </button>
</template>

<script setup>
defineProps({
    value: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: 'danger'
    }
});
</script>

<style scoped>
.el-badge {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    line-height: 1;
    height: 32px;
    white-space: nowrap;
    cursor: pointer;
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
    border-color: #dcdfe6;;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    transition: .1s;
    font-weight: 500;
    user-select: none;
    vertical-align: middle;
    padding: 8px 15px;
    font-size: 14px;
    border-radius: 4px;
    position: relative;
}
.el-badge-num {
    position: absolute;
    right: -10px;
    top: -10px;
    color: white;
    border-radius: 10px;
    padding: 3px 5px;
}
.el-badge-primary {
    background: blue;
}
.el-badge-danger {
    background: red;
}
</style>