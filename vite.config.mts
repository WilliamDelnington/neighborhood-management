import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import macrosPlugin from "vite-plugin-babel-macros";

import fs from "fs";
import path from "path";

// zmp-cli's build pipeline only writes app-config.json into the output dir
// on its legacy Vite 2 code path (via zmp-vite-plugin, which also fills in
// listCSS/listSyncJS/listAsyncJS from the real build output); for Vite 5 it
// silently skips this. The Zalo client reads those three lists at runtime
// to know which built JS/CSS to inject into a *deployed* mini app - if they
// stay empty (as in the source app-config.json), the app has nothing to load
// and hangs on Zalo's splash screen forever, even though index.html itself
// is fine and `zmp start` dev preview never notices (it serves index.html
// live instead of relying on this manifest). Regenerate them ourselves.
function generateAppConfigPlugin() {
    return {
        name: "generate-app-config",
        apply: "build" as const,
        writeBundle(options: { dir?: string }, bundle: Record<string, any>) {
            const outDir = options.dir || path.resolve(__dirname, "www");
            const files = Object.values(bundle);
            const chunkByFileName = new Map(files.map((f: any) => [f.fileName, f]));

            const cssFiles = files
                .filter((f: any) => f.type === "asset" && f.fileName.endsWith(".css"))
                .map((f: any) => f.fileName);

            const entryChunks = files.filter(
                (f: any) => f.type === "chunk" && f.isEntry,
            );

            const seen = new Set<string>();
            const asyncChunks: string[] = [];
            const collectImports = (chunk: any) => {
                (chunk.imports || []).forEach((fileName: string) => {
                    if (seen.has(fileName)) return;
                    seen.add(fileName);
                    const imported = chunkByFileName.get(fileName);
                    if (imported && (imported as any).type === "chunk") {
                        collectImports(imported);
                        asyncChunks.push(fileName);
                    }
                });
            };
            entryChunks.forEach(collectImports);

            const baseConfig = JSON.parse(
                fs.readFileSync(
                    path.resolve(__dirname, "app-config.json"),
                    "utf-8",
                ),
            );

            const appConfigJson = {
                ...baseConfig,
                listCSS: [...cssFiles, ...(baseConfig.listCSS || [])],
                listSyncJS: [
                    ...entryChunks.map((f: any) => f.fileName),
                    ...(baseConfig.listSyncJS || []),
                ],
                listAsyncJS: [...asyncChunks, ...(baseConfig.listAsyncJS || [])],
                pages: [],
            };

            fs.writeFileSync(
                path.resolve(outDir, "app-config.json"),
                JSON.stringify(appConfigJson, null, 2),
            );
        },
    };
}

// https://vitejs.dev/config/
export default () => {
    return defineConfig({
        root: "./src",
        base: "./",
        plugins: [react(), macrosPlugin(), generateAppConfigPlugin()],
        // twin.macro is a babel-plugin-macros macro (see babel-plugin-macros.config.js)
        // - it's meant to be fully compiled away by macrosPlugin() before the browser
        // ever sees it. Vite's dependency scanner doesn't apply babel transforms though,
        // so it sees the raw `import ... from "twin.macro"` in ~28 component files and
        // tries to pre-bundle the real twin.macro package for the browser. That drags in
        // the whole tailwindcss package (config-loading via cosmiconfig/jiti/resolve),
        // which needs Node's `fs` and fails esbuild's browser-target pre-bundle with
        // "Failed to resolve entry for package 'fs'". Excluding it here skips that dead-end
        // scan - twin.macro never needs a real runtime bundle since the macro erases it.
        optimizeDeps: {
            exclude: ["twin.macro"],
        },
        build: {
            outDir: "www",
            emptyOutDir: true,
            target: "es2020",
            rollupOptions: {
                output: {
                    // Zalo's native shell picks <script type="module"> vs a
                    // classic script by sniffing this ".module.js" suffix on
                    // the built filename (same convention zmp-vite-plugin
                    // uses) - without it, Vite's ESM chunks (which use
                    // import/export between each other) get injected as
                    // classic scripts and throw "Cannot use import statement
                    // outside a module" / "Unexpected token 'export'".
                    entryFileNames: "assets/[name]-[hash].module.js",
                    chunkFileNames: "assets/[name]-[hash].module.js",
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
