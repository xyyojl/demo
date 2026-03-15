/* 
防抖（Debounce） 与 节流（Throttle） （必须闭着眼写对）。
深拷贝（Deep Clone） （要能处理循环引用 WeakMap）。
手写原生 Promise.all （高频考点，考察异步并发控制）。
手写 new 操作符。
数组扁平化（Flat） 或 数组去重。
*/

function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}

function throttle(fn, delay) {
    let lastTime = 0;
    return function(...args) {
        let now = Date.now();
        if (now - lastTime >= delay) {
            lastTime = now;
            fn.apply(this, args);
        }
    }
}

/* 
对于防抖和节流的疑问：
1. 返回的匿名函数为什么要有 ...args？
简单回答：为了不弄丢浏览器（或业务代码）传给原始函数的“参数”。
深度解析：
在实际开发中，防抖和节流最常用于处理 DOM 事件（比如点击、输入、滚动）。
当我们将一个函数绑定给 DOM 事件时，浏览器会自动给这个函数传递一个 事件对象（Event 对象）。

2. 为什么要绑定 this 和参数？
简单回答：为了保证你的业务函数在被延迟执行时，它的“执行上下文（this）”依然指向触发事件的那个 DOM 元素本身。
深度解析：
在 JS 中，谁调用了函数，函数里的 this 就指向谁。
在 DOM 事件中，事件处理函数里的 this 默认指向绑定该事件的 DOM 元素。
 */
