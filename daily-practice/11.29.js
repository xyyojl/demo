// 数组去重
// 要求： 给定 [1, 2, 3, 2, 1, '1', '1']，请写出去重函数。

// const arr = [1, 2, 3, 2, 1, '1', '1'];
// 如果按性能排：Map/Set (王者) > filter+indexOf (青铜)。
// 如果按面试展示排：Map (王者) > filter+indexOf (白银/经典) > Set (兜底/快捷方式)。

// 青铜段位： [...new Set(arr)] （面试官觉得你偷懒，但必须会）。
/* const unique = (a) => [...new Set(a)];
console.log(unique(arr)); */
/* 
原理： ES6 的 Set 数据结构内部就是专门用来存“唯一值”的。
时间复杂度： O(n)
面试建议： 这是首选写法。如果面试官不追问原理或兼容性，直接写这个。
*/

// 白银段位： 使用 filter + indexOf
/* const unique = (arr) => {
    return arr.filter((item, index) => {
        return arr.indexOf(item) === index;
    });
};
console.log(unique(arr)); */
/* 
原理： “只保留第一次出现的元素”。indexOf 总是返回找到的第一个索引，如果当前索引 index 不等于 indexOf 返回的索引，说明它之前出现过。
时间复杂度： O(n²)（这是致命伤）。
    filter 循环 n 次，内部 indexOf 又循环 n 次。如果数组有 10万条数据，这个方法会卡死。
面试建议： 除非面试官限制“不能用 ES6”，否则不要作为首选。如果写了，一定要主动说：“这个方法时间复杂度是 O(n²)，数据量大时性能不好。”
*/

// 王者段位： 使用 Map（性能最好，且能区分 '1' 和 1）
/* const unique = (arr) => {
    const seen = new Map();
    return arr.filter((a) => !seen.has(a) && seen.set(a, 1));
};
console.log(unique(arr)); */
/* 
原理： 利用 Map 记录出现过的元素。
    !seen.has(a)：如果没见过，返回 true。
    &&：前面是 true，才执行后面。
    seen.set(a, 1)：这里有个知识点 —— Map.set() 操作返回的是 Map 对象本身（它是真值 Truthy）。
    所以：true && Map对象 => 返回 Map 对象 => filter 判定为真 => 保留。
    如果是旧值：!seen.has(a) 为 false => filter 判定为假 => 丢弃。
时间复杂度： O(n)。Map 的查找和插入近似 O(1)。
*/

// 更推荐的写法
// “手写一个高性能去重，且不能用 Set”（考察算法能力）
/* const unique = (arr) => {
    const res = [];
    const seen = new Map();

    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        // 如果 Map 里没有，就放进去
        if (!seen.has(item)) {
            seen.set(item, true); // 这里的 value 无所谓
            res.push(item);
        }
    }
    return res;
};
console.log(unique(arr)); */

// 面试加分项：对象去重（Object）
// 方案 1：JSON.stringify（基础版）
/* const uniqueObj = (arr) => {
    const res = [];
    const seen = new Set();

    for (const item of arr) {
        // 将对象序列化为字符串作为指纹
        const key = JSON.stringify(item);

        if (!seen.has(key)) {
            seen.add(key);
            res.push(item);
        }
    }

    return res;
};
// 测试
const list = [{x:1}, {x:1}, {x:2}];
console.log(uniqueObj(list)); // [{x:1}, {x:2}] */

// 方案 2：对象属性排序 + JSON.stringify（进阶版 - 面试推荐）
// 辅助函数➡️去重主函数➡️测试
//  1. 辅助函数：将对象按 Key 排序，保证 {a:1, b:2} 和 {b:2, a:1} 转换出一样的字符串
/* const sortObjectKeys = (obj) => {
    // 如果不是对象或者是 null，直接返回（递归终点）
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // 如果是数组，遍历数组里的每一项进行递归
    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    }

    // 如果是对象，获取 keys 并排序，构建新对象
    return Object.keys(obj).sort().reduce((acc, key) => {
        acc[key] = sortObjectKeys(obj[key]); // 递归处理嵌套对象
        return acc;
    }, {});
};

// 2. 去重主函数
const uniqueObjAdvanced = (arr) => {
    const seen = new Set();
    return arr.filter(item => {
        // 先排序，再序列化
        const key = JSON.stringify(sortObjectKeys(item));
        return !seen.has(key) && seen.add(key);
    })
};

// 测试
const list2 = [
    { a: 1, b: 2 },
    { b: 2, a: 1 }, // 乱序，但内容相同
    { a: 1, b: { c: 3, d: 4 } },
    { a: 1, b: { d: 4, c: 3 } } // 嵌套对象乱序
];

console.log(uniqueObjAdvanced(list2)); */
// 输出：只保留第1个和第3个，完美去重

