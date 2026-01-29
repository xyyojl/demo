<template>
    <div :class="switchClass" @click="handleClick">
        <div class="switch__handle"></div>
    </div>
</template>

<script>
/* 
实现需求：el-switch开关组件
- 状态：开/关
- 交互：点击切换状态
*/
export default {
  name: 'ElSwitch',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  computed: {
    switchClass() {
       return {
        switch: true,
        'switch--closed': !this.modelValue
       };
    }
  },
  methods: {
    handleClick() {
        this.$emit('update:modelValue', !this.modelValue);
    }
  }
}
</script>

<style scoped>
.switch {
    width: 28px;
    height: 16px;
    border-radius: 100px;
    background: #1890ff;
    cursor: pointer;
}
.switch--closed {
    background: rgba(0, 0, 0, 0.25);
}
.switch--closed .switch__handle {
    left: 14px;
}
.switch__handle {
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    position: relative;
    left: 2px;
    top: 2px;
    transition: .2s;
}
</style>
