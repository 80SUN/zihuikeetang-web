import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'dashboard',
          component: () => import('../views/Dashboard.vue')
        },
        {
          path: 'teacher/dashboard',
          name: 'TeacherDashboard',
          component: () => import('../views/teacher/Dashboard.vue')
        },
        {
          path: 'student/dashboard',
          name: 'StudentDashboard',
          component: () => import('../views/student/Dashboard.vue')
        },
        {
          path: 'manager/roleManage',
          name: 'RoleManage',
          component: () => import('../views/org/roleManage.vue')
        },
        // 课程管理
        {
          path: 'courses/list',
          name: 'CourseList',
          component: () => import('../views/teacher/CourseList.vue')
        },
        // 签到管理 (教师)
        {
          path: 'teacher/checkin',
          name: 'TeacherCheckin',
          component: () => import('../views/teacher/Checkin.vue')
        },
        // 学生选课
        {
          path: 'courses/find',
          name: 'FindCourse',
          component: () => import('../views/student/FindCourse.vue')
        },
        // 学生参与签到
        {
          path: 'student/checkin',
          name: 'StudentCheckin',
          component: () => import('../views/student/Checkin.vue')
        }
      ]
    }
  ]
});

export default router;