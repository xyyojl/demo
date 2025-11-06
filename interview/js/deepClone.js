/**
 * 手写深拷贝
 */

const obj1 = {
    age: 20,
    name: '凡星',
    address: {
        city: '北京'
    },
    arr: ['a', 'b', 'c']
};

const obj2 = deepClone(obj1);
obj2.address.city = '上海';
obj2.arr[0] = 'a1';
console.log(obj1.address.city);
console.log(obj1.arr[0]);
console.log('obj1', obj1);
console.log('obj2', obj2);


/**
 * 深拷贝
 * @param {Object} obj 要拷贝的对象
 */
/* 
    实现思路 v1.0.0
    1.类型判断：判断 obj，如果 obj 是 null，或者不是对象和数组，直接返回
    2.初始化返回结果
    3.遍历属性并递归拷贝
    4.返回结果
*/
function deepClone(obj = {}) {
    if (typeof obj !== 'object' || obj == null) {
        // obj 是 null，或者不是对象和数组，直接返回
        return obj;
    }
    
    // 初始化返回结果
    let result;
    if (obj instanceof Array) {
        result = [];
    } else {
        result = {};
    }

    // 做处理
    for (let key in obj) {
        // 保证 key 不是原型的属性
        if (obj.hasOwnProperty(key)) {
            // 递归调用！！！
            result[key] = deepClone(obj[key]);
        }
    }

    // 返回结果
    return result;
}