// 方案 3：业务唯一 ID 去重（实战版）
/* const uniqueByField = (arr, field = 'id') => {
    const seen = new Map();
    // 利用 Map.set 的特性：后面的覆盖前面的（保留最后一条）
    // 或者用 !has 判断（保留第一条）
    arr.forEach(item => {
        const key = item[field];
        if (!seen.has(key)) {
            seen.set(key, item);
        }
    });
    return [...seen.values()];
};
const users = [{id: 1, name: 'A'}, {id: 1, name: 'B'}, {id: 2, name: 'C'}];
console.log(uniqueByField(users, 'id'));  */



// 搞定之后删掉
// 问 AI 之前的回复，有没有问题
/* 你需要掌握这 3 种写法（由浅入深）：
青铜段位： [...new Set(arr)] （面试官觉得你偷懒，但必须会）。
白银段位： 使用 filter + indexOf。
王者段位： 使用 Map（性能最好，且能区分 '1' 和 1）。
 */

// this 自测
/* var length = 10;
function fn() {
    console.log(this.length);
}

var obj = {
    length: 5,
    method: function (fn) {
        fn(); // 第一问
        arguments[0](); // 第二问（最坑的一问）
    }
};

obj.method(fn, 1); */
/* 
第一问 fn() 这是独立调用（默认绑定）。
this window
window.length 是 10
第二问「做错了」
this window
window.length 是 10
输出结果「做错了」
10 10
输出结果「正确」
10 2
解析：
第二问 arguments[0]()：
    这里 arguments[0] 实际上就是传进去的 fn。
    调用形式是 arguments[0]()，相当于 arguments.0()（虽然语法不对，但逻辑是这样的）。
    这是隐式绑定！调用者是 arguments 对象。
    所以 this 指向 arguments。
    arguments.length 是多少？你传了 fn 和 1 两个参数，所以长度是 2。
    输出：2。
*/

/* 
手写防抖 (Debounce)
场景： 搜索框输入（用户停下来才发送请求）。
口诀： “你敢动，我就清零重新计时。”
*/

// 面试标准版
/* function debounce(fn, delay) {
    let timer = null; // 1. 利用闭包保存定时器

    // 返回一个新函数
    return function(...args) {
        // 2. 保存当前的 this （Context）
        const context = this;
        // 3. 如果定时器存在，说明还没到时间又触发了，赶紧清空之前的
        if (timer) clearTimeout(timer);
        // 4. 重新设置定时器
        timer = setTimeout(() => {
            // 5. 执行函数，利用 apply 修正 this 指向，并传递参数
            fn.apply(context, args);
        }, delay);
    }
} */

/* 
手写节流 (Throttle)
场景： 滚动条监听、窗口 resize（每隔一段时间执行一次）。
口诀： “别急，技能 CD 还没好。”
*/

// 【面试标准版 - 时间戳写法】(这种写法最简单，也好记)
/* function throttle(fn, delay) {
    let lastTime = 0; // 1. 记录上一次执行的时间

    return function(...args) {
        const now = Date.now(); // 2. 获取当前的时间

        // 3. 如果（当前时间 - 上次时间）大于 设置的间隔
        if (now - lastTime >= delay) {
            // 4. 执行函数，修正 this
            fn.apply(this, args);
            // 5. 更新上次执行时间
            lastTime = now;
        }
    }
} */


// AI评分：80-85分
/* 
面试建议：
先把你的这两段代码背熟（这是保底）。
防抖：准备好应对“如何立刻执行一次”的追问。
节流：主动告诉面试官，“我写的是时间戳版，特点是第一次会立刻执行。如果业务需要保证最后一次操作也必须执行（比如存库），可以用定时器版。” —— 这句话能证明你懂业务场景。

我刚才写的是时间戳版，适合首屏加载等需要立即响应的场景。但它有丢失最后一次操作的风险。如果要兼顾首尾，
我们可以结合时间戳和定时器：在 delay 时间内用时间戳控制不触发，但在 delay 结束的边缘设置一个 setTimeout 来兜底执行最后一次。
*/
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        const context = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    }
}

function throttle(fn, delay) {
    let lastTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= delay) {
            fn.apply(this, args);
            lastTime = now;
        }
    }
}