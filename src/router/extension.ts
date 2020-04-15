import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/ExtensionPopup.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../layouts/Auth.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        component: () => import('../pages/auth/login.vue'),
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../layouts/Auth.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        component: () => import('../pages/auth/register.vue'),
        meta: { requiresAuth: false },
      },
    ],
  },
];

const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
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
