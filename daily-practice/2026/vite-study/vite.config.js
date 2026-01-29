import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

/* 
Vite 是一种新型前端构建工具，它由两部分组成：
1. 开发服务器 (Dev Server)： 基于 原生 ESM (Native ES Modules)。它不需要像 Webpack 那样先打包整个项目再启动，而是按需编译。浏览器请求哪个文件，Vite 就编译哪个，启动速度是毫秒级的。
2. 构建指令 (Build)： 生产环境使用 Rollup 进行打包。Vite 3 升级了 Rollup 版本，产物更小，配置更灵活。

*/
// https://vite.dev/config/
export default defineConfig({
  // 1. 插件配置
  plugins: [vue()],

  // 2. 别名配置 (@ -> src)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  // 3. 开发服务器配置 (代理跨域)
  server: {
    proxy: {
      '/api': {
        target: 'https://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  // 4. 打包配置 (Rollup)
  build: {
    outDir: 'dist',
    // 生产环境移除 console
    terserOptions: {
      compress: {
        drop_console: true,
      }
    }
  }
})
