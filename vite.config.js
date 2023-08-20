// // import { fileURLToPath, URL } from 'node:url'

// // import { defineConfig } from 'vite'
// // import vue from '@vitejs/plugin-vue'

// // // https://vitejs.dev/config/
// // export default defineConfig({
// //   plugins: [vue()],
// //   resolve: {
// //     alias: {
// //       '@': fileURLToPath(new URL('./src', import.meta.url))
// //     }
// //   }
// // })
// // Plugins
// import vue from '@vitejs/plugin-vue'
// import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// // Utilities
// import { defineConfig } from 'vite'
// import { fileURLToPath, URL } from 'node:url'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     vue({ 
//       template: { transformAssetUrls }
//     }),
//     // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
//     vuetify({
//       autoImport: true,
//       styles: {
//         configFile: 'src/styles/settings.scss',
//       },
//     }),
//   ],
//   define: { 'process.env': {} },
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     },
//     extensions: [
//       '.js',
//       '.json',
//       '.jsx',
//       '.mjs',
//       '.ts',
//       '.tsx',
//       '.vue',
//     ],
//   },
//   server: {
//     host: '0.0.0.0',
//     port: 5544,
//   },
// })


import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const url = new URL('./src', import.meta.url);

export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  plugins: [
    vue(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "${url}/assets/scss/partials/_vars.scss";
          @import "${url}/assets/scss/partials/_mixins.scss";
          @import "${url}/assets/scss/partials/_media.scss";`
      }
    }
  },
  server: {
    port: 5991,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(url)
    }
  }
});