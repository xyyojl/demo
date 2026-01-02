// Vue2 响应式基本原理
/* const data = {};
let name = 'Vue';

Object.defineProperty(data, 'name', {
    get: function() {
        console.log('get');
        return name;
    },
    set: function(newValue) {
        console.log('set');
        name = newValue;
        // 视图重新渲染
    }
})

console.log('data.name', data.name); // 希望返回 Vue
data.name = 'React';
console.log('data.name', data.name); */

/* // 快速实现一个简易的Vue响应式
const data = {
    name: '凡星',
    age: 18
};

// 变成响应式数据
observer(data);

function observer(target) {
    if (typeof target !== 'object' || target === null) {
        return target;
    }
    for (let key in target) {
        defineReactive(target, key, target[key]);
    }
}

function defineReactive(target, key, value) {
    Object.defineProperty(target, key, {
        get() {
            return value;
        },
        set(newValue) {
            if (newValue !== value) {
                value = newValue;
                console.log('更新视图');
            }
        }
    })
}

data.name = '小明';
data.age = 7; */

// 实现Vue2响应式之复杂对象情况
// 实现Vue2响应式之改写数组方法
/* const data = {
    name: '凡星',
    age: 18,
    friend: {
        friendName: '小王'
    },
    colors: ['red', 'oranger', 'green']
};

const oldArrayProto = Array.prototype;
const newArrayProto = Object.create(oldArrayProto);
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(methodName => {
    newArrayProto[methodName] = function() {
        console.log('更新视图');
        oldArrayProto[methodName].call(this, ...arguments);
    }
})

console.log('old', oldArrayProto);
console.log('new', newArrayProto);


// 变成响应式数据
observer(data);

function observer(target) {
    if (typeof target !== 'object' || target === null) {
        return target;
    }
    if (Array.isArray(target)) {
        target.__proto__ = newArrayProto;
    }
    for (let key in target) {
        defineReactive(target, key, target[key]);
    }
}

function defineReactive(target, key, value) {
    // 深度监听
    observer(value);
    Object.defineProperty(target, key, {
        get() {
            return value;
        },
        set(newValue) {
            observer(newValue);
            if (newValue !== value) {
                value = newValue;
                console.log('更新视图');
            }
        }
    })
}

// data.friend.friendName = '小林';
// data.age = { number: 10 };
// data.age.number = 20;
// delete data.age; // Vue.delete
// data.test = 'something'; // Vue.set
// data.colors[0] = 'blue'; // 有触发更新视图，Vue中通过下标修改数组是不会触发更新的
// console.log(data.colors.push); // 使用 newArrayProto 下的方法
// data.colors.push('blue'); // 1. 更新视图 2. 原本的功能 */

/* 
出现的问题：
1. 大数据的情况下深度监听
2. data 属性的新增或删除，不会更新视图
3. 使用数组的方法，不会触发视图更新
*/


// 手写 defineReactive（Vue 2 核心）
/* 
面试官让你手写这个，考察的有 3 个关键点：
1. 闭包的使用（如何存储 value）
2. 递归使用（如何处理深层嵌套）
3. Setter 的逻辑（新值也是对象怎么办？）

4个精髓
1. 为什么 defineReactive 需要传 val？
为了利用闭包。Object.defineProperty 的 get/set 需要存取值，如果直接用 obj[key] 会导致无限递归（死循环）。所以我们把 val 存在函数作用域里供 get/set 使用
2. observe(val) 放在第一行是干嘛的？
深度监听。如果 data 是 {a: { b: 1 }}，必须先把 {b: 1} 也变成响应式的，否则改 data.a.b 不会触发更新
3. set 里为什么又要调用 observe(newVal)？
动态监听。如果我执行 data.info = { c: 99 }，原来的 info 被覆盖了，新来的对象必须立马“安上监控”，否则改 data.info.c 就没反应了
4. 这个代码有什么缺陷？（引出 Vue 3）
    需要递归遍历，数据量大时，初始化非常慢
    defineProperty 无法拦截对象新增/删除属性（data.newProp = 1 不会触发更新，所以需要 $set）
    这里没有写数组的处理逻辑（Vue2 源码里数组是单独拦截原型方法的）
*/


