import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './plugins/clipboard';

import firebase from 'firebase';

Vue.config.productionTip = false;

let vue: Vue | null = null;

firebase.auth().onAuthStateChanged((user: any) => {
  if (user) {
    const payload = {
      user,
      query: router.currentRoute.query,
    };
    store.dispatch('user/autoSignIn', payload);
  } else {
    store.dispatch('user/setAuth', true);
  }

  if (!vue) {
    vue = new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount('#app');
  }
});
