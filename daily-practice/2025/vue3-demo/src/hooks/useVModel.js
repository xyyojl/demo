import { computed } from 'vue';

/**
 * useVModel
 * @param {Object} props - 组件的 props 对象
 * @param {Object} key - v-model 绑定的名称（默认为 'modelValue'） 
 * @param {Function} emit - 组件的 emit 函数
 */
export function useVModel(props, key = 'modelValue', emit) {
    return computed({
        // 1. 读取拦截：直接返回 props 里的值
        // 这样就保证了数据源是唯一的（来自父组件）
        get() {
            return props[key];
        },

        // 2. 写入拦截：不直接修改 props，而是发出事件
        // 这样符合单向数据流，同时利用 v-model 的语法糖更新父组件
        set(newValue) {
            emit(`update:${key}`, newValue);
        }
    })
};

/**
 * 补充三点
 * 1. 本质：
 * useVModel 的本质就是创建一个可写计算属性 (Writable Computed)。它在中间做了一层代理，把对内部变量的修改，转换成了对外的事件发送。
 * 
 * 2. 解决的痛点
 * 在没有这个 Hook 之前，如果子组件想封装一个 input，我们必须写 :value="props.modelValue" 和 @input="emit('update:modelValue', $event.target.value)"，非常啰嗦。
 * 有了这个 Hook，子组件内部也可以直接用 v-model 了，代码极其简洁。
 * 
 * 3.进阶（VueUse 源码）
 * 在 VueUse 的源码中，为了方便，它甚至可以通过 getCurrentInstance() 自动获取 props 和 emit，连参数都不用传，直接 useVModel(props) 即可。
 * 但在面试中，显示传入 emit 是更函数式、更纯粹的写法。
 */