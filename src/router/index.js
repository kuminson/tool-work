import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/regExp',
    name: 'regExp',
    component: () => import(/* webpackChunkName: "about" */ '../views/regExp.vue')
  },
  {
    path: '/i18n',
    name: 'i18n',
    component: () => import(/* webpackChunkName: "about" */ '../views/i18n.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
