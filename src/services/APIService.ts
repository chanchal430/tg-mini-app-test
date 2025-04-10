import { Axios } from "axios";


const API = new Axios({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  }
})

export type APIResponse<T> = {
  data: T;
  message: string;
}

export default API;


// Add a request interceptor to attach the access token to the request header if it exists in the local storage 
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
