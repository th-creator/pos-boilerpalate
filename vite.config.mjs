import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import mkcert from 'vite-plugin-mkcert';
import { getBabelOutputPlugin } from "@rollup/plugin-babel";

export default defineConfig({
  define: {
    'process.env': process.env,
  },
  server: {
    port: 8080,  // Add this line to set the server port
  },
  build: {
    lib: {
      entry: './src/js/app.jsx',
      formats: ['cjs'],
      name: 'bundle',
      fileName: 'bundle',
    },
    rollupOptions: {
      output: {
        dir: "./",
        plugins: [
          getBabelOutputPlugin({
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: "since 2017",
                  },
                },
              ],
            ],
          }),
        ],
      },
    },
  },
  resolve: {
    alias: {
      os: "os-browserify/browser",
    }
  },
  plugins: [
    cssInjectedByJsPlugin(),
    mkcert(),
    react({
      include: '**/*.{jsx}',
    }),
  ],
});
