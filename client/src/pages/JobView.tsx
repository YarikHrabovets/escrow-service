import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBriefcase,
    faCalendarDays,
    faDollarSign,
    faUser,
    faArrowLeft,
    faStar,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import CenteredSpinner from '../components/ui/CenteredSpinner'
import Button from '../components/ui/Button'
import { getJob } from '../api/jobAPI'

type Client = {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
    role: string
    reputation_score: number
    completed_deals: number
}

type Job = {
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

function JobView() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJob = async () => {
            try {
                if (!id) return

                const data = await getJob(id)
                setJob(data)
            } catch {
                toast.error('Failed to load job')
            } finally {
                setLoading(false)
            }
        }

        fetchJob()
    }, [id])

    if (loading) {
        return <CenteredSpinner size="xl" />
    }

    if (!job) {
        return (
            <div className="flex items-center justify-center text-zinc-400">
                Job not found
            </div>
        )
    }

    const clientName = job.client.full_name || job.client.username || 'Unknown client'

    return (
        <div className="max-w-5xl mx-auto py-10">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors cursor-pointer"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
            </button>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <FontAwesomeIcon
                                icon={faBriefcase}
                                className="text-primary text-xl"
                            />

                            <h1 className="text-4xl font-bold text-white">
                                {job.title}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3 text-zinc-400">
                            {job.client.avatar_url ? (
                                <img
                                    src={job.client.avatar_url}
                                    alt={clientName}
                                    className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUser} className="text-zinc-500" />
                                </div>
                            )}

                            <div>
                                <div className="text-white font-medium">
                                    {clientName}
                                </div>

                                <div className="text-sm text-zinc-500">
                                    {job.client.role}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faStar} className="text-orange-400" />
                                <span>
                                    Reputation {job.client.reputation_score}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-400" />
                                <span>
                                    {job.client.completed_deals} completed deals
                                </span>
                            </div>
                        </div>
                    </div>

                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        {job.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <FontAwesomeIcon
                                icon={faDollarSign}
                                className="text-emerald-400"
                            />

                            <span>Budget</span>
                        </div>

                        <div className="text-3xl font-bold text-white">
                            {job.currency} {Number(job.budget).toFixed(2)}
                        </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <FontAwesomeIcon
                                icon={faCalendarDays}
                                className="text-orange-400"
                            />

                            <span>Deadline</span>
                        </div>

                        <div className="text-2xl font-semibold text-white">
                            {job.deadline
                                ? new Date(job.deadline).toLocaleDateString()
                                : 'No deadline'}
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-white mb-4">
                        Description
                    </h2>

                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                        <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                            {job.description || 'No description provided.'}
                        </p>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
                    <div className="text-sm text-zinc-500">
                        Posted on{' '}
                        {new Date(job.created_at).toLocaleDateString()}
                    </div>

                    <Button>
                        Apply for Job
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default JobView