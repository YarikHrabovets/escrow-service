import { authHost } from './index'

export const getDeals = async () => {
    const { data } = await authHost.get('/deals/me')
    return data
}

export const getDeal = async (dealId: string) => {
    const { data } = await authHost.get(`/deals/${dealId}`)
    return data
}