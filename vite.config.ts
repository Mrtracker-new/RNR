import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Gzip — broad compatibility fallback
    viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 }),
    // Brotli — Netlify and modern CDNs serve .br files with ~20% better compression than gzip
    viteCompression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 }),
  ],
  build: {
    outDir: 'build',
    sourcemap: false,
    // Warn when any individual chunk exceeds 400 KB
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        // Function form correctly intercepts node_modules in React 19 + Vite 6
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          if (id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          if (id.includes('node_modules/styled-components')) {
            return 'styled';
          }
          if (id.includes('node_modules/react-helmet-async')) {
            return 'helmet';
          }
        },
      },
    },
  },
})
