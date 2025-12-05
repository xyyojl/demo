// 防抖
/* function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        const context = this;
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    }
} */

// 虚拟 DOM (VDOM) 到底是什么？
/* 
它就是一个纯粹的 javaScript 对象。
真实 DOM：浏览器里的 <div> 节点，属性几百个，操作它非常慢（因为会触发回流重绘）
虚拟 DOM：我们用 JS 对象模拟出来的“替身”。它很轻，只有关键信息（标签名、属性、子节点）

面试必问结论：
虚拟 DOM 本质上就是用 JS 对象来描述 DOM 结构。它的主要价值在于：
1. 具备跨平台能力（可以渲染到安卓/IOS）
2. 提供了一个性能下限（通过 Diff 算法批量更新，避免频繁的暴力 DOM 操作）
*/

/* <!-- 真实 HTML -->
<div id="app" class="container">
  <h1>Hello</h1>
</div> */

// 虚拟 DOM（VNode）
// tag props children
/* const vnode = {
    tag: 'div',
    props: { id: 'app', class: 'container' },
    children: [
        { tag: 'h1', children: 'Hello' }
    ]
} */

// 手写 VNode 对象，表示如下 DOM 节点
{/* <div class="container">
    <img src="x1.png" />
    <p>hello</p>
</div> */}

/* const vnode = {
    tag: 'div',
    props: {
        class: 'container'
    },
    children: [
        {
            tag: 'img',
            props: {
                src: 'x1.png'
            }
        },
        {
            tag: 'p',
            props: {},
            children: 'hello'
        }
    ]
} */

/* const vnode = {
    tag: 'div',
    props: {
        class: 'container',
    },
    children: [
        {
            tag: 'img',
            props: {
                src: 'x1.png',
            },
        },
        {
            tag: 'p',
            props: {},
            children: ['hello'],
        },
    ],
} */


// 目标 HTML
{/* <div id="app" class="container">
  <h1 style="color: red">Hello VNode</h1>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div> */}

// 原始版：手动写 JSON (VNode 结构)
/* const vnode = {
    // 1. 标签名
    tag: 'div',
    // 2. 属性（props/attrs/style）
    props: {
        id: 'app',
        class: 'container'
    },
    // 3. 子节点（children）
    children: [
        {
            tag: 'h1',
            props: {
                style: 'color: red'
            },
            children: 'Hello VNode' // 文本节点
        },
        {
            tag: 'ul',
            props: {},
            children: [
                {
                    tag: 'li',
                    props: {},
                    children: 'Item 1'
                },
                {
                    tag: 'li',
                    props: {},
                    children: 'Item 2'
                }
            ]
        }
    ],
    // 4. 真实 DOM 引用（一开始是 null，mount 后会指向真实 DOM）
    el: null
}; */

/* 
工程版：手写 h 函数 (面试实战)
手动写上面那个 JSON 太累了。我们需要一个工厂函数 h 来自动生成它。

代码要求：
1. 接收 tag,props,children
2. 判断 children 是数组还是文本
3. 返回 VNode 对象
*/

/* function h(tag, props, children) {
    // 定义 VNode 骨架
    const vnode = {
        tag: tag,
        props: props || {}, // 防止传 null
        children: undefined,
        text: undefined,
        el: null
    };

    // 处理 children
    if (typeof children === 'string' || typeof children === 'number') {
        // 情况 A：子节点是文本
        vnode.text = String(children);
    } else if (Array.isArray(children)) {
        // 情况 B：子节点是数组
        vnode.children = children;
    }

    return vnode;
}

// --- 🧪 自测代码 ---

// 用 h 函数生成上面的结构
const myVNode = h('div', { id: 'app', class: 'container' }, [
    h('h1', { style: 'color: red' }, 'Hello VNode'),
    h('ul', null, [
        h('li', null, 'Item 1'),
        h('li', null, 'Item 2')
    ])
]);

console.log(myVNode); */

/**
 * 将 VNode 渲染为真实 DOM，并挂载到容器上
 * @param {Object} vnode - 虚拟 DOM 对象
 * @param {HTMLElement} container - 挂载的目标容器
 */
// 手写 render 函数
function render(vnode, container) {
    // 1. 处理文本节点（如果 children 里直接传了字符串）
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        const textNode = document.createTextNode(String(vnode));
        container.appendChild(textNode);
        return;
    }

    // 2. 创建真实 DOM 元素
    const el = document.createElement(vnode.tag);

    // 🔥【关键一步】建立链接
    // 将真实 DOM 保存到 VNode.el 上
    // 这一步对于后续的 Diff 算法至关重要（否则 Diff 时找不到要操作谁）
    vnode.el = el;

    // 3. 处理属性（Props / Events / Style）
    if (vnode.props) {
        for (const key in vnode.props) {
            const value = vnode.props[key];

            // A. 处理事件（以 on 开头，如 onClick）
            if (key.startsWith('on')) {
                // onClick -> click
                const eventName = key.slice(2).toLowerCase();
                el.addEventListener(eventName, value);
            }
            // B. 处理 Style（对象形式）
            else if (key === 'style' && typeof value === 'object') {
                for (const styleName in value) {
                    el.style[styleName] = value[styleName];
                }
            }
            // C. 处理普通属性（id, class）
            else {
                el.setAttribute(key, value);
            }
        }
    }

    // 4. 处理子节点（递归渲染）
    if (vnode.text) {
        // 情况 A: 纯文本
        el.textContent = vnode.text;
    } else if (Array.isArray(vnode.children)) {
        // 情况 B: 数组子节点 -> 递归
        vnode.children.forEach(child => {
            // 注意：这里的容器变成了当前创建的 el
            render(child, el);
        });
    }

    // 5. 挂载到容器
    container.appendChild(el);
}

