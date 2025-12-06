// 手写节流 Throttle
/* function throttle(fn, delay) {
    let lastTime = 0; // 1. 记录上一次执行的时间

    return function(...args) {
        const nowTime = Date.now(); // 2. 获取当前的时间

        // 3. 如果（当前时间 - 上次时间）大于 设置的间隔
        if (nowTime - lastTime >= delay) {
            // 4. 执行函数，修正 this
            fn.apply(this, args);
            // 5. 更新上次执行时间
            lastTime = nowTime;
        }
    }
} */

/* function throttle(fn, delay) {
    let lastTime = 0;
    return function(...args) {
        const nowTime = Date.now();
        if (nowTime - lastTime >= delay) {
            fn.apply(this, args);
            lastTime = nowTime;
        }
    }
} */

// 下面我们基于数组来实现一波栈的常用操作，完成“放置冰淇淋”和“卖冰淇淋”的过程：
/* // 初始状态，栈空
const stack = [];
// 入栈过程
stack.push('东北大板');
stack.push('可爱多');
stack.push('巧乐兹');
stack.push('冰工厂');
stack.push('光明奶砖');

// 出栈过程，栈不为空时才执行
while (stack.length) {
    // 单纯访问栈顶元素（不出栈）
    const top = stack[stack.length - 1];
    console.log('现在取出的冰淇淋是', top);
    // 将栈顶元素出栈
    stack.pop();
}

// 栈空
console.log(stack); */

// 下面我们基于数组来实现一波队列的常用操作，完成“小册姐排队”和“小册姐取餐”的过程：
/* const queue = [];

queue.push('小册一姐');
queue.push('小册二姐');
queue.push('小册三姐');

while(queue.length) {
    // 单纯访问队头元素（不出队）
    const top = queue[0];
    console.log(top, '取餐');
    // 将队头元素出队
    queue.shift();
}

// 队空
console.log(queue); */

// 手写 Mitt (发布订阅模式)
// 这是前端面试中手写设计模式的必考题。
// 在 Vue 3 中，官方移除了实例上的 $on, $off, $emit，推荐使用第三方库 Mitt。Mitt 的源码只有不到 200 字节，其核心就是一个基于 Map 的发布订阅中心。

// class EventEmitter {
//     constructor() {
//         // 1. 定义事件容器
//         // 使用 Map 而不是 Object，因为 Map 的 Key 可以是任何类型，且没有原型链杂质
//         // Key：事件名（String/Symbol）
//         // Value：回调函数数组（Array<Function>）
//         this.all = new Map();
//     }

//     /**
//      * 订阅事件
//      * @param {string} type 事件名
//      * @param {Function} handler 回调函数
//      */
//     on(type, handler) {
//         // 1. 获取该事件名对应的回调数组
//         let handlers = this.all.get(type);

//         // 2. 如果还没注册过，初始化一个空数组
//         if (!handlers) {
//             handlers = [];
//             this.all.set(type, handlers);
//         }

//         // 3. 把回调推入数组
//         handlers.push(handler);
//     }

//     /**
//      * 取消订阅
//      * @param {string} type 事件名
//      * @param {Function} handler 要卸载的那个回调函数
//      */
//     off(type, handler) {
//         const handlers = this.all.get(type);

//         // 如果有这个事件的订阅
//         if (handlers) {
//             // 如果传了具体函数，就只删除那一个
//             if (handler) {
//                 // 使用 splice 删除（或者 filter 重新赋值）
//                 // >>> (handlers.indexOf(handler) >>> 0) 是一个小技巧，防止 -1 导致 splice 错误
//                 const index = handlers.indexOf(handler);
//                 if (index > -1) {
//                     handlers.splice(index, 1);
//                 }
//             } else {
//                 // 如果没传 handler，通常默认清空该事件所有订阅（Mitt 的行为）
//                 this.all.set(type, []);
//             }
//         }
//     }

//     /**
//      * 发布事件
//      * @param {string} type 事件名
//      * @param {any} payload 传递的参数
//      */
//     emit(type, payload) {
//         const handlers = this.all.get(type);

//         if (handlers) {
//             // 循环执行所有订阅了该事件的函数
//             // 使用 slice() 浅拷贝一份，防止在执行过程中 off 导致数组长度变化引起的跳过执行
//             handlers.slice().forEach(fn => {
//                 fn(payload);
//             });
//         }

//         // Mitt 特性：支持监听 '*' 通配符，这里面试通常不强求，写出上面的就够了
//     }

//     // --- 进阶：手写 once (面试加分项) ---
//     once(type, handler) {
//         // 包装一下：执行完立刻 off 掉自己
//         const wrapper = (payload) => {
//             handler(payload); // 执行原函数
//             this.off(type, wrapper); // 卸载包装函数
//         };
//         this.on(type, wrapper);
//     }
// }

