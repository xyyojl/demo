const { Controller } = require('egg');

class HomeController extends Controller {
  /* async index() {
    const { ctx } = this;
    // ctx.body = 'hi, egg';
    // 获取到浏览器查询参数
    const { id } = ctx.query;
    ctx.body = id;
  } */
  // 获取用户信息
  /* async user() {
    const { ctx } = this;
    const { id } = ctx.params; // 通过 params 获取申明参数
    ctx.body = id;
  } */
  // post 请求方法
  async add() {
    console.log('哈哈哈哈');
    const { ctx } = this;
    const { title } = ctx.request.body;
    // Egg 框架内置了 bodyParser 中间件来对 POST 请求 body 解析成 object 挂载到 ctx.request.body 上
    ctx.body = {
      title
    }
  }
  // 获取用户信息
  async user() {
    const { ctx } = this;
    const result = await ctx.service.home.user();
    ctx.body = result;
  }
  // 模板渲染
  async index() {
    const { ctx } = this;
    // ctx.render 默认会去 view 文件夹寻找 index.html，这是 Egg 约定好的。
    await ctx.render('index.html', {
      title: '以大多数人的努力程度之低，根本轮不到拼天赋' // 将 title 传入 index.html
    })
  }
  async addUser() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    try {
      const result = await ctx.service.home.addUser(name);
      ctx.body = {
        code: 200,
        msg: '添加成功',
        data: null
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '添加失败',
        data: null
      };
    }
  }
  // 编辑
  async editUser() {
    const { ctx } = this;
    const { id, name } = ctx.request.body;
    try {
      const result = await ctx.service.home.editUser(id, name);
      ctx.body = {
        code: 200,
        msg: '更新成功',
        data: null
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '更新失败',
        data: null
      };
    }
  }
  // 删除
  async deleteUser() {
    const { ctx } = this;
    const { id } = ctx.request.body;
     try {
      const result = await ctx.service.home.deleteUser(id);
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: null
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '删除失败',
        data: null
      };
    }
  }
}

module.exports = HomeController;
