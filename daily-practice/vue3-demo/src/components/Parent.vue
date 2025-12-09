<template>
    <div class="parent">
        <h1>父组件值：{{ text }}</h1>
        <Child v-model="text" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Child from './Child.vue';

const text = ref('Hello Vue 3');
</script>