import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import firebase from 'firebase';
import store from '@/store';

Vue.use(VueRouter);

let extension: boolean;
if (window.chrome && window.chrome.runtime.id) {
  extension = true;
} else {
  extension = false;
}
console.log('extension=', extension);
const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  mode: extension ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
});


router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    store.commit('base/setLeftDrawerOpen', false);
    if (!firebase.auth().currentUser) {
      next({
        path: '/',
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
