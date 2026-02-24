import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
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
  plugins: [
    react(),
    ViteImageOptimizer({
      webp: {
        quality: 85,
        lossless: false,
        effort: 4,
      },
      png: {
        quality: 85,
        compressionLevel: 9,
      },
      jpeg: {
        quality: 85,
        progressive: true,
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false,
              },
            },
          },
        ],
      },
      test:
        mode === "production" ? /\.(png|svg)$/i : /\.(jpe?g|png|webp|svg)$/i,
      includePublic: true,
      logStats: true,
      ansiColors: true,
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "node_modules/.cache/vite-plugin-image-optimizer",
      ),
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "terser",
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react/") || id.includes("react-dom/")) {
              return "react-core";
            }
            if (id.includes("react-router")) {
              return "react-router";
            }
            if (id.includes("@radix-ui") || id.includes("lucide-react")) {
              return "vendor-ui";
            }
            if (id.includes("@tanstack/react-query")) {
              return "react-query";
            }
            if (id.includes("@paypal")) {
              return "paypal";
            }
            if (id.includes("date-fns")) {
              return "date-utils";
            }
          }
          if (id.includes("/src/pages/")) {
            const pageName = id.split("/src/pages/")[1].split(".")[0];
            return `page-${pageName}`;
          }
          if (id.includes("/src/components/") && id.length > 1000) {
            const componentPath = id.split("/src/components/")[1];
            const componentName = componentPath.split("/")[0];
            return `comp-${componentName}`;
          }
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          // Preservar nombres de archivos responsive sin duplicar hash
          if (
            assetInfo.name?.match(
              /-(?:small|medium|large)\.(webp|jpg|jpeg|png)$/i,
            )
          ) {
            return "assets/[name][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    reportCompressedSize: true,
    assetsInlineLimit: 4096,
  },
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
  ssr: {
    noExternal: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
  },
}));
