import http from '@/utils/http'
import { defineStore } from 'pinia'

type Login = {
  email: string
  pass: string
  [index: string]: unknown
}

export const useUsersStore = defineStore('users', () => {
  function loginAction(payload: Login) {
    return http.post('/users/login', payload)
  }
  return {
    loginAction
  }
})
