import axios, { type InternalAxiosRequestConfig, AxiosError } from 'axios'

const API_URL = import.meta.env.VITE_API_URL as string
let accessToken: string | null = null

export const host = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

export const authHost = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

export const setAccessToken = (token: string | null) => {
    accessToken = token
}

export const getAccessToken = () => accessToken

authHost.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

authHost.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
        const originalRequest: any = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const { data } = await host.post('/auth/refresh')
                setAccessToken(data.access_token)

                originalRequest.headers.Authorization = `Bearer ${data.access_token}`
                return authHost(originalRequest)
            } catch (err) {
                accessToken = null
                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    }
)