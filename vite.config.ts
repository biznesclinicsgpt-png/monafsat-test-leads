import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    appType: 'spa',
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api/apollo': {
          target: 'https://api.apollo.io',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/apollo/, '/api/v1')
        },
        '/api/lemlist': {
          target: 'https://api.lemlist.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/lemlist/, '/api')
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
