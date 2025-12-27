<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden">
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

    <div class="z-10 w-full max-w-md p-10 bg-white/80 backdrop-blur-lg border border-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
           <icon-book class="text-white text-3xl" /> </div>
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

        <div class="flex items-center justify-between mb-6">
          <a-checkbox v-model="form.remember">记住我</a-checkbox>
          <a-link type="primary" size="small">忘记密码？</a-link>
        </div>

        <a-form-item>
          <a-button 
            type="primary" 
            html-type="submit" 
            long 
            size="large" 
            :loading="loading"
            class="rounded-lg bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            立即登录
          </a-button>
        </a-form-item>
      </a-form>

      <div class="mt-8 text-center">
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
// 导入图标 (根据你的组件库自行调整)
import { IconUser, IconLock, IconBook } from '@arco-design/web-vue/es/icon';

const router = useRouter();
const loading = ref(false);

const form = reactive({
  username: '',
  password: '',
  remember: false
});

const handleSubmit = async () => {
  if (!form.username || !form.password) {
    Message.warning('请输入完整信息');
    return;
  }

  loading.value = true;
  
  try {
    // 模拟请求延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Login success:', form);
    Message.success('登录成功，正在跳转...');
    router.push('/dashboard');
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