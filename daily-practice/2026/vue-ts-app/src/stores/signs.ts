import http from '@/utils/http'
import { ref } from 'vue'
import { defineStore } from 'pinia'

type GetTime = {
  userid: unknown
}
type PutTime = {
  userid: unknown
}
type Infos = {
  [index: string]: unknown
}

export const useSignsStore = defineStore('signs', () => {
  const infos = ref<Infos>({})
  const getTimeAction = (payload: GetTime) => {
    return http.get('/signs/time', payload)
  }
  const putTimeAction = (payload: PutTime) => {
    return http.put('/signs/time', payload)
  }
  const updateInfos = (payload: Infos) => {
    infos.value = payload
  }
  return {
    infos,
    getTimeAction,
    putTimeAction,
    updateInfos,
  }
})
