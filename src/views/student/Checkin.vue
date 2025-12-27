<template>
  <div class="p-6">
    <div class="mb-6 bg-white p-6 rounded-2xl shadow-sm">
      <h1 class="text-2xl font-black text-gray-800">课堂签到中心</h1>
      <p class="text-gray-500 text-sm mt-1">请选择您当前正在参加的课程进行签到</p>
    </div>

    <a-spin :loading="loading" class="w-full">
      <div v-if="enrolledCourses.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a-card v-for="course in enrolledCourses" :key="course.id" class="rounded-xl hover:shadow-lg transition-shadow">
          <template #title>
             <div class="flex items-center gap-2">
                 <icon-book class="text-blue-500" />
                 <span class="font-bold">{{ course.title }}</span>
             </div>
          </template>
          <div class="py-4">
             <div v-if="activeCheckins[course.id]" class="bg-blue-50 p-4 rounded-lg flex flex-col items-center">
                 <div class="text-blue-600 font-bold text-lg mb-2"> 检测到当前有点名任务</div>
                 <div class="text-xs text-blue-400 mb-4">{{ activeCheckins[course.id].title }}</div>
                 <a-button type="primary" long shape="round" @click="handleCheckin(activeCheckins[course.id].id)">
                   立即签到
                 </a-button>
             </div>
             <div v-else class="text-center py-6 text-gray-400">
                 <icon-sync class="mb-2 animate-spin" />
                 <div class="text-sm">暂无进行中的点名</div>
             </div>
          </div>
        </a-card>
      </div>
      <div v-else class="py-20 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
          <p class="text-gray-400">您还没有加入任何课程，请先前往选课中心</p>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconBook, IconSync } from '@arco-design/web-vue/es/icon';
import request from '../../utils/request';

const loading = ref(false);
const enrolledCourses = ref<any[]>([]);
const activeCheckins = ref<Record<number, any>>({});

const fetchData = async () => {
    loading.value = true;
    try {
        const courses: any = await request.get('/service/admin/edu/course/my-courses');
        enrolledCourses.value = courses;
        
        // 为每一门课检查是否有活跃的点名
        for (const course of enrolledCourses.value) {
            const checkins: any = await request.get(`/service/admin/edu/checkin/list/${course.id}`);
            // 找一个没过期的
            const now = new Date();
            const active = checkins.find((c: any) => new Date(c.endTime) > now);
            if (active) {
                activeCheckins.value[course.id] = active;
            }
        }
    } catch (e) {} finally {
        loading.value = false;
    }
};

const handleCheckin = async (checkinId: number) => {
    try {
        await request.post(`/service/admin/edu/checkin/submit/${checkinId}`);
        Message.success('签到成功！');
        fetchData();
    } catch (e) {}
};

onMounted(() => {
    fetchData();
});
</script>