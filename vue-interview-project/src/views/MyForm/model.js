// 编写数据模型
import { reactive } from 'vue';

// 初始化表单数据
export const createInitModel = () => reactive({
    username: '',
    role: 'user', // 默认值
    adminKey: '', // 这个字段虽然在 Card 里，但数据还是挂在一级
    isPublic: false
});