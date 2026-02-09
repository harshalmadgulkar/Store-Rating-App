import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

import path, { resolve } from 'path';

const root = resolve(__dirname, 'src');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: ['ratingstore-1.onrender.com']
  },
  resolve: {
    alias: {
      '@': root,
      '@app': path.resolve(root, 'app'),
      '@assets': path.resolve(root, 'assets'),
      '@components': path.resolve(root, 'components'),
      '@features': path.resolve(root, 'features'),
      '@utils': path.resolve(root, 'utils'),
      '@hooks': path.resolve(root, 'hooks'),
    }
  }
});
