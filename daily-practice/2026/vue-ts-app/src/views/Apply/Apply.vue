<template>
  <div class="apply-title">
    <el-button type="primary">添加审批</el-button>
    <el-space>
      <el-input v-model="searchWord" placeholder="请输入搜索关键词" />
      <el-button type="primary" icon="search">搜索</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-radio-group v-model="approverType">
        <el-radio-button label="全部" />
        <el-radio-button label="待审批" />
        <el-radio-button label="已通过" />
        <el-radio-button label="未通过" />
      </el-radio-group>
    </el-space>
  </div>
  <div class="apply-table">
    <el-table :data="pageApplyList" border>
      <el-table-column prop="applicantname" label="申请人" width="180" />
      <el-table-column prop="reason" label="审批事由" width="180" />
      <el-table-column prop="time" label="时间" />
      <el-table-column prop="note" label="备注" />
      <el-table-column prop="approvername" label="审批人" width="180" />
      <el-table-column prop="state" label="状态" width="180" />
    </el-table>
    <el-pagination small background layout="prev, pager, next" :total="10" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchWord = ref('')
const defaultType = '全部'
const approverType = ref(defaultType)

const pageApplyList = ref([])
</script>

<style scoped lang="scss">
.apply-title {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
.apply-table {
  margin: 10px;
  .el-pagination {
    float: right;
    margin: 10px;
  }
}
</style>
