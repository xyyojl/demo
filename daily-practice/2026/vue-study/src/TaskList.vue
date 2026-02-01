<template>
    <div>
        <h2>任务列表</h2>
        <div>
            <input type="text" v-model="task">
            <button @click="handleAdd">添加</button>
        </div>
        <router-link to="/todo">所有任务</router-link> |
        <router-link to="/complete">已完成任务</router-link> |
        <router-link to="/incomplete">未完成任务</router-link>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const task = ref('');
const store = useStore();

const handleAdd = () => {
    store.commit('add', task.value);
    task.value = '';
}
</script>

<style>
.router-link-active {
    background: red;
    color: #fff;
}
.through {
    text-decoration: line-through;
}
</style>