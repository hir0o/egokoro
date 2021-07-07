import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import path from "path";

const srcDirRoot = "src/client";
const distDirRoot = "dist/client";

// https://vitejs.dev/config/
export default defineConfig({
  root: path.join(__dirname, srcDirRoot),
  publicDir: path.join(__dirname, `${srcDirRoot}/public`),
  build: {
    outDir: path.join(__dirname, distDirRoot),
  },
  plugins: [reactRefresh()],
});
