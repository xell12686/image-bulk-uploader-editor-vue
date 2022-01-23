import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

Vue.prototype.$appImgsPath = '/wp-content/themes/thiscovery/image-resizer/dist/img/'

new Vue({
  render: h => h(App),
}).$mount('#app')
