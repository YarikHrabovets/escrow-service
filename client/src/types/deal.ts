export type UserPreview = {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
    role: string
    reputation_score: number
    completed_deals: number
}

export type Message = {
    id: string
    deal_id: string
    type: string
    body: string | null
    attachment_url: string | null
    read_at: string | null
    created_at: string
    sender: UserPreview | null
}

export type Milestone = {
    id: string
    title: string
    description: string | null
    amount: string
    status: string
    order: number
    due_date: string | null
}

export type Deal = {
    id: string
    title: string
    description: string | null
    amount: string
    currency: string
    platform_fee: string
    status: string
    milestone_based: boolean
    deadline: string | null
    auto_release_at: string | null
    created_at: string
    updated_at: string
    client: UserPreview
    freelancer: UserPreview
    milestones: Milestone[]
    messages: Message[]
}