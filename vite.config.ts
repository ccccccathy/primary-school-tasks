import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "vue",
      "pinia",
      "element-plus",
      "dexie",
      "uuid",
      "vue-confetti-explosion",
      "dayjs",
      "dayjs/plugin/weekOfYear",
      "dayjs/plugin/isoWeek",
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
  },
  server: {
    port: 3001,
    host: "0.0.0.0",
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
  },
});
