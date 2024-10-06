import Generouted from "@generouted/react-router/plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: ".vite",
  plugins: [react(), Generouted()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
