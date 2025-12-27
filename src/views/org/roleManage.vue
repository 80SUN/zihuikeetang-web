<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden font-sans">
    <!-- 背景装饰 (保持原有风格) -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-1/2 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-24 left-1/3 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- 主容器 -->
    <div class="z-10 w-full max-w-5xl p-6">

      <!-- 页面标题区域 -->
      <div class="mb-8 text-center md:text-left">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">角色权限配置</h1>
        <p class="mt-2 text-gray-500">RBAC 访问控制中心 · 配置教师与学生的系统权限</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">

        <!-- 左侧：权限配置区 (占8列) -->
        <div class="md:col-span-8">
          <div class="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl p-6 h-full flex flex-col">

            <!-- 顶部：角色切换 -->
            <div class="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <span class="text-lg font-bold text-gray-700 flex items-center gap-2">
                <icon-settings class="text-blue-600" />
                权限设置
              </span>
              <a-button-group>
                <a-button>学生</a-button>
                <a-button>教师</a-button>
              </a-button-group>

              <!-- 角色切换组件 -->
              <a-radio-group
                  type="button"
                  size="large"
                  v-model="currentRole"
                  @change="handleRoleChange"
                  class="bg-gray-100 p-1 rounded-lg"
              >
                <a-radio value="teacher" class="!px-6">
                  <template #radio="{ checked }">
                    <div :class="['flex items-center gap-2 transition-all', checked ? 'text-blue-600 font-bold' : 'text-gray-500']">
                      <icon-user /> 教师 (Teacher)
                    </div>
                  </template>
                </a-radio>
                <a-radio value="student" class="!px-6">
                  <template #radio="{ checked }">
                    <div :class="['flex items-center gap-2 transition-all', checked ? 'text-green-600 font-bold' : 'text-gray-500']">
                      <icon-face-smile-fill /> 学生 (Student)
                    </div>
                  </template>
                </a-radio>
              </a-radio-group>
            </div>

            <!-- 中间：权限树 -->
            <div class="flex-1 overflow-y-auto min-h-[400px]">
              <a-tree
                  blockNode
                  checkable
                  :data="permissionData"
                  :checked-keys="checkedKeys"
                  @check="onCheck"
                  class="permission-tree"
              >
                <template #title="nodeData">
                  <div class="py-1">
                    <span class="font-medium text-gray-700">{{ nodeData.title }}</span>
                    <span v-if="nodeData.desc" class="ml-2 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      {{ nodeData.desc }}
                    </span>
                  </div>
                </template>
                <template #icon="{ isLeaf, expanded }">
                  <icon-folder v-if="!isLeaf && !expanded" />
                  <icon-folder v-else-if="!isLeaf && expanded" />
                  <icon-file v-else />
                </template>
              </a-tree>
            </div>

            <!-- 底部：保存按钮 -->
            <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-4">
              <a-button @click="handleReset">重置更改</a-button>
              <a-button type="primary" :loading="saving" @click="handleSave" class="px-8 bg-blue-600 hover:bg-blue-700">
                <template #icon><icon-save /></template>
                保存配置
              </a-button>
            </div>
          </div>
        </div>

        <!-- 右侧：当前角色预览区 (占4列) -->
        <div class="md:col-span-4">
          <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl p-8 sticky top-8 text-center transition-all duration-500">

            <!-- 动态头像 -->
            <div class="relative inline-block mb-6 group">
              <div
                  class="absolute inset-0 rounded-full blur-xl opacity-60 transition-colors duration-500"
                  :class="currentRole === 'teacher' ? 'bg-blue-400' : 'bg-green-400'"
              ></div>
              <a-avatar
                  :size="100"
                  class="relative border-4 border-white shadow-lg transform transition-transform group-hover:scale-105"
                  :class="currentRole === 'teacher' ? 'bg-blue-600' : 'bg-green-600'"
              >
                <icon-user v-if="currentRole === 'teacher'" class="text-4xl" />
                <icon-face-smile-fill v-else class="text-4xl" />
              </a-avatar>

              <!-- 角色徽章 -->
              <div class="absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold border border-gray-100 flex items-center gap-1">
                <div class="w-2 h-2 rounded-full" :class="currentRole === 'teacher' ? 'bg-blue-500' : 'bg-green-500'"></div>
                {{ roleInfo[currentRole].label }}
              </div>
            </div>

            <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ roleInfo[currentRole].name }}</h2>
            <p class="text-gray-500 text-sm mb-6">{{ roleInfo[currentRole].description }}</p>

            <!-- 角色统计/信息卡片 -->
            <div class="space-y-3 text-left">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <div class="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                  <icon-user-group />
                </div>
                <div>
                  <div class="text-xs text-gray-500">关联用户数</div>
                  <div class="font-bold text-gray-800">{{ roleInfo[currentRole].count }} 人</div>
                </div>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <div class="p-2 bg-white rounded-lg shadow-sm text-purple-600">
                  <icon-safe />
                </div>
                <div>
                  <div class="text-xs text-gray-500">权限节点</div>
                  <div class="font-bold text-gray-800">已选 {{ checkedKeys.length }} 项</div>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-dashed border-gray-200">
              <p class="text-xs text-gray-400">上次更新: 2024-05-20 14:30</p>
              <p class="text-xs text-gray-400">操作人: Administrator</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, } from 'vue';
