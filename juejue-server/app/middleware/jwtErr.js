// 在请求接口的时候，过一层中间件，判断该请求是否是登录状态下发起的
module.exports = (secret) => {
    return async function jwtErr(ctx, next) {
        const token = ctx.request.header.authorization; // 若是没有 token，返回的是 null 字符串
        console.log('token', token);      
        let decode;
        if (token != 'null' && token) {
            try {
                decode = ctx.app.jwt.verify(token, secret); // 验证 token
                await next();
            } catch (error) {
                console.log('error', error);
                ctx.status = 200;
                ctx.body = {
                    code: 401,
                    msg: 'token 已过期，请重新登录'
                }
                return;
            }
        } else {
            ctx.status = 200;
            ctx.body = {
                code: 401,
                msg: 'token 不存在'
            };
            return;
        }
    }
};