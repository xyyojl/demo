// 题目1
/* console.log('start');

setTimeout(() => {
    console.log('children2');

    setTimeout(function () {
        console.log('children8');
    }, 0);

    Promise.resolve().then(() => {
        console.log('children3');
    })

}, 0);

new Promise(function (resolve, reject) {
    console.log('children4');

    setTimeout(function () {
        console.log('children5');
        resolve('children6')

    }, 0);

}).then((res) => {
    console.log('children7');
    setTimeout(() => { console.log(res); }, 0)
}); */
/* 
输出：
start
children4
children2
children3
children5
children7
children8
children6

Promise 的 .then 回调进入微任务队列只有两种情况：
1. 如果 Promise 已经是 Resolved 状态（比如 Promise.resolve().then(...)）：代码执行到 .then 这一行时，回调立刻进入微任务队列
2. 如果 Promise 是 Pending 状态（比如本题）：代码执行到 .then 时只注册不入队。直到 resolve() 被调用那一刻，回调才会被放入微任务队列

*/

// 题目2
/* Promise.resolve().then(() => {
    console.log(1);
}).catch(() => {
    console.log(2);
}).then(() => {
    console.log(3);
}); */
/* 
输出：
1
3
注：Promise 的 .then 回调如果没有显式 return，默认会返回 undefined（即 resolved 状态），所以链式调用会继续下去，后面的 then 都会执行。
*/

// 题目3
/* Promise.resolve().then(() => {
    console.log(1);
    throw new Error('error1');
}).catch(() => {
    console.log(2);
}).then(() => {
    console.log(3);
}); */
/* 
输出：
1
2
3
*/

// 题目4
/* Promise.resolve().then(() => {
    console.log(1);
    throw new Error('error1');
}).catch(() => {
    console.log(2);
}).catch(() => { // 这里是 catch
    console.log(3);
}); */
/* 
输出：
1
2
*/

// 题目5
/* async function fn() {
    return 100;
}
(async function() {
    const a = fn();
    const b = await fn();
    console.log('a', a);
    console.log('b', b);
})(); */
/* 
输出：
a Promise {<fulfilled>: 100}
b 100

核心规则：async 函数永远返回一个 Promise
即使你写的是 return 100（一个普通数值），JS 引擎内部会自动把它包装成 Promise.resolve(100)

调用了 fn()，并且使用了 await
await 会暂停当前代码的执行，等待 fn() 返回的 Promise 变为 fulfilled
一旦成功，await 会拆包，取出 Promise 内部的 resolve 值（也就是 100）


这道题考察了 async/await 的本质：
async 函数总是返回 Promise。所以变量 a 接收到的是一个 Promise 对象。
await 操作符的作用是‘解包’。它等待 Promise 完成并提取其中的 resolve 值。所以变量 b 接收到的是数字 100。
*/

// 题目6
/* (async function() {
    console.log('start');
    const a = await 100;
    console.log('a', a);
    const b = await Promise.resolve(200);
    console.log('b', b);
    const c = await Promise.reject(300);
    console.log('c', c);
    console.log('end');
})(); */
/* 
输出：
start
a 100
b 200
（报错）Uncaught (in promise) 300

考点总结：
1. await 的转化：await 100 会转化为 Promise.resolve(100)，这是基础
2. await 的报错机制（中带你）：await 遇到 reject 会抛错并中断代码
*/
/* 
// 代码注释
(async function() {
    console.log('start'); // 1. 同步代码，立即输出 'start'
    const a = await 100;
    // 2. await 将 100 包装为 Promise.resolve(100)
    // 放入微任务队列。本轮宏任务结束，微任务执行
    // a 拿到值 100
    console.log('a', a);
    // 3. 输出 a 100
    const b = await Promise.resolve(200);
    // 4. 等待 Promise.resolve
    // b 拿到值 200
    console.log('b', b);
    // 5. 输出 b 200
    const c = await Promise.reject(300);
    // 机制： 当 await 后面跟的是一个 Rejected（失败）状态的 Promise 时，await 表达式会抛出一个异常（Throw Error）
    console.log('c', c); // ❌ 已经被中断，不执行
    console.log('end'); // ❌ 已经被中断，不执行
})();
*/

// 题目7
/* console.log(100);
setTimeout(() => {
    console.log(200);
});
Promise.resolve().then(() => {
    console.log(300);
});
console.log(400); */
/* 
输出：
100
400
300
200
*/

// 题目8
/* async function async1 () {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2 () {
    console.log('async2');
}
console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0);

async1();

new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
})
console.log('script end'); */
/* 
输出：
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
*/
// 带注释
/* async function async1 () {
    console.log('async1 start');
    await async2();
    // await 后面的都作为回调内容 ———— 微任务
    console.log('async1 end');
}
async function async2 () {
    console.log('async2');
}
console.log('script start');

setTimeout(function() { // 宏任务 setTimeout
    console.log('setTimeout');
}, 0);

async1();

// 初始化 Promise 时，传入的函数会立刻被执行
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() { // 微任务
    console.log('promise2');
})
console.log('script end'); */
/* 
核心考点总结
1. async/await 的转化
    async 函数中的 await 之前的代码是同步执行的。
    await 之后的代码，本质上是被放入了 Promise.then 中，属于微任务
    由于 async1() 先调用，所以它的微任务先进入队列
2. Promise 的构造函数：
    new Promise(fn) 中的 fn 是同步执行的
    .then() 才是异步微任务
3. 优先级
    同步代码 > 微任务（process.nextTick,Promise,await）> 宏任务（setTimeout，setInterval）

*/

