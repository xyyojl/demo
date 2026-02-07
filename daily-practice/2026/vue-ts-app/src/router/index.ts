import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { useSignsStore } from '@/stores/signs'
import { storeToRefs } from 'pinia'
import _ from 'lodash'

const Login = () => import('@/views/Login/Login.vue')
const Home = () => import('@/views/Home/Home.vue')
const Sign = () => import('@/views/Sign/Sign.vue')
const Exception = () => import('@/views/Exception/Exception.vue')
const Apply = () => import('@/views/Apply/Apply.vue')
const Check = () => import('@/views/Check/Check.vue')

declare module 'vue-router' {
  interface RouteMeta {
    menu?: boolean
    title?: string
    icon?: string
    auth?: boolean
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/sign',
    meta: {
      menu: true,
      title: '考勤管理',
      icon: 'document-copy',
      auth: true
    },
    children: [
      {
        path: 'sign',
        name: 'sign',
        component: Sign,
        meta: {
          menu: true,
          title: '在线打卡签到',
          icon: 'calendar',
          auth: true
        },
        async beforeEnter(to, from, next) {
          const usersStore = useUsersStore()
          const { infos: usersInfos } = storeToRefs(usersStore)
          const signsStore = useSignsStore()
          const { infos: signsInfos } = storeToRefs(signsStore)
          // 检查是否有打卡记录
          if (_.isEmpty(signsInfos.value)) {
            const res = await signsStore.getTimeAction({ userid: usersInfos.value._id })
            if (res.data.errcode === 0) {
              signsStore.updateInfos(res.data.infos)
              next()
            }
          } else {
            next()
          }
        }
      },
      {
        path: 'exception',
        name: 'exception',
        component: Exception,
        meta: {
          menu: true,
          title: '异常考勤查询',
          icon: 'warning',
          auth: true
        },
        async beforeEnter(to, from, next) {
          const usersStore = useUsersStore()
          const { infos: usersInfos } = storeToRefs(usersStore)
          const signsStore = useSignsStore()
          const { infos: signsInfos } = storeToRefs(signsStore)
          // 检查是否有打卡记录
          if (_.isEmpty(signsInfos.value)) {
            const res = await signsStore.getTimeAction({ userid: usersInfos.value._id })
            if (res.data.errcode === 0) {
              signsStore.updateInfos(res.data.infos)
              next()
            }
          } else {
            next()
          }
        }
      },
      {
        path: 'apply',
        name: 'apply',
        component: Apply,
        meta: {
          menu: true,
          title: '添加考勤审批',
          icon: 'document-add',
          auth: true
        }
      },
      {
        path: 'check',
        name: 'check',
        component: Check,
        meta: {
          menu: true,
          title: '我的考勤审批',
          icon: 'finished',
          auth: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const usersStore = useUsersStore()
  const { token, infos } = storeToRefs(usersStore)
  if (to.meta.auth && _.isEmpty(infos.value)) { // 需要权限
    if (token.value) {
      usersStore.infosAction().then(res => {
        if (res.data.errcode === 0) {
          usersStore.updateInfos(res.data.infos);
          next()
        }
      })
    } else {
      next({ name: 'login' }) // 也可以写成 next('/login')，下同
    }
  } else {
    if (token.value && to.path === '/login') {
      next({ name: 'home' })
    } else {
      next()
    }
  }
})

export default router
