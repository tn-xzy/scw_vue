import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import Inspect from 'vite-plugin-inspect'
// https://vitejs.dev/config/
const pathSrc = path.resolve(__dirname, 'src')
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue'],
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
        dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
      }),
      Components({
        resolvers: [
          IconsResolver({
            enabledCollections: ['ep'],
          }),
          ElementPlusResolver(),
        ],
        dts: path.resolve(pathSrc, 'components.d.ts'),
      }),
      Icons({
        autoInstall: true,
      }),
      Inspect(),
    ],
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html'),
          login: path.resolve(__dirname, 'login.html'),
        }, output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/name-[hash].[ext]"
        }
      },
    },
    server: {
      proxy: {
        [env.VITE_API_URL]: {
          target: "http://localhost:8081",
          changeOrigin: true,
          rewrite: (path) => path.replace(env.VITE_API_URL, ""),
        },
      },
    },

  }
})
