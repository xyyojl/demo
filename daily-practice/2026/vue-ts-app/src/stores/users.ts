import http from '@/utils/http'
import { defineStore } from 'pinia'
import { ref } from 'vue'

type Token = string
type Login = {
  email: string
  pass: string
  [index: string]: unknown
}

export const useUsersStore = defineStore('users', () => {
  const token = ref<Token>('')
  function loginAction(payload: Login) {
    return http.post('/users/login', payload)
  }
  function updateToken(payload: Token) {
    token.value = payload
  }
  return {
    token,
    loginAction,
    updateToken,
  }
}, {
  persist: {
    pick: ['token'],
  }
})
