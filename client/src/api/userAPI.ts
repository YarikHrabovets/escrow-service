import { authHost } from './index'

export const getMe = async () => {
    const { data } = await authHost.get('/user/me')
    return data
}

export const updateProfile = async (formData: FormData) =>{
    const { data } = await authHost.patch('/user/me', formData)
    return data
}