import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('../layouts/Main.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../pages/Home.vue'),
      },
    ],
  },
  {
    path: '/editor',
    component: () => import('../layouts/Editor.vue'),
    children: [
      {
        path: '',
        component: () => import('../pages/editor/Editor.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: ':workBookId',
        component: () => import('../pages/editor/Editor.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: ':workBookId/:pageId',
        component: () => import('../pages/editor/Editor.vue'),
        meta: { requiresAuth: false },
      },
    ],
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

export default routes;
