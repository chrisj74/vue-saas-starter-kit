import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router/extension';
import store from '@/store';
import vuetify from '@/plugins/vuetify';
import { FirebaseAutoLogin, AUTH, fireApp } from '@/boot/firebase';


Vue.config.productionTip = false;
Vue.prototype.$auth = AUTH;
Vue.prototype.$firebase = fireApp;

declare global {
  interface Window { chrome: any; }
}

window.chrome = window.chrome;

new Vue({
  router,
  store,
  vuetify,
  created() {
    FirebaseAutoLogin(this as Vue);
  },
  render: (h) => h(App),
}).$mount('#app');
