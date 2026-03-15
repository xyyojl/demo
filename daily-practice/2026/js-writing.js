// 防抖（Debounce）
function debounce(fn, delay) {
    let timer = null; // 维护一个定时器
    return function(...args) { // 使用 ...args 接收所有参数
        // 【核心动作】如果此时已经有定时器了，说明在 delay 时间内又触发了
        // 必须立刻清除掉之前的定时器，重新开始计时！
        if (timer) {
            clearTimeout(timer);
        }
        // 设定一个新的定时器
        timer = setTimeout(() => {
            fn.apply(this, args); // 箭头函数没有自己的 this，这里的 this 指向返回的匿名函数的 this
        }, delay);
    }
}
/* 
【防抖原理解析】
作用：高频触发的事件，在指定的间隔时间内只执行最后一次。如果在这个时间内又触发了，则重新计时。
适用场景：搜索框联想、窗口 resize 防抖、频繁点击按钮。
*/

// 节流（Throttle）
function throttle(fn, delay) {
    let lastTime = 0; // 记录上一次执行的时间
    return function (...args) {
        let now = Date.now();
        // 如果当前时间距离上一次执行时间超过了设定的 delay，才放行执行
        if (now - lastTime >= delay) {
            lastTime = now;
            fn.apply(this, args);
        }
    }
}
/* 
【节流原理解析】
作用：高频触发的事件，在指定的单位时间内，只允许真正的处理函数执行一次。
适用场景：页面滚动（scroll）加载、鼠标移动（mousemove）、拖拽等持续连贯触发的操作。
*/

// 深拷贝（Deep Clone）- 解决循环引用
function deepClone(obj, hash = new WeakMap()) {
    // 1. 如果是基本数据类型（或 null），直接返回
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // 2. 查表（解决循环引用）：如果在 hash 字典中查到了该对象，直接返回存好的引用
    if (hash.has(obj)) return hash.get(obj);

    // 3. 根据原对象的类型（数组 or 对象）初始化新容器
    const cloneTarget = Array.isArray(obj) ? [] : {};
    
    // 4. 【核心一步】在递归拷贝属性之前，必须先把当前正在拷贝的对象存入 hash！
    hash.set(obj, cloneTarget);

    // 5. 递归遍历拷贝
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloneTarget[key] = deepClone(obj[key], hash);
        }
    }
    return cloneTarget;
}
/* 
【深拷贝原理解析】
为什么用 WeakMap？如果不记录被拷贝过的对象，当遇到 obj.self = obj 这种自循环引用时，递归会陷入无限死循环报错。
把传入的对象作为 key 塞进 WeakMap 中，下次遇到它直接提走缓存的新对象即可。WeakMap 是弱引用，不会造成原对象内存泄漏。
*/

// 手写原生 Promise.all
function myPromiseAll(promises) {
    return new Promise((resolve, reject) => {
        // 判断参数是否为可迭代对象
        if (!promises || typeof promises[Symbol.iterator] !== 'function') {
            return reject(new TypeError('Argument is not iterable'));
        }

        const result = []; // 存放结果的数组
        let count = 0;     // 记录成功 resolve 的个数
        const arr = Array.from(promises); // 转换为真实数组方便获取 length

        if (arr.length === 0) return resolve(result); // 为空直接返回

        for (let i = 0; i < arr.length; i++) {
            // 用 Promise.resolve 包一层，兼容传入的数组里有非 Promise 的普通值
            Promise.resolve(arr[i])
                .then(res => {
                    result[i] = res; // 必须按照 i 对应的原顺序存放结果
                    count++;
                    // 全部成功了才整体 resolve
                    if (count === arr.length) {
                        resolve(result);
                    }
                })
                .catch(err => {
                    // 只要有一个失败，就整体 reject（短路）
                    reject(err);
                });
        }
    });
}
/* 
【Promise.all 原理解析】
核心是通过计数器 count 来判断是否所有的 Promise 都成功了。
难点：
1. 结果数组中的顺序必须和传入的一致，所以不能用 `push`，只能用 `result[i] = res`。
2. 里面可能是普通值（比如 1, 2, 'a'），需要用 `Promise.resolve` 强行包裹转换为 Promise 才能统一 `then`。
*/

// 手写 new 操作符
function myNew(Constructor, ...args) {
    // 1. 校验 Constructor 是否为函数
    if (typeof Constructor !== 'function') {
        throw new TypeError('Constructor must be a function');
    }

    // 2. [核心1] 使用 Object.create 创建一个新对象，并将隐式原型指向构造函数的显示原型
    const obj = Object.create(Constructor.prototype);

    // 3. [核心2] 把新创建的对象绑定到 this，并执行构造函数
    const result = Constructor.apply(obj, args);

    // 4. [核心3] 判断返回值。如果构造函数人为返回了一个引用类型（对象或函数），则直接返回它；否则返回我们新建的 obj
    if (result !== null && (typeof result === 'object' || typeof result === 'function')) {
        return result;
    }
    return obj;
}

// 数组扁平化（Flat）- 控制深度版
function flattenArray(arr, depth = 1) {
    // 若层级大于0则继续展开
    if (depth > 0) {
        return arr.reduce((acc, current) => {
            // 若当前项还是数组，则递归调用自身，并且 depth - 1
            if (Array.isArray(current)) {
                return acc.concat(flattenArray(current, depth - 1));
            }
            return acc.concat(current);
        }, []);
    }
    // 深度等于0时直接浅拷贝返回
    return arr.slice();
}
// （补充简化版：如果不要求指定深度、即无限扁平化）
// const infiniteFlat = arr => arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) ? infiniteFlat(cur) : cur), []);
/* 
【数组扁平化解析】
核心：reduce 累加器配合 concat 拼接。内部判断如果是数组就递归。
*/

// 数组去重（Unique）
// 方法一：现代最强 ES6 Set（推荐，一行代码）
function uniqueArray(arr) {
    return Array.from(new Set(arr));
    // 或简写为: return [...new Set(arr)];
}

// 方法二：ES5 通用做法（利用 indexOf）
function uniqueArrayOldSchool(arr) {
    const res = [];
    for (let i = 0; i < arr.length; i++) {
        // 如果结果数组里还没收录这个元素，就放进去
        if (res.indexOf(arr[i]) === -1) {
            res.push(arr[i]);
        }
    }
    return res;
}