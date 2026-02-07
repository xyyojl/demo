<template>
  <div class="exception-title">
    <el-button type="primary" @click="handleToApply">异常处理</el-button>
    <el-space>
      <el-button plain>{{ year }}年</el-button>
      <el-select v-model="month">
        <el-option v-for="item in 12" :key="item" :value="item" :label="item + '月'" />
      </el-select>
    </el-space>
  </div>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-empty v-if="detailMonth.length === 0" description="暂无异常考勤" />
      <el-timeline v-else>
        <el-timeline-item v-for="[day, status] in detailMonth" :key="day" :timestamp="`${year}/${month}/${day}`" placement="top">
          <el-card>
            <el-space>
              <h4>{{ status }}</h4>
              <p>考勤详情：{{ renderTime(day) }}</p>
            </el-space>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-col>
    <el-col :span="12">
      <el-empty v-if="applyListMonth.length === 0" description="暂无申请审批" />
      <el-timeline v-else>
        <el-timeline-item v-for="item in applyListMonth" :key="(item._id as string)" :timestamp="(item.reason as string)" placement="top">
          <el-card>
            <h4>{{ item.state }}</h4>
            <p class="apply-info">申请日期 {{ (item.time as string[]).join(' - ') }}</p>
            <p class="apply-info">申请详情 {{ item.note }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useSignsStore } from '@/stores/signs'
import { useChecksStore } from '@/stores/checks'
import { storeToRefs } from 'pinia'
import { toZero } from '@/utils/common'

const router = useRouter()
const route = useRoute()
const signsStore = useSignsStore()
const { infos: signsInfos } = storeToRefs(signsStore)
const checksStore = useChecksStore()
const { applyList } = storeToRefs(checksStore)

const date = new Date()
const year = date.getFullYear()
const month = ref(Number(route.query.month) || date.getMonth() + 1)

const applyListMonth = computed(() => {
  return applyList.value.filter(item => {
    // 数据格式：["2026-02-06 12:00:00", "2026-03-04 12:00:00"]
    // 1. 安全检查：确保 item 存在且 time 是有值的数组
    const timeArr = item.time as string[] | undefined;
    if (!timeArr || timeArr.length < 2) return false;

    // 2. 提取月份：利用字符串截取 YYYY-MM-DD，比连续两次 split 更高效
    // 格式 "2026-02-06 12:00:00" -> 取索引 5,6 得到 "02"
    const startMonth = timeArr[0]?.substring(5, 7);
    const endMonth = timeArr[1]?.substring(5, 7);

    // 3. 对比月份
    const currentMonth = toZero(month.value);

    // 确保提取到了月份再进行对比
    if (!startMonth || !endMonth) return false;

    return startMonth <= currentMonth && endMonth >= currentMonth;
  })
})

// 数据格式 [['01', '旷工']]
const detailMonth = computed(() => {
  type DetailMap = Record<string, Record<string, unknown>>
  // ?? {}: 如果找不到该月份，给一个空对象保底，方便后续直接进行 Object.entries(res)
  const res = (signsInfos.value.detail as DetailMap)[toZero(month.value)] ?? {}
  return Object.entries(res).filter(([, value]) => value !== '正常出勤').sort()
})

watch(month, () => {
  router.push({
    query: {
      month: month.value
    }
  })
})

const renderTime = (day: string) => {
  // 拿到对应的月份，再去拿天
  const res = (signsInfos.value.time as Record<string, Record<string, unknown>>)[toZero(month.value)]?.[day]
  if (Array.isArray(res)) {
    return res.join('-')
  } else {
    return '暂无打卡记录'
  }
}

const handleToApply = () => {
  router.push('/apply')
}

</script>

<style scoped lang="scss">
.exception-title {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
.el-select {
  width: 80px;
}
.el-timeline {
  padding-left: 0px;
  margin: 10px;
}
.apply-info {
  margin: 10px;
}
</style>
