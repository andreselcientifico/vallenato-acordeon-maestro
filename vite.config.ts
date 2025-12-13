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
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Si el archivo pertenece a una librería externa, lo ponemos en su propio chunk
          if (id.includes('node_modules')) {
            return 'vendor'; // Los módulos de node_modules se agruparán en un solo archivo 'vendor.js'
          }
        }
      }
    }
  }
}));
