<template>
  <div class="teacher-dashboard">
    <!-- Header Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <a-card hoverable :bordered="false" class="stat-card bg-blue-50">
        <template #title>
          <span class="flex items-center gap-2"><icon-storage />进行中课程</span>
        </template>
        <div class="flex items-baseline justify-between mt-2">
            <div class="text-4xl font-extrabold text-blue-600">6</div>
            <div class="text-blue-400"><icon-arrow-rise /> 12%</div>
        </div>
      </a-card>
      <a-card hoverable :bordered="false" class="stat-card bg-green-50">
        <template #title>
          <span class="flex items-center gap-2"><icon-user-group />总学生数</span>
        </template>
        <div class="flex items-baseline justify-between mt-2">
            <div class="text-4xl font-extrabold text-green-600">284</div>
            <div class="text-green-400"><icon-user /> 本周 +5</div>
        </div>
      </a-card>
      <a-card hoverable :bordered="false" class="stat-card bg-orange-50">
        <template #title>
          <span class="flex items-center gap-2"><icon-file />今日作业</span>
        </template>
        <div class="flex items-baseline justify-between mt-2">
            <div class="text-4xl font-extrabold text-orange-600">18</div>
            <div class="text-orange-400">待批改</div>
        </div>
      </a-card>
      <a-card hoverable :bordered="false" class="stat-card bg-purple-50">
        <template #title>
          <span class="flex items-center gap-2"><icon-calendar />下节课程</span>
        </template>
        <div class="mt-2">
            <div class="text-lg font-bold text-purple-700">JavaEE企业开发</div>
            <div class="text-xs text-purple-400">14:00 | 智慧教室502</div>
        </div>
      </a-card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Course Attendance Chart (Placeholder) -->
      <div class="lg:col-span-2">
        <a-card title="课堂实时表现" :bordered="false" class="rounded-2xl shadow-sm">
           <template #extra>
             <a-link>查看详情</a-link>
           </template>
           <div class="h-64 flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
              <div class="text-center">
                  <icon-empty :size="64" class="text-gray-300" />
                  <p class="text-gray-400 mt-2 italic text-sm">正在加载实时数据可视化图表...</p>
              </div>
           </div>
        </a-card>
        
        <a-card title="快速教学任务" :bordered="false" class="rounded-2xl shadow-sm mt-8">
          <a-table :data="tasks" :pagination="false" :bordered="false">
            <template #columns>
              <a-table-column title="任务名称" data-index="name" />
              <a-table-column title="截止时间" data-index="deadline" />
              <a-table-column title="进度" data-index="progress">
                <template #cell="{ record }">
                  <a-progress :percent="record.progress" size="small" />
                </template>
              </a-table-column>
              <a-table-column title="操作">
                <template #cell>
                  <a-button type="text">查看</a-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-card>
      </div>

      <!-- Right Side -->
      <div class="space-y-8">
        <a-card title="教学研讨安排" :bordered="false" class="rounded-2xl shadow-sm">
          <a-timeline>
            <a-timeline-item label="2024-12-28">大数据课程研讨会</a-timeline-item>
            <a-timeline-item label="2024-12-30" dot-color="red">期中教学质量检查</a-timeline-item>
            <a-timeline-item label="2025-01-05">智慧课堂二期培训</a-timeline-item>
          </a-timeline>
        </a-card>

        <a-card :bordered="false" class="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg overflow-hidden relative">
            <div class="relative z-10">
                <div class="text-lg font-bold">系统提示</div>
                <div class="mt-2 text-indigo-100 text-sm opacity-90">
                    您有 3 个班级的课程资料尚未上传，请及时处理以免影响学生预习。
                </div>
                <a-button class="mt-4 bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full px-6">立即上传</a-button>
            </div>
            <icon-email class="absolute -right-4 -bottom-4 text-8xl text-white/10 rotate-12" />
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  IconStorage, IconUserGroup, IconFile, IconCalendar, 
  IconArrowRise, IconUser, IconEmpty, IconEmail
} from '@arco-design/web-vue/es/icon';

const tasks = [
    { name: '软件工程作业批改', deadline: '2024-12-29', progress: 0.65 },
    { name: 'Java课程试卷出题', deadline: '2024-12-31', progress: 0.20 },
    { name: '毕业设计进度审核', deadline: '2025-01-10', progress: 0.90 }
];
</script>

<style scoped>
.teacher-dashboard {
  animation: slide-up 0.4s ease-out;
}

.stat-card {
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>