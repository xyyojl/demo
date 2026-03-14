// 第三题：闭包与属性修改
// 不修改 Foo 代码块的前提下如何修改 foo 属性 a 的值
var Foo = (function() {
    var foo = {
        a: 10
    }
    return {
        get: function(prop) {
            return foo[prop]
        }
    }
})()
/* 
原理解析
1. Foo.get('getPrivateObj') 在执行时实际返回的是 foo['getPrivateObj']。
2. 引擎在 foo 对象自身上找不到 getPrivateObj 属性，于是沿着原型链（__proto__）找到了 Object.prototype.getPrivateObj。
3. 发现这是一个访问器属性，立刻执行它的 get() 方法。
4. 核心机制【关键】：在 JavaScript 中，谁调用了方法，this 就指向谁。这里是 foo 发起的属性访问，所以 get() 内部的 this 就是 foo 对象。
5. 最终返回了 this，也就把内部的 foo 暴露到了外部。我们拿到引用后，自然就能随意修改它的属性了。
提示：在真实项目中，为了防范这种原型链污染导致的数据泄露，通常可以把内部对象创建为 Object.create(null)（即没有原型），这样它就不会继承 Object.prototype 上的任何恶意的 getter 了。
*/

// 代码实现：
// 第一步：在 Object 原型上临时定义一个带有 getter 的属性
Object.defineProperty(Object.prototype, 'getPrivateObj', {
    get() {
        // 这里的 this 会指向触发该 getter 的对象，即闭包内部的 foo
        return this;
    },
    configurable: true // 设置为可配置，方便用完后删除，避免污染全局
});

// 第二步：通过 Foo.get 触发刚才定义的 getter，拿到真实的 foo 对象引用
var internalFoo = Foo.get('getPrivateObj');

// 第三步：直接修改内部对象的属性 a
internalFoo.a = 20;

// 第四步：清理原型链污染（好习惯）
delete Object.prototype.getPrivateObj;

// 测试结果：
console.log(Foo.get('a')); // 输出 20


// 第四题：深拷贝（处理循环引用）
// 实现对 a1 对象的深拷贝
var a1 = {
    b: {
        d: {
            e: 10
        }
    },
    c: [
        'f',
        'g'
    ]
}
a1.newObj = a1

// 代码实现：
function deepClone(obj, hash = new WeakMap()) {
    // 1. 如果是基本数据类型（或 null），直接返回
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // 2. 如果在 hash 中查到了该对象，证明之前已经拷贝过它（触发了循环引用）
    // 直接返回 hash 中存储的新对象引用，不仅节省性能，还能防止递归死循环
    if (hash.has(obj)) {
        return hash.get(obj);
    }

    // 3. 根据原对象的类型（数组 or 对象）初始化新容器
    const cloneTarget = Array.isArray(obj) ? [] : {};

    // 4. 【核心一步】在递归拷贝属性之前，必须先把当前正在拷贝的对象存入 hash 中！
    // 键为原对象 obj，值为新拷贝的对象 cloneTarget
    hash.set(obj, cloneTarget);

    // 5. 遍历并递归拷贝各个属性
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloneTarget[key] = deepClone(obj[key], hash);
        }
    }

    return cloneTarget;
}

// 验证
var a2 = deepClone(a1);
console.log('--- 验证第四题深拷贝 ---');
console.log(a2);
console.log('处理循环引用结果:', a2.newObj === a2); // true
console.log('------------------------');

/*
【原理解析】
1. 为什么用 WeakMap 而不仅用递归？
如果不记录已经拷贝过的对象，当遇到诸如 a1.newObj = a1 这种循环引用时，递归会陷入无限死循环，最后抛出栈溢出（或在使用 JSON.parse(stringify) 时报 TypeError: Converting circular structure to JSON）。

2. WeakMap 扮演了什么角色？
它相当于一个“备忘录”。键是“原对象”，值是“拷贝出的新对象”。
每次准备深拷贝一个对象前，先去这个备忘录里查一下：
- 如果没有，就开辟新空间拷贝它，并立刻记录进备忘录（hash.set(obj, cloneTarget)）。
- 如果查到了，说明这个对象之前已经拷贝过（在这条路径上遇到了环），直接返回备忘录里记录的新对象引用即可，巧妙打破了死循环。

3. 为什么是 WeakMap 而不是 Map？
WeakMap 的键必须是对象，且它是“弱引用”的。当我们要深拷贝的源对象（obj）在外部不被使用需要销毁时，WeakMap 不会阻碍垃圾回收机制把它收走，从而避免了内存泄露（我们只在深拷贝执行的这短暂时间里需要这个备忘录）。
*/

// 第五题：this 指向
x = 9;
var module = {
    x: 81,
    getX() {
        return this.x;
    }
}

const retrieveX  = module.getX;
console.log(retrieveX());

