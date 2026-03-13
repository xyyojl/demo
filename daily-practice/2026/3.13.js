/* 
第一题：new 操作符的原理
当下面的代码  new Foo() 执行时 ,发生了什么事情
function Foo() {}
var foo = new Foo()

参考答案：
执行 new Foo() 时，JavaScript 引擎内部主要完成了以下四个步骤：
1. 创建一个新对象：在内存中创建一个空的简单 JavaScript 对象
2. 链接原型：将新对象的 __proto__ 属性指向构造函数 Foo 的 prototype 属性
3. 绑定 this 并执行：将构造函数内部的 this 绑定到这个新对象上，并执行构造函数体内的代码（为新对象添加属性）
4. 返回新对象：如果构造函数没有返回非原始值（对象、函数等），则默认返回这个新创建的对象

原理回顾：new 干了 4 件事
1. 创建一个新对象
2. 把新对象的 __proto__ 指向构造函数的 prototype
3. 执行构造函数，把 this 指向新对象
4. 返回这个新对象（如果构造函数自己返回了对象，就用它返回的；否则返回新对象）

function myNew(Constructor, ...args) {
    // 1. 创建一个新对象
    const obj = {};
    // 2. 把新对象的 __proto__ 指向构造函数的 prototype
    obj.__proto__ = Constructor.prototype;
    // 3. 执行构造函数，把 this 指向新对象
    const result = Constructor.apply(obj, args);
    // 4. 返回这个新对象（如果构造函数自己返回了对象，就用它返回的；否则返回新对象）
    if (result && (typeof result === 'object' || typeof result === 'function')) {
        return result;
    }
    return obj;
}
*/

/* 
这段手写 new 的核心逻辑是正确的，涵盖了 new 操作符的 4 个关键步骤：
1. 创建一个新对象 (const obj = {})。
2. 连接原型链 (obj.__proto__ = Constructor.prototype)，让新对象可以访问构造函数原型上的属性和方法。
3. 绑定 this 并执行构造函数 (Constructor.apply(obj, args))。
4. 处理返回值：如果构造函数返回了一个对象或函数，则返回该结果；否则返回新创建的 obj。其中 result && ... 也很严谨地排除了 null 的情况（因为 typeof null === 'object'）。
不过，在实际开发或面试要求中，这段代码还有几个可以优化的地方：

优化点：
避免直接修改 __proto__：直接操作 __proto__ 属性在大多数 JavaScript 引擎中会有性能问题，并且它已被 Web 标准废弃。推荐使用 Object.create() 将“创建对象”和“连接原型”两步合二为一。
增加参数校验：最好校验一下传入的 Constructor 是否真的是一个函数，防止运行报错。

*/
/* function myNew(Constructor, ...args) {
    const obj = {}
    obj.__proto__ = Constructor.prototype
    const result = Constructor.apply(obj, args)
    if (result && (typeof result === 'object' || typeof result === 'function')) {
        return result
    }
    return obj
} */

// 优化后的版本：
/* function myNew(Constructor, ...args) {
    // 1. 校验 Constructor 是否为函数
    if (typeof Constructor !== 'function') {
        throw new TypeError('Constructor must be a function');
    }

    // 2. 使用 Object.create 创建一个新对象，并将其原型直接指向 Constructor.prototype（替代直接修改 __proto__）
    const obj = Object.create(Constructor.prototype);

    // 3. 将新对象绑定到 `this` 并执行构造函数
    const result = Constructor.apply(obj, args);

    // 4. 判断返回值类型
    // (注意 typeof null === 'object'，所以需要 result !== null)
    if (result !== null && (typeof result === 'object' || typeof result === 'function')) {
        return result;
    }

    return obj;
} */

function myNew(Constructor, ...args) {
    if (typeof Constructor !== 'function') {
        throw new TypeError('Constructor must be a function')
    }
    const obj = Object.create(Constructor.prototype)
    const result = Constructor.apply(obj, args)
    if (result !== null && (typeof result === 'object' || typeof result === 'function')) {
        return result
    }
    return obj
}

/* 
第二题：事件循环（Event Loop）
参考答案：3 4 1 2 5

解析说明：
1. 同步代码执行：
   - console.log('3') 首先被打印。
   - Promise.resolve().then() 将第一个微任务（包含 console.log('4') 和内部的 setTimeout）加入微任务队列。
   - setTimeout(..., 0) 将第一个宏任务（包含 console.log('1') 和内部的 Promise）加入宏任务队列。

2. 微任务执行：
   - 执行微任务队列中的任务：console.log('4') 被打印。
   - 内部的 setTimeout 被加入新的宏任务队列。

3. 宏任务执行：
   - 执行宏任务队列中的任务：console.log('1') 被打印。
   - 内部的 Promise.resolve().then() 将 console.log('2') 加入新的微任务队列。

4. 微任务执行：
   - 执行微任务队列中的任务：console.log('2') 被打印。

5. 宏任务执行：
   - 执行宏任务队列中的任务：console.log('5') 被打印。

*/
// 执行下面的代码，会输出什么信息
function task() {
    setTimeout(() => {
        console.log('1')
        Promise.resolve().then(() => {
            console.log('2')
        })
    })
    console.log('3')
    Promise.resolve().then(() => {
        console.log('4')
        setTimeout(() => {
            console.log('5')
        })
    })
}

task()
