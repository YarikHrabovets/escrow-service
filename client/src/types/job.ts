export type Client = {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
    role: string
    reputation_score: number
    completed_deals: number
}

export type Job = {
    id: string
    title: string
    description: string | null
    budget: string
    currency: string
    deadline: string | null
    status: string
    created_at: string
    client: Client
}

export type JobApplication = {
    id: string
    job_id: string
    freelancer_id: string
    cover_letter: string | null
    proposed_amount: string | null
    status: string
    created_at: string
    updated_at: string
    freelancer: Client | null
}