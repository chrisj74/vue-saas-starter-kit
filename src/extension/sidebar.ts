import Vue from 'vue';
import App from './Sidebar.vue';
import router from '@/router';
import store from '@/store';
import vuetify from '@/plugins/vuetify';
import { FirebaseAutoLogin, AUTH, fireApp } from '@/boot/firebase';

Vue.config.productionTip = false;
Vue.prototype.$auth = AUTH;
Vue.prototype.$firebase = fireApp;

new Vue({
  router,
  store,
  vuetify,
  created() {
    FirebaseAutoLogin(this as Vue);
  },
  render: (h) => h(App),
}).$mount('#app');
