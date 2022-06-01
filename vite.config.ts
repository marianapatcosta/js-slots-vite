import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const path = require('path');

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/_index.scss";`,
      },
    },
  },
});
