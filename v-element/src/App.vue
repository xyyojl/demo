<template>
  <main>
    <Button type="primary" plain disabled ref="buttonRef">Test Button</Button>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Button from '@/components/Button/Button.vue';
import type { ButtonInstance } from '@/components/Button/types';
const buttonRef = ref<ButtonInstance | null>(null);

onMounted(() => {
  if (buttonRef.value) {
    console.log('buttonRef', buttonRef.value.ref);
  }
})
</script>

<style scoped></style>
