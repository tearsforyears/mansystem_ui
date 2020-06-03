import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Register from "@/views/Register";
import Info from "@/views/Info";
import Error from "@/components/Error";
import Alert from "@/views/Alert";
import Main from "@/views/Main";
import Community from "@/views/Community";
import Communities from "@/views/Communities";
import ManageCommunity from "@/views/ManageCommunity";
import Statistics from "@/views/Statistics";
import Query from "@/views/Query";

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/query.vue',
      name: 'Query',
      component: Query,
      meta: {
        charset: "UTF-8",
      }
    },
    {
      path: '/statistics.vue',
      name: 'Statistics',
      component: Statistics,
      meta: {
        charset: "UTF-8",
      }
    },
    {
      path: '/managecommunity.vue',
      name: 'ManageCommunity',
      component: ManageCommunity,
      meta: {
        charset: "UTF-8",
      }
    },
    {
      path: '/communities.vue',
      name: 'Communities',
      component: Communities,
      meta: {
        charset: "UTF-8",
      }
    },
    {
      path: '/community.vue',
      name: 'Community',
      component: Community,
      meta: {
        charset: "UTF-8",
      }
    },
    {
      path: '/login.vue',
      name: 'Login',
      component: Login,
      meta: {
        charset: "UTF-8",
      }
    },
    {
      path: '/register.vue',
      name: 'Register',
      component: Register,
      meta: {
        charset: "UTF-8",
      }
    },
    {
      path: '/info.vue',
      name: 'Info',
      component: Info,
      meta: {
        charset: "UTF-8",
      }
    },
    {
      path: '/alert.vue',
      name: 'Alert',
      component: Alert,
      meta: {
        charset: "UTF-8",
      }
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
      meta: {
        charset: "UTF-8",
      }
    },
    {
      path: '/*',
      component: Error,
      name: 'Error',
      meta: {
        title: '页面没找到 请重试',
        charset: "UTF-8",
      }
    },
  ]
})
