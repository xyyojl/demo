/* 
原理回顾：new 干了 4 件事
1. 创建一个新对象
2. 把新对象的 __proto__ 指向构造函数的 prototype
3. 执行构造函数，把 this 指向新对象
4. 返回这个新对象（如果构造函数自己返回了对象，就用它返回的；否则返回新对象）
*/

/* 
疑问点：
...args 的作用是什么？
在 myNew 这个函数里，...args 用到了 ES6 的两个特性：剩余参数 (Rest Parameters) 和 展开语法 (Spread Syntax)。
它的作用是：“照单全收，原样传递”。

// 1. 定义时：...args 是【收集器】（剩余参数）
function myNew(Constructor, ...args) {
    // 此时，args 变成了一个数组。
    // 如果调用 myNew(Person, 'Tom', 18)
    // 那么 Constructor 是 Person
    // args 就是 ['Tom', 18]
    
    const obj = Object.create(Constructor.prototype);

    // 2. 调用时：...args 是【发射器】（展开语法）
    // Constructor.apply(obj, args); // 如果用 apply，直接传数组 args
    // 或者用 Constructor.call(obj, ...args); // 如果用 call，需要把数组展开成 'Tom', 18
}


Object.create(Constructor.prototype) 我可以理解成下面这两行代码吗？
const obj = {};
obj.__proto__ = Constructor.prototype

为什么要用 Object.create 而不是直接写 __proto__？
    标准化： __proto__ 曾经是非标准属性（虽然浏览器都支持），现在虽然被纳入标准但主要是为了兼容，官方不推荐直接去操作它。
    性能： 修改一个已有对象的 __proto__（即 obj.__proto__ = ...）是一个非常耗性能的操作，会破坏 JS 引擎的优化策略。而 Object.create 是在创建对象时就指定好原型，性能更好。
总结： 你的理解模型是对的，但在写代码时，请认准 Object.create。

Object.create 是什么，以及应用场景？
Object.create(proto) 是一个静态方法，它创建一个新对象，使用现有的对象来提供新创建的对象的 __proto__。
通俗翻译： “我要造一个新对象，请帮我指定它的‘爸爸’是谁。”
🛠️ 三大应用场景
场景 1：手写 new 操作符（就是刚才学的）
场景 2：实现继承（寄生组合式继承）
场景 3：创建“纯净”的字典对象（面试加分项）

助教总结
    ...args：是为了处理不定参数，方便透传。
    Object.create(A)：就是创建个空对象，并把它的 __proto__ 指向 A。
    面试中：看到“继承”、“创建对象”、“原型连接”这些关键词，第一反应就要想到 Object.create。

关于 Object.create：
一定要搞懂 Object.create(proto) 做了什么：它创建了一个空对象，这个空对象的 __proto__ 指向参数 proto。这正是实现继承的关键。
*/

// 标准代码
/* function myNew(Constructor, ...args) {
    // 1. 创建一个新对象，并将其 __proto__ 链接到构造函数的 prototype
    // 这一步把 1 和 2 合并了
    const obj = Object.create(Constructor.prototype);

    // 2. 执行构造函数，绑定 this
    const result = Constructor.apply(obj, args);

    // 3. 处理返回值
    // 如果构造函数返回的是对象或函数，则返回该结果；否则返回新创建的 obj
    // 注意：null 也是 object，但需要排除
    if (result && (typeof result === 'object' || typeof result === 'function')) {
        return result;
    }
    return obj;
}

// --- 自测 ---
function Person(name) { this.name = name; }
const p = myNew(Person, 'Jack');
console.log(p.name); // Jack
console.log(p instanceof Person); // true */

