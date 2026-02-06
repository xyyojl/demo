import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';

const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 5000
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  const usersStore = useUsersStore()
  const { token } = storeToRefs(usersStore)
  config.headers.authorization = token.value
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  const usersStore = useUsersStore()
  if (response.data.errmsg === 'token error') {
    ElMessage.error('token error');
    usersStore.clearToken()
    setTimeout(() => {
      window.location.replace('/login')
    }, 1000)
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

interface Data {
  [index: string]: unknown
}

interface Http {
  get: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
  post: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
  put: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
  patch: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
  delete: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
}

const http: Http = {
  get: (url, data, config) => instance.get(url, { params: data, ...config }),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data, config) => instance.put(url, data, config),
  patch: (url, data, config) => instance.patch(url, data, config),
  delete: (url, data, config) => instance.delete(url, { params: data, ...config }),
}
export default http
