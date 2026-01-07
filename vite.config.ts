import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, "../certificados/localhost-key.pem")),
    //   cert: fs.readFileSync(path.resolve(__dirname, "../certificados/localhost.pem")),
    // },
    host: "::",
    port: 8080,
    hmr: false,
    allowedHosts: true
  },
  preview: {
    // allowedHosts permite que el servidor de preview acepte solicitudes desde ciertos hosts externos.
    // Esto es necesario cuando usas Cloudflare Tunnel, Ngrok, LocalTunnel, etc.
    allowedHosts: true
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   build: {
    // Optimizaciones de build
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Chunking inteligente para mejor caching
          if (id.includes('node_modules')) {
            // Separar React y sus dependencias
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Separar UI libraries
            if (id.includes('@radix-ui') || id.includes('lucide-react') || id.includes('tailwindcss')) {
              return 'ui-vendor';
            }
            // Separar otras librerías
            if (id.includes('axios') || id.includes('date-fns') || id.includes('@tanstack/react-query')) {
              return 'utils-vendor';
            }
            // Paypal y otras librerías pesadas
            if (id.includes('paypal') || id.includes('stripe')) {
              return 'payment-vendor';
            }
            return 'vendor';
          }
          // Chunking por páginas/routes
          if (id.includes('/pages/')) {
            const pageName = id.split('/pages/')[1].split('.')[0];
            return `page-${pageName}`;
          }
        }
      }
    },
    // Optimizaciones adicionales
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    reportCompressedSize: false,
  },
  // Optimizaciones de desarrollo
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      'date-fns'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  // Preload de módulos críticos
  ssr: {
    noExternal: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
  }
}));