// 重新写一遍
/* function myNew(Constructor, ...args) {
    const obj = Object.create(Constructor.prototype);

    const result = Constructor.apply(obj, args);

    if (result && (typeof result === 'object' || typeof result === 'function')) {
        return result;
    }
    return obj;
}

// --- 自测 ---
function Person(name) {
    this.name = name;
}
const p = myNew(Person, '凡星');
console.log(p.name); // 凡星
console.log(p instanceof Person); // true

function Boss(name) {
    this.name = name;
    // 显式返回一个新对象
    return { name: 'I am the Boss', money: 1000000 };
}

function Loser(name) {
    this.name = name;
    // 返回基本类型（应该被忽略）
    return 'I am a string';
}

// 测试 1：构造函数返回对象 -> 应该拿到返回的对象
const b = myNew(Boss, 'Jack');
console.log(b.name); // 'I am the Boss' (而不是 Jack)
console.log(b instanceof Boss); // false (因为返回的新对象断开了原型链)

// 测试 2：构造函数返回基础类型 -> 应该忽略，拿到实例
const l = myNew(Loser, 'Tom');
console.log(l.name); // 'Tom'
console.log(l instanceof Loser); // true */

/* 
手写 instanceof
原理回顾： 沿着左边的 __proto__ 一直往上找，看能不能找到右边的 prototype。
*/
/* function myInstanceof(left, right) {
    // 【补充 1】预判断：基础类型和 null 直接返回 false
    // 原生 instanceof 行为：左边必须是对象或函数，否则直接返回 false
    if ((typeof left !== 'object' && typeof left !== 'function') || left === null) {
        return false;
    }    

    // 1. 获取右边的显式原型
    const prototype = right.prototype;

    // 2. 获取左边的隐式原型
    let proto = Object.getPrototypeOf(left); // 等同于 left.__proto__

    // 3. 循环向上查找
    while(true) {
        // 到了尽头还没找到  -> false
        if (proto === null) return false;
        // 找到了 -> true
        if (proto === prototype) return true;
        // 继续往上找
        proto = Object.getPrototypeOf(proto); 
    }
} */

// 重新写一遍
/* function myInstanceof(left, right) {
    if ((typeof left !== 'object' && typeof left !== 'function') || left === null) {
        return false;
    }
    const prototype = right.prototype;
    let proto = Object.getPrototypeOf(left);

    while (true) {
        if (proto === null) return false;
        if (proto === prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}
// --- 自测 ---
console.log(myInstanceof([], Array)); // true
console.log(myInstanceof({}, Object)); // true
console.log(myInstanceof(1, Number)); // false (修正后符合原生行为)
console.log(myInstanceof(null, Array)); // false (修正后不会报错) */

/* 
手写 继承（终极 Boss）
核心要求： 必须掌握 “寄生组合式继承”。
这是《JavaScript 高级程序设计》推荐的完美方案，也是面试官心目中的满分答案。不要写之前的“组合继承”（会调用两次父类构造函数），直接写这个。

核心逻辑：
1. 继承属性：在子类里调用 Parent.call(this);
2. 继承方法：使用 Object.create() 复制父类的原型
3. 修正指针：把子类原型的 constructor 指回子类自己

关于继承的“两步走”：
    一定要分清：Parent.call 是为了拿属性（写在构造函数里的 this.xxx）。
    Object.create 是为了拿方法（写在 prototype 上的函数）。
    两者结合，才是“组合式”。
*/

/* 
疑问点
Parent.call(this, name); 
调用 Parent 方法， 并改变 this 指向
*/

/* 
// 1. 定义父类
function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}
Parent.prototype.sayName = function() {
    console.log(this.name);
}

// 2. 定义子类
function Child(name, age) {
    // 【第一步】继承属性 (借用构造函数)
    Parent.call(this, name); 
    this.age = age;
}

// 【第二步】继承方法 (寄生式)
// 创建一个纯净的对象，它的 __proto__ 指向 Parent.prototype
// 为什么不用 Child.prototype = new Parent()? 因为那会多执行一次 Parent 代码
Child.prototype = Object.create(Parent.prototype);

// 【第三步】修正 constructor 指向
// 因为上面重写了 Child.prototype，导致 constructor 丢了（变成了 Parent），要补回来
Child.prototype.constructor = Child;

// --- 自测 ---
const child1 = new Child('Tom', 18);
child1.sayName(); // Tom
console.log(child1 instanceof Parent); // true
console.log(child1.constructor); // Child
*/

/* function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}
Parent.prototype.sayName = function() {
    console.log(this.name);
}

function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}

Child.prototype = Object.create(Parent.prototype);
// console.log('Child.prototype', Child.prototype);

Child.prototype.constructor = Child;

// --- 自测 ---
const child1 = new Child('Tom', 18);
child1.sayName(); // Tom
console.log(child1 instanceof Parent); // true
console.log(child1.constructor); // Child */

