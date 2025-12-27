<template>
  <div class="login-page">
    <div class="background-wrapper">
      <div class="glass-sphere sphere-1"></div>
      <div class="glass-sphere sphere-2"></div>
      <div class="glass-sphere sphere-3"></div>
    </div>

    <div class="main-container">
      <div class="visual-section">
        <div class="brand">
          <div class="logo-box">
            <icon-user class="!text-white"/>
          </div>
          <span class="brand-name">SmartClass</span>
        </div>

        <div class="content-text">
          <h1 class="hero-title">
            智慧教学<br/>
            <span class="gradient-text">重塑未来</span>
          </h1>
          <p class="hero-subtitle">全场景数字化教学协同平台，让教育更有温度，让学习更高效。</p>
        </div>

        <div class="glass-card-info">
          <div class="stat-item">
            <span class="stat-value">99%</span>
            <span class="stat-label">好评率</span>
          </div>
          <div class="divider"></div>
          <div class="stat-item">
            <span class="stat-value">24h</span>
            <span class="stat-label">实时同步</span>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="form-wrapper">
          <div class="form-header">
            <h2>{{ isRegister ? '加入我们' : '欢迎登录' }}</h2>
            <p>{{ isRegister ? '开启您的智慧教学第一步' : '请输入您的账号信息开始工作' }}</p>
          </div>

          <a-form :model="form" layout="vertical" @submit="handleSubmit" class="custom-form">
            <a-form-item field="username" label="账号">
              <a-input v-model="form.username" placeholder="用户名/邮箱" class="custom-input">
                <template #prefix><icon-user /></template>
              </a-input>
            </a-form-item>

            <a-form-item field="password" label="密码">
              <a-input-password v-model="form.password" placeholder="请输入密码" class="custom-input">
                <template #prefix><icon-lock /></template>
              </a-input-password>
            </a-form-item>

            <transition-group name="list-stagger">
              <template v-if="isRegister">
                <a-form-item key="name" field="name" label="真实姓名">
                  <a-input v-model="form.name" placeholder="请输入姓名" class="custom-input">
                    <template #prefix><icon-idcard /></template>
                  </a-input>
                </a-form-item>

                <a-form-item key="phone" field="phone" label="联系电话">
                  <a-input v-model="form.phone" placeholder="请输入手机号" class="custom-input">
                    <template #prefix><icon-phone /></template>
                  </a-input>
                </a-form-item>

                <a-form-item key="type" label="选择身份" class="role-selector-item">
                  <a-radio-group v-model="form.type" type="button" class="modern-radio-group">
                    <a-radio :value="2" :class="form.type===2?'!text-blue-500':''">教师</a-radio>
                    <a-radio :value="3" :class="form.type===3?'!text-blue-500':''">学生</a-radio>
                  </a-radio-group>
                </a-form-item>
              </template>
            </transition-group>

            <div v-if="!isRegister" class="form-options">
              <a-checkbox v-model="form.remember">自动登录</a-checkbox>
              <a-link class="forgot-link">忘记密码？</a-link>
            </div>

            <a-button
                html-type="submit"
                :loading="loading"
                class="submit-btn"
            >
              <span>{{ isRegister ? '完成注册' : '进入系统' }}</span>
            </a-button>
          </a-form>

          <div class="form-footer">
            <span>{{ isRegister ? '已有账号？' : '还没有账号？' }}</span>
            <button @click="toggleMode" class="toggle-btn">
              {{ isRegister ? '返回登录' : '立即申请' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import {
  IconUser, IconLock, IconPhone, IconIdcard,

} from '@arco-design/web-vue/es/icon';
import request from '../utils/request';

const router = useRouter();
const loading = ref(false);
const isRegister = ref(false);

const form = reactive({
  username: '',
  password: '',
  name: '',
  phone: '',
  type: 3,
  remember: false
});

const toggleMode = () => {
  isRegister.value = !isRegister.value;
};

const handleLogin = async () => {
  if(!form.username || !form.password) {
    Message.warning('请输入用户名和密码');
    return;
  }
  loading.value = true;
  try {
    const res: any = await request.post('/login/admin/system/index/login', {
      username: form.username,
      password: form.password
    });

    if(res.token) {
      localStorage.setItem('token', res.token);
      Message.success({ content: '身份验证通过，欢迎回来', duration: 2000 });

      const userInfo: any = await request.get('/login/admin/system/index/info');

      const routes: Record<string, string> = {
        'admin': '/manager/roleManage',
        'teacher': '/teacher/dashboard',
        'student': '/student/dashboard'
      };
      router.push(routes[userInfo.roles] || '/dashboard');
    }
  } catch (e) {
  } finally {
    loading.value = false;
  }
}

const handleRegister = async () => {
  if(!form.username || !form.password || !form.name || !form.phone) {
    Message.warning('请填写完整注册信息');
    return;
  }
  loading.value = true;
  try {
    await request.post('/login/admin/system/index/register', {
      username: form.username,
      password: form.password,
      name: form.name,
      phone: form.phone,
      type: form.type
    });
    Message.success('注册成功，已为您切换至登录页');
    isRegister.value = false;
  } catch (e) {
  } finally {
    loading.value = false;
  }
}

const handleSubmit = () => {
  isRegister.value ? handleRegister() : handleLogin();
};
</script>

<style scoped>
/* 1. 基础布局 */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  padding: 20px;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.background-wrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.glass-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  animation: float 20s infinite alternate ease-in-out;
}
.sphere-1 { width: 400px; height: 400px; background: #6366f1; top: -100px; left: -100px; }
.sphere-2 { width: 350px; height: 350px; background: #a855f7; bottom: -50px; right: -50px; animation-delay: -5s; }
.sphere-3 { width: 300px; height: 300px; background: #3b82f6; bottom: 20%; left: 10%; animation-delay: -10s; }

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, 60px) scale(1.1); }
}

/* 2. 主容器 */
.main-container {
  position: relative;
  z-index: 10;
  display: flex;
  width: 100%;
  max-width: 1100px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 3. 左侧视觉区 */
.visual-section {
  flex: 1.1;
  padding: 60px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  width: 44px;
  height: 44px;
  background: #4f46e5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 8px 16px rgba(79, 70, 229, 0.3);
}

.brand-name {
  font-size: 22px;
  font-weight: 800;
  color: #1e1b4b;
  letter-spacing: -0.5px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  color: #1e1b4b;
  margin-bottom: 20px;
}

.gradient-text {
  background: linear-gradient(to right, #4f46e5, #9333ea);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  color: #64748b;
  font-size: 16px;
  line-height: 1.6;
  max-width: 340px;
}

.glass-card-info {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  align-self: flex-start;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #4f46e5;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
}

.divider {
  width: 1px;
  height: 30px;
  background: rgba(0, 0, 0, 0.05);
}

/* 4. 右侧表单区 */
.form-section {
  flex: 1;
  background: white;
  padding: 60px;
  display: flex;
  align-items: center;
}

.form-wrapper {
  width: 100%;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.form-header p {
  color: #94a3b8;
  margin-top: 8px;
}

/* 自定义输入框样式 */
.custom-input :deep(.arco-input-wrapper) {
  background-color: #f8fafc !important;
  border: 1.5px solid #f1f5f9 !important;
  border-radius: 12px;
  padding: 6px 12px;
  transition: all 0.2s;
}

.custom-input :deep(.arco-input-wrapper:hover) {
  background-color: #f1f5f9 !important;
  border-color: #e2e8f0 !important;
}

.custom-input :deep(.arco-input-wrapper.arco-input-focus) {
  background-color: white !important;
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
}

/* 角色选择器优化 */
.modern-radio-group {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  width: 100%;
}

.modern-radio-group :deep(.arco-radio-button) {
  flex: 1;
  text-align: center;
  background: transparent;
  border: none !important;
  color: #64748b;
  font-weight: 600;
  height: 38px;
  line-height: 38px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-radio-group :deep(.arco-radio-button-checked) {
  background: white !important;
  color: #4f46e5 !important;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  transform: scale(1.02);
}

.modern-radio-group :deep(.arco-radio-button::before) {
  display: none;
}

/* 按钮样式 */
.submit-btn {
  width: 100%;
  height: 52px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  margin-top: 10px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border: none;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  transition: all 0.3s;
  color: white;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(79, 70, 229, 0.4);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-link {
  font-size: 13px;
  color: #64748b !important;
}

.form-footer {
  margin-top: 32px;
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.toggle-btn {
  margin-left: 8px;
  color: #4f46e5;
  font-weight: 700;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.toggle-btn:hover {
  text-decoration: underline;
}

/* 动画效果 */
.list-stagger-enter-active {
  transition: all 0.4s ease-out;
}
.list-stagger-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .visual-section {
    display: none;
  }
  .main-container {
    max-width: 450px;
  }
  .form-section {
    padding: 40px 30px;
  }
}
</style>