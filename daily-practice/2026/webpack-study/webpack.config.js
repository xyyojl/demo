const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: {
        main: './src/main.js'
    },
    output: {
        path: __dirname + '/dist',
        clean: true
    },
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/i,
                type: 'asset/resource'
            },
            {
                // 告诉 Webpack，遇到 .vue 文件，交给 vue-loader 处理
                test: /\.vue$/i,
                use: ['vue-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            title: '脚手架原理'
        }),
        // 它的作用是将你在其他规则中定义的 Loader（如 css-loader）复制并应用到 .vue 文件里的 <style> 块中
        new VueLoaderPlugin()
    ]
};