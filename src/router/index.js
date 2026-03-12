import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import WebScraper from '../views/WebScraper.vue'
import Login from '../views/Login.vue'
import { clearAuth, isAdmin, isAuthenticated } from '../services/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/web-scraper',
      name: 'scraper',
      component: WebScraper,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        public: true,
      },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.public) {
    if (to.name === 'login' && isAuthenticated() && isAdmin()) {
      return { name: 'dashboard' }
    }

    return true
  }

  if (to.meta.requiresAuth && !isAuthenticated()) {
    return {
      name: 'login',
      query: {
        reason: 'auth',
      },
    }
  }

  if (to.meta.requiresAdmin && !isAdmin()) {
    clearAuth()
    return {
      name: 'login',
      query: {
        reason: 'admin',
      },
    }
  }

  return true
})

export default router
