import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your API server's URL
        changeOrigin: true,
        secure: false, // Change to true if your API server uses HTTPS
      },
    },
  },
});
