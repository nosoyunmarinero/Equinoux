import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/Equinoux/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/full-analysis": "http://localhost:3001",
      "/analyze": "http://localhost:3001",
      "/puppeteer": "http://localhost:3001",
      "/axe": "http://localhost:3001",
    },
  },
});
