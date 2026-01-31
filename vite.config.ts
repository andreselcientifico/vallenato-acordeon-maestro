import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, "../certificados/localhost-key.pem")),
    //   cert: fs.readFileSync(path.resolve(__dirname, "../certificados/localhost.pem")),
    // },
    host: "::",
    port: 8080,
    hmr: false,
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
    host: true,
    port: 4173,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimizaciones de build
    target: "esnext",
    minify: "terser",
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true, // Elimina console.logs
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"], // Elimina funciones específicas
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Dividir node_modules agresivamente
          if (id.includes("node_modules")) {
            // React core
            if (id.includes("react/") || id.includes("react-dom/")) {
              return "react-core";
            }

            // React Router
            if (id.includes("react-router")) {
              return "react-router";
            }

            // Radix UI - TODOS en un solo chunk para evitar dependencias circulares
            if (id.includes("@radix-ui")) {
              return "radix-ui";
            }

            // Lucide icons
            if (id.includes("lucide-react")) {
              return "lucide-icons";
            }

            // TanStack Query
            if (id.includes("@tanstack/react-query")) {
              return "react-query";
            }

            // PayPal (muy pesado, separarlo)
            if (id.includes("@paypal")) {
              return "paypal";
            }

            // Date utilities
            if (id.includes("date-fns")) {
              return "date-utils";
            }
          }

          // Páginas - cada una en su propio chunk
          if (id.includes("/src/pages/")) {
            const pageName = id.split("/src/pages/")[1].split(".")[0];
            return `page-${pageName}`;
          }

          // Componentes grandes en chunks separados
          if (id.includes("/src/components/") && id.length > 1000) {
            const componentPath = id.split("/src/components/")[1];
            const componentName = componentPath.split("/")[0];
            return `comp-${componentName}`;
          }
        },
        // Optimizar nombres de chunks para mejor caching
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    // Optimizaciones adicionales
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    reportCompressedSize: true,
    assetsInlineLimit: 4096,
  },
  // Optimizaciones de desarrollo
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "lucide-react",
      "date-fns",
    ],
    exclude: ["@vite/client", "@vite/env"],
  },
  // Preload de módulos críticos
  ssr: {
    noExternal: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
  },
}));
