// 题目1
/* var func = 1
function func() { }
console.log(func + func) */

/* 
输出：2
*/

// 题目2
/* let obj1 = { x: 1 }
let obj2 = obj1
obj2.y = 2
obj2 = { y: 20 }
console.log('obj1', obj1) */

/* 
输出：obj1 { x: 1, y: 2 }
*/

// 题目3
/* const User = {
    count: 1,
    getCount: function () {
        return this.count
    },
}
console.log('a ', User.getCount()) // what?
const func = User.getCount
console.log('b', func()) // what? */

/* 
输出：
a 1
b undefined
*/

// 题目4
/* const obj = {
  f1() {
    const fn = () => {
      console.log('this1', this)
    }
    fn()
    fn.call(window)
  },
  f2: () => {
    function fn() {
      console.log('this2', this)
    }
    fn()
    fn.call(this)
  },
}
obj.f1()
obj.f2() */

/* 
输出：
this1 obj
this1 obj
this2 window
this2 window
注：
this 的核心原则只有一句话：**this 的指向，是在函数被调用的时候决定的，而不是定义的时候决定的。**（箭头函数除外）。
箭头函数**没有自己的 this**。它只认**定义时**外层作用域（父级作用域）的 this。
*/

// 题目5
/* let i
for (i = 1; i <= 3; i++) {
    setTimeout(function () {
        console.log(i)
    }, 0)
} */
/* 
输出：4 4 4
i 是全局变量，用来控制循环。循环调用了 3 次 setTimeout 延迟执行。当 setTimeout 执行的时候，i 已经变成了 4。
*/

// 题目6
/* let n = 10
function f1() {
    n++ // 11
    function f2() {
        function f3() {
            n++ // 21
        }
        let n = 20
        f3()
        n++ // 22
    }
    f2()
    n++ // 12
}
f1()
console.log('n', n) */
/*
输出：n 12

*/

// 题目7
/* const n = 10
function print() {
    console.log(n)
}

function f1(fn) {
    const n = 20
    fn()
}
f1(print) */
/*
输出：10
注：作用域在函数定义时就已经确定了，而不是在函数调用时确定。
*/

// 题目8
/* function fn() {
    let num = 10
    return {
        set: (n) => (num = n),
        get: () => num,
    }
}

let num = 20
const { get, set } = fn()
console.log('result1: ', get())
set(100)
console.log('result2: ', num) */

/* 
输出：
result1: 10
result2: 20
*/

