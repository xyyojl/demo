// 手写 useCounter (Composable)
import { ref } from 'vue';

/**
 * 封装计数器逻辑
 * @param {number} initialValue 初始值，默认为 0
 */
export function useCounter(initialValue = 0) {
    // 1. 定义响应式数据（State）
    const count = ref(initialValue);

    // 2. 定义修改数据的方法（Actions）
    const increment = () => {
        count.value++;
    }
    const decrement = () => {
        count.value--;
    }
    const reset = () => {
        count.value = initialValue;
    }

    // 3. 【关键】将数据和方法暴露出去
    return {
        count,
        increment,
        decrement,
        reset
    };
};