/* // 1. 模拟视图更新
function updateView() {
    console.log('🚀 视图更新了');
}

// 2. 核心函数：数据劫持
function defineReactive(obj, key, val) {
    // 【关键点 1】递归遍历
    // 如果 val 本身是个对象（比如 data.info），需要递归进去劫持它的属性
    observe(val);

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,

        // 【关键点2】Getter
        get() {
            console.log(`正在读取 ${key}`);
            // 这里未来会加：dep.depend() 进行依赖收集
            return val; // 利用闭包保存 val
        },
        // 【关键点3】Setter
        set(newVal) {
            if (newVal === val) return;
            console.log(`正在修改 ${key}，值从 ${val} 变为 ${newVal}`);

            // 【关键点4】如果新赋的值是个对象，也需要劫持它
            observe(newVal);

            val = newVal;
            // 这里未来会加：dep.notify() 进行派发更新
            updateView();
        }
    });
}

// 3. 入口函数：观察者
function observe(target) {
    // 边界判断：不是对象或为 null，直接返回
    if (typeof target !== 'object' || target === null) {
        return target;
    }

    // 遍历对象的每一个 key，逐个劫持
    for(let key in target) {
        defineReactive(target, key, target[key]);
    }

}

// --- 🧪 自测代码 ---
const data = {
    name: 'Vue2',
    info: {
        age: 8 // 深层对象
    }
}

// 初始化劫持
observe(data);

console.log('---- 测试 1: 修改基本属性 ----');
data.name = 'Vue 3'; 
// 输出：
// 正在修改 name，值从 Vue2 变为 Vue 3
// 🚀 视图更新了

console.log('---- 测试 2: 读取深层属性 ----');
console.log(data.info.age); 
// 输出：
// 正在读取 info
// 正在读取 age
// 8

console.log('---- 测试 3: 修改深层属性 ----');
data.info.age = 10; 
// 输出：
// 正在读取 info
// 正在修改 age，值从 8 变为 10
// 🚀 视图更新了

console.log('---- 测试 4: 赋值新对象 ----');
data.info = { height: 180 }; 
// 正在修改 info，值从 [object Object] 变为 [object Object]
// 🚀 视图更新了
data.info.height = 190; 
// 正在读取 info
// 正在修改 height，值从 180 变为 190
// 🚀 视图更新了 */

// 手写简易版 reactive（Vue 3 核心）
/* 
面试官考察这道题，主要看重 3 点：
1. Proxy 基本语法：get 和 set 拦截
2. Reflect 的使用：为什么要搭配 Reflect？（为了正确的 this 指向）
3. 懒代理（Lazy Proxy）：Vue3 最大的性能优化点————只有访问到了才递归

Reflect.get 的第三个参数 receiver 就是为了把 this 锁死在 Proxy 身上，防止“this 逃逸”到原始对象上。
「Reflect.get 告诉 JS 引擎：“你去读 target 的 key，但是！如果里面用到了 this，请把 this 绑定为 receiver (也就是 proxy 实例)”。」
Reflect.set 是一种更底层、更规范的赋值方式，它不仅完成了赋值，还帮我们处理了 this 指向（receiver），并返回了标准的成功/失败状态。
为了统一风格： get 用 Reflect，set 用 Reflect，删除也用 Reflect，保持代码一致性。

在 Vue3 的 Proxy 中：
1. Reflect.get 配合 receiver，是为了修正 getter 里的 this，确保依赖收集不漏网（这是面试最核心的考点）
2. Reflect.set 是为了拿到标准返回值，告诉 Proxy 操作成功了没
*/

/* const target = {
    firstName: 'Jack',
    get fullName() {
        // 【关键点】这里的 this 指向谁？
        return this.firstName + ' Ma';
    }
};

const proxy = new Proxy(target, {
    get(target, key, receiver) {
        console.log(`正在读取 ${key}`);
        
        // ❌ 写法 A：直接返回原对象属性
        // return target[key]; 
        
        // ✅ 写法 B：使用 Reflect，并传入 receiver
        return Reflect.get(target, key, receiver);
    }
}); */

