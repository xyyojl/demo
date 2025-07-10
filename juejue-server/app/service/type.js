const { Service } = require('egg');

class TypeService extends Service {
    // 获取类型标签列表
    async list(id) {
        const { ctx, app } = this;
        const QUERY_STR = 'id, name, type, user_id';
        let sql = `select ${QUERY_STR} from type where user_id = 0 || user_id = ${id}`;
        try {
            const result = await app.mysql.query(sql);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = TypeService;