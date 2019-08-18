import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import Login from '@/views/admin/login'
import Main from '@/views/admin/main-info'
import userInfo from '@/views/admin/personal/user-info'
import Register from '@/views/admin/register'
import Test from '@/views/admin/test'
import Echarts from '@/views/admin/echarts'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/main-info',
      name: 'main-info',
      component: Main
    },
    {
      path: '/user-info',
      name: 'user-info',
      component: userInfo
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '/echarts',
      name: 'echarts',
      component: Echarts
    }
  ]
})