// 知识复盘：ES6 Class 原理
/* // === 1. ES6 写法 (你平时写的) ===
class Child extends Parent {
    constructor(name, age) {
        super(name); // 对应 Parent.call(this, name)
        this.age = age;
    }
}

// === 2. ES5 写法 (你下午手写的) ===
function Child(name, age) {
    // 对应 super(name)
    Parent.call(this, name); 
    this.age = age;
}

// 对应 class ... extends ...
// (寄生组合式继承的核心步骤)
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child; */

/* 
面试必问：
Q: super() 是什么？
A: 在构造函数中，super() 相当于 Parent.call(this, ...args)。它负责把父类的实例属性挂载到子类的 this 上。在使用 this 之前，必须先调用 super()。
*/

// 默写 new 实现代码
/* function myNew(Constructor, ...args) {
    const obj = Object.create(Constructor.prototype);

    const result = Constructor.apply(obj, args);

    if (result && (typeof result === 'object' || typeof result === 'function')) {
        return result;
    }
    return obj;
} */

// all/race/allSettled/any
c/* onst createPromise = (delay, flag = true) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            flag ? resolve(`成功${delay}`) : reject(`失败${delay}`);
        }, delay);
    })
};

// Promise.all：并发，一挂全挂（全成功才 resolve，一个失败就 reject）
Promise.all([createPromise(1000), createPromise(1500, false), createPromise(2000)])
    .then(res => console.log('res', res))
    .catch(err => console.error('err', err));
// 输出：err 失败1500

Promise.all([createPromise(1000), createPromise(1500), createPromise(2000)])
    .then(res => console.log('res', res))
    .catch(err => console.error('err', err));
// res ['成功1000', '成功1500', '成功2000']

// Promise.race：赛跑，谁快听谁的（无论成功失败，第一个有结果的说了算）
Promise.race([createPromise(2000), createPromise(1500), createPromise(1000, false)])
    .then(res => console.log('res', res))
    .catch(err => console.error('err', err));
// 输出：err 失败1000

// Promise.allSettled(ES2020)：兜底王，永远成功（等所有都结束，返回每个的状态数组）
// 面试官常问：想把成功的都拿到，失败的不管，用哪个？答：用这个，然后 filter。
Promise.allSettled([createPromise(1000), createPromise(1500, false), createPromise(2000)])
    .then(res => console.log('res', res))
    .catch(err => console.error('err', err)); */
/* 
输出：
res [
    {status: 'fulfilled', value: '成功1000'},
    {status: 'rejected', reason: '失败1500'},
    {status: 'fulfilled', value: '成功2000'}
]
*/

/* // Promise.any(ES2021)：求生欲强，一成全成（只要有一个成功就 resolve，全失败才 reject）
Promise.any([createPromise(1000), createPromise(1500, false), createPromise(2000)])
    .then(res => console.log('res', res))
    .catch(err => console.error('err', err));
// 输出：res 成功1000

Promise.any([createPromise(1000, false), createPromise(1500, false), createPromise(2000, false)])
    .then(res => console.log('res', res))
    .catch(err => console.dir(err)); */

/* 
问： 如果 Promise.any 全部失败了，catch 到的 err 是什么？
答：不是普通的 Error，而是一个 AggregateError（聚合错误）。它里面有一个 .errors 属性，是一个数组，包含了所有失败的原因。
输出：
{
    errors: ['失败1000', '失败1500', '失败2000'],
    message: "All promises were rejected",
    stack: "AggregateError: All promises were rejected"
}
*/

