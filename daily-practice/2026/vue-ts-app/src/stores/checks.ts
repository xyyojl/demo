import http from '@/utils/http'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { DateModelType } from 'element-plus'

type GetApply = {
  applicantid?: unknown
  approverid?: unknown
}

export type PostApply = {
  applicantid: string
  applicantname: string
  approverid: string
  approvername: string
  note: string
  reason: string

  time: string[]
}
type PutApply = {
  _id: string
  state: '已通过' | '未通过'
}
type Infos = {
  [index: string]: unknown
}

export const useChecksStore = defineStore('checks', () => {
  const applyList = ref<Infos[]>([])
  const checkList = ref<Infos[]>([])
  const getApplyAction = (payload: GetApply) => {
    return http.get('/checks/apply', payload)
  }
  const postApplyAction = (payload: PostApply) => {
    return http.post('/checks/apply', payload)
  }
  const putApplyAction = (payload: PutApply) => {
    return http.put('/checks/apply', payload)
  }
  const updateApplyList = (payload: Infos[]) => {
    applyList.value = payload
  }
  const updateCheckList = (payload: Infos[]) => {
    checkList.value = payload
  }

  return {
    applyList,
    checkList,
    getApplyAction,
    postApplyAction,
    putApplyAction,
    updateApplyList,
    updateCheckList,
  }
})
