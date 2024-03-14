import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '../components/SignUp.vue'
import LogIn from '../components/LogIn.vue'
import HomePage from '@/views/HomePage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/login',
      name: 'login',
      component: LogIn
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage
    }
  ]
})

export default router
