<template>
  <el-descriptions border direction="vertical" :column="9">
    <el-descriptions-item label="月份">{{ month }}月</el-descriptions-item>
    <el-descriptions-item label="正常出勤">0</el-descriptions-item>
    <el-descriptions-item label="旷工">0</el-descriptions-item>
    <el-descriptions-item label="漏打卡">0</el-descriptions-item>
    <el-descriptions-item label="迟到">0</el-descriptions-item>
    <el-descriptions-item label="早退">0</el-descriptions-item>
    <el-descriptions-item label="迟到并早退">0</el-descriptions-item>
    <el-descriptions-item label="操作">
      <el-button type="primary" plain size="small">查看详情</el-button>
    </el-descriptions-item>
    <el-descriptions-item label="考勤状态">
      <el-tag type="success" size="small">正常</el-tag>
    </el-descriptions-item>
  </el-descriptions>
  <el-calendar v-model="date">
    <template #header>
      <el-button type="primary">在线签到</el-button>
      <el-space>
        <el-button plain>{{ year }}年</el-button>
        <el-select v-model="month">
          <el-option v-for="item in 12" :key="item" :value="item" :label="item + '月'" />
        </el-select>
      </el-space>
    </template>
  </el-calendar>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const date = ref(new Date());
const year = date.value.getFullYear()
const month = ref(date.value.getMonth() + 1)

</script>

<style scoped lang="scss">
.el-descriptions {
  margin: 10px;
}
.el-select {
  width: 80px;
}
</style>
