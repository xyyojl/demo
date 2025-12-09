import { reactive, inject } from "vue";

// 创建一个唯一 Key，用于 provide/inject
const piniaSymbol = Symbol('pinia');

/**
 * 1. createPinia
 * 作用：创建一个全局的 Pinia 实例，并安装到 Vue App 中
 */
export function createPinia() {
    const pinia = {
        // 核心：用来存放所有的 store（id -> store）
        // 使用 Map 是为了方便管理，且比 Object 更纯净
        _s: new Map(),

        // Vue 插件必须有的 install 方法
        install(app) {
            // 通过 provide 注入全局，这样在任何组件里的 useStore 都能拿到这个 pinia 实例
            app.provide(piniaSymbol, pinia);
        }
    };
    return pinia;
}

/**
 * 2. defineStore
 * 作用：定义一个 Store，返回 useStore 函数
 * @param {string} id 唯一标识
 * @param {Object} options 配置项 { state, actions, getters }
 */
export function defineStore(id, options) {
    // 返回一个函数（即 useStore）
    return function useStore() {
        // 2.1 获取全局 pinia 实例
        const pinia = inject(piniaSymbol);

        // 2.2 单例模式：如果这个 store 已经创建过，直接返回
        if (pinia._s.has(id)) {
            return pinia._s.get(id);
        }

        // 2.3 初始化：如果没有，就开始创建
        const { state, actions } = options;

        // 【核心】将 state 变成响应式对象
        const store = reactive({
            ...state() // 执行 state 函数拿到原始对象
        });

        // 【核心】处理 actions
        // 遍历 actions，将他们挂载到 store 上，并强制绑定 this 指向 store
        for (const key in actions) {
            store[key] = actions[key].bind(store);
        }

        // 2.4 存入全局注册表
        pinia._s.set(id, store);

        return store;
    }
}

/**
 * Pinia 的核心原理其实就是：全局的一个 Map 对象（存所有的 store），配合 Vue 的 reactive 做响应式，再通过 provide/inject 让全应用访问。
 * 三个核心逻辑
 * 1. 为什么 state 必须是一个函数？
 * 和 Vue 组件里的 data 一样。为了防止引用污染。如果是对象，服务端渲染（SSR）或者多个实例之间可能会共用同一个状态对象。用函数返回新对象，能保证每次创建都是独立的。
 * 
 * 2. actions 是怎么绑定 this 的？
 * 在我的代码里，我遍历了 actions 对象。通过 actions[key].bind(store) 强制把函数的 this 指向了响应式的 store 对象。
 * 这就是为什么我们在 Pinia 的 action 里可以直接写 this.count++ 的原因。
 * 
 * 3. 怎么保证全局单例？
 * 利用了 Vue 的 provide/inject 机制。createPinia 在根组件注入了全局唯一的 pinia 实例。defineStore 返回的 useStore 函数在执行时，
 * 会先去这个全局实例的 Map(_s) 里查。查到了就直接返回，没查到才创建。这就是享元模式或单例模式的应用。
 */