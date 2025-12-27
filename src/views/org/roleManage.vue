<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h1 class="text-2xl font-black text-gray-800 tracking-tight">权限管控中心</h1>
        <p class="text-gray-500 text-sm mt-1">智慧课堂 RBAC 策略配置 · 管理全校教职员工与学生的访问权限</p>
      </div>
      <div class="flex gap-2">
           <a-button type="outline" @click="fetchData"><template #icon><icon-refresh /></template>刷新数据</a-button>
           <a-button type="primary" :loading="saving" @click="handleSave" class="shadow-lg shadow-blue-100">
                <template #icon><icon-save /></template>保存全量配置
           </a-button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div class="md:col-span-4 lg:col-span-3">
          <a-card title="角色列表" :bordered="false" class="rounded-2xl shadow-sm overflow-hidden h-full">
            <div class="space-y-2">
                <div v-for="role in roles" :key="role.id" @click="handleSelectRole(role)" :class="['p-4 cursor-pointer rounded-xl transition-all border flex items-center justify-between group', selectedRole.id === role.id ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-gray-700']">
                    <div class="flex items-center gap-3">
                        <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', selectedRole.id === role.id ? 'bg-white/20' : 'bg-blue-50 text-blue-600']">
                             <icon-user-group />
                        </div>
                        <div>
                            <div class="font-bold text-sm">{{ role.roleName }}</div>
                            <div :class="['text-xs opacity-60', selectedRole.id === role.id ? 'text-white' : 'text-gray-400']">{{ role.roleCode }}</div>
                        </div>
                    </div>
                </div>
            </div>
          </a-card>
      </div>

      <div class="md:col-span-8 lg:col-span-9">
          <a-card :title="`权限分配: ${selectedRole.roleName || '未选择'}`" :bordered="false" class="rounded-2xl shadow-sm min-h-[600px] flex flex-col">
            <div class="flex-1 bg-slate-50/50 p-6 rounded-xl border border-dashed border-slate-200">
                <a-tree v-if="treeData.length" block-node checkable :data="treeData" v-model:checked-keys="checkedKeys" :default-expand-all="true">
                    <template #title="{ title, perms }">
                        <div class="flex items-center gap-2">
                            <span class="font-medium">{{ title }}</span>
                            <a-tag v-if="perms" size="small" color="arcoblue" class="rounded-full">{{ perms }}</a-tag>
                        </div>
                    </template>
                </a-tree>
            </div>
          </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconUserGroup, IconRefresh, IconSave } from '@arco-design/web-vue/es/icon';
import request from '../../utils/request';

const roles = ref<any[]>([]);
const selectedRole = ref<any>({});
const treeData = ref<any[]>([]);
const checkedKeys = ref<number[]>([]);
const saving = ref(false);

const fetchData = async () => {
    try {
        // Updated with /login prefix
        const resRoles: any = await request.get('/login/admin/system/sysRole/findAll');
        roles.value = resRoles;
        if(roles.value.length > 0 && !selectedRole.value.id) selectedRole.value = roles.value[0];
        // Updated with /login prefix
        const resPerms: any = await request.get('/login/admin/system/sysPermission/list');
        treeData.value = formatTree(resPerms);
        if (selectedRole.value.id) await loadRolePermissions(selectedRole.value.id);
    } catch (e) { Message.error('获取配置失败'); }
};

const formatTree = (list: any[]) => {
    const map: any = {}; const tree: any[] = [];
    list.forEach(item => { map[item.id] = { ...item, title: item.name, key: item.id, children: [] }; });
    list.forEach(item => { if (item.parentId !== 0) map[item.parentId]?.children.push(map[item.id]); else tree.push(map[item.id]); });
    return tree;
};

const handleSelectRole = (role: any) => { selectedRole.value = role; loadRolePermissions(role.id); };

const loadRolePermissions = async (roleId: number) => {
    try {
        // Updated with /login prefix
        const res: any = await request.get(`/login/admin/system/sysPermission/toAssign/${roleId}`);
        checkedKeys.value = res || [];
    } catch (e) { Message.error('加载权限失败'); }
};

const handleSave = async () => {
    if (!selectedRole.value.id) return;
    saving.value = true;
    try {
        // Updated with /login prefix
        await request.post('/login/admin/system/sysPermission/toAssign', {
            roleId: selectedRole.value.id,
            permissionIds: checkedKeys.value
        });
        Message.success('更新成功！');
    } catch (e) { } finally { saving.value = false; }
};

onMounted(() => { fetchData(); });
</script>