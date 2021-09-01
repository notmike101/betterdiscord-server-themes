import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile';
import Banner from 'vite-plugin-banner';
import { banner, name, main } from './meta';

export default defineConfig({
  plugins: [
    viteSingleFile(),
    Banner(banner),
  ],
  build: {
    target: 'esnext',
    minify: false,
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    brotliSize: false,
    rollupOptions: {
      inlineDynamicImports: true,
      output: {
        manualChunks: () => 'everything.js',
      },
      external: ['react'],
    },
    lib: {
      entry: main,
      name: name,
      fileName: name + '.plugin',
      formats: ['cjs'],
    },
  }
});
