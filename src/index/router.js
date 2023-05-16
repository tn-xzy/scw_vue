import { createRouter, createWebHistory } from 'vue-router'
import * as VueRouter from 'vue-router'
import Home from "./pages/Home.vue";
import Test from "./pages/Test.vue";
import ManagerWork from "./pages/ManagerWork.vue";
import PersonWork from "./pages/PersonWork.vue";
import StudentTeam from "./pages/StudentTeam.vue";
import TeacherTeam from "./pages/TeacherTeam.vue";
import TeacherWorkAll from "./pages/TeacherWorkAll.vue";
import TeacherWorkSingle from "./pages/TeacherWorkSingle.vue";
// 2. 定义一些路由
const routes = [
  {
    path: '/',
    component:Home
  },
  {
    path: '/test',
    component: Test
  },
  {
    path: '/ManagerWork'.toLowerCase(),
    component: ManagerWork
  },
  {
    path: '/PersonWork'.toLowerCase(),
    component: PersonWork
  },
  {
    path: '/StudentTeam'.toLowerCase(),
    component: StudentTeam
  },
  {
    path: '/TeacherTeam'.toLowerCase(),
    component: TeacherTeam
  },
  {
    path: '/TeacherWorkAll'.toLowerCase(),
    component: TeacherWorkAll
  },
  {
    path: '/TeacherWorkSingle'.toLowerCase(),
    component: TeacherWorkSingle
  }
]

const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes:routes, // `routes: routes` 的缩写
})
router.beforeEach((to, from, next) => {
  // 如果路由有name属性，就将其作为页面名字
  if (to.path) {
    document.title = to.path
  }
  next()
})
export default router