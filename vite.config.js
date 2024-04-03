import { defineConfig, loadEnv } from "vite";

import uni from "@dcloudio/vite-plugin-uni";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    AutoImport({
      imports: [
        "vue",
        "uni-app",
        "pinia",
        {
          "nutui-uniapp/composables": [
            // 在这里添加需要自动导入的API
            "useToast"
          ]
        }
      ]
    })
  ],
  define: {
    "process.env": loadEnv(defineConfig.mode, process.cwd())
  },
  transpileDependencies: ["@dcloudio/uni-ui"],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          "@import '@/styles/custom_theme.scss';@import 'nutui-uniapp/styles/variables.scss';"
      }
    }
  }
});
