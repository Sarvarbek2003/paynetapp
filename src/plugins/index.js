/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import router from '../router'

export function registerPlugins (app) {
  loadFonts()
  app
    .use(vuetify)
    .use(router)
    // .use(pinia)
    // .use(new VueSocketIO({
    //   debug: true,
    //   connection: SocketIO('https://my.agrobank.uz', {
    //     transport: ["websocket", "polling"],
    //     reconnection: true,
    //     reconnectionDelay: 500,  
    //     maxReconnectionAttempts: Infinity,
    //     extraHeaders: {
    //       token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInVzZXJuYW1lIjoib3BlcmF0b3I0IiwiZmlyc3RfbmFtZSI6Ik9wZXJhdG9yNCIsImlhdCI6MTY3NzA0MDY4NywiZXhwIjoxNjc3MDc2Njg3fQ.FAakm0GBPsqefLKEW8aMr2ZUMTaLc3veckJBEcko3b8"
    //     },
    //   })
    // }));
}
