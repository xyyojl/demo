/* console.log('start')

setTimeout(() => {
    console.log('setTimeout')
}, 0)

Promise.resolve()
    .then(() => {
        console.log('promise1')
    })
    .then(() => {
        console.log('promise2')
    })

console.log('end') */

/*
输出：
start
end
promise1
promise2
setTimeout
*/


// myNew
/* 
尝试手写下面的，并且不看资料。
懂就是懂，不懂就不懂。不要不懂装懂。
1. myNew
2. debounce
3. flat
4. deepClone (带 WeakMap)
5. Promise.all
6. Scheduler (并发调度)
*/

/* 
实现思路
1. 创建一个新对象，并将其 __proto__ 链接到构造函数的 prototype
2. 执行构造函数，绑定 this
3. 处理返回值
如果构造函数返回的是对象或函数，则返回该结果；否则返回新创建的 obj
注意：null 也是 object，但需要排除
注意：res 判断条件
*/

/* function myNew(Constructor, ...args) {
    const obj = Object.create(Constructor.prototype);
    const res = Constructor.apply(obj, args);
    if (res && (typeof res === 'object' || typeof res === 'function')) {
        return res;
    }
    return obj;
} */

/* 
实现思路：
1. 利用闭包保存定时器
2. 返回一个新函数
3. 保存当前的 this（Context）
4. 如果定时器存在，说明还没到时间又触发了，赶紧清空之前的
5. 重新设置定时器
6. 执行函数，利用 apply 修正 this 指向，并传递参数

如果我希望按钮点击后立刻触发一次，然后后续连续点击才防抖（比如点赞功能），怎么修改？
思路： 加一个 immediate 参数。
判断： if (immediate && !timer) -> 立刻执行。
*/
/* 
为什么 debounce 里要用 fn.apply(context, args)？
是为了还原函数原本的执行环境。
1. 关于 this：防抖函数返回的闭包在运行时，this 通常指向 DOM 元素或组件实例；但如果不通过 apply 显示绑定，
在 setTimeout 异步执行时，原函数内的 this 会丢失（变成 window 或 undefined）
2. 关于参数：事件触发时会传递 event 等参数，我们需要通过 apply 把这些参数原封不动地透传给原函数，
否则业务代码会拿不到参数。
所以，apply 保证了加上防抖后的函数，在行为上和原函数保持完全一致。
防抖函数（dedounce）只是一个“代理”，它必须保证原函数（fn）执行时的环境（this）和参数（arguments）与不加防抖时一模一样，只是时间推迟了。
*/
/* function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        const context = this;
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    }
} */

// 有错误的版本
/* function flat(arr, depth) { // 没有默认值
    if (depth <= 0) arr.slice(); // 😱 并没有 return！
    return arr.reduce((acc, curr) => {
        if (Array.isArray(curr)) {
            acc.push(...flat(curr, depth - 1));
        } else {
            acc.push(curr);
        }
        return acc;
    }, []);
} */
/* function flat(arr, depth = 1) {
    if (depth <= 0) return arr.slice();
    return arr.reduce((acc, curr) => {
        if (Array.isArray(curr)) {
            acc.push(...flat(curr, depth - 1));
        } else {
            acc.push(curr);
        }
        return acc;
    }, []);
} */

/* 
深拷贝
核心：递归 + WeakMap
关键点：先查 WeakMap，如果有直接返回；没有再创建，先登记、再递归
面试官可能会问：同学，你这个 for...in 循环，如果对象里有 Symbol 类型的 key，是不是丢了？
是的，for...in 无法遍历 Symbol。如果需要支持 Symbol，可以使用 Reflect.ownKeys(target) 来替代 for...in循环。
但在常规业务场景下，这个版本已经够用了。
*/
/* function deepClone(target, map = new WeakMap()) {
    if (typeof target !== 'object' || target === null) return target;
    if (map.has(target)) return map.get(target);
    
    const cloneTarget = Array.isArray(target) ? [] : {};
    map.set(target, cloneTarget);

    for (const key in target) {
        if (target.hasOwnProperty(key)) {
            cloneTarget[key] = deepClone(target[key], map);
        }
    }
    return cloneTarget;
} */