// Generator 本质上是一个状态机
/* // 1. 定义：带星号 *
function* myGenerator() {
    console.log('开始执行');
    const a = yield 'Hello'; // 暂停点 1
    console.log('恢复执行，接收到：', a);
    const b = yield 'World'; // 暂停点 2
    console.log('恢复执行，接收到：', b);
    return 'Over';
}

// 2. 初始化：调用函数并没有立即执行代码！而是返回一个迭代器（Iterator）对象
const gen = myGenerator();
console.log('gen', gen);

// 3. 第一步：按下播放键
// 代码执行到第一个 yield 'Hello' 处暂停
// res1 = {value: 'Hello', done: false}
const res1 = gen.next();
console.log('res1', res1);

// 4. 第二步：按下播放键（并传参）
// 代码从暂停处继续，'User' 被赋值给变量 a
// 代码执行到第二个 yield 'World' 处暂停
// res2 = {value: 'World', done: false}
const res2 = gen.next('User');
console.log('res2', res2);

// 5. 第三步：按下播放键
// 代码从暂停处继续，'' 被赋值给变量 b
// 代码执行到 return
// res2 = {value: 'Over', done: true}
const res3 = gen.next('Finish'); */

// 手写一个简易的 async 原理（自动执行器）
// 模拟 async/await 的底层逻辑
/* function run(generatorFunc) {
    // 1. 初始化生成器
    const gen = generatorFunc();

    // 2. 定义递归函数，自动调用 next
    function step(nextF) {
        let next;
        try {
            next = nextF();
        } catch (error) {
            return Promise.reject(error);
        }

        if (next.done) {
            return Promise.resolve(next.value);
        }

        // 3. 把 yield 后面的值（可能是 Promise）包装一下
        Promise.resolve(next.value)
            .then(
                function(v) {
                    // 4. Promise 成功了，自动调用 next(v)，把结果传回 Generator 内部
                    step(function() { return gen.next(v) })
                },
                function(e) {
                    // 5. 失败了，在 Generator 内部抛错
                    step(function() { return gen.throw(e) })
                },
            )
    }

    step(function() { return gen.next(undefined); });
} */

/* 
手写 Promise.all（必考）
核心逻辑（默写目标）：
1. 返回一个新的 Promise
2. 遍历输入数组，对每一项用 Promise.resolve 包装（防备它不是 Promise）
3. 维护一个计数器 count，每成功一个 count++
4. 关键点：结果数组 res 的赋值要用 res[i] = value，不能用 push （保证结果顺序与请求顺序一致）
5. 只要有一个失败，直接 reject
*/

// 这个版本实际上存在问题
/* 虽然你的代码在面试中绝对通过，但严格对照 ES6 标准，有一个小小的差别：
标准规定： Promise.all(iterable) 接收的是一个 Iterable（可迭代对象），而不只是 Array。
比如：Set、Map、String 其实都可以传给 Promise.all。
你的代码里用了 if (!Array.isArray(promises)) 和 forEach，这限制了它只能接收数组。 */

/* function myAll(promises) {
    // 1. 返回新 Promise
    return new Promise((resolve, reject) => {
        // 边界判断：如果传入的不是数组（可迭代对象）
        if (!Array.isArray(promises)) {
            return reject(new TypeError('Argument must be an array'));
        }

        const len = promises.length;
        const res = [];
        let count = 0;

        // 边界判断：如果是空数组，立刻 resolve
        if (len === 0) {
            return resolve([]);
        }

        promises.forEach((p, i) => {
            // 2. 用 Promise.resolve 包一层，兼容普通值
            Promise.resolve(p).then(
                (value) => {
                    // 3. 按索引存结果（保证顺序）
                    res[i] = value;
                    count++;
                    // 4. 所有都成功了，resolve
                    if (count === len) {
                        resolve(res);
                    }
                },
                (reason) => {
                    // 5. 有一个失败，立刻 reject
                    reject(reason);
                }
            );
        });
    });
} */

