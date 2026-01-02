// 手写 new
function myNew(Constructor, ...args) {
    const obj = Object.create(Constructor.prototype);

    const result = Constructor.apply(obj, args);

    if (result && (typeof result === 'object' || typeof result === 'function')) {
        return result;
    }
    return obj;
}

// 寄生组合式继承
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
    // 【第一步】继承属性（借用构造函数）
    Parent.call(this, name);
    this.age = age;
}

// 【第二步】继承方法（寄生式）
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

// 保底版
function deepClone(target, map = new WeakMap()) {
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
}
/* 
面试建议：
    先把你的这个版本默写熟练（这是保底）。
    如果面试官问：“那 Date 对象怎么处理？”或者“Symbol 属性丢了怎么办？”，你再把你懂的 constructor 和 Reflect.ownKeys 知识点抛出来。
    通常不需要一开始就写那个最复杂的版本，因为容易写错。你现在的版本性价比最高。
*/

// 手写深拷贝，进阶修正版（面试加分版）
/* function deepClone(target, map = new WeakMap()) {
    // 1. 基本类型直接返回
    if (typeof target !== 'object' || target === null) return target;

    // 2. 查缓存（解决循环引用）
    if (map.has(target)) return map.get(target);

    // 3. 【优化点】处理特殊对象（Date, RegExp）
    // 利用 constructor 构造一个新的
    if (/^(Date|RegExp)$/.test(target.constructor.name)) {
        return new target.constructor(target);
    }

    // 4. 初始化容器（保留原型链）
    // 这里的 constructor 会指向 Array 或者 Object，或者自定义类型
    const cloneTarget = new target.constructor();

    // 登记
    map.set(target, cloneTarget);

    // 5. 【优化点】使用 Reflect.ownKeys 遍历（包含 Symbol 和不可枚举属性）
    // 如果不想拷贝不可枚举属性，也可以组合 Object.getOwnPropertyNames 和 Object.getOwnPropertySymbols
    Reflect.ownKeys(target).forEach(key => {
        cloneTarget[key] = deepClone(target[key], map);
    });

    return cloneTarget;
} */


/* // 用 reduce 实现 filter
// 核心思想是：将初始值设为一个空数组 []，遍历过程中，如果当前项符合条件，就 push 进累加器，否则忽略，最后返回累加器。
Array.prototype.myFilter = function(callback, context) {
    // 这里的 this 指向调用 myFilter 的数组
    return this.reduce((acc, cur, index, array) => {
        // 1. 执行回调函数，判断结果（注意处理 this 指向）
        const res = callback.call(context, cur, index, array);

        // 2. 如果结果为真，将当前项加入累加器
        if (res) {
            acc.push(cur);
        }

        // 3. 返回累加器供下一次使用
        return acc;
    }, []); // 【关键】初始值必须是空数组
};

// --- 自测 ---
const arr = [1, 2, 3, 4, 5];

// 使用手写的 myFilter
const result = arr.myFilter((item) => {
    return item > 3;
});

console.log(result); // 输出: [4, 5]

// 测试 this 指向 (进阶测试)
const contextObj = { min: 2 };
const resultWithContext = arr.myFilter(function(item) {
    return item > this.min;
}, contextObj);

console.log(resultWithContext); // 输出: [3, 4, 5] */


// 手写 flat (支持 depth)「版本 2：迭代版 (Stack 实现) —— 面试加分项」
// 相比于递归版，迭代版的核心难点在于：如何利用栈（Stack）的“后进先出”特性，还能保证最终拍平后的数组顺序不变？
/**
 * 数组扁平化（迭代版 - 防止递归爆栈）
 * @param {Array} arr 源数组
 * @param {number} depth 拍平深度
 */
function flatStack(arr, depth = 1) {
    // 1. 结果数组
    const res = [];

    // 2. 初始化栈
    // 核心技巧：将数组元素和它对应的 depth 打包成元组[item, depth]
    // 关键点：【倒序】入栈。因为栈是后进先出（LIFO），只有倒序入栈，pop 出来才是正序。
    const stack = arr.map(item => [item, depth]).reverse();

    while (stack.length > 0) {
        // 3. 弹出栈顶元素（这是当前原数组最前面的元素）
        const [curr, curDepth] = stack.pop();

        // 4. 判断：如果是数组 且 还有深度额度
        if (Array.isArray(curr) && curDepth > 0) {
            // 5. 剥壳操作：将子元素推回栈中
            // 关键点：依然要【倒序】推入栈
            // 例子：curr 是 [A, B]，先 push B，再 push A。下次循环 pop 的就是 A。
            for (let i = curr.length - 1; i >= 0; i--) {
                stack.push([curr[i], curDepth - 1]);
            }
        } else {
            // 6. 不是数组或深度不够，直接由结果收录
            res.push(curr);
        }
    }

    return res;
}

// 自测代码
const arr = [1, 2, [3, 4, [5, 6]]];

console.log(flatStack(arr, 1)); 
// 输出: [1, 2, 3, 4, [5, 6]] (保留了一层数组)

console.log(flatStack(arr, 2)); 
// 输出: [1, 2, 3, 4, 5, 6] (全拍平)

console.log(flatStack(arr, Infinity));
// 输出: [1, 2, 3, 4, 5, 6]

/* 
1. 为什么用迭代（Stack）不用递归？
虽然递归写法更简洁，但如果数组嵌套层级极深（例如几万层），递归会占用大量调用栈帧，导致 Stack OverFlow（爆栈）错误。
而我们使用手动维护的 Stack（堆内存中的数组），理论上只受限于内存大小，更安全稳定。

2. 为什么要倒序（reverse/i--）？
因为栈是 LIFO（后进先出）的结构，为了保证 res.push 的顺序和原数组一致，我们必须先把后面的元素压入栈底，把前面的元素放在栈顶，这样弹出处理时顺序才是对的。
*/