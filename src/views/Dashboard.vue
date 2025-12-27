<template>
  <div class="min-h-screen bg-gray-50">
    <a-layout class="h-screen">
      <a-layout-header class="px-4 py-2 bg-white shadow-sm flex justify-between items-center h-16">
        <div class="text-xl font-bold text-blue-600">智慧课堂</div>
        <a-space>
            <span>管理员</span>
            <a-avatar>A</a-avatar>
        </a-space>
      </a-layout-header>
      <a-layout>
        <a-layout-sider theme="light" collapsible breakpoint="xl">
          <a-menu :default-selected-keys="['1']">
            <a-menu-item key="1">
              <template #icon><icon-dashboard /></template>
              仪表盘
            </a-menu-item>
            <a-menu-item key="2">
              <template #icon><icon-book /></template>
              课程管理
            </a-menu-item>
            <a-menu-item key="3">
              <template #icon><icon-user-group /></template>
              学生管理
            </a-menu-item>
             <a-menu-item key="4">
              <template #icon><icon-file /></template>
              作业管理
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout-content class="p-4 bg-gray-50">
          <div class="bg-white p-6 rounded shadow-sm h-full">
            <h2 class="text-lg font-medium mb-4">欢迎来到智慧课堂</h2>
            <p>这里是仪表盘区域</p>
            <a-button @click="handleJump">
              跳转
            </a-button>
          </div>
          <div>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { IconDashboard, IconBook, IconUserGroup, IconFile } from '@arco-design/web-vue/es/icon';
import {useRouter} from "vue-router";

const router = useRouter();

const handleJump = ()=>{
  console.log('准备跳转到teacher Home')
  router.push("/teacher/home")
}
</script>