// 有错误的版本
// 这个错误非常典型，通常是因为写顺手了，习惯性敲了 const。
/* function myPromiseAll(iterable) {
    return new Promise((resolve, reject) => {
        const promises = Array.from(iterable);
        const len = promises.length;
        const res = [];
        const count = 0; // ❌ 致命错误：Const 变量无法修改
        if (len === 0) return resolve([]);

        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                (value) => {
                    res[index] = value;
                    count++;
                    if (count === len) {
                        resolve(res);
                    }
                },
                (reason) => {
                    reject(reason);
                }
            )
        })
    });
}; */

// 正确的版本
/* function myPromiseAll(iterable) {
    return new Promise((resolve, reject) => {
        const promises = Array.from(iterable);
        const len = promises.length;
        const res = [];
        let count = 0;

        if (len === 0) return resolve([]);
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                (value) => {
                    res[index] = value;
                    count++;
                    if (count === len) {
                        resolve(res);
                    }
                },
                (reason) => {
                    reject(reason);
                }
            )
        });
    });
} */


/* 
并发调度器 Scheduler（终极 Boss）
题目描述：
实现一个 Scheduler 类，完成 add 方法。要求：同时进行的异步任务最多 2 个。
add 返回一个 Promise，当任务执行完时，Promise 变为 resolved。

核心逻辑：
1. 待办队列：没位置时，把任务存进 queue 数组
2. 正在运行数：用 runCount 记录当前有几个在跑
3. 递归调用：一个任务跑完（finally）后，runCount--，并从 queue 里取下一个任务跑

亮点：
1. 队列机制：push 入队，shift 出队，标准操作
2. 递归驱动：在 .then 里调用 this.run()，这是实现持续调度的关键，你写对了
3. 工厂函数：createPromise 包装得很对，没有立刻执行 Promise，而是存了函数进队列
*/

// 评分：85分
// 有错误的版本
/* class Scheduler {
    constructor (limit) {
        this.limit = limit;
        this.queue = [];
        this.runCount = 0;
    }
    add(time, order) {
        const createPromise = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(order);
                    resolve();
                }, time);
            })
        }

        this.queue.push(createPromise);

        this.run();
    }
    run() {
        // 跟限制个数有关
        if (this.runCount >= 2 || this.queue.length === 0) { // ❌ 唯一扣分点：写死了并发数
            return;
        }
        // 出队列，执行
        const p = this.queue.shift();
        this.runCount++;

        p().then(() => {
            this.runCount--;
            this.run();
        })
        
    }
} */

// 带注释的版本
/* class Scheduler {
    constructor(limit) {
        this.limit = limit; // 最大并发数
        this.queue = []; // 排队队列
        this.runCount = 0; // 当前正在运行的任务数
    }

    add(time, order) {
        // 这里的工厂函数是模拟异步任务，实际中可能是 fetch
        const promiseCreator = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(order);
                    resolve();
                }, time);
            });
        };

        // 把任务加进队列
        this.queue.push(promiseCreator);

        // 尝试运行
        this.run();
    }

    run() {
        // 如果正在运行的大于限制，或者队列空了，就停
        if (this.runCount >= this.limit || this.queue.length === 0) {
            return;
        }

        // 取出队头任务
        const task = this.queue.shift();
        this.runCount++;

        // 执行任务
        task().then(() => {
            // 任务完成
            this.runCount--;
            // 【关键】递归触发下一个
            this.run();
        });
    }
} */

/* class Scheduler {
    constructor(limit) {
        this.limit = limit;
        this.queue = [];
        this.runCount = 0;
    }
    add(time, order) {
        const promiseCreator = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(order);
                    resolve();
                }, time);
            })
        };

        this.queue.push(promiseCreator);

        this.run();
    }
    run() {
        if (this.runCount >= this.limit || this.queue.length === 0) {
            return;
        }

        const task = this.queue.shift();
        this.runCount++;

        task().then(() => {
            this.runCount--;
            this.run();
        })
    }
}

// --- 自测 ---
const scheduler = new Scheduler(2); // 最多 2 个并发
const addTask = (time, order) => {
    scheduler.add(time, order);
};

// 预想输出：2, 3, 1, 4
addTask(1000, '1'); // 任务1：耗时 1s
addTask(500, '2'); // 任务2：耗时 0.5s
addTask(300, '3'); // 任务3：耗时 0.3s
addTask(400, '4'); // 任务4：耗时 0.4s */