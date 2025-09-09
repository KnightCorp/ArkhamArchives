import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/' : '/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom')
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      "/api": {
        target: "https://spectrum-api-343916782787.us-central1.run.app",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ["lucide-react"],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    sourcemap: mode !== 'production',
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            // Group React and ReactDOM together
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('lucide-react') || id.includes('react-hot-toast')) {
              return 'ui-libs';
            }
            if (id.includes('react-markdown') || id.includes('prism-react-renderer') || id.includes('react-live')) {
              return 'markdown';
            }
            if (id.includes('axios') || id.includes('date-fns') || id.includes('zustand')) {
              return 'utils';
            }
            if (id.includes('socket.io-client')) {
              return 'socket';
            }
            if (id.includes('@emailjs')) {
              return 'email';
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 1500,
  },
}));