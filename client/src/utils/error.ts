type FastAPIErrorItem = {
    msg: string
    [key: string]: any
}

type FastAPIError = {
    detail?: string | FastAPIErrorItem[]
    message?: string
}

export const getErrorMessage = (e: any): string => {
    const data: FastAPIError | undefined = e?.response?.data

    if (!data) return 'Network error'

    if (typeof data.detail === 'string') {
        return data.detail
    }

    if (Array.isArray(data.detail)) {
        return data.detail
            .map(err => err.msg)
            .filter(Boolean)
            .join(', ')
    }

    if (typeof data.message === 'string') {
        return data.message
    }

    return 'Something went wrong'
}