/* 
写完代码后，你要主动解释这 3 个核心逻辑，展示你的专业度：
1. vnode.el = el 的意义：
    我在创建真实 DOM 后，立刻把它赋值给了 vnode.el。这是为了以后的 Diff 更新做准备。因为 VNode 只是数据，当我们需要修改页面时，
    必须通过 vnode.el 找到那个真实的 DOM 节点才能操作
2. 递归挂载（Recursion）
    在处理 children 时，我使用了深度优先的递归，父节点先创建，然后递归创建子节点，把子节点 append 到父节点上，最后把父节点 append 到容器上。
3. 属性区分处理：
    对于 props，不能一股脑用 setAttribute。特别是事件（EventListener）和样式对象（Style Obejct），需要特殊处理
*/

/* 
这是虚拟 DOM 中最核心、也是最复杂的环节——Diff 流程（Patch）。
在面试的手写环节，面试官通常不会让你手写完整的“双端比较”或“最长递增子序列”（那个代码量太大了，白板写不完）。
面试官真正想要考察的是你对 Diff 宏观流程 的掌控：
1. 判断是不是同一个节点？（不是就暴力替换）
2. 是同一个节点 -> 复用 DOM -> 更新属性 -> 更新子节点
3. 子节点的三种情况处理（文本 VS 文本、文本 VS 数组、数组 VS 数组）
*/

// 0. 辅助函数：挂载 (就是之前的 render)
function mount(vnode, container) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        const textNode = document.createTextNode(String(vnode));
        container.appendChild(textNode);
        return;
    }

    const el = document.createElement(vnode.tag);
    vnode.el = el;

    if (vnode.props) {
        for (const key in vnode.props) {
            const value = vnode.props[key];

            if (key.startsWith('on')) {
                // onClick -> click
                const eventName = key.slice(2).toLowerCase();
                el.addEventListener(eventName, value);
            } else if (key === 'style' && typeof value === 'object') {
                for (const styleName in value) {
                    el.style[styleName] = value[styleName];
                }
            } else {
                el.setAttribute(key, value);
            }
        }
    }

    if (vnode.text) {
        el.textContent = vnode.text;
    } else if (Array.isArray(vnode.children)) {
        vnode.children.forEach(child => {
            mount(child, el);
        });
    }
    container.appendChild(el);
}
// 简易 Diff (Patch)
// ==========================================
// 🔥 核心函数：Patch (Diff 的入口)
// n1: 旧节点 (Old VNode)
// n2: 新节点 (New VNode)
// ==========================================

function patch(n1, n2) {
    // 1.【判断身份】标签不一样？直接暴力替换！
    if (n1.tag !== n2.tag) {
        const parent = n1.el.parentNode;
        const anchor = n1.el.nextSibling; // 记住位置
        parent.removeChild(n1.el); // 删旧
        mount(n2, parent); // 建新
        // 如果有 anchor 需要插入到 anchor 前面，这里简化处理
        return;
    }

    // 2. 【复用 DOM】标签一样，那是自己人
    // 核心操作：把旧节点的 DOM 引用给新节点（传火）
    const el = (n2.el = n1.el);

    // 3. 【更新属性】（Props Diff）
    // 简化版：这里略过具体的 style/class 比对，假设我们有个 updateProps 函数
    // updateProps(el, n1.props, n2.props);

    // 4. 【更新子节点】（Children Diff）-- 核心中的核心
    const oldCh = n1.children || [];
    const newCh = n2.children || [];
    const oldText = n1.text;
    const newText = n2.text;

    // --- 情况 A: 新节点是纯文本 ---
    if (newText !== undefined) {
        // 无论旧的是数组还是文本，只要内容不一样，直接改 textContent
        // 注：textContent 会自动清空旧的子元素
        if (newText !== oldText) {
            el.textContent = newText;
        }
    }
    // --- 情况 B: 新节点是数组 ---
    else {
        // 🔥 这里才是真正的 Diff 算法战场 (双端比较 / LIS)
        // 面试手写通常写不出完整算法，写个简易版逻辑即可：

        // 简单处理：取最小长度，一一比对
        const commonLength = Math.min(oldCh.length, newCh.length);
        for (let i = 0; i < commonLength; i++) {
            patch(oldCh[i], newCh[i]); // 递归更新
        }

        // 新的比旧的多 -> 新增
        if (newCh.length > oldCh.length) {
            newCh.slice(commonLength).forEach(child => mount(child ,el));
        }
        // 旧的比新的多 -> 删除
        else if (newCh.length < oldCh.length) {
            oldCh.slice(commonLength).forEach(child => {
                el.removeChild(child.el);
            })
        }
    }
}

/* 
设计细节
1. 为什么第一步是 n2.el = n1.el？
    这是 Diff 的前提。因为 n2 是新创建的对象，它没有 el（真实 DOM 引用）。既然我们判断出 n1 和 n2 是同类节点，
    就要复用 n1 的 el，否则后续的操作（如 el.textContent）找不到对象

2. 子节点更新的互斥逻辑
    子节点更新其实就是几种情况的排列组合：
        新的是文本：不管旧的是啥，直接 el.textContent 覆盖（效率最高）
        新的是数组：
            旧的是文本：清空文本，循环 mount 心数组
            旧的是数组：这就是最复杂的 Diff 核心，需要对比两个数组的差异（这里我写了简化版，真实 Vue 会用双端比较或 LIS 算法来尽可能复用节点）
3. 递归更新（patch(oldCh[i], newCh[i])）
    Diff 是深度优先的。当对比两个数组时，如果发现对应位置的子节点也是同类节点，会再次调用 patch 递归进去，直到叶子节点。
*/
