import { defineConfig } from "vite";   // ✅ this fixes defineConfig error
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputDir = process.env.VITE_DIST_PATH || "dist";

export default defineConfig({
  base: "./",
  plugins: [react(), svgr()],
  server: {
    host: "0.0.0.0",   // ✅ allows external access
    port: 5004,
  },
  build: {
    outDir: path.resolve(__dirname, outputDir),
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf.worker.entry"], // ✅ ensures PDF worker is bundled
  },
});
