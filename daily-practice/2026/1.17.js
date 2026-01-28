/* 
如果后端返回的不是标准路由结构（比如是扁平的 id/pid 结构），你怎么生成菜单？”

这是一个常见的数据处理场景。
如果后端返回的是扁平数组（Flat List），我会在前端写一个 listToTree 的工具函数。
利用 Map 做映射，通过一次遍历（O(n) 复杂度）将扁平数据转换为树形结构，然后再进行路由生成和菜单渲染。

核心思路：Map 映射法
1. 第一步（建立索引）：遍历数组，把每个节点存入 Map（或对象），Key 是 id，Value 是节点本身。为了方便，我们顺便给每个节点加一个空的 children: []
2. 第二部（组装树）：再次遍历数组（或者在第一步中同时进行），对于每个节点：
    如果它有 parentId（说明它是子节点），我们就去 Map 里找到它的爸爸，把它 push 进爸爸的 children 里。
    如果它没有 parentId（说明它是根节点），我们就把它放入结果数组 tree
*/


/**
 * 扁平数组转树形结构 (O(n))
 * @param {Array} list 扁平数组
 * @param {string} idKey ID字段名 (默认 'id')
 * @param {string} pidKey 父ID字段名 (默认 'pid')
 */
/* function listToTree(list, idKey = 'id', pidKey = 'pid') {
    const map = {};
    const tree = [];

    // 1. 建立映射表（Map）
    // 这一步是为了后续能通过 ID 瞬间找到节点引用
    list.forEach(item => {
        // 初始化 children，并存入 map
        // 使用 { ...item } 浅拷贝，防止污染原数据
        map[item[idKey]] = { ...item, children: [] };
    });

    // 2. 组装树
    list.forEach(item => {
        const id = item[idKey];
        const pid = item[pidKey];
        const node = map[id]; // 拿到当前节点的引用

        // 如果有父节点，且父节点在 map 中存在
        if (pid !== null && map[pid]) {
            // 找到爸爸，把自己塞进去
            map[pid].children.push(node);
        } else {
            // 没有父节点，说明是根节点
            tree.push(node);
        }
    });

    return tree;
} */

/* 
进阶优化（一次遍历版）
这是一次遍历的核心逻辑：边查边建，占位符策略
在遍历过程中，如果遇到里一个节点，发现它的爸爸还没遍历到（Map 里没有），我们不等待，直接在 Map 里给它爸爸建一个空壳（占位对象），先把儿子塞进去。
等后面真正遍历到爸爸时，再把爸爸的真实数据合并到这个空壳里。
*/

function listToTree(list, idKey = 'id', pidKey = 'pid') {
    const map = {}; // 存储节点引用
    const tree = []; // 结果树

    for (const item of list) {
        const id = item[idKey];
        const pid = item[pidKey];

        // 1. 确保当前节点在 map 中存在（可能是之前作为父节点被占位创建的）
        if (!map[id]) {
            map[id] = { children: [] };
        }

        // 2. 将当前项的真实数据合并到 map[id] 中
        // 注意：保留之前 push 进去的 children
        map[id] = { ...item, children: map[id].children};

        // 3. 处理父节点
        if (pid === null) {
            // 是根节点，直接放入 tree
            tree.push(map[id]);
        } else {
            // 是子节点，找爸爸
            if (!map[pid]) {
                // 关键点：爸爸还没遍历到？先帮爸爸创建一个“占位壳”
                map[pid] = { children: [] };
            }
            // 把自己塞到爸爸的 children 里
            map[pid].children.push(map[id]);
        }
    }

    return tree;
}

// 自测
const menuList = [
    { id: 1, pid: null, name: '系统管理' },
    { id: 2, pid: 1, name: '用户管理' },
    { id: 3, pid: 1, name: '角色管理' },
    { id: 4, pid: null, name: '订单管理' },
    { id: 5, pid: 4, name: '订单列表' },
    { id: 6, pid: 2, name: '用户新增' } // 三级菜单
];

const treeData = listToTree(menuList);
console.log(JSON.stringify(treeData, null, 2));