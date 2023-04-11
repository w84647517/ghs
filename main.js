import App from './App'
import store from './store/index'
import Vue from 'vue'
import uView from 'uview-ui';
import request from '@/request/request'
// #ifndef VUE3


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()
Vue.use(uView);
Vue.prototype.$http = request
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif