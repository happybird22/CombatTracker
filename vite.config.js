import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Firebase Hosting serves from the domain root, unlike the GitHub Pages
  // project-page path this used before.
  base: "/",
});