// 输出内容：
// 9

/* 
原理解析：
1. 变量提升：全局变量 x 被提升并初始化为 9。
2. 引用赋值：retrieveX 只是 module.getX 方法的一个普通函数引用，它不再是 module 对象的方法。
3. 独立执行：当调用 retrieveX() 时，它是在全局上下文中执行的，此时 this 指向全局对象（浏览器中是 window）。
4. 访问全局变量：全局对象上存在 x = 9，因此 this.x 也就是 window.x，最终返回 9。

如果想让它输出 81，需要显式绑定 this：
const retrieveX = module.getX.bind(module);
console.log(retrieveX()); // 输出 81
*/

// 第六题：对象解构
// 实现对一个对象进行解构，类数组解构
// 代码实现：
Object.prototype[Symbol.iterator] = function* () {
    // 使用 generator 委托 yield 产出所有的 value 
    yield* Object.values(this);
};

var [a, b] = {
    a: 10,
    b: 'foo'
}

/* 
原理解析：
1. 为什么不能直接解构对象为数组：因为数组的解构赋值和扩展运算符（...）背后依赖的是“可迭代协议”（Iterable Protocol），即目标必须要具有 `Symbol.iterator` 这个方法（比如 Array、Map、Set 等自带）。
2. 普通对象默认情况下是没有 `Symbol.iterator` 的，所以会报错 `TypeError: {...} is not iterable`。
3. 解决方案：我们在原型链顶端 `Object.prototype` 上为其挂载一个生成器函数。
4. 调用过程：当执行 `var [a, b] = {...}` 时，系统会调用该对象的 `[Symbol.iterator]()`。这里我们用 `yield* Object.values(this)` 把对象里的所有值（在这个例子里是 `[10, 'foo']`）迭代产出，就顺利赋值给 `a` 和 `b` 了。
*/
console.log(a, b); // 正确输出 : 10 foo

// 第七题：（网络协议）TCP 协议
// TCP 三次握手和四次挥手过程（画图）
/* 
参考答案与解析：

【一】TCP 三次握手 (建立连接)
作用：确认双方的接收能力和发送能力是否正常、指定自己的初始化序列号为后面的可靠性传送做准备。

状态转换与过程图：
客户端 (Client)                                  服务端 (Server)
CLOSED                                          LISTEN (监听端口)
  |                                               |
  | ------- 1. SYN=1, seq=x (请求建连) --------->   |
SYN-SENT                                        SYN-RCVD
  |                                               |
  | <---- 2. SYN=1, ACK=1, ack=x+1, seq=y ------- |
ESTABLISHED                                       |
  |                                               |
  | ------- 3. ACK=1, ack=y+1, seq=x+1 ---------> |
  |                                             ESTABLISHED

详细机制：
1. 第一次握手：客户端发送 SYN 报文（SYN=1，随机序列号 seq=x）给服务端，进入 SYN_SENT 状态。
   - 证明：尚无结论。
2. 第二次握手：服务端收到 SYN 报文，回复 SYN+ACK 报文（SYN=1，ACK=1，确认号 ack=x+1，随机序列号 seq=y），进入 SYN_RCVD 状态。
   - 证明：服务端确认了【客户端的发送正常，自己的接收正常】。
3. 第三次握手：客户端收到服务端的 SYN+ACK 报文，回复 ACK 报文（ACK=1，确认号 ack=y+1，序列号 seq=x+1）给服务端。随后客户端进入 ESTABLISHED（已连接）状态，服务端收到后也进入 ESTABLISHED 状态。
   - 证明：客户端确认了【服务端的收发正常，自己的收发正常】。服务端收到此报文后也确认了【客户端的接收正常，自己的发送正常】。至此，双方都确认彼此收发正常，连接建立。


【二】TCP 四次挥手 (断开连接)
作用：优雅地断开连接，确保数据都能完整传输完毕。

状态转换与过程图：
客户端 (Client)                                  服务端 (Server)
ESTABLISHED                                     ESTABLISHED
  |                                               |
  | ------- 1. FIN=1, seq=u (请求断开) --------->   |
FIN-WAIT-1                                      CLOSE-WAIT
  |                                               |
  | <------- 2. ACK=1, ack=u+1 ------------------ | (服务端可能还在发送剩余数据)
FIN-WAIT-2                                        | 
  |                                               |
  | <------- 3. FIN=1, ACK=1, ack=u+1, seq=w ---- |
TIME-WAIT                                       LAST-ACK
  |                                               |
  | ------- 4. ACK=1, ack=w+1, seq=u+1 ---------> |
  |                                             CLOSED
(等待 2MSL 时间后)
CLOSED

详细机制：
1. 第一次挥手：客户端数据发送完毕，发送 FIN 报文（FIN=1，序列号 seq=u），告诉服务端“我没有数据要发了”，客户端进入 FIN_WAIT_1 状态。
2. 第二次挥手：服务端收到 FIN 报文，回复 ACK 报文（ACK=1，确认号 ack=u+1），进入 CLOSE_WAIT 状态。
   - 作用：告诉客户端“我收到你的断开请求了，但我可能还有数据没发完，你等我一下”。此时客户端收到后进入 FIN_WAIT_2 状态，变成只能接收不能发送的状态。
3. 第三次挥手：服务端把剩余数据发送完毕后，发送 FIN 报文（FIN=1，ACK=1，确认号 ack=u+1，序列号 seq=w），进入 LAST_ACK 状态。
   - 作用：告诉客户端“我的数据也发完了，可以正式断开了”。
4. 第四次挥手：客户端收到 FIN 报文后，回复 ACK 报文（ACK=1，确认号 ack=w+1，序列号 seq=u+1），进入 TIME_WAIT 状态。服务端收到此报文后直接进入 CLOSED 状态。
   - 作用：客户端等待 2MSL（报文最大生存时间的 2 倍）后，才真正进入 CLOSED 状态。防止服务端的最后一个 ACK 丢包导致服务端无法正常关闭，同时也防止“已失效的请求报文段”出现在下一个新连接中。
*/


