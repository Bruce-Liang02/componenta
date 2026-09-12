import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@componenta/core': path.resolve(__dirname, '../../packages/core/src'),
      '@componenta/components': path.resolve(__dirname, '../../packages/components/src'),
      '@componenta/themes': path.resolve(__dirname, '../../packages/themes/src'),
      '@componenta/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@componenta/admin-shell': path.resolve(__dirname, '../../packages/admin-shell/src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
