import { authHost } from './index'

export const fetchCurrencies = async () => {
    const { data } = await authHost.get('/currencies')
    return data
}