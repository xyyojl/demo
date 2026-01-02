// 手写实战：Mini-Webpack Runtime
/* 
核心逻辑
1. 把所有模块的代码放进一个对象里（Key 是路径，Value 是包裹了代码的函数）
2. 实现一个 require 函数，负责执行代码并缓存结果
3. 从入口文件开始递归执行

面试必答
Webpack 打包出的文件本质上是一个 IIFE（立即执行函数）。
它内部维护了一个 installedModules 缓存对象和一个 __webpack_require__ 函数。
所有的业务代码都被包裹在函数中作为参数传入，通过 __webpack_require__ 递归调用和执行。
*/

// 自执行函数（IIFE），参数 modules 是一个对象，存放所有模块
(function(modules) {
    // 1. 模块缓存对象（避免重复执行）
    var installedModules = {};

    // 2. 核心：自定义的 require 函数
    function __webpack_require__(moduleId) {
        // A. 检查缓存：如果模块已经加载过，直接返回缓存的 exports
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }

        // B. 创建新模块，并放入缓存
        var module = installedModules[moduleId] = {
            i: moduleId, // ID
            l: false,    // Loaded 是否已加载
            exports: {}  // 导出对象
        };

        // C. 执行模块代码
        // modules[moduleId] 是下面传入的函数
        // 传入参数：module, module.exports, __webpack_require__
        // 这里的 call 保证了模块内部的 this 指向 module.exports
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // D. 标记为已加载
        module.l = true;

        // E. 返回导出的内容
        return module.exports;
    }

    // 3. 启动：加载入口模块（假设入口 ID 是 0）
    return __webpack_require__(0);
})(
// 4. 传入参数：模块定义对象（路径 -> 函数）
{
    // 模块 0 （入口文件 index.js）
    0: function(module, exports, __webpack_require__) {
        console.log("我是入口文件");
        // 引用模块 1
        var result = __webpack_require__(1);
        console.log("收到模块1的结果:", result); 
    },
    // 模块 1 （utils.js）
    1: function(module, exports, __webpack_require__) {
        console.log("我是模块 1");
        module.exports = "Hello Webpack!";
    }
});