/* function myPromiseAll(iterable) {
    return new Promise((resolve, reject) => {
        // Iterable => Array
        const promises = Array.from(iterable);
        const len = promises.length;
        const res = [];
        let count = 0;
        
        if (len === 0) {
            return resolve([]);
        }
        for(let i = 0; i < len; i++) {
             // Promise.resolve 确保把所有数据都转化为 Promise
            Promise.resolve(promises[i]).then(
                (value) => {
                    // 因为 promise 是异步的，保持数组一一对应
                    res[i] = value;
                    count++;
                    // 如果数组中所有 promise 都完成，则返回结果数组
                    if (count === len) {
                        resolve(res);
                    }
                },
                (reason) => {
                    // 有一个失败，立刻 reject
                    reject(reason);
                }
            )
        }
    })
}

// ==========================================
// 场景 1: 基础功能 + 顺序保证 + 非 Promise 值兼容
// ==========================================
const p1 = new Promise(r => setTimeout(() => r('慢(1s)'), 1000));
const p2 = new Promise(r => setTimeout(() => r('快(0.1s)'), 100));
const p3 = '我是普通值'; // 非 Promise

console.time('👉 场景1 耗时'); // 应该只花费约 1s (最慢的那个)，而不是 1.1s
myPromiseAll([p1, p2, p3]).then(res => {
    console.timeEnd('👉 场景1 耗时');
    console.log('✅ 场景1 结果:', res); 
    // 预期输出: ['慢(1s)', '快(0.1s)', '我是普通值']
    // (注意：即使 p2 先回来，它也在数组第二个位置)
});


// ==========================================
// 场景 2: 失败熔断 (Fail-Fast)
// ==========================================
const pSuccess = new Promise(r => setTimeout(() => r('成功'), 1000));
const pFail = new Promise((_, reject) => setTimeout(() => reject('💥 炸了'), 500));

myPromiseAll([pSuccess, pFail])
    .then(() => console.log('❌ 场景2 失败: 不应该走到这里'))
    .catch(err => console.log('✅ 场景2 捕获:', err));
    // 预期输出: '💥 炸了' (且不需要等 1s，0.5s 就报错)


// ==========================================
// 场景 3: 空数组边界 (最容易死锁的场景)
// ==========================================
myPromiseAll([]).then(res => {
    console.log('✅ 场景3 空数组:', res);
    // 预期输出: [] (且必须是立即返回)
});


// ==========================================
// 场景 4: Iterable 支持 (Set / String)
// ==========================================
const set = new Set([1, Promise.resolve(2), 3]);
myPromiseAll(set).then(res => {
    console.log('✅ 场景4 Set支持:', res);
    // 预期输出: [1, 2, 3]
});


// ==========================================
// 场景 5: 错误捕获范围测试 (验证 .then(ok, fail))
// ==========================================
const bugPromise = new Promise(resolve => resolve('ok'));
// 模拟一个有 Bug 的 myPromiseAll (假如我们用了 r.push 导致 bug)
// 这里的 myPromiseAll 是正确的，所以 catch 不会触发，这证明了源码本身的健壮性
myPromiseAll([bugPromise]).then(res => {
    // 假设我们在 then 里抛错
    // throw new Error("结果处理出错"); 
    console.log('✅ 场景5 完成');
}).catch(err => {
    console.log('场景5 捕获:', err);
}); */

/* 
手写 Promise.race（送分题）
核心逻辑：谁先回调（无论 then 还是 catch），就以谁为准
*/

/* function myPromiseRace(iterable) {
    return new Promise((resolve, reject) => {
        // Iterable => Array
        const promises = Array.from(iterable);

        promises.forEach((p) => {
            Promise.resolve(p).then(resolve, reject);
        })
    })
} */

/* 
并发调度器 Scheduler（终极 Boss）
题目描述：
实现一个 Scheduler 类，完成 add 方法。要求：同时进行的异步任务最多 2 个。
add 返回一个 Promise，当任务执行完时，Promise 变为 resolved。

核心逻辑（排队机制）：
1. 待办队列：没位置时，把任务存进 queue 数组
2. 正在运行数：用 runCount 记录当前有几个在跑
3. 递归调用：一个任务跑完（finally）后，runCount--，并从 queue 里取下一个任务跑
*/

class Scheduler {
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
        })
    }
}

// --- 自测 ---
const scheduler = new Scheduler(2); // 最多 2 个并发
const addTask = (time, order) => {
    scheduler.add(time, order);
};

// 预想输出：2, 3, 1, 4
// 可以进行执行时间轴推演，更好的理解输出的结果
addTask(1000, '1'); // 任务1：耗时 1s
addTask(500, '2'); // 任务2：耗时 0.5s
addTask(300, '3'); // 任务3：耗时 0.3s
addTask(400, '4'); // 任务4：耗时 0.4s