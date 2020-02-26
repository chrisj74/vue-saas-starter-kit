import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('../layouts/Main.vue'),
    children: [
      {
        path: '',
        component: () => import('../pages/Home.vue'),
      },
      {
        path: 'deeper',
        component: () => import('../pages/Home.vue'),
      },
    ],
  },
  {
    path: '/login',
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

export default routes;
