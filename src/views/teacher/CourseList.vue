<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
      <div>
        <h1 class="text-2xl font-black text-gray-800">课程管理</h1>
        <p class="text-gray-500 text-sm mt-1">创建并管理您的在线课程、课件与教学计划</p>
      </div>
      <a-button type="primary" size="large" @click="handleAdd" class="shadow-lg shadow-blue-100">
        <template #icon><icon-plus /></template>创建新课程
      </a-button>
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
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                 <a-button type="primary" shape="circle" @click="handleEdit(course)"><icon-edit /></a-button>
                 <a-popconfirm content="确定删除该课程吗？" @ok="handleDelete(course.id)">
                   <a-button type="primary" status="danger" shape="circle"><icon-delete /></a-button>
                 </a-popconfirm>
              </div>
            </div>
          </template>
          <a-card-meta :title="course.title">
            <template #description>
              <div class="mt-2 text-xs text-gray-400 line-clamp-2">{{ course.description || '暂无课程描述信息' }}</div>
              <div class="mt-4 flex items-center justify-between">
                <a-tag :color="course.status === 1 ? 'green' : 'gray'" size="small">
                  {{ course.status === 1 ? '进行中' : '已结束' }}
                </a-tag>
                <span class="text-gray-400 text-[10px]">{{ formatDate(course.createTime) }}</span>
              </div>
            </template>
          </a-card-meta>
        </a-card>
      </div>
      <div v-else class="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200">
          <icon-empty :size="64" class="text-gray-200" />
          <p class="text-gray-400 mt-4">您还没有创建过课程</p>
      </div>
    </a-spin>

    <!-- Modal for Add/Edit -->
    <a-modal v-model:visible="visible" :title="form.id ? '编辑课程' : '创建课程'" @ok="handleOk" @cancel="handleCancel">
      <a-form :model="form" layout="vertical">
        <a-form-item field="title" label="课程标题" required>
          <a-input v-model="form.title" placeholder="请输入课程标题" />
        </a-form-item>
        <a-form-item field="description" label="课程描述">
          <a-textarea v-model="form.description" placeholder="请输入课程简介..." :auto-size="{ minRows: 3 }" />
        </a-form-item>
        <a-form-item field="cover" label="封面图片地址">
          <a-input v-model="form.cover" placeholder="http://..." />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-radio-group v-model="form.status">
            <a-radio :value="1">进行中</a-radio>
            <a-radio :value="0">已结束</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconPlus, IconEdit, IconDelete, IconEmpty } from '@arco-design/web-vue/es/icon';
import request from '../../utils/request';

const loading = ref(false);
const courses = ref<any[]>([]);
const visible = ref(false);

const form = reactive({
  id: undefined,
  title: '',
  description: '',
  cover: '',
  status: 1
});

const fetchData = async () => {
    loading.value = true;
    try {
        // 直接传 0，后端会通过 Token 自动识别当前教师
        const res: any = await request.get('/service/admin/edu/course/list/0');
        courses.value = res;
    } catch (e) {
        Message.error('获取课程列表失败');
    } finally {
        loading.value = false;
    }
};

const handleAdd = () => {
  form.id = undefined;
  form.title = '';
  form.description = '';
  form.cover = '';
  form.status = 1;
  visible.value = true;
};

const handleEdit = (course: any) => {
  Object.assign(form, course);
  visible.value = true;
};

const handleOk = async () => {
  if (!form.title) {
    Message.warning('请填写课程标题');
    return;
  }
  try {
    await request.post('/service/admin/edu/course/save', form);
    Message.success(form.id ? '编辑成功' : '创建成功');
    visible.value = false;
    fetchData();
  } catch (e) {}
};

const handleCancel = () => {
  visible.value = false;
};

const handleDelete = async (id: number) => {
  try {
    await request.delete(`/service/admin/edu/course/remove/${id}`);
    Message.success('已删除课程');
    fetchData();
  } catch (e) {}
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '刚刚';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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