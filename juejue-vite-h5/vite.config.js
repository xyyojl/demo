import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'
import styleImport from 'vite-plugin-style-import';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  // plugins: [react()],
  plugins: [reactRefresh(), styleImport({
    libs: [
      {
        libraryName: 'zarm',
        esModule: true,
        resolveStyle: (name) => {
          return `zarm/es/${name}/style/css`;
        }
      }
    ]
  })],
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        // 当遇到 /api 路径时，将其转换成 target 的值
        // target: 'https://api.chennick.wang', // 线上
        // 使用线上地址，需要加上下面这个配置，否则请求接口有问题，并且控制台有报错：Error: certificate has expired
        // secure: false, // 跳过 SSL 证书验证
        target: 'http://localhost:7001', // 本地
        changeOrigin: true,
        // 不要重写路径，保留 /api
        // rewrite: path => path.replace(/^\/api/, '') // 将 /api 重写为空
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
      'utils': path.resolve(__dirname, 'src/utils'),
      'config': path.resolve(__dirname, 'src/config'),
    }
  }
})
