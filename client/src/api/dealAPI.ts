import { authHost } from './index'

export const getDeals = async () => {
    const { data } = await authHost.get('/deals/me')
    return data
}

export const getDeal = async (dealId: string) => {
    const { data } = await authHost.get(`/deals/${dealId}`)
    return data
}

export const fundDeal = async (dealId: string) => {
    const { data } = await authHost.patch(`/deals/${dealId}/fund`)
    return data
}

export const startDealWork = async (dealId: string) => {
    const { data } = await authHost.patch(`/deals/${dealId}/start`)
    return data
}

export const submitDealWork = async (dealId: string, message: string, attachment_url: string | null) => {
    const { data } = await authHost.post(`/deals/${dealId}/submit`, {
        message,
        attachment_url,
    })

    return data
}

export const approveDealWork = async (dealId: string) => {
    const { data } = await authHost.patch(`/deals/${dealId}/approve`)
    return data
}