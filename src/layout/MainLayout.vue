<template>
  <a-layout class="layout-container">
    <a-layout-sider
      breakpoint="lg"
      :width="220"
      collapsible
      :collapsed="collapsed"
      @collapse="onCollapse"
      class="sider-shadow"
    >
      <div class="logo">
        <icon-book class="logo-icon" />
        <span v-if="!collapsed" class="logo-text">智慧课堂</span>
      </div>
      <a-menu
        :selected-keys="[activeKey]"
        :auto-open-selected="true"
        :style="{ width: '100%' }"
        @menu-item-click="handleMenuClick"
      >
        <template v-for="item in filteredMenu" :key="item.key">
          <!-- 一级菜单 -->
          <a-menu-item v-if="!item.children || item.children.length === 0" :key="item.key">
            <template #icon><component :is="item.icon" /></template>
            {{ item.title }}
          </a-menu-item>
          <!-- 子菜单项 -->
          <a-sub-menu v-else :key="item.key">
             <template #icon><component :is="item.icon" /></template>
             <template #title>{{ item.title }}</template>
             <a-menu-item v-for="child in item.children" :key="child.key">
               {{ child.title }}
             </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header-shadow bg-white flex items-center justify-between px-6">
        <div class="flex items-center">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item>{{ currentPageTitle }}</a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="flex items-center gap-4">
          <a-badge :count="3" dot>
            <icon-notification class="text-xl cursor-pointer text-gray-600" />
          </a-badge>
          <a-dropdown trigger="click">
            <div class="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded-lg transition-colors">
                <a-avatar :size="32">
                    <img :src="userInfo.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'" />
                </a-avatar>
                <div class="hidden md:block">
                    <div class="text-sm font-medium text-gray-700 leading-tight">{{ userInfo.name }}</div>
                    <div class="text-xs text-gray-400 capitalize">{{ userInfo.roles }}</div>
                </div>
                <icon-down class="text-xs text-gray-400" />
            </div>
            <template #content>
              <a-doption @click="handleLogout"><icon-export class="mr-2" />退出登录</a-doption>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="p-6 overflow-y-auto bg-slate-50">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconBook, IconDashboard, IconSettings, IconUserGroup, 
  IconStorage, IconNotification, IconDown, IconExport,
  IconCalendar, IconFile, IconSearch, IconCheckCircle
} from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import request from '../utils/request';

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const userInfo = ref({ name: '', roles: '', avatar: '', id: null });
const userPerms = ref<string[]>([]);

const onCollapse = (val: boolean) => {
  collapsed.value = val;
};

// 菜单定义
const allMenus = [
  {
    title: '看板首页',
    key: 'dashboard',
    icon: IconDashboard,
    path: '/(admin|teacher|student)/dashboard',
    perm: 'dashboard'
  },
  {
    title: '角色授权',
    key: 'roleManage',
    icon: IconSettings,
    path: '/manager/roleManage',
    perm: 'manager:roleManage'
  },
  {
    title: '课程管理',
    key: 'courses',
    icon: IconStorage,
    path: '/courses/list',
    perm: 'course:*',
    children: [
        { title: '课程列表', key: 'course:list', path: '/courses/list', perm: 'course:list' },
        { title: '考勤签到', key: 'course:checkin', path: '/teacher/checkin', perm: 'course:checkin' }
    ]
  },
  {
    title: '学习中心',
    key: 'learning',
    icon: IconFile,
    path: '/student/dashboard',
    perm: 'student:*',
    children: [
        { title: '我的学习', key: 'learning:my', path: '/student/dashboard', perm: 'student:course' },
        { title: '选课中心', key: 'learning:find', path: '/courses/find', perm: 'student:course' },
        { title: '参与签到', key: 'learning:checkin', path: '/student/checkin', perm: 'student:course' }
    ]
  }
];

// 计算过滤后的菜单
const filteredMenu = computed(() => {
    return allMenus.filter(menu => {
        if (userInfo.value.roles === 'admin') return true;
        
        if (!menu.perm) return true;
        const perms = userPerms.value || [];
        
        return perms.some(p => {
            if (!p) return false;
            const up = p.trim();
            if (up === '*') return true;
            if (up === menu.perm) return true;
            
            // 通配符匹配
            if (up.endsWith(':*')) {
                const prefix = up.split(':*')[0];
                if (menu.perm.startsWith(prefix)) return true;
            }
             if (menu.perm.endsWith(':*')) {
                const prefix = menu.perm.split(':*')[0];
                if (up.startsWith(prefix)) return true;
            }

            return false;
        });
    });
});

const activeKey = computed(() => {
    const path = route.path;
    for(const m of allMenus) {
        if(m.children) {
            const child = m.children.find(c => path === c.path);
            if(child) return child.key;
        }
    }
    const current = allMenus.find(m => path === m.path.replace('(admin|teacher|student)', userInfo.value.roles));
    return current ? current.key : '';
});

const currentPageTitle = computed(() => {
     const path = route.path;
     for(const m of allMenus) {
         if(m.children) {
             const child = m.children.find(c => path === c.path);
             if(child) return child.title;
         }
     }
     const current = allMenus.find(m => path.includes(m.path.replace('(admin|teacher|student)', '')));
     return current ? current.title : '概览';
});

const handleMenuClick = (key: string) => {
    let targetPath = '';
    allMenus.forEach(m => {
        if (m.key === key) {
            targetPath = m.path.replace('(admin|teacher|student)', userInfo.value.roles);
        } else if (m.children) {
            const child = m.children.find(c => c.key === key);
            if (child) targetPath = child.path;
        }
    });
    if (targetPath) router.push(targetPath);
};

const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
    Message.success('已安全退出');
};

onMounted(async () => {
    try {
        const res: any = await request.get('/login/admin/system/index/info');
        userInfo.value = res;
        userPerms.value = res.perms || [];
    } catch (e) {
        if (route.path !== '/login') router.push('/login');
    }
});
</script>

<style scoped>
.layout-container { height: 100vh; width: 100vw; }
.logo { height: 64px; display: flex; align-items: center; padding: 0 20px; gap: 12px; background: rgba(255, 255, 255, 0.04); }
.logo-icon { font-size: 28px; color: #3B82F6; }
.logo-text { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: 1px; }
:deep(.arco-layout-header) { height: 64px; }
.header-shadow { box-shadow: 0 1px 4px rgba(0,21,41,.08); z-index: 100; }
.sider-shadow { box-shadow: 2px 0 8px rgba(0, 21, 41, 0.08); z-index: 101; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>