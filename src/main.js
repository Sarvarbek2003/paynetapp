import App from './App.vue'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
// Composables
import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives
})
// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App).use(vuetify)
const options = {
    timeout: 3000 
};


const store = createStore({
    state () {
      return {
        item: null
      }
    },
    mutations: {
      createPayment (state, data) {
        console.log(data);
        state.item = data
      }
    }
})

app.use(Toast, options);
app.use(store)

registerPlugins(app)

app.mount('#app')
