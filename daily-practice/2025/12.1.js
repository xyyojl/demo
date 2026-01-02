// 晨间自测题（先思考，再看资料）
// 这是一个循环引用对象
/* const obj = { name: 'test' };
obj.self = obj;

console.log(obj);
JSON.parse(JSON.stringify(obj)); */

// 请问：用 JSON.parse(JSON.stringify(obj)) 会发生什么？
// 答案：Uncaught TypeError: Converting circular structure to JSON

/* 
如何写出一个惊艳面试官的深拷贝?

先问自己三个问题
1. 你真的理解什么是深拷贝吗？
2. 在面试官眼里，什么样的深拷贝才算合格？
3. 什么样的深拷贝能让面试官感到惊艳？
*/

/*
乞丐版 JSON.parse(JSON.stringify(obj));
这种写法非常简单，而且可以应对大部分的应用场景，但是它还是有很大缺陷的，比如拷贝其他引用类型、拷贝函数、
循环引用等情况。
*/

// 深拷贝 现在有了原生支持api： structuredClone

// 梯度 1：亲眼见证 Crash（2分钟）
/* const target = { field: 'test' };
target.target = target; // 制造循环引用

console.log(JSON.parse(JSON.stringify(target)));
// 出现报错：Uncaught TypeError: Converting circular structure to JSON */

// 梯度 2：手写“乞丐版”递归（8分钟）
// 不考虑 WeakMap，先试着把递归逻辑写通。
// 自测目标： 能拷贝多层嵌套的对象 {a: {b: {c: 1}}}
/* const target = {
    a: {
        b : {
            c: 1
        }
    }
};

function deepClone(target) {
    // 1. 如果是基础类型，直接返回
    if (typeof target !== 'object' || target === null) {
        return target;
    }

    // 2. 初始化容器（先只考虑数组和对象）
    const cloneTarget = Array.isArray(target) ? [] : {};

    // 3. 遍历 + 递归
    for (const key in target) {
        if (target.hasOwnProperty(key)) {
            cloneTarget[key] = deepClone(target[key]); // 递归调用
        }
    }

    return cloneTarget;
}

// 自测
console.log(deepClone(target)); */

// 梯度 3：加上 WeakMap 解决循环引用（10分钟）
/* function deepClone(target, map = new WeakMap()) {
    if (typeof target !== 'object' || target === null) {
        return target;
    }

    const cloneTarget = Array.isArray(target) ? [] : {};
    if (map.has(target)) {
        return map.get(target);
    }
    map.set(target, cloneTarget);

    for (const key in target) {
        if (target.hasOwnProperty(key)) {
            cloneTarget[key] = deepClone(target[key], map);
        }
    }

    return cloneTarget;
} */


// 关于V8垃圾回收机制的思考性问题
/* 
1. 什么是垃圾回收机制？
2. 垃圾是怎样产生的？
3. 为什么要进行垃圾回收？
4. 垃圾回收是怎样进行的？
5. V8 引擎对垃圾回收进行了哪些优化？
*/

// 先了解 flat 的用法
// flat() 方法创建一个新的数组，并根据指定深度递归地将所有子数组元素拼接到新的数组中。
// 展开嵌套数组
/* const arr1 = [1, 2, [3, 4]];
console.log(arr1.flat());
// [1, 2, 3, 4]

const arr2 = [1, 2, [3, 4, [5, 6]]];
console.log(arr2.flat());
// [1, 2, 3, 4, [5, 6]]

const arr3 = [1, 2, [3, 4, [5, 6]]];
console.log(arr3.flat(2));
// [1, 2, 3, 4, 5, 6]

const arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
console.log(arr4.flat(Infinity));
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// 在稀疏数组上使用 flat()
const arr5 = [1, 2, , 4, 5];
console.log(arr5.flat()); // [1, 2, 4, 5]

const array = [1, , 3, ["a", , "c"]];
console.log(array.flat()); // [ 1, 3, "a", "c" ]

const array2 = [1, , 3, ["a", , ["d", , "e"]]];
console.log(array2.flat()); // [ 1, 3, "a", ["d", empty, "e"] ]
console.log(array2.flat(2)); // [ 1, 3, "a", "d", "e"] */