// 第八题：（网络协议）HTTP 协议
// http 协议的请求报文和响应报文有哪几个部分组成？以及每个部分具体有哪些字段构成，这些字段分别代表什么含义
/* 
参考答案与解析：

HTTP 报文都是由【三部分】组成的：起始行（请求行/状态行）、首部（Header，即请求头/响应头）、实体（Body，即请求体/响应体）。

---
【一】HTTP 请求报文 (Request Message)
结构：请求行 + 请求头 + 空行 + 请求体

1. 请求行 (Request Line)
   包含 3 个字段（由空格分隔）：
   - 请求方法 (Method)：如 GET, POST, PUT, DELETE 等，表示对资源执行的操作。
   - 请求 URL (Request-URI)：如 `/api/login`，指明要访问的资源路径（有时也带查询参数）。
   - HTTP 版本协议 (HTTP Version)：如 `HTTP/1.1`，表示使用的 HTTP 版本。
   示例：`POST /api/login HTTP/1.1`

2. 请求头 (Request Header)
   由键值对（Key: Value）组成，用于传递客户端本身的环境信息或请求的附加属性。
   常见字段：
   - Host：请求的目标域名和端口（如 `www.example.com`）。
   - User-Agent：告诉服务端客户端的系统和浏览器信息（如 `Mozilla/5.0 ...`）。
   - Accept：客户端能接收的响应内容类型（如 `application/json`, `text/html`）。
   - Content-Type：请求体中发送的数据格式（如 `application/json`, `application/x-www-form-urlencoded`）。
   - Authorization：携带身份验证凭证（如 Bearer Token）。
   - Cookie：携带保存在客户端的会话状态信息。

3. 空行 (CRLF)
   一个只有回车符和换行符的空行，用于告诉服务器“请求头已经结束，接下来是请求体了”。（这是必不可少的分隔符）

4. 请求体 (Request Body)
   客户端发给服务端的具体数据。GET 请求通常没有请求体，POST/PUT 请求常用来传输 JSON 数据、表单或文件。
   示例：`{"username": "admin", "password": "123"}`


---
【二】HTTP 响应报文 (Response Message)
结构：状态行 + 响应头 + 空行 + 响应体

1. 状态行 (Status Line)
   包含 3 个字段（由空格分隔）：
   - HTTP 版本协议 (HTTP Version)：如 `HTTP/1.1`。
   - 状态码 (Status Code)：一个 3 位数字，如 `200`（成功）、`404`（找不到）、`500`（服务器错误）。
   - 状态描述 (Reason Phrase)：对状态码的简短文字解释，如 `OK`, `Not Found`。
   示例：`HTTP/1.1 200 OK`

2. 响应头 (Response Header)
   由键值对组成，用于传递服务器本身的信息或响应数据的附加属性。
   常见字段：
   - Server：告诉客户端服务端的软件环境信息（如 `nginx/1.22.0`）。
   - Content-Type：响应体中返回的数据格式（如 `application/json; charset=utf-8`）。
   - Content-Length：响应体的字节长度。
   - Set-Cookie：服务端要求客户端保存的 Cookie 信息。
   - Cache-Control：缓存策略控制（如 `no-cache`, `max-age=3600`）。
   - Access-Control-Allow-Origin：CORS 跨域资源共享的配置字段。

3. 空行 (CRLF)
   与请求报文一样，用于标志响应头结束，区分下面的响应体内容。

4. 响应体 (Response Body)
   服务端真正返回给客户端的数据。通常是 JSON 数据、HTML 页面字符串、图片二进制流等。
   示例：`{"code": 0, "message": "success", "data": { ... }}`
*/

