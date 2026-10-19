import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: process.env.NODE_ENV === 'production'
          ? [['babel-plugin-styled-components', {
              displayName: false,
              pure: true,
              ssr: false,
              fileName: false,
            }]]
          : [],
      },
    }),
    viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 }),
  ],
  build: {
    outDir: 'build',
    sourcemap: false,
    // Never base64-inline images: they are content-hashed files that should be
    // cached, and inlining them bloats the JS (and the prerendered srcset).
    assetsInlineLimit: 0,
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2,
        drop_console: true,
        drop_debugger: true,
        pure_getters: true,
        toplevel: true,
      },
      mangle: { toplevel: true },
      format: { comments: false },
    },
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      treeshake: { preset: 'recommended' },
      output: {
        compact: true,
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/framer-motion')) return 'motion';
          if (id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          if (id.includes('node_modules/styled-components')) return 'styled';
          if (id.includes('node_modules/react-helmet-async')) return 'helmet';
        },
      },
    },
  },
})
