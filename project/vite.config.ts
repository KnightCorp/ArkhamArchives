import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://spectrum-api-343916782787.us-central1.run.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React dependencies
          "react-vendor": ["react", "react-dom"],
          // Router
          router: ["react-router", "react-router-dom"],
          // Supabase
          supabase: ["@supabase/supabase-js"],
          // UI Libraries
          "ui-libs": ["lucide-react", "react-hot-toast", "clsx"],
          // Markdown and syntax highlighting
          markdown: [
            "react-markdown",
            "prism-react-renderer",
            "sucrase",
            "react-live",
          ],
          // Utilities
          utils: ["axios", "date-fns", "zustand"],
          // Socket.io
          socket: ["socket.io-client"],
          // Email service
          email: ["@emailjs/browser"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
