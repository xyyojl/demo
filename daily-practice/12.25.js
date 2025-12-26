// schema-design
export const formSchema = [
    // --- 第 1 个控件：文本输入框 ---
    {
        // 1. component：告诉引擎，我要渲染什么组件？
        // 这里的字符串：'Input' 将来会映射到 <el-input> 或 <a-input>
        component: 'Input',

        // 2. label：表单左边的文字标签
        label: '用户名',

        // 3. field：核心中的核心！
        // 它对应最后表单数据对象中的 key。例如：formData.username
        field: 'username',

        // 4. props：传递给组件的属性（UI 配置）
        // 这些属性会通过 v-bind="..." 透传给内部组件
        props: {
            placeholder: '请输入您的用户名',
            clearable: true,
            disabled: false
        },

        // 5. rules: 校验规则（腹痛 ElementUI/AntD 的格式）
        rules: [
            { required: true, message: '必填项', trigger: 'blur' }
        ]
    },

    // --- 第 2 个控件：下拉选择框 ---
    {
        component: 'Select',
        label: '职业',
        field: 'job',
        props: {
            placeholder: '请选择职业',
            // 下拉框特有的数据源
            options: [
                { label: '前端工程师', value: 'fe' },
                { label: '后端工程师', value: 'be' },
                { label: '产品经理', value: 'pm' },
            ]
        }
    },

    // --- 第 3 个控件：开关 ---
    {
        component: 'Switch',
        label: '是否订阅周刊',
        field: 'isSubscribe',
        // 默认值通常在 formData 里给，但 schema 里也可以定义初始状态
        props: {
            activeText: '是',
            inactiveText: '否'
        }
    }
];