const { Service } = require('egg');

class BillService extends Service {
    // 新增账单
    async add(params) {
        const { ctx, app } = this;
        try {
            // 往 bill 表中，插入一条账单数据
            const result = await app.mysql.insert('bill', params);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    // 获取账单列表
    async list(id) {
        const { ctx, app } = this;
        // 从 bill 表中查询 user_id 等于当前用户 id 的账单数据，并且返回的属性是 id, pay_type, amount, date, type_id, type_name, remark
        const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
        let sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
        try {
            const result = await app.mysql.query(sql);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    // 获取账单详情
    async detail(id, user_id) {
        const { ctx, app } = this;
        try {
            // Q：user_id 的作用是？
            const result = await app.mysql.get('bill', { id, user_id });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    // 编辑账单
    async update(params) {
        const { ctx, app } = this;
        try {
            // 第一个参数为需要操作的数据库表名称 bill；第二个参数为需要更新的数据内容，这里直接将参数展开；
            // 第三个为查询参数，指定 id 和 user_id。
            let result = await app.mysql.update('bill', {
                ...params
            }, {
                id: params.id,
                user_id: params.user_id
            });
            return result;
        } catch (error) {
            console.log(error);
            return null; 
        }
    }
    // 删除账单
    async delete(id, user_id) {
        const { ctx, app } = this;
        try {
            // app.mysql.delete 方法接收两个参数，第一个是数据库表名称，第二个是查询条件
            // 带上 user_id 起到双保险的作用
            const result = await app.mysql.delete('bill', {
                id: id,
                user_id: user_id
            })
            return result;
        } catch (error) {
            console.log(error);
            return null; 
        }
    }
}

module.exports = BillService;