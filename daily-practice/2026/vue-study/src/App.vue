<template>
  <!-- <h2>hello vue</h2>
  <ElRate v-model="value1" /> {{ value1 }}
  <ElRate v-model="value2" :max="6" /> {{ value2 }}
  <ElSwitch v-model="value3" /> {{ value3 ? '开' : '关' }}
  <ElSwitch v-model="value4" /> {{ value4 ? '开' : '关' }}
  <h2>函数防抖指令</h2>
  <input v-debouncing="handleChange" type="text">
  <h2>el-badge徽章组件</h2> -->
  <!-- <el-badge :value="12">徽章</el-badge> -->
  <!-- <el-badge :value="5" type="primary">徽章</el-badge> -->
  <router-view></router-view>
</template>

<script>
import ElRate from './components/ElRate.vue';
import ElSwitch from './components/ElSwitch.vue';
import ElBadge from './components/ElBadge.vue';
export default {
  name: 'App',
  data() {
    return {
      value1: 0,
      value2: 3,
      value3: true,
      value4: false
    }
  },
  components: {
    ElRate,
    ElSwitch,
    ElBadge
  },
  methods: {
    handleChange() {
      console.log(123);
    }
  },
  directives: {
    debouncing(el, binding) {
      let timer;
      el.oninput = function() {
        clearTimeout(timer);
        timer = setTimeout(binding.value, 200);
      }
    }
  }
}
</script>

<style scoped></style>
