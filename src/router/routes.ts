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
        // component: () => import('../pages/tasks/Tasks.vue'),
      },
      {
        path: 'tasks',
        name: 'Tasks',
        component: () => import('../pages/tasks/Tasks.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/task/:id',
        name: 'Task',
        component: () => import('../pages/tasks/Task.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'templates',
        name: 'Templates',
        component: () => import('../pages/templates/Templates.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/template/:id',
        name: 'Template',
        component: () => import('../pages/templates/Template.vue'),
        meta: { requiresAuth: true },
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