import { Message } from '@arco-design/web-vue';
import {
  IconSettings, IconUser, IconFaceSmileFill, IconSave, IconFolder,
   IconFile, IconUserGroup, IconSafe
} from '@arco-design/web-vue/es/icon';

// --- 类型定义 ---
type RoleType = 'teacher' | 'student';

// --- 状态数据 ---
const currentRole = ref<RoleType>('teacher');
const saving = ref(false);

// 角色元数据（用于右侧展示）
const roleInfo = reactive({
  teacher: {
    label: 'Teacher',
    name: '教职工',
    description: '负责课程管理、学生评分及教学资源上传。拥有大部分内容的编辑权限。',
    count: 120,
    theme: 'blue'
  },
  student: {
    label: 'Student',
    name: '在校生',
    description: '主要进行课程学习、作业提交及成绩查询。权限主要集中在查看和个人数据提交。',
    count: 500,
    theme: 'green'
  }
});

// 权限树结构 (RBAC 模拟数据)
const permissionData = [
  {
    title: '工作台 (Dashboard)',
    key: 'dashboard',
    children: [
      { title: '查看概览', key: 'dashboard:view' },
      { title: '查看公告', key: 'dashboard:notice' },
    ],
  },
  {
    title: '课程管理 (Courses)',
    key: 'courses',
    children: [
      { title: '浏览课程列表', key: 'course:list' },
      { title: '创建/编辑课程', key: 'course:edit', desc: '核心权限' },
      { title: '删除课程', key: 'course:delete', desc: '危险' },
      { title: '上传课件', key: 'course:upload' },
    ],
  },
  {
    title: '学生/班级管理 (Class)',
    key: 'class',
    children: [
      { title: '查看学生名单', key: 'student:list' },
      { title: '录入成绩', key: 'grade:edit' },
      { title: '导出成绩单', key: 'grade:export' },
    ],
  },
  {
    title: '个人中心 (Profile)',
    key: 'profile',
    children: [
      { title: '修改基本信息', key: 'profile:edit' },
      { title: '修改密码', key: 'password:change' },
    ],
  }
];

// --- 模拟后端存储的权限数据 ---
const dbPermissions = {
  teacher: ['dashboard', 'dashboard:view', 'dashboard:notice', 'courses', 'course:list', 'course:edit', 'course:upload', 'class', 'student:list', 'grade:edit', 'grade:export', 'profile', 'profile:edit', 'password:change'],
  student: ['dashboard', 'dashboard:view', 'dashboard:notice', 'courses', 'course:list', 'profile', 'profile:edit', 'password:change']
};

// 当前选中的 keys
const checkedKeys = ref<string[]>(dbPermissions.teacher);

// --- 事件处理 ---

// 切换角色时，加载对应权限
const handleRoleChange = (val: string | number | boolean) => {
  const role = val as RoleType;
  // 模拟从后端获取该角色的权限
  checkedKeys.value = [...dbPermissions[role]];
  Message.info(`已切换至 ${roleInfo[role].name} 配置视图`);
};

// 树节点勾选
const onCheck = (newCheckedKeys: (string | number)[]) => {
  checkedKeys.value = newCheckedKeys as string[];
};

// 重置
const handleReset = () => {
  checkedKeys.value = [...dbPermissions[currentRole.value]];
  Message.warning('已重置为上次保存的状态');
};

// 保存
const handleSave = () => {
  saving.value = true;
  setTimeout(() => {
    // 模拟 API 保存
    dbPermissions[currentRole.value] = [...checkedKeys.value];
    saving.value = false;
    Message.success({
      content: `${roleInfo[currentRole.value].name} 权限配置已更新！`,
      duration: 3000
    });
  }, 1000);
};

</script>

<style scoped>
/* 保持原有的动画 */
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

/* 优化 Tree 组件样式 */
:deep(.arco-tree-node) {
  padding: 4px 0;
}
:deep(.arco-tree-node:hover) {
  background-color: rgba(243, 244, 246, 0.5); /* gray-100/50 */
  border-radius: 6px;
}
</style>