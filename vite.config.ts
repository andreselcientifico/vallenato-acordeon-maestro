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
      treeshake: "smallest",
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("/node_modules/react/") || id.includes("/node_modules/react-dom/")) {
            return "react-core";
          }

          if (id.includes("/node_modules/react-router/") || id.includes("/node_modules/react-router-dom/")) {
            return "react-router";
          }

          // Separar UI libs para no descargar “todo vendor-ui” por un uso mínimo
          if (id.includes("/node_modules/@radix-ui/")) return "radix";
          if (id.includes("/node_modules/lucide-react/")) return "icons";

          if (id.includes("/node_modules/@tanstack/react-query/")) return "react-query";
          if (id.includes("/node_modules/@paypal/")) return "paypal";
          if (id.includes("/node_modules/date-fns/")) return "date-utils";
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
