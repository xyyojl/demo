import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import viteCompression from 'vite-plugin-compression'
import { visualizer} from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 开启 Gzip 压缩
    viteCompression({
      verbose: true, // 控制台输出压缩结果
      disable: false,
      threshold: 10240, // 体积大于 10kb 才压缩
      algorithm: 'gzip',
      ext: '.gz'
    }),
    // visualizer({
    //   open: true, // 打包后自动打开页面
    //   gzipSize: true, // 查看 gzip 压缩后的大小
    //   brotliSize: true
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 手动拆包策略
        manualChunks(id) {
          // id 是文件的绝对路径
          if (id.includes('node_modules')) {
              // 把 node_modules 里的东西拆成 vendor.js
              return 'vendor';
              // 或者更细粒度
              // if (id.includes('element-plus')) return 'element-plus';
              // if (id.includes('lodash')) return 'lodash';
          }
        }
      }
    }
  }
})
