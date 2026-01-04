// 编写 Schema 配置
// 定义表单的配置项
export const formSchema = [
    // --- 组件 1：普通输入框 ---
    {
        key: 'username', // 建议加上唯一 key
        // 1. 组件类型：字符串映射，将来会在 <component :is> 中使用
        // 你可以映射到 ElementPlus 的 'el-input' 或自定义组件 'BaseInput'
        component: 'Input',

        // 2. 字符串（Field/Path）：对应 formData 中的属性名
        field: 'username',

        // 3. 标签名
        label: '用户名',

        // 4. UI 配置（props）：这些属性会被 v-bind 直接透传给组件
        // 这样做的好处是：Schema 层不需要知道组件具体有哪些 props，实现了“解耦”
        props: {
            placeholder: '请输入真实姓名',
            clearable: true,
            prefixIcon: 'User' // 假设用的是 Element Plus
        },

        // 5. 校验规则（标准 Async-Validator 格式）
        rules: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
        ]
    },

    // 布局组件（Card 嵌套）
    {
        key: 'layout_card_1',
        component: 'Card',
        label: '详细信息（嵌套布局）',
        isLayout: true, // 🔥 标记为布局组件
        props: { shadow: 'hover' }, // ElCard 的属性
        children: [
            // Card 里面的子表单项
            // --- 组件：下拉选择框 (联动触发源) ---
            {
                key: 'role',
                component: 'Select',
                field: 'role',
                label: '角色',
                props: {
                    placeholder: '请选择您的角色',
                    // 下拉选项数据
                    options: [
                        { label: '普通用户', value: 'user' },
                        { label: '管理员', value: 'admin' }, // 选中这个，下面的输入框才会显示
                        { label: '超级 VIP', value: 'vip' },
                    ]
                }
            },
            // --- 组件：受控输入框 (联动目标) ---
            // 联动组件放这里，测试递归环境下的联动
            {
                key: 'adminKey',
                component: 'Input',
                field: 'adminKey',
                label: '管理员密钥',
                props: {
                    placeholder: '请输入6位密钥',
                    type: 'password'
                },
                // 🔥【难点设计】联动逻辑（Linkage）
                // 这是一个函数，接收当前的 formData 模型
                // 返回 true 显示，返回 false 隐藏
                // 面试官问：为什么用函数？答：灵活性最高，这是 JS 的优势。
                showIf: (model) => model.role === 'admin',
                rules: [
                    { required: true, message: '管理员必须输入密钥', trigger: 'blur' }
                ]
            },
        ]
    },

    // --- 组件 4：开关 ---
    {
        key: 'isPublic',
        component: 'Switch',
        field: 'isPublic',
        label: '是否公开资料',
        props: {
            activeText: '公开',
            inactiveText: '保密'
        }
    },
];