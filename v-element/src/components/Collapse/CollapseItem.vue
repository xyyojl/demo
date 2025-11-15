<template>
  <div
    class="vk-collapse-item"
    :class="{
      'is-disabled': disabled
    }"
  >
    <div
      class="vk-collapse-item__header"
      :class="{
        'is-disabled': disabled,
        'is-active': isActive
      }"
      :id="`item-header-${name}`"
      @click="handleClick"
    >
      <slot name="title">{{ title }}</slot>
    </div>
    <Transition name="slide" v-on="transitionEvents">
      <div class="vk-collapse-item__content" :id="`item-content-${name}`" v-show="isActive">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { collapseContextKey } from './types';
import type { CollapseItemProps } from './types';
defineOptions({
  name: 'vkCollapseItem'
});
const props = defineProps<CollapseItemProps>();
const collapseContext = inject(collapseContextKey);
const isActive = computed(() => collapseContext?.activeNames.value.includes(props.name));
const handleClick = () => {
  if (props.disabled) return;
  collapseContext?.handleItemClick(props.name);
};
const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  beforeEnter(el) {
    el.style.height = '0px';
  },
  enter(el) {
    el.style.height = `${el.scrollHeight}px`;
  },
  afterEnter(el) {
    el.style.height = '';
  },
  beforeLeave(el) {
    el.style.height = `${el.scrollHeight}px`;
  },
  leave(el) {
    el.style.height = '0px';
  },
  afterLeave(el) {
    el.style.height = '';
  }
};
</script>

<style scoped></style>
