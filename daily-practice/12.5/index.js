/* // 引入 snabbdom 库
const snabbdom = window.snabbdom;

// 将 vnode（虚拟节点）塞入空的容器中
const patch = snabbdom.init([
    snabbdom_class,
    snabbdom_props,
    snabbdom_style,
    snabbdom_eventlisteners
]);
// 创建 vnode（虚拟节点）
const h = snabbdom.h;

// 空的容器
const container = document.getElementById('container');

// 创建 vnode
let vnode = h('ul#list', {}, [
    h('li.item', {}, '第一项'),
    h('li.item', {}, '第二项')
])
// vnode -> 空容器
patch(container, vnode);

// 点击按钮
const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
    const newVnode = h('ul#list', {}, [
        h('li.item', {}, '第一项'),
        h('li.item', {}, '第二项111'),
        h('li.item', {}, '第三项'),
    ]);
    // 用新的vnode -> 更新老的 vnode
    patch(vnode, newVnode);

    vnode = newVnode;
}); */

// h 函数负责画图纸（生成 VNode），render 函数负责盖房子（生成真实 DOM）。
/* function h(tag, props, children) {
    const vnode = {
        tag: tag,
        props: props || {},
        children: undefined,
        text: undefined,
        el: null
    };
    if (typeof children === 'string' || typeof children === 'number') {
        vnode.text = String(children);
    } else if (Array.isArray(children)) {
        vnode.children = children;
    }

    return vnode;
} */

/**
 * 将 VNode 渲染为真实 DOM，并挂载到容器上
 * @param {Object} vnode - 虚拟 DOM 对象
 * @param {HTMLElement} container - 挂载的目标容器
 */

/* // 手写 render 函数
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

// 第一步：用 h 生成 VNode
const myVNode = h('div', { id: 'box', style: { border: '1px solid red', padding: '20px' } }, [
    h('h2', { style: { color: 'blue' } }, '手写 Render 函数'),
    h('button', { 
        onClick: () => alert('Hello World!') 
    }, '点击我'),
    h('ul', null, [
        h('li', null, '苹果'),
        h('li', null, '香蕉')
    ])
]);

// 第二步：获取容器
const app = document.getElementById('app');

// 第三步：渲染！
render(myVNode, app); */

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

// Diff 流程模拟测试
const container = document.getElementById('app');

// 1. 初次渲染
const vnode1 = {
    tag: 'div',
    children: [
        { tag: 'p', text: 'A' },
        { tag: 'p', text: 'B' },
    ]
};
mount(vnode1, container);
console.log('渲染完毕: A, B');

// 2. 更新（点击按钮后）
const udpateBtn = document.getElementById('udpateBtn');

udpateBtn.addEventListener('click', function() {
    const vnode2 = {
        tag: 'div',
        children: [
            { tag: 'p', text: 'A' }, // 不变
            { tag: 'p', text: 'C' }, // 变文本
            { tag: 'span', text: 'D' }, // 新增
        ]
    };

    // 执行 Diff
    patch(vnode1, vnode2);
    console.log('更新完毕: A, C, D');
}, { once: true });