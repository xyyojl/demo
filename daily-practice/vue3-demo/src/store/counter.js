import { defineStore } from '@/utils/mini-pinia';

export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: 0
    }),
    actions: {
        increment() {
            // 这里的 this 已经被 bind 指向了响应式的 store
            this.count++;
        }
    }
});
