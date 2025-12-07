// 手写简易 Hash Router
// 这是面试中考察你对 SPA（单页应用）底层原理 理解程度的必考题。
// Hash Router 的核心非常简单，就靠一个原生事件：window.onhashchange。
// class HashRouter {
//     constructor() {
//         // 1. 路由表：存放 path -> callback 的映射
//         this.routes = {};
//         // 2. 当前 URL 状态
//         this.currentUrl = '';
        
//         // 3. 绑定 this（防止监听事件时丢失 this）
//         this.refresh = this.refresh.bind(this);

//         // 4. 监听事件
//         // load：页面第一次加载时触发（处理用户直接输入带 # 的 URL）
//         window.addEventListener('load', this.refresh);
//         // hashchange：URL 的 # 后面变化时触发
//         window.addEventListener('hashchange', this.refresh);
//     }
//     /**
//      * 注册路由
//      * @param {string} path 路径 (如 '/home')
//      * @param {Function} callback 渲染回调
//      */
//     route(path, callback) {
//         this.routes[path] = callback;
//     }

//     /**
//      * 核心逻辑：根据当前 Hash 刷新页面
//      */
//     refresh() {
//         // 获取 # 后面的路径（去掉 # 号）
//         // 如果没有 hash，默认为 '/'
//         this.currentUrl = location.hash.slice(1) || '/';

//         // 查找路由表中对应的回调函数
//         const callback = this.routes[this.currentUrl];

//         if (callback) {
//             // 执行回调（模拟渲染组件）
//             callback();
//         } else {
//             console.log('404 Not Found');
//         }
//     }
// }

/* 
核心3问
1. 为什么不发请求？
Hash 模式利用了浏览器特性：# 后面的内容（hash）虽然在 URL 里，但不会被发送给服务器。服务器只知道你请求了 index.html
2. 为什么页面不刷新？
修改 location.hash 或点击带 # 的链接，只会产生一条新的历史记录（History Record），并触发 hashchange 事件，浏览器不会重新加载页面
3.Vue Router 是怎么做的？
真实的 Vue Router 会定义一个响应式的 current 变量。当 hashchange 触发时，更新这个变量。由于数据是响应式的，<router-view> 组件
会自动根据新的 current 重新渲染对应的组件，而不仅仅是想上面那样修改 innerHTML。

绑定 this（防止监听事件时丢失 this），这个要怎么理解？
简单来说：类的方法一旦被当做“回调函数”传出去，它就和原来的对象断开联系了。

面试建议：
手写代码时，写 bind 显得你基础扎实（懂 ES5 类）。
写 箭头函数 显得你跟得上时代（懂 ES6+ 新特性）。
两者选其一即可，但如果面试官问“为什么要 bind”，一定要能答出“回调函数导致 this 丢失”这个点。
*/

// 手写简易 History Router
/* 
核心难点在于： 浏览器提供的原生 API history.pushState 不会触发任何事件。
这意味着：当你调用 pushState 修改 URL 时，页面 URL 变了，但代码感知不到，视图不会自己更新。
所以，我们需要手动封装一个 push 方法来同时完成“修改 URL”和“更新视图”两件事。
*/

class HistoryRouter {
    constructor() {
        this.routes = {};
        
        // 绑定 this，防止事件监听时丢失
        this.refresh = this.refresh.bind(this);

        // 1. 监听 popstate 事件
        // 注意：这个事件只有在点击浏览器【前进/后退】按钮时才会触发
        // 调用 pushState 是不会触发它的
        window.addEventListener('popstate', this.refresh);

        // 2. 监听页面首次加载
        window.addEventListener('load', this.refresh);
    }
    
    /**
     * 注册路由
     */
    route(path, callback) {
        this.routes[path] = callback;
    }

    /**
     * 【核心】自定义跳转方法
     * 替代原生的 history.pushState
     */
    push(path) {
        // 1. 修改浏览器 URL（不刷新页面）
        // 参数：state 对象，标题（通常传 null），目标路径
        history.pushState({}, null, path);

        // 2. 【关键】因为 pushState 不触发 popstate
        // 所以我们需要手动调用 refresh 来更新视图
        this.refresh();
    }

    /**
     * 渲染视图逻辑
     */
    refresh() {
        // 获取当前路径（例如 '/about'）
        const path = location.pathname;
        
        const callback = this.routes[path];

        if (callback) {
            callback();
        } else {
            console.log('404 Not Found');
            // 实际项目中这里可能渲染一个 404 组件
        }
    }
}