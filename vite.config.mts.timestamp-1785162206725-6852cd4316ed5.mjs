// vite.config.mts
import { defineConfig } from "file:///c:/Users/admin/Projects/Neighborhood%20Management/neighborhood-management/node_modules/vite/dist/node/index.js";
import react from "file:///c:/Users/admin/Projects/Neighborhood%20Management/neighborhood-management/node_modules/@vitejs/plugin-react/dist/index.js";
import macrosPlugin from "file:///c:/Users/admin/Projects/Neighborhood%20Management/neighborhood-management/node_modules/vite-plugin-babel-macros/dist/plugin.js";
import fs from "fs";
import path from "path";
var __vite_injected_original_dirname = "c:\\Users\\admin\\Projects\\Neighborhood Management\\neighborhood-management";
function copyAppConfigPlugin() {
  return {
    name: "copy-app-config",
    apply: "build",
    closeBundle() {
      fs.copyFileSync(
        path.resolve(__vite_injected_original_dirname, "app-config.json"),
        path.resolve(__vite_injected_original_dirname, "www/app-config.json")
      );
    }
  };
}
var vite_config_default = () => {
  return defineConfig({
    root: "./src",
    base: "./",
    plugins: [react(), macrosPlugin(), copyAppConfigPlugin()],
    build: {
      outDir: "www",
      emptyOutDir: true,
      target: "es2020",
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": [
              "react",
              "react-dom",
              "react-router",
              "react-router-dom"
            ],
            "vendor-zmp": ["zmp-ui", "zmp-sdk"],
            "vendor-ui": [
              "styled-components",
              "react-datepicker",
              "@xuannghia/html2canvas"
            ]
          }
        }
      }
    },
    resolve: {
      alias: {
        "@assets": path.resolve(__vite_injected_original_dirname, "src/assets"),
        "@components": path.resolve(__vite_injected_original_dirname, "src/components"),
        "@common": path.resolve(__vite_injected_original_dirname, "src/common"),
        "@constants": path.resolve(__vite_injected_original_dirname, "src/constants"),
        "@routes": path.resolve(__vite_injected_original_dirname, "src/routes"),
        "@shared": path.resolve(__vite_injected_original_dirname, "src/shared"),
        "@utils": path.resolve(__vite_injected_original_dirname, "src/utils"),
        "@pages": path.resolve(__vite_injected_original_dirname, "src/pages"),
        "@dts": path.resolve(__vite_injected_original_dirname, "src/types"),
        "@state": path.resolve(__vite_injected_original_dirname, "src/state"),
        "@service": path.resolve(__vite_injected_original_dirname, "src/service"),
        "@store": path.resolve(__vite_injected_original_dirname, "src/store"),
        "@mock": path.resolve(__vite_injected_original_dirname, "src/mock")
      }
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiYzpcXFxcVXNlcnNcXFxcYWRtaW5cXFxcUHJvamVjdHNcXFxcTmVpZ2hib3Job29kIE1hbmFnZW1lbnRcXFxcbmVpZ2hib3Job29kLW1hbmFnZW1lbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcImM6XFxcXFVzZXJzXFxcXGFkbWluXFxcXFByb2plY3RzXFxcXE5laWdoYm9yaG9vZCBNYW5hZ2VtZW50XFxcXG5laWdoYm9yaG9vZC1tYW5hZ2VtZW50XFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYzovVXNlcnMvYWRtaW4vUHJvamVjdHMvTmVpZ2hib3Job29kJTIwTWFuYWdlbWVudC9uZWlnaGJvcmhvb2QtbWFuYWdlbWVudC92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCBtYWNyb3NQbHVnaW4gZnJvbSBcInZpdGUtcGx1Z2luLWJhYmVsLW1hY3Jvc1wiO1xyXG5cclxuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuLy8gem1wLWNsaSdzIGJ1aWxkIHBpcGVsaW5lIG9ubHkgd3JpdGVzIGFwcC1jb25maWcuanNvbiBpbnRvIHRoZSBvdXRwdXQgZGlyXHJcbi8vIG9uIGl0cyBsZWdhY3kgVml0ZSAyIGNvZGUgcGF0aDsgZm9yIFZpdGUgNSBpdCBzaWxlbnRseSBza2lwcyB0aGlzLCBzb1xyXG4vLyBgem1wIGRlcGxveWAgZmFpbHMgbG9va2luZyBmb3Igd3d3L2FwcC1jb25maWcuanNvbi4gQ29weSBpdCBvdXJzZWx2ZXMuXHJcbmZ1bmN0aW9uIGNvcHlBcHBDb25maWdQbHVnaW4oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5hbWU6IFwiY29weS1hcHAtY29uZmlnXCIsXHJcbiAgICAgICAgYXBwbHk6IFwiYnVpbGRcIiBhcyBjb25zdCxcclxuICAgICAgICBjbG9zZUJ1bmRsZSgpIHtcclxuICAgICAgICAgICAgZnMuY29weUZpbGVTeW5jKFxyXG4gICAgICAgICAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJhcHAtY29uZmlnLmpzb25cIiksXHJcbiAgICAgICAgICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInd3dy9hcHAtY29uZmlnLmpzb25cIiksXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn1cclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcclxuICAgIHJldHVybiBkZWZpbmVDb25maWcoe1xyXG4gICAgICAgIHJvb3Q6IFwiLi9zcmNcIixcclxuICAgICAgICBiYXNlOiBcIi4vXCIsXHJcbiAgICAgICAgcGx1Z2luczogW3JlYWN0KCksIG1hY3Jvc1BsdWdpbigpLCBjb3B5QXBwQ29uZmlnUGx1Z2luKCldLFxyXG4gICAgICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgICAgIG91dERpcjogXCJ3d3dcIixcclxuICAgICAgICAgICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgICAgICAgICAgIHRhcmdldDogXCJlczIwMjBcIixcclxuICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmVuZG9yLXJlYWN0XCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVhY3RcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVhY3QtZG9tXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlYWN0LXJvdXRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWFjdC1yb3V0ZXItZG9tXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmVuZG9yLXptcFwiOiBbXCJ6bXAtdWlcIiwgXCJ6bXAtc2RrXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZlbmRvci11aVwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0eWxlZC1jb21wb25lbnRzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlYWN0LWRhdGVwaWNrZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQHh1YW5uZ2hpYS9odG1sMmNhbnZhc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICAgICAgXCJAYXNzZXRzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2Fzc2V0c1wiKSxcclxuICAgICAgICAgICAgICAgIFwiQGNvbXBvbmVudHNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvY29tcG9uZW50c1wiKSxcclxuICAgICAgICAgICAgICAgIFwiQGNvbW1vblwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9jb21tb25cIiksXHJcbiAgICAgICAgICAgICAgICBcIkBjb25zdGFudHNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvY29uc3RhbnRzXCIpLFxyXG4gICAgICAgICAgICAgICAgXCJAcm91dGVzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3JvdXRlc1wiKSxcclxuICAgICAgICAgICAgICAgIFwiQHNoYXJlZFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9zaGFyZWRcIiksXHJcbiAgICAgICAgICAgICAgICBcIkB1dGlsc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy91dGlsc1wiKSxcclxuICAgICAgICAgICAgICAgIFwiQHBhZ2VzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3BhZ2VzXCIpLFxyXG4gICAgICAgICAgICAgICAgXCJAZHRzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3R5cGVzXCIpLFxyXG4gICAgICAgICAgICAgICAgXCJAc3RhdGVcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvc3RhdGVcIiksXHJcbiAgICAgICAgICAgICAgICBcIkBzZXJ2aWNlXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3NlcnZpY2VcIiksXHJcbiAgICAgICAgICAgICAgICBcIkBzdG9yZVwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9zdG9yZVwiKSxcclxuICAgICAgICAgICAgICAgIFwiQG1vY2tcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvbW9ja1wiKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSk7XHJcbn07XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVosU0FBUyxvQkFBb0I7QUFDcGIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sa0JBQWtCO0FBRXpCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUxqQixJQUFNLG1DQUFtQztBQVV6QyxTQUFTLHNCQUFzQjtBQUMzQixTQUFPO0FBQUEsSUFDSCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxjQUFjO0FBQ1YsU0FBRztBQUFBLFFBQ0MsS0FBSyxRQUFRLGtDQUFXLGlCQUFpQjtBQUFBLFFBQ3pDLEtBQUssUUFBUSxrQ0FBVyxxQkFBcUI7QUFBQSxNQUNqRDtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0o7QUFHQSxJQUFPLHNCQUFRLE1BQU07QUFDakIsU0FBTyxhQUFhO0FBQUEsSUFDaEIsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sU0FBUyxDQUFDLE1BQU0sR0FBRyxhQUFhLEdBQUcsb0JBQW9CLENBQUM7QUFBQSxJQUN4RCxPQUFPO0FBQUEsTUFDSCxRQUFRO0FBQUEsTUFDUixhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDWCxRQUFRO0FBQUEsVUFDSixjQUFjO0FBQUEsWUFDVixnQkFBZ0I7QUFBQSxjQUNaO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsWUFDSjtBQUFBLFlBQ0EsY0FBYyxDQUFDLFVBQVUsU0FBUztBQUFBLFlBQ2xDLGFBQWE7QUFBQSxjQUNUO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxZQUNKO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ0wsT0FBTztBQUFBLFFBQ0gsV0FBVyxLQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQy9DLGVBQWUsS0FBSyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLFFBQ3ZELFdBQVcsS0FBSyxRQUFRLGtDQUFXLFlBQVk7QUFBQSxRQUMvQyxjQUFjLEtBQUssUUFBUSxrQ0FBVyxlQUFlO0FBQUEsUUFDckQsV0FBVyxLQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQy9DLFdBQVcsS0FBSyxRQUFRLGtDQUFXLFlBQVk7QUFBQSxRQUMvQyxVQUFVLEtBQUssUUFBUSxrQ0FBVyxXQUFXO0FBQUEsUUFDN0MsVUFBVSxLQUFLLFFBQVEsa0NBQVcsV0FBVztBQUFBLFFBQzdDLFFBQVEsS0FBSyxRQUFRLGtDQUFXLFdBQVc7QUFBQSxRQUMzQyxVQUFVLEtBQUssUUFBUSxrQ0FBVyxXQUFXO0FBQUEsUUFDN0MsWUFBWSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLFFBQ2pELFVBQVUsS0FBSyxRQUFRLGtDQUFXLFdBQVc7QUFBQSxRQUM3QyxTQUFTLEtBQUssUUFBUSxrQ0FBVyxVQUFVO0FBQUEsTUFDL0M7QUFBQSxJQUNKO0FBQUEsRUFDSixDQUFDO0FBQ0w7IiwKICAibmFtZXMiOiBbXQp9Cg==
