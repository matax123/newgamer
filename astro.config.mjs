import { defineConfig } from 'astro/config';

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  vite: {
    preview: {
      host: '0.0.0.0',
      port: 4321,
      strictPort: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {},
      cors: true,
      hmr: {
        host: '0.0.0.0',
      },
    },
    server: {
      host: '0.0.0.0',
      port: 4321,
      strictPort: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {},
      cors: true,
      hmr: {
        host: '0.0.0.0',
      },
    },
  },
});