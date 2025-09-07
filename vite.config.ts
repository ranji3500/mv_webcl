import { defineConfig } from "vite";
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
  build: {
    outDir: path.resolve(__dirname, outputDir),
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf.worker.entry"], // ✅ Add this line
  },
});
