import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import macrosPlugin from "vite-plugin-babel-macros";

import path from "path";
// https://vitejs.dev/config/
export default () => {
    return defineConfig({
        root: "./src",
        base: "./",
        plugins: [react(), macrosPlugin()],
        build: {
            target: "es2020",
            rollupOptions: {
                output: {
                    manualChunks: {
                        "vendor-react": [
                            "react",
                            "react-dom",
                            "react-router",
                            "react-router-dom",
                        ],
                        "vendor-zmp": ["zmp-ui", "zmp-sdk"],
                        "vendor-ui": [
                            "styled-components",
                            "react-datepicker",
                            "@xuannghia/html2canvas",
                        ],
                    },
                },
            },
        },
        resolve: {
            alias: {
                "@assets": path.resolve(__dirname, "src/assets"),
                "@components": path.resolve(__dirname, "src/components"),
                "@common": path.resolve(__dirname, "src/common"),
                "@constants": path.resolve(__dirname, "src/constants"),
                "@routes": path.resolve(__dirname, "src/routes"),
                "@shared": path.resolve(__dirname, "src/shared"),
                "@utils": path.resolve(__dirname, "src/utils"),
                "@pages": path.resolve(__dirname, "src/pages"),
                "@dts": path.resolve(__dirname, "src/types"),
                "@state": path.resolve(__dirname, "src/state"),
                "@service": path.resolve(__dirname, "src/service"),
                "@store": path.resolve(__dirname, "src/store"),
                "@mock": path.resolve(__dirname, "src/mock"),
            },
        },
    });
};
