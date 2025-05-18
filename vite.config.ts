import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    base: isProduction ? process.env.VITE_BASE_URL || '/NextStepTracker/' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      assetsInlineLimit: 4096,
      rollupOptions: {
        input: {
          main: './index.html'
        },

      },
      minify: false,
      sourcemap: true,
      target: 'es2020',
      manifest: true
    }
  };
});