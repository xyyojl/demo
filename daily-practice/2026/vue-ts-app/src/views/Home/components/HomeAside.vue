<template>
  <el-menu default-active="1-1">
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <location />
        </el-icon>
        <span>考勤管理</span>
      </template>
      <el-menu-item index="1-1">
        <el-icon>
          <location />
        </el-icon>
        <span>在线打卡签到</span>
      </el-menu-item>
      <el-menu-item index="1-2">
        <el-icon>
          <location />
        </el-icon>
        <span>异常考勤查询</span>
      </el-menu-item>
      <el-menu-item index="1-3">
        <el-icon>
          <location />
        </el-icon>
        <span>添加考勤审批</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.el-menu {
  height: calc(100vh - 60px);
  border: none;
  padding-top: 30px;
}

.el-menu-item.is-active {
  background: #e6f7ff;
  border-right: 3px solid #1890ff;
}
</style>
