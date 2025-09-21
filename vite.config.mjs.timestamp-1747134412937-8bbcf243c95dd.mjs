// vite.config.mjs
import { defineConfig } from "file:///C:/Users/oussi/OneDrive/Documents/pos-platform-boilerplate/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/oussi/OneDrive/Documents/pos-platform-boilerplate/node_modules/@vitejs/plugin-react/dist/index.mjs";
import cssInjectedByJsPlugin from "file:///C:/Users/oussi/OneDrive/Documents/pos-platform-boilerplate/node_modules/vite-plugin-css-injected-by-js/dist/esm/index.js";
import mkcert from "file:///C:/Users/oussi/OneDrive/Documents/pos-platform-boilerplate/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
import { getBabelOutputPlugin } from "file:///C:/Users/oussi/OneDrive/Documents/pos-platform-boilerplate/node_modules/@rollup/plugin-babel/dist/es/index.js";
var vite_config_default = defineConfig({
  define: {
    "process.env": process.env
  },
  server: {
    port: 8080
    // Add this line to set the server port
  },
  build: {
    lib: {
      entry: "./src/js/app.jsx",
      formats: ["cjs"],
      name: "bundle",
      fileName: "bundle"
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
                    browsers: "since 2017"
                  }
                }
              ]
            ]
          })
        ]
      }
    }
  },
  resolve: {
    alias: {
      os: "os-browserify/browser"
    }
  },
  plugins: [
    cssInjectedByJsPlugin(),
    mkcert(),
    react({
      include: "**/*.{jsx}"
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcb3Vzc2lcXFxcT25lRHJpdmVcXFxcRG9jdW1lbnRzXFxcXHBvcy1wbGF0Zm9ybS1ib2lsZXJwbGF0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcb3Vzc2lcXFxcT25lRHJpdmVcXFxcRG9jdW1lbnRzXFxcXHBvcy1wbGF0Zm9ybS1ib2lsZXJwbGF0ZVxcXFx2aXRlLmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL291c3NpL09uZURyaXZlL0RvY3VtZW50cy9wb3MtcGxhdGZvcm0tYm9pbGVycGxhdGUvdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCBjc3NJbmplY3RlZEJ5SnNQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tY3NzLWluamVjdGVkLWJ5LWpzJztcclxuaW1wb3J0IG1rY2VydCBmcm9tICd2aXRlLXBsdWdpbi1ta2NlcnQnO1xyXG5pbXBvcnQgeyBnZXRCYWJlbE91dHB1dFBsdWdpbiB9IGZyb20gXCJAcm9sbHVwL3BsdWdpbi1iYWJlbFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBkZWZpbmU6IHtcclxuICAgICdwcm9jZXNzLmVudic6IHByb2Nlc3MuZW52LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiA4MDgwLCAgLy8gQWRkIHRoaXMgbGluZSB0byBzZXQgdGhlIHNlcnZlciBwb3J0XHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgbGliOiB7XHJcbiAgICAgIGVudHJ5OiAnLi9zcmMvanMvYXBwLmpzeCcsXHJcbiAgICAgIGZvcm1hdHM6IFsnY2pzJ10sXHJcbiAgICAgIG5hbWU6ICdidW5kbGUnLFxyXG4gICAgICBmaWxlTmFtZTogJ2J1bmRsZScsXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBkaXI6IFwiLi9cIixcclxuICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICBnZXRCYWJlbE91dHB1dFBsdWdpbih7XHJcbiAgICAgICAgICAgIHByZXNldHM6IFtcclxuICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICBcIkBiYWJlbC9wcmVzZXQtZW52XCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRhcmdldHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBicm93c2VyczogXCJzaW5jZSAyMDE3XCIsXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIG9zOiBcIm9zLWJyb3dzZXJpZnkvYnJvd3NlclwiLFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgY3NzSW5qZWN0ZWRCeUpzUGx1Z2luKCksXHJcbiAgICBta2NlcnQoKSxcclxuICAgIHJlYWN0KHtcclxuICAgICAgaW5jbHVkZTogJyoqLyoue2pzeH0nLFxyXG4gICAgfSksXHJcbiAgXSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFcsU0FBUyxvQkFBb0I7QUFDM1ksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sMkJBQTJCO0FBQ2xDLE9BQU8sWUFBWTtBQUNuQixTQUFTLDRCQUE0QjtBQUVyQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixlQUFlLFFBQVE7QUFBQSxFQUN6QjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsRUFDUjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLE1BQ1AsU0FBUyxDQUFDLEtBQUs7QUFBQSxNQUNmLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixLQUFLO0FBQUEsUUFDTCxTQUFTO0FBQUEsVUFDUCxxQkFBcUI7QUFBQSxZQUNuQixTQUFTO0FBQUEsY0FDUDtBQUFBLGdCQUNFO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxTQUFTO0FBQUEsb0JBQ1AsVUFBVTtBQUFBLGtCQUNaO0FBQUEsZ0JBQ0Y7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFVBQ0YsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLElBQUk7QUFBQSxJQUNOO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1Asc0JBQXNCO0FBQUEsSUFDdEIsT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