// 手写一遍 EventEmitter
/* class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    // 订阅
    on(type, handler) {
        let handlers = this.events.get(type);

        if (!handlers) {
            handlers = [];
            this.events.set(type, handlers);
        }

        // 创建新数组时：必须 set（建立引用关系）。
        // 修改已有数组时：直接 push（利用引用关系）。
        handlers.push(handler);
    }

    // 取消订阅
    off(type, handler) {
        const handlers = this.events.get(type);

        if(handlers) {
            if (handler) {
                const index = handlers.indexOf(handler);
                if (index > -1) {
                    handlers.splice(index, 1);
                }
            } else {
                this.events.set(type, []);
            }
        }
    }

    // 发布
    emit(type, payload) {
        const handlers = this.events.get(type);

        if (handlers) {
            handlers.slice().forEach(fn => {
                fn(payload);
            })
        }
    }

    // 执行一次
    once(type, handler) {
        const wrapper = (payload) => {
            handler(payload);
            this.off(type, wrapper);
        }
        this.on(type, wrapper);
    }
}

const bus = new EventEmitter();

// 1. 定义回调
const fn1 = (msg) => console.log('监听器1收到:', msg);
const fn2 = (msg) => console.log('监听器2收到:', msg);

// 2. 订阅
console.log('--- 订阅事件 ---');
bus.on('order', fn1);
bus.on('order', fn2);

// 3. 发布
bus.emit('order', { id: 100, name: 'iPhone' });
// 预期输出
// 监听器1收到: {id: 100, name: 'iPhone'}
// 监听器2收到: {id: 100, name: 'iPhone'}

// 4. 取消订阅
console.log('--- 取消 fn1 ---');
bus.off('order', fn1);

bus.emit('order', { id: 101 });
// 预期输出: 只有 fn2 收到
// 监听器2收到: {id: 101}

// 5. 测试 once
console.log('--- 测试 once ---');
bus.once('login', (user) => console.log('用户登录:', user));

bus.emit('login', 'Tom'); // 输出: 用户登录: Tom
bus.emit('login', 'Jerry'); // 无输出 (已自动卸载) */

/* 
疑问点：
1. >>> (handlers.indexOf(handler) >>> 0) 是一个小技巧，防止 -1 导致 splice 错误
>>> 0 （无符号右移）的作用：
这是一个位运算符，它的副作用是将数字转换为 32位无符号整数 (Unsigned Integer)。
这是一个利用位运算特性实现的**“静默失败”**技巧，用来替代 if (index !== -1)，让代码更短。在面试手写时，写 if (index > -1) 也是完全满分的，而且可读性更好。

2. 使用 slice() 浅拷贝一份，防止在执行过程中 off 导致数组长度变化引起的跳过执行
为了防止“塌陷效应”（Skipping Elements）。
场景还原：
假设事件 click 有 3 个回调函数：[A, B, C]。
其中，函数 A 的逻辑里写了一句：“执行完我就取消订阅”（也就是 off(A)）。

如果不拷贝直接遍历：
    i=0：执行 A。
    A 内部调用 off(A) -> 数组被 splice 删除了 A。
    数组变成了： [B, C]。
    i++ 变成 1：准备执行下一个。
    问题来了！ 现在数组 index 为 1 的元素是 C（因为 B 往前挪到了 index 0）。
    结果： B 被跳过了！ B 永远不会执行。

3. once 函数不太理解
once 的核心逻辑是：“执行一次，立马销毁”。

once(type, handler) {
    // 1. 我们不直接订阅用户传进来的 handler
    // 而是订阅一个我们自己造的“包装函数” (wrapper)
    const wrapper = (payload) => {
        // 3. 当事件触发时，先执行用户的原逻辑
        handler(payload);
        
        // 4. 【核心】紧接着把自己(wrapper)给卸载掉！
        this.off(type, wrapper);
    };

    // 2. 订阅这个包装函数
    this.on(type, wrapper);
}

执行流程模拟：
    用户调用 bus.once('login', fn)。
    EventBus 实际上存的是 wrapper。
    emit('login') 触发。
    执行 wrapper：
        调用 fn() (用户看到效果了)。
        调用 off('login', wrapper) (把 wrapper 从数组里删了)。
    下次再 emit('login')，数组里已经没东西了，不会再执行。


注：记得判断 handlers

为什么用 Map 而不用 {} 对象？
1. 纯净。对象（Object）原型链上有默认属性（如 toString），如果事件名恰好撞了 key，会出 Bug。Map 是干净的。
2. 类型：Map 的 Key 可以是任何类型（Symbol、Object），这在复杂的事件系统中更灵活
3. Mitt 源码：Vue3 官网推荐的 mitt 库源码内部就是用 new Map() 实现的。

*/

/* 
讲讲 keep-alive？
1. 定性：keep-alive 是 Vue 的一个内置抽象组件，用于缓存动态组件，避免组件反复销毁和重建，从而提升性能并保留用户状态
2.配置：它提供了 include 和 exclude 属性来精细控制缓存目标，还有一个 max 属性控制最大缓存数
3. 生命周期：被缓存的组件在切换时，不会触发 created 和 mounted，也不会触发 unmounted.
而是会触发特有的 activated 和 deactivated 钩子。所以如果需要每次进入都更新数据，代码要写在 activated 里
4. 原理（LRU）：它的底层实现是维护了一个 cache 对象和 keys 数组。当缓存数量达到 max 限制时，它会采用 LRU（最近最少使用）算法，
优先销毁那个最久没有被访问的组件实例，为新组件腾出空间。


当缓存数量达到 max 限制时，它会采用 LRU (最近最少使用) 算法，优先销毁那个最久没有被访问的组件实例，为新组件腾出空间。
*/
