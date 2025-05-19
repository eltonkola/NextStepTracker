import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import ghPages from 'vite-plugin-gh-pages';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      ghPages({
        branch: 'gh-pages',
        repo: 'https://github.com/eltonkola/NextStepTracker.git'
      })
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    base: process.env.NODE_ENV === 'development' ? '/' : '/NextStepTracker/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      assetsInlineLimit: 4096,
      rollupOptions: {
        input: {
          main: './index.html'
        },
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        }
      },
      minify: false,
      sourcemap: true,
      target: 'es2020',
      manifest: true,
      emptyOutDir: true
    }
  };
});