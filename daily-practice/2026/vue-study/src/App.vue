<template>
  <h2>hello vue</h2>
  <ElRate v-model="value1" /> {{ value1 }}
  <ElRate v-model="value2" :max="6" /> {{ value2 }}
</template>

<script>
import ElRate from './components/ElRate.vue';
export default {
  name: 'App',
  data() {
    return {
      value1: 0,
      value2: 3
    }
  },
  components: {
    ElRate
  }
}
</script>

<style scoped></style>
