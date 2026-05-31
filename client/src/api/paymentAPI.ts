import { authHost } from './index'

export const createDealCheckoutSession = async (dealId: string) => {
    const { data } = await authHost.post(`/payments/deals/${dealId}/checkout`)
    return data
}