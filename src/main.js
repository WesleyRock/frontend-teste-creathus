import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueMask from 'v-mask'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueMask);

axios.defaults.baseURL = "http://localhost:8080/api"

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
