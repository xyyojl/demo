/* 
手写 instanceof
原理回顾： 沿着左边的 __proto__ 一直往上找，看能不能找到右边的 prototype。
*/
function myInstanceof(left, right) {
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