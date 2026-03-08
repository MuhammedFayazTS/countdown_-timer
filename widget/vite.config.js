import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: "../extensions/countdown-timer/assets",
    minify: "terser",
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: "./src/main.jsx",
      output: {
        format: "iife",
        name: "CountdownTimer",
        entryFileNames: "countdown-timer.iife.js",
        manualChunks: undefined,
        assetFileNames: "timer-widget.[ext]",
      },
    },
  },
});
