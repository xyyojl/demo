import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // 代理配置
    proxy: {
      // 选项写法
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端，代理会将主机头修改为 target 的地址，解决跨域问题
        rewrite: (path) => path.replace(/^\/api/, '') // 路径重写
      }
    }
  }
})
