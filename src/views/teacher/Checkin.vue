<template>
  <div class="p-6">
    <div class="mb-6 bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-black text-gray-800">在线签到管理</h1>
        <p class="text-gray-500 text-sm mt-1">发布限时点名任务，掌握学生到课情况</p>
      </div>
      <div class="flex gap-4">
        <a-select v-model="selectedCourseId" placeholder="选择课程" style="width: 240px" @change="fetchHistory">
          <a-option v-for="course in courses" :key="course.id" :value="course.id">{{ course.title }}</a-option>
        </a-select>
        <a-button type="primary" :disabled="!selectedCourseId" @click="visible = true">
          <template #icon><icon-plus /></template>发起点名
        </a-button>
      </div>
    </div>

    <!-- Checkin History -->
    <a-spin :loading="loading" class="w-full">
      <div v-if="history.length" class="bg-white rounded-2xl overflow-hidden shadow-sm">
        <a-table :data="history" :pagination="false">
          <template #columns>
            <a-table-column title="点名标题" data-index="title" />
            <a-table-column title="开始时间">
              <template #cell="{ record }">{{ formatDate(record.startTime) }}</template>
            </a-table-column>
             <a-table-column title="截止时间">
              <template #cell="{ record }">{{ formatDate(record.endTime) }}</template>
            </a-table-column>
            <a-table-column title="状态">
              <template #cell="{ record }">
                <a-tag :color="isExpired(record.endTime) ? 'gray' : 'green'">
                  {{ isExpired(record.endTime) ? '已失效' : '点名中' }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="操作">
              <template #cell="{ record }">
                <a-button type="text" size="small" @click="viewRecords(record.id)">查看结果</a-button>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </div>
      <div v-else class="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200">
          <icon-empty :size="64" class="text-gray-200" />
          <p class="text-gray-400 mt-4">请选择课程查看签到历史</p>
      </div>
    </a-spin>

    <!-- Create Modal -->
    <a-modal v-model:visible="visible" title="发起新点名" @ok="handleCreate">
      <a-form :model="form" layout="vertical">
        <a-form-item label="签到标题">
          <a-input v-model="form.title" placeholder="如：12月28日 课堂签到" />
        </a-form-item>
        <a-form-item label="有效时长 (分钟)">
          <a-input-number v-model="form.minutes" :min="1" :max="60" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Records Modal -->
    <a-modal v-model:visible="recordVisible" title="到课学生名单" :footer="false" width="600px">
       <a-table :data="attendanceRecords">
         <template #columns>
            <a-table-column title="学生 ID" data-index="studentId" />
            <a-table-column title="签到时间">
               <template #cell="{ record }">{{ formatDate(record.checkinTime) }}</template>
            </a-table-column>
         </template>
       </a-table>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconPlus, IconEmpty } from '@arco-design/web-vue/es/icon';
import request from '../../utils/request';

const loading = ref(false);
const courses = ref<any[]>([]);
const selectedCourseId = ref<number>();
const history = ref<any[]>([]);
const visible = ref(false);
const recordVisible = ref(false);
const attendanceRecords = ref<any[]>([]);

const form = reactive({
  title: '课堂同步签到',
  minutes: 5
});

const fetchCourses = async () => {
  try {
    const res: any = await request.get('/service/admin/edu/course/list/0');
    courses.value = res;
  } catch (e) {}
};

const fetchHistory = async () => {
    if (!selectedCourseId.value) return;
    loading.value = true;
    try {
        const res: any = await request.get(`/service/admin/edu/checkin/list/${selectedCourseId.value}`);
        history.value = res;
    } catch (e) {} finally {
        loading.value = false;
    }
};

const handleCreate = async () => {
    try {
        const endTime = new Date(Date.now() + form.minutes * 60000);
        await request.post('/service/admin/edu/checkin/create', {
            courseId: selectedCourseId.value,
            title: form.title,
            endTime: endTime
        });
        Message.success('点名任务已发布');
        visible.value = false;
        fetchHistory();
    } catch (e) {}
};

const viewRecords = async (checkinId: number) => {
    recordVisible.value = true;
    try {
        const res: any = await request.get(`/service/admin/edu/checkin/records/${checkinId}`);
        attendanceRecords.value = res;
    } catch (e) {}
};

const formatDate = (dateStr: any) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

const isExpired = (endTime: any) => {
    return new Date() > new Date(endTime);
};

onMounted(() => {
    fetchCourses();
});
</script>