<script setup>
import { useCounterStore } from '@/store/counter';
import Parent from '@/components/Parent.vue';

const counter = useCounterStore();
</script>

<template>
  <div>
    <p>数字：{{ counter.count }}</p>
    <button @click="counter.increment">加一</button>

    <Parent />
  </div>
</template>

<style scoped>
</style>
