import axios from "axios"
const backend_url = 'http://localhost:3000/'
export const axiosInstance = axios.create({
    baseURL :backend_url,
    withCredentials:true,
})