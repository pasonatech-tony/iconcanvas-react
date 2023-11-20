/// <reference types="vitest" />
/// <reference types="vite/client" />

import { resolve } from "path";

import react from "@vitejs/plugin-react";
import type { UserConfigExport, Plugin } from "vite";
import { Plugin as importToCDN, autoComplete } from "vite-plugin-cdn-import";
import { viteSingleFile } from "vite-plugin-singlefile";
import svgr from "vite-plugin-svgr";

export const plugin = (name: string): UserConfigExport => ({
  build: {
    outDir: "dist/plugin",
    emptyOutDir: false,
    lib: {
      formats: ["iife"],
      // https://github.com/vitejs/vite/pull/7047
      entry: `src/widgets/${name}.ts`,
      name: `ReearthPluginSidebar_${name}`,
      fileName: () => `${name}.js`,
    },
    reportCompressedSize: false,
  },
});

export const web = (name: string): UserConfigExport => ({
  server: {
    open: true,
  },
  plugins: [
    react(),
    viteSingleFile(),
    serverHeaders(),
    svgr(),
    importToCDN({
      modules: [
        autoComplete("react"),
        autoComplete("react-dom"),
        {
          name: "antd",
          var: "antd",
          path: "https://cdnjs.cloudflare.com/ajax/libs/antd/4.23.2/antd.min.js",
          css: "https://cdnjs.cloudflare.com/ajax/libs/antd/4.23.2/antd.variable.min.css",
        },
        {
          name: "react-is",
          var: "react-is",
          path: "https://unpkg.com/react-is@18.2.0/umd/react-is.production.min.js",
        },
        {
          name: "styled-components",
          var: "styled-components",
          path: "https://unpkg.com/styled-components/dist/styled-components.min.js",
        },
        {
          name: "turf",
          var: "turf",
          path: "https://unpkg.com/@turf/turf@6.5.0/turf.min.js",
        },
      ],
    }),
  ],
  publicDir: false,
  root: `./web/components/${name}`,
  build: {
    outDir: `../../../dist/web/${name}`,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./web/test/setup.ts",
  },
  resolve: {
    alias: [{ find: "@web", replacement: resolve(__dirname, "web") }],
  },
});

const serverHeaders = (): Plugin => ({
  name: "server-headers",
  configureServer(server) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader("Service-Worker-Allowed", "/");
      next();
    });
  },
});
