<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

    <!-- 登录卡片 -->
    <div class="z-10 w-full max-w-md p-10 bg-white/80 backdrop-blur-lg border border-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
          <icon-book class="text-white text-3xl" />
        </div>
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">智慧课堂</h2>
        <p class="mt-2 text-sm text-gray-500">欢迎回来，请登录您的账户</p>
      </div>

      <a-form :model="form" layout="vertical" @submit="handleSubmit">
        <a-form-item field="username" label="用户名" class="mb-4">
          <a-input v-model="form.username" placeholder="请输入用户名" size="large" allow-clear>
            <template #prefix><icon-user /></template>
          </a-input>
        </a-form-item>

        <a-form-item field="password" label="密码" class="mb-6">
          <a-input-password v-model="form.password" placeholder="请输入密码" size="large" allow-clear>
            <template #prefix><icon-lock /></template>
          </a-input-password>
        </a-form-item>

        <div class="flex items-center justify-between mb-8">
          <a-checkbox v-model="form.remember">记住我</a-checkbox>
          <a-link type="primary" size="small">忘记密码？</a-link>
        </div>

        <a-form-item>
          <a-button
              html-type="submit"
              long
              size="large"
              :loading="loading"
              type="primary"
              class="rounded-lg bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg h-12 text-lg"
          >
            立即登录
          </a-button>
        </a-form-item>
      </a-form>

      <div class="mt-6 text-center">
        <span class="text-sm text-gray-500">还没有账号？</span>
        <a-link type="primary">申请加入</a-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { IconUser, IconLock, IconBook } from '@arco-design/web-vue/es/icon';

const router = useRouter();
const loading = ref(false);

const form = reactive({
  username: '',
  password: '',
  remember: false
});

// 管理员账号和密码
const adminUsername = 'dsq123456';
const adminPassword = 'dsq123456';

const handleSubmit = async () => {
  if (!form.username || !form.password) {
    Message.warning('请输入用户名和密码');
    return;
  }

  loading.value = true;

  try {
    // 模拟请求延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 检查是否是管理员
    if (form.username === adminUsername && form.password === adminPassword) {
      console.log('管理员登录成功');
      Message.success('管理员登录成功，正在跳转...');
      router.push('/manager/roleManage'); // 管理员跳转到角色管理页面
    } else {
      // 普通用户登录逻辑 (此处可根据需要修改跳转路径，例如 '/dashboard')
      console.log('登录成功');
      Message.success('登录成功，正在跳转...');
      router.push('/dashboard');
    }
  } catch (err) {
    Message.error('登录失败，请重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 自定义动画，增加背景的灵动感 */
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
</style>