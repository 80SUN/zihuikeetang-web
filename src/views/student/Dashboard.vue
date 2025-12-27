<template>
  <div class="student-dashboard">
    <!-- Student Profile Header -->
    <div class="bg-white rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-slate-100">
        <a-avatar :size="80" class="border-4 border-blue-100 shadow-md">
            <img :src="userInfo.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'" />
        </a-avatar>
        <div class="text-center md:text-left">
            <h2 class="text-2xl font-black text-gray-800">Hi, {{ userInfo.name || '同学' }}</h2>
            <p class="text-gray-500 mt-1">您已经在智慧课堂学习了 <span class="text-blue-600 font-bold">15</span> 天，加油！</p>
        </div>
        <div class="flex-1 md:text-right">
             <a-button type="primary" shape="round" size="large" class="shadow-lg shadow-blue-200">
                <template #icon><icon-check-circle /></template>快速签到
             </a-button>
        </div>
    </div>

    <!-- Main Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <a-card class="data-card bg-gradient-to-br from-indigo-500 to-blue-600 border-none rounded-2xl text-white shadow-blue-100 shadow-xl overflow-hidden relative">
        <div class="relative z-10 p-2">
            <div class="text-sm opacity-80">当前学期绩点</div>
            <div class="text-4xl font-black mt-2">3.85</div>
            <div class="mt-4 flex items-center text-xs opacity-70">
              <icon-trophy class="mr-1" /> 超过全校 85% 的学生
            </div>
        </div>
        <icon-thunderbolt class="absolute -right-6 -bottom-6 text-9xl text-white/10 -rotate-12" />
      </a-card>

      <a-card class="data-card bg-gradient-to-br from-teal-400 to-emerald-600 border-none rounded-2xl text-white shadow-emerald-100 shadow-xl overflow-hidden relative">
        <div class="relative z-10 p-2">
            <div class="text-sm opacity-80">待提交作业</div>
            <div class="text-2xl font-black mt-2">点击查看</div>
            <div class="mt-4 flex items-center text-xs">
              <icon-book class="mr-1" /> 距离最近 DDL 还有 <span class="mx-1 font-bold text-lg">2</span> 小时
            </div>
        </div>
        <icon-history class="absolute -right-6 -bottom-6 text-9xl text-white/10 rotate-12" />
      </a-card>

      <a-card class="data-card bg-gradient-to-br from-rose-400 to-orange-500 border-none rounded-2xl text-white shadow-orange-100 shadow-xl overflow-hidden relative">
        <div class="relative z-10 p-2">
            <div class="text-sm opacity-80">我的积分</div>
            <div class="text-4xl font-black mt-2">1,540</div>
            <div class="mt-4 flex items-center text-xs opacity-70">
               <icon-gift class="mr-1" /> 可以在积分商城兑换奖品
            </div>
        </div>
        <icon-star class="absolute -right-6 -bottom-6 text-9xl text-white/10" />
      </a-card>
    </div>

    <!-- Course List -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <a-card title="正在进行的课程" :bordered="false" class="rounded-2xl shadow-sm">
            <a-spin :loading="loading" class="w-full">
                <div v-if="enrolledCourses.length" class="space-y-4">
                    <div v-for="course in enrolledCourses" :key="course.id" class="course-item p-4 rounded-xl border border-slate-50 bg-slate-50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-lg bg-white overflow-hidden flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
                                    <img v-if="course.cover" :src="course.cover" class="w-full h-full object-cover" />
                                    <icon-book v-else />
                                </div>
                                <div>
                                    <div class="font-bold text-gray-800">{{ course.title }}</div>
                                    <div class="text-xs text-gray-400">状态: {{ course.status === 1 ? '进行中' : '已结课' }}</div>
                                </div>
                            </div>
                            <a-button type="text" class="group-hover:text-blue-600">
                                进场学习 <icon-arrow-right />
                            </a-button>
                        </div>
                    </div>
                </div>
                <div v-else class="py-10 text-center">
                    <p class="text-gray-400">您还没有加入任何课程</p>
                    <a-button type="outline" class="mt-4" @click="$router.push('/courses/find')">前往选课中心</a-button>
                </div>
            </a-spin>
        </a-card>

        <a-card title="校园通知" :bordered="false" class="rounded-2xl shadow-sm">
            <a-list :bordered="false">
                <a-list-item v-for="notice in notices" :key="notice.title">
                    <a-list-item-meta :title="notice.title" :description="notice.date" />
                    <template #actions>
                        <icon-eye class="cursor-pointer text-gray-400 hover:text-blue-600" />
                    </template>
                </a-list-item>
            </a-list>
        </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  IconCheckCircle, IconThunderbolt, IconHistory, IconStar, 
  IconTrophy,  IconGift, IconBook, IconArrowRight, IconEye
} from '@arco-design/web-vue/es/icon';
import request from '../../utils/request';

const loading = ref(false);
const enrolledCourses = ref<any[]>([]);
const userInfo = ref<any>({});

const fetchData = async () => {
    loading.value = true;
    try {
        // 获取用户信息
        const infoRes: any = await request.get('/login/admin/system/index/info');
        userInfo.value = infoRes;
        
        // 获取已报名的课程
        const courseRes: any = await request.get('/service/admin/edu/course/my-courses');
        enrolledCourses.value = courseRes;
    } catch (e) {} finally {
        loading.value = false;
    }
};

const notices = [
    { title: '校园网升级维护通知', date: '2025-12-25' },
    { title: '图书馆闭馆系统通知', date: '2025-12-24' },
    { title: '期末作业截止提醒', date: '2025-12-20' }
];

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.student-dashboard {
  animation: fade-in 0.5s ease-out;
}
.data-card {
  transition: transform 0.3s ease;
}
.data-card:hover {
  transform: scale(1.02);
}
.course-item {
  cursor: pointer;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>