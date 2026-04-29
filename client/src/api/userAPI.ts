import { authHost } from './index'

export const getMe = async () => {
    const { data } = await authHost.get('/user/me')
    return data
}