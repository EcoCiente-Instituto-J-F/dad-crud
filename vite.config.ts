import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    server: {
      port: 5173,
      strictPort: true,

      proxy: {
        "/dad-api": {
          target:
            env.DAD_PROXY_TARGET || "http://127.0.0.1:8080",
          changeOrigin: true,
          rewrite: (caminho) =>
            caminho.replace(/^\/dad-api/, ""),
        },

        "/auth-api": {
          target:
            env.AUTH_PROXY_TARGET || "http://127.0.0.1:9801",
          changeOrigin: true,
          rewrite: (caminho) =>
            caminho.replace(/^\/auth-api/, ""),
        },

        "/cadastro-api": {
          target:
            env.CADASTRO_PROXY_TARGET || "http://127.0.0.1:9090",
          changeOrigin: true,
          rewrite: (caminho) =>
            caminho.replace(/^\/cadastro-api/, ""),
        },

        "/senha-api": {
          target:
            env.SENHA_PROXY_TARGET || "http://127.0.0.1:9809",
          changeOrigin: true,
          rewrite: (caminho) =>
            caminho.replace(/^\/senha-api/, ""),
        },
      },
    },
  };
});