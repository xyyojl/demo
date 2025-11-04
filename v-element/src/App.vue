<template>
  <main>
    <Button ref="buttonRef">Test Button</Button>
    <Button plain>Plain Button</Button>
    <Button round>Round Button</Button>
    <Button circle>VK</Button>
    <Button disabled>Disabled Button</Button>
    <br><br>
    <Button type="primary">Primary</Button>
    <Button type="success">Success</Button>
    <Button type="info">Info</Button>
    <Button type="warning">Warning</Button>
    <Button type="danger">Danger</Button>
    <br><br>
    <Button type="primary" plain>Primary</Button>
    <Button type="success" plain>Success</Button>
    <Button type="info" plain>Info</Button>
    <Button type="warning" plain>Warning</Button>
    <Button type="danger" plain>Danger</Button>
    <br><br>
    <Button size="large">Large</Button>
    <Button size="small">Small</Button>
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
