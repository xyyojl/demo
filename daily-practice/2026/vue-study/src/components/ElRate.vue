<template>
    <ul class="rate">
        <li
            v-for="index in max"
            :key="index"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave()"
            @click="handleClick(index)"
        >
            <i :class="rateClass(index)"></i>
        </li>
    </ul>
</template>

<script>
/* 
实现需求：el-rate评分组件
- 最大分值
- 选中分值
- 事件交互
*/
import '@/assets/iconfont/iconfont.css';
export default {
  name: 'ElRate',
  props: {
    max: {
        type: Number,
        default: 5
    },
    modelValue: {
        type: Number,
        default: 0
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
        initValue: this.modelValue
    }
  },
  methods: {
    rateClass(index) {
        return {
            iconfont: true,
            'icon-xingxing': true,
            'active': this.modelValue >= index
        }
    },
    handleMouseEnter(index) {
        this.$emit('update:modelValue', index);
    },
    handleMouseLeave() {
        this.$emit('update:modelValue', this.initValue);
    },
    handleClick(index) {
        this.$emit('update:modelValue', index);
        this.initValue = index;
    }
  }
}
</script>

<style scoped>
.rate {
    display: flex;
    list-style: none;
}
.rate i {
    font-size: 30px;
    color: #ccc;
}
.rate .active {
    color: #ff9800;
}

</style>
