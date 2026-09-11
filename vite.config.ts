import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        registro: resolve(__dirname, "src/pages/auth/registro/registro.html"),
        admin: resolve(__dirname, "src/pages/admin/admin.html"),
        clientHome: resolve(__dirname, "src/pages/client/home/home.html"),
        clientCart: resolve(__dirname, "src/pages/client/cart/cart.html"),
      },
    },
  },
  base: "./",
});