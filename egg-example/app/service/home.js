const { Service } = require('egg');

class HomeService extends Service {
    // 查询接口实现流程：service/home.js=>controller/home.js=>修改路由配置 router.js
    // 其他接口实现类似
    async user() {
        const { ctx, app } = this;
        const QUERY_STR = 'id, name';
        let sql = `select ${QUERY_STR} from list`; // 获取 id 的 sql 数据
        try {
            // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到
            const result = await app.mysql.query(sql);
            return result;
        } catch(error) {
            console.log(error);
            return null;
        }
    }
    // 新增接口
    async addUser(name) {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.insert('list', { name }); // 给 list 表，新增一条数据
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    // 编辑接口
    async editUser(id, name) {
        const { ctx, app } = this;
        try {
            let result = await app.mysql.update('list', { name }, {
                where: {
                    id
                }
            });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    // 删除接口
    async deleteUser(id) {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.delete('list', { id });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = HomeService;