// vite.config.js
export default {
  base: './',
  root: './src',
  build: {
    outDir: '../',
    //minify: true,
  },
  server: {
    https: true,
  },
};