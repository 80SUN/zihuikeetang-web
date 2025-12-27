<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
      <div>
        <h1 class="text-2xl font-black text-gray-800">课程大厅</h1>
        <p class="text-gray-500 text-sm mt-1">发现精彩课程，加入您的学习之旅</p>
      </div>
    </div>

    <!-- Course Grid -->
    <a-spin :loading="loading" class="w-full">
      <div v-if="courses.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <a-card v-for="course in courses" :key="course.id" hoverable class="course-card">
          <template #cover>
            <div class="h-40 overflow-hidden relative group">
              <img
                :src="course.cover || 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012957b145f1b669c22e334a69611.png~tplv-uwbnlip3yd-webp.webp'"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </template>
          <a-card-meta :title="course.title">
            <template #description>
              <div class="mt-2 text-xs text-gray-400 line-clamp-2 h-8">{{ course.description || '暂无详细描述' }}</div>
              <div class="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
                 <span class="text-[10px] text-gray-400">授课教师 ID: {{ course.teacherId }}</span>
                 <a-button type="primary" size="mini" @click="handleJoin(course.id)" shape="round">
                   加入学习
                 </a-button>
              </div>
            </template>
          </a-card-meta>
        </a-card>
      </div>
      <div v-else class="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200">
          <icon-empty :size="64" class="text-gray-200" />
          <p class="text-gray-400 mt-4">暂无开放课程</p>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconEmpty } from '@arco-design/web-vue/es/icon';
import request from '../../utils/request';

const loading = ref(false);
const courses = ref<any[]>([]);

const fetchData = async () => {
    loading.value = true;
    try {
        const res: any = await request.get('/service/admin/edu/course/all');
        courses.value = res;
    } catch (e) {
        Message.error('获取课程失败');
    } finally {
        loading.value = false;
    }
};

const handleJoin = async (courseId: number) => {
    try {
        await request.post(`/service/admin/edu/course/join/${courseId}`);
        Message.success('恭喜！已成功加入课程');
    } catch (e: any) {
        // 后端会返回如“已加入”等错息
    }
};

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.course-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
}
.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
}
:deep(.arco-card-meta-title) {
  font-weight: bold;
}
</style>