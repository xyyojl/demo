// 20 道 async/await + Promise + setTimeout 的混合输出题（看代码说结果）
// 不要只靠脑子想，拿纸笔把任务队列画出来！

// 题目1
/* const promise = new Promise((resolve, reject) => {
    console.log(1)
    console.log(2)
})
promise.then(() => {
    console.log(3)
})
console.log(4) */
/* 
输出顺序：1 2 4
注：promise.then() 注册了一个回调函数，但因为 executor 函数没有调用 resolve 或 reject，
所以 Promise 永远处于 pending 状态，回调函数不会被执行，所以不会打印 3。
这是这道题的核心考点：Promise 的状态机制。
.then(() => { console.log(3) }) 里的回调函数，只有在 Promise 状态变为 fulfilled 时，才会被加入到 微任务队列 中。
*/

// 题目2
/* const promise = new Promise((resolve, reject) => {
    console.log(1)
    setTimeout(() => {
        console.log('timerStart')
        resolve('success')
        console.log('timerEnd')
    }, 0)
    console.log(2)
})
promise.then((res) => {
    console.log(res)
})
console.log(4) */

/* 
输出：
1
2
4
timerStart
timerEnd
success
setTimeout 回调开始执行，打印 timerStart。此时调用 resolve 函数，但 Promise.then 回调也是异步的，
所以不会立刻调用 then 函数，而是放入微任务队列。代码继续执行，打印 timerEnd。
*/

// 题目3
/* console.log('start')
setTimeout(() => {
    console.log('a')

    Promise.resolve().then(() => {
        console.log('c')
    })
})
Promise.resolve().then(() => {
    console.log('b')

    setTimeout(() => {
        console.log('d')
    })
})
console.log('end') */

/* 
输出：
start
end
b
a
c
d
注：执行到第一个 setTimeout 的时候，先打印 a，Promise.resolve().then() 注册了一个回调函数，会被放入微任务队列
同步代码执行完毕，栈空了，所以去微任务队列里看有没有微任务，发现有微任务队列，然后就打印 c。
为什么 c 在 d 前面？
Event Loop 的规则是：每执行完一个宏任务，都要立刻检查并清空微任务队列。
简单说就是：微任务总是见缝插针，在一个宏任务结束后立刻执行，优先级高于排在后面的宏任务。
*/

// 题目4 “慢 Promise”题目
/* Promise.resolve()
    .then(() => {
        console.log(0)
        return Promise.resolve(4)
    })
    .then((res) => {
        console.log(res)
    })

Promise.resolve()
    .then(() => {
        console.log(1)
    })
    .then(() => {
        console.log(2)
    })
    .then(() => {
        console.log(3)
    })
    .then(() => {
        console.log(5)
    })
    .then(() => {
        console.log(6)
    }) */

/* 
输出：「做错了」
0 1 4
输出：「正确的」
0 1 2 3 4 5 6

Promise 的链式调用规则（Chain Rule）：
.then() 里的回调函数执行完后，默认会返回一个“成功的 Promise”。
如果你没有手动写 return，JS 引擎会自动帮你执行 return undefined。
return undefined 等同于 return Promise.resolve(undefined)。
所以，链条并没有断！
    打印完 1，函数结束 -> 自动返回成功 -> 触发下一个 .then (打印 2)。
    打印完 2，函数结束 -> 自动返回成功 -> 触发下一个 .then (打印 3)。
    以此类推，一直到链条结束。

除非你在 .then 里：
抛出了错误 throw new Error()
返回了一个“永远不 resolve”的 Promise（如 return new Promise(()=>{})）
否则，后面的 .then 都会依次执行。

为什么 4 会跑到 3 后面？

注意！在 .then 中返回一个新的 Promise，比返回一个普通值（如 return 4）要慢！
规则： V8 引擎在处理 .then 中返回的 Promise 时，会产生 2 次微任务的额外开销（就像是多办了两次手续），才能把里面的值取出来传递给下一个 .then。
通俗理解：
    return 4：相当于“立刻交接棒”，下一棒马上跑。
    return Promise.resolve(4)：相当于“套娃”，JS 引擎需要拆两层包装，每一层拆解都需要一轮微任务的时间。

重点记住这个。
解释顺序： 
“这道题的关键在于第一条链返回了 Promise.resolve(4)。
在 V8 引擎中，当 .then 返回一个 Promise 时，会有额外的微任务开销（通常慢 2 个 tick）。这导致了右边的链条（打印 1, 2, 3）在微任务队列中多次‘插队’，所以 4 被推迟到了 3 后面才打印。”
*/

// 题目5
/* console.log('1');

setTimeout(() => {
    console.log('2');
    Promise.resolve().then(() => {
        console.log('3');
    });
}, 0);

new Promise((resolve, reject) => {
    console.log('4');
    resolve(5);
}).then((data) => {
    console.log(data);
});

setTimeout(() => {
    console.log('6');
}, 0);

console.log('7'); */
/* 
输出：
1
4
7
5
2
3
6
注：3 是哪里来的？它是宏任务 2 里面产生的微任务。重点： 宏任务 2 执行完后，必须先把它产生的微任务 3 跑完，
才会去跑下一个宏任务 6。如果你 3 排在 6 后面，说明你没理解“执行完一个宏任务后，要立刻清空微任务队列”这一条规则。
*/


// 题目6
async function async1() {
  console.log('1');
  await async2();
  console.log('2'); // 注意这里！
}
async function async2() {
  console.log('3');
}
console.log('4');
setTimeout(function() {
  console.log('5');
}, 0);
async1();
new Promise(function(resolve) {
  console.log('6');
  resolve();
}).then(function() {
  console.log('7');
});
console.log('8');
/*
输出：
4
1
3
6
8
2
7
5
考查点：await 
await 是一个“分界线”！
    分界线之上（同步）
    分界线之下（异步微任务）
你可以把 await async2(); console.log('2'); 理解为：
Promise.resolve(async2()).then(() => {
    console.log('2');
})
*/