const { Service } = require('egg');

class HomeService extends Service {
    async user() {
        // 假设从数据库获取的用户信息
        return {
            name: '嘎子',
            slogan: '网络的世界太虚拟，你把握不住'
        }
    }
}

module.exports = HomeService;