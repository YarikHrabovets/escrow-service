import { host, setAccessToken } from './index'

export const register = async (email: string, password: string, username: string, full_name: string, role: string) => {
    const { data } = await host.post('/auth/register', {
        email,
        password,
        username,
        full_name,
        role
    })

    setAccessToken(data.access_token)
    return data.user
}

export const login = async (email: string, password: string) => {
    const { data } = await host.post('/auth/login', {
        email,
        password
    })

    setAccessToken(data.access_token)
    return data.user
}


export const refresh = async () => {
    const { data } = await host.post('/auth/refresh')
    setAccessToken(data.access_token)
}

export const logout = async () => {
    await host.post('/auth/logout')
    setAccessToken(null)
}