/* 
第一问：实现一个简单的数组拍平 flat 函数
实现思路：在数组种找到是数组类型的元素，然后将他们展开。这就是实现数组拍平 flat 方法的关键思路。
有了思路，我们就需要解决实现这个思路需要克服的困难：
1. 遍历数组的每一个元素
2. 判断元素是否是数组
3. 将数组的元素展开一层
*/

/* // concat + 递归
function flat(arr) {
    let res = [];
    arr.forEach(item => {
        if (Array.isArray(item)) {
            res = res.concat(flat(item)); // 递归
            // 或者用扩展运算符
            // res.push(...flat(item));
        } else {
            res.push(item);
        }
    });
    return res;
}
const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "凡星" }];
flat(arr);
// [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "凡星" }];
*/

// 第二问：用 reduce 实现 flat 函数
/* const flat = arr => {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flat(cur) : cur)
    }, [])
};
const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "凡星" }];
flat(arr);
// [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "凡星" }]; */

// 第三问：使用栈的思想实现 flat 函数
// 栈思想
/* function flat(arr) {
    const result = [];
    const stack = [].concat(arr); // 将数组元素拷贝至栈，直接赋值回改变原数组
    // 如果栈不为空，则循环遍历
    while(stack.length !== 0) {
        const val = stack.pop();
        if (Array.isArray(val)) {
            // 如果是数组再次入栈，并且展开了一层
            stack.push(...val);
        } else {
            // 如果不是数组就将其取出来放入结果数组中
            result.unshift(val);
        }
    }
    return result;
}
const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "凡星" }];
flat(arr);
// [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "凡星" }]; */

// 第四问：通过传入整数参数控制“拉平”层数
// reduce + 递归
/* function flat(arr, num = 1) {
    return num > 0
        ? arr.reduce(
            (pre, cur) => {
                return pre.concat(Array.isArray(cur) ? flat(cur, num - 1): cur)
            },
            []
        )
        : arr.slice()
};
const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "凡星" }];
flat(arr);
flat(arr, 2);
flat(arr, Infinity); */

// 挑战 A：手写 flat (支持 depth)
// 版本 1：标准递归版 (Reduce 实现)

/**
 * @param {Array} arr - 需要扁平化的数组
 * @param {number} depth - 拍平的层数，默认 1
 */
/* function myFlat(arr, depth = 1) {
    // 1. 边界检查：如果 depth <= 0，不需要拍平，直接返回原数组（浅拷贝）
    if (depth <= 0) return arr.slice(); 

    // 2. 使用 reduce 累加
    return arr.reduce((acc, curr) => {
        // 3. 判断：如果是数组，且还有深度额度（depth > 0）
        if (Array.isArray(curr)) {
            // 核心递归：深度减 1，继续拍平，然后与当前结果拼接
            return acc.concat(myFlat(curr, depth - 1));
        } else {
            // 否则直接加入结果数组
            return acc.concat(curr);
        }
    }, []);
} */

// 手写版本
/* function myFlat(arr, depth = 1) {
    if (depth <= 0 ) return arr.slice();
    
    return arr.reduce((acc, curr) => {
        if (Array.isArray(curr)) {
            return acc.concat(myFlat(curr, depth - 1));
        } else {
            return acc.concat(curr);
        }
    }, []);
}; */

// 能不能写得更简练一点？
// 极简版
/* function myFlat(arr, depth) {
    // 核心逻辑：如果 depth > 0 且当前项是数组，就递归；否则直接保留
    return depth > 0
        ? arr.reduce((acc, curr) => acc.concat(Array.isArray(curr) ? myFlat(curr, depth - 1) : curr), [])
        : arr.slice();
} */

// 这段代码在性能上有什么问题吗？
// 性能痛点：concat 的开销
// 性能优化版（使用 push）
/* function myFlat(arr, depth = 1) {
    if (depth <= 0 ) return arr.slice();
    
    return arr.reduce((acc, curr) => {
        if (Array.isArray(curr)) {
            // 这里用解构 ... 或者 apply 把结果 push 进去
            acc.push(...myFlat(curr, depth - 1));
        } else {
            acc.push(curr);
        }
        return acc; // 必须返回 acc
    }, []);
}; */


