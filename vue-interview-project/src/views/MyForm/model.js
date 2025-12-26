// 编写数据模型
import { reactive } from 'vue';

// 初始化表单数据
export const createInitModel = () => reactive({
    username: '',
    role: 'user', // 默认值
    adminKey: '',
    isPublic: false
});