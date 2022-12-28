import path from "path";

/** @type {import('vite').UserConfig} */
export default {
  build: {
    outDir: path.resolve(__dirname, "dist"),
    rollupOptions: {
      input: "./index.html",
      output: {
        dir: "dist",
      },
    },
  },
  server: {
    port: 2990,
  },
};