/* // 自测
const arr = [1, 2, [3, 4, [5, 6]]];

console.log(myFlat(arr, 1)); 
// 预期: [1, 2, 3, 4, [5, 6]]  (只拍平了一层)

console.log(myFlat(arr, 2)); 
// 预期: [1, 2, 3, 4, 5, 6]    (拍平了两层)

console.log(myFlat(arr, Infinity)); 
// 预期: [1, 2, 3, 4, 5, 6]    (全拍平) */

// 挑战 B：用 reduce 实现 map
/* 
实现思路
1. 执行 callback 拿到结果
2. push 进 acc
3. 返回 acc
*/
/* Array.prototype.myMap = function(callback, context) {
    // 边界检查（可选，加上显得更严谨）
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    return this.reduce((acc, curr, index, array) => {
        // 使用 .call 绑定 this
        // 如果没有传入 context，.call 第一个参数传 undefined 也没事
        const res = callback.call(context, curr, index, array);
        acc.push(res);
        return acc;
    }, []);
};
const user = { multiplier: 2 };

const arr = [1, 2, 3];

// 我们希望 callback 里面的 this 指向 user 对象
const result = arr.myMap(function(val) {
    return val * this.multiplier;
}, user); // 传入 user 作为 thisArg

console.log(result); 
// [2, 4, 6]
// 你的原代码会报错 (Cannot read property 'multiplier' of undefined) 或得到 NaN
// 修正后的代码输出: [2, 4, 6] */

// 深拷贝自测
/* 
实现思路：
1. 如果是非对象类型，直接返回
2. 使用 WeakMap 做判断，之前来过，就直接获取
3. 创建 cloneTarget，根据类型进行赋值数组或对象
4. map.set
5. for in 遍历对象 + hasOwnProperty
6. 递归调用，记得传 map
*/
/* 
它成功解决了三个最核心的问题：
    递归拷贝（基础功能）。
    区分数组和对象（基础类型判断）。
    解决循环引用（核心难点，用 WeakMap 解决）。
*/
// 这个版本默写熟练（这是保底）。
/* function deepClone(target, map = new WeakMap()) {
    if (typeof target !== 'object' || target === null) return target;
    if (map.has(target)) {
        return map.get(target);
    }
    const cloneTarget = Array.isArray(target) ? [] : {};
    map.set(target, cloneTarget);
    
    for (const key in target) {
        if (target.hasOwnProperty(key)) {
            cloneTarget[key] = deepClone(target[key], map);
        }
    }
    return cloneTarget;
};

const obj = {
    a: 1,
    b: [2, 3],
    c: { d: 4 }
};
obj.self = obj; // 循环引用

const result = deepClone(obj);
console.log(result.self === result); // 必须为 true
console.log(result.self === obj);    // 必须为 false (引用的必须是新对象) */

// forEach 遍历数组会自动跳过空元素
/* const eachFlat = (arr = [], depth = 1) => {
    const result = []; // 缓存递归结果
    // 开始递归
    (function flat(arr, depth) {
        // forEach 会自动去除数组空位
        arr.forEach((item) => {
            // 控制递归深度
            if (Array.isArray(item) && depth > 0) {
                // 递归数组
                flat(item, depth - 1);
            } else {
                // 缓存元素
                result.push(item);
            }
        })
    })(arr, depth);
    return result;
}; */

/* 
深拷贝
核心：递归 + WeakMap
关键点：先查 WeakMap，如果有直接返回；没有再创建、先登记、再递归
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
};

const obj = {
    a: 1,
    b: [2, 3],
    c: { d: 4 }
};
obj.self = obj; // 循环引用

const result = deepClone(obj);
console.log(result.self === result); // 必须为 true
console.log(result.self === obj);    // 必须为 false (引用的必须是新对象) */

/* 
数组去重
核心：Set 或 Map
关键点：如果用 Map，利用 !map.has(key) 来过滤
*/

/* const arr = [1, 2, 3, 2, 1, '1', '1'];
// 预期结果：[1, 2, 3, '1']
const unique1 = (arr) => [...new Set(arr)];
console.log(unique1(arr));

const unique2 = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}
console.log(unique1(arr));

const unique3 = (arr) => {
    const res = [];
    const seen = new Map();

    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        // 如果 Map 里没有，就放进去
        if (!seen.has(item)) {
            seen.set(item, true);
            res.push(item);
        }
    }
    return res;
}
console.log(unique1(arr)); */