import { host, authHost } from './index'

export const getJobs = async () => {
    const { data } = await host.get('/job')
    return data
}

export const getJob = async (jobId: string) => {
    const { data } = await host.get(`/job/${jobId}`)
    return data
}

export const createJob = async (title: string, description: string, budget: number, currency: string, deadline: string) => {
    const { data } = await authHost.post('/job', {title, description, budget, currency, deadline})
    return data
}

export const applyForJob = async (jobId: string, cover_letter: string, proposed_amount: number | null) => {
    const { data } = await authHost.post(`/job/${jobId}/applications`, {cover_letter, proposed_amount})
    return data
}

export const getJobApplications = async (jobId: string) => {
    const { data } = await authHost.get(`/job/${jobId}/applications`)
    return data
}

export const getMyJobApplication = async (jobId: string) => {
    const { data } = await authHost.get(`/job/${jobId}/applications/me`)
    return data
}