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

    <Collapse v-model="openedValue">
      <CollapseItem name="a" title="Title A">
        <h1>headline title</h1>
        <div> this is content a aaa </div>
      </CollapseItem>
      <CollapseItem name="b" title="Title B">
        <div> this is bbbbb test </div>
      </CollapseItem>
      <CollapseItem name="c" title="Disabled Title C" disabled>
        <div> this is cccc test </div>
      </CollapseItem>
    </Collapse>
    {{ openedValue }}
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Button from '@/components/Button/Button.vue';
import Collapse from '@/components/Collapse/Collapse.vue';
import CollapseItem from '@/components/Collapse/CollapseItem.vue';
import type { ButtonInstance } from '@/components/Button/types';
const buttonRef = ref<ButtonInstance | null>(null);
const openedValue = ref(['a']);
onMounted(() => {
  if (buttonRef.value) {
    console.log('buttonRef', buttonRef.value.ref);
  }
});
setTimeout(() => {
  openedValue.value = ['a', 'b'];
}, 2000);
</script>

<style scoped></style>