// 1. 模拟视图更新
/* function trigger() {
    console.log('🚀 视图更新了 (Trigger)');
}
function track() {
    console.log('📡 收集依赖 (Track)');
}

// 2. 核心函数：reactive
function reactive(target) {
    // 边界判断：如果不是对象，直接返回
    if (typeof target !== 'object' || target === null) {
        return target;
    }

    // Proxy 处理器
    const handler = {
        // 拦截读取
        get(target, key, receiver) {
            track(); // 模拟依赖收集

            // 关键点1：使用 Reflect.get 配合 receiver
            // 保证如果 target 中有 getter，this 能正确指向 Proxy 实例
            const res = Reflect.get(target, key, receiver);

            // 关键点2：懒代理（Lazy Recursion）
            // 只有当 res 是对象时，才递归调用 reactive
            // 相比 Vue2 的一上来就全盘递归，性能提升巨大
            if (typeof res === 'object' && res !== null) {
                return reactive(res);
            }

            return res;
        },

        // 拦截修改
        set(target, key, value, receiver) {
            // 关键点3：使用 Reflect.set 拿到操作结果
            const res = Reflect.set(target, key, value, receiver);

            // 派发更新
            trigger();
            
            // set 方法必须返回 boolean，告知操作是否成功
            return res;
        },

        // 拦截删除（Vue2 做不到的）
        deleteProperty(target, key) {
            const res = Reflect.defineProperty(target, key);
            trigger();
            return res;
        }
    };

    // 返回 Proxy 实例
    return new Proxy(target, handler);
}

// --- 🧪 自测代码 ---
const data = reactive({
    name: 'Vue 3',
    info: {
        age: 18
    },
    list: [1, 2]
});

console.log('---- 测试 1: 修改基本属性 ----');
data.name = 'Vite'; 
// 🚀 视图更新了 (Trigger)

console.log('---- 测试 2: 深度修改 (验证懒代理) ----');
// 访问 data.info 时触发 get，此时才把 info 变成 Proxy
data.info.age = 20; 
// 📡 收集依赖 (Track)
// 🚀 视图更新了 (Trigger)

console.log('---- 测试 3: 数组操作 (Vue 2 的痛点) ----');
data.list.push(3); 
// 📡 收集依赖 (Track)
// 2 📡 收集依赖 (Track)
// 2 🚀 视图更新了 (Trigger)
// (Proxy 能完美拦截数组索引和 length 变化)


console.log('---- 测试 4: 新增属性 (Vue 2 的痛点) ----');
data.newProp = 'Happy';
// 🚀 视图更新了 (Trigger) */

/* 
Track 触发多次是因为：读取 push 方法本身、读取 length 属性。
Trigger 触发两次是因为：一次是新增索引（key: "2"），一次是更新长度（key: "length"）。

现象： push 触发两次 set（一次索引，一次 length）。
原因： ES 标准定义 push 就是复合操作。
面试回答： “这是因为 push 操作在底层涉及了设置索引值和更新 length 两个步骤。在 Vue 3 源码中，通过判断操作类型（ADD/SET）和新旧值对比，屏蔽了多余的 length 更新，保证视图只更新一次。
*/

/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
	// 1. 边界条件：如果只有 1 级或 2 级，方法数就是 n 本身
    // 1 级台阶 = 1 种（1）
    // 2 级台阶 = 2 种（1+1, 2）
    if (n <= 2 ) return n;
    
    // 2. 初始化状态变量（对应 i = 3 之前的情况）
    // prev2：代表到达“i-2”级台阶的方法数。初始对应第 1 级，所以是 1
    let prev2 = 1;

    // prev1：代表到达“i-1”级台阶的方法数。初始对应第 2 级，所以是 2
    let prev1 = 2;

    // current；用于存储当前“i”级台阶的方法数
    let current;

    // 3. 从第 3 级开始迭代，一直算到第 n 级
    for (let i = 3; i <= n; i++) {
        // 【核心公式】：到达当前级 = 从前一级跳上来 + 从前两级跳上来
        current = prev1 + prev2;

        // 【核心动作】：滚动窗口（为了下一次循环做准备）
        // 就像人上楼梯一样，脚印整体往前挪一步

        // 旧的“前一级” 变成了 下一次循环的“前两级”
        prev2 = prev1;

        // 刚算出来的“当前级” 变成了 下一次循环的“前一级”
        prev1 = current;
    } 

    // 4. 返回结果
    return current;
};