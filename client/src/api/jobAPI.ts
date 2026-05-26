import { host, authHost } from './index'

export const getJobs = async () => {
    const { data } = await host.get('/jobs')
    return data
}

export const getJob = async (jobId: string) => {
    const { data } = await host.get(`/jobs/${jobId}`)
    return data
}

export const createJob = async (title: string, description: string, budget: number, currency: string, deadline: string) => {
    const { data } = await authHost.post('/jobs', {title, description, budget, currency, deadline})
    return data
}

export const applyForJob = async (jobId: string, cover_letter: string, proposed_amount: number | null) => {
    const { data } = await authHost.post(`/jobs/${jobId}/applications`, {cover_letter, proposed_amount})
    return data
}

export const getJobApplications = async (jobId: string) => {
    const { data } = await authHost.get(`/jobs/${jobId}/applications`)
    return data
}

export const getMyJobApplication = async (jobId: string) => {
    const { data } = await authHost.get(`/jobs/${jobId}/applications/me`)
    return data
}

export const acceptJobApplication = async (jobId: string, applicationId: string) => {
    const { data } = await authHost.patch(`/jobs/${jobId}/applications/${applicationId}/accept`)
    return data
}