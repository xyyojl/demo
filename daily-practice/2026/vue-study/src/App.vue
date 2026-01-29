<template>
  <h2>hello vue</h2>
  <ElRate v-model="value1" /> {{ value1 }}
  <ElRate v-model="value2" :max="6" /> {{ value2 }}
  <ElSwitch v-model="value3" /> {{ value3 ? '开' : '关' }}
  <ElSwitch v-model="value4" /> {{ value4 ? '开' : '关' }}
</template>

<script>
import ElRate from './components/ElRate.vue';
import ElSwitch from './components/ElSwitch.vue';
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
    ElSwitch
  }
}
</script>

<style scoped></style>
