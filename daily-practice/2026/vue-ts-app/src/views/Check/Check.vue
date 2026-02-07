<template>
  <div class="check-title">
    <el-space>
      <el-input v-model="searchWord" placeholder="请输入搜索关键词" />
      <el-button type="primary" icon="search">搜索</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-radio-group v-model="approverType">
        <el-radio-button label="全部" value="全部" />
        <el-radio-button label="待审批" value="待审批" />
        <el-radio-button label="已通过" value="已通过" />
        <el-radio-button label="未通过" value="未通过" />
      </el-radio-group>
    </el-space>
  </div>
  <div class="check-table">
    <el-table :data="pageCheckList" border>
      <el-table-column prop="applicantname" label="申请人" width="180" />
      <el-table-column prop="reason" label="审批事由" width="180" />
      <el-table-column prop="time" label="时间">
        <template #default="scope">
          {{ scope.row.time.join(' - ') }}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <!-- 待填坑 -->
          <el-button @click="handlePutApply(scope.row._id, '已通过', scope.row.applicantid)" type="success" icon="check" size="small" circle></el-button>
          <el-button @click="handlePutApply(scope.row._id, '未通过', scope.row.applicantid)" type="danger" icon="close" size="small" circle></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="180" />
    </el-table>
    <el-pagination size="small" background layout="prev, pager, next" :total="filterCheckList.length" :page-size="pageSize" @current-change="handleChange" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useChecksStore } from '@/stores/checks'
import { useUsersStore } from '@/stores/users'
import { useNewsStore } from '@/stores/news'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

const checksStore = useChecksStore()
const { checkList } = storeToRefs(checksStore)
const usersStore = useUsersStore()
const { infos: usersInfos } = storeToRefs(usersStore)
const newsStore = useNewsStore()

const searchWord = ref('')
const defaultType = '全部'
const approverType = ref(defaultType)
const pageSize = ref(2)
const pageCurrent = ref(1)

const filterCheckList = computed(() => {
  return checkList.value.filter(item => {
    return (item.state === approverType.value || approverType.value === defaultType) && (item.note as string).includes(searchWord.value)
  })
})

const handleChange = (value: number) => {
  pageCurrent.value = value
}

const pageCheckList = computed(() => {
  return filterCheckList.value.slice((pageCurrent.value - 1)*pageSize.value, pageCurrent.value*pageSize.value)
})

const handlePutApply = (_id: string, state: '已通过' | '未通过', applicantid: string) => {
  checksStore.putApplyAction({ _id, state})
    .then(res => {
      if (res.data.errcode === 0) {
        checksStore.getApplyAction({ approverid: usersInfos.value._id })
          .then(res => {
            if (res.data.errcode === 0) {
              checksStore.updateCheckList(res.data.rets)
            }
          })
        newsStore.putRemindAction({ userid: applicantid, applicant: true })
        ElMessage.success('审批成功')
      }
    })
}

</script>

<style scoped lang="scss">
.check-title {
  margin: 20px;
  display: flex;
  justify-content: flex-end;
}
.check-table {
  margin: 10px;
  .el-pagination {
    float: right;
    margin: 10px;
  }
}
</style>
