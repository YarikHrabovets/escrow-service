import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase, faCalendarDays, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import Button from './ui/Button'
import { JOBS_ROUTE } from '../utils/constants'

type Job = {
    id: string
    title: string
    budget: string
    currency: string
    deadline: string | null
    status: string
    created_at: string
}

type Props = {
    job: Job
}

function JobCard({ job }: Props) {
    const navigate = useNavigate()

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <FontAwesomeIcon icon={faBriefcase} className="text-primary" />
                        <h2 className="text-xl font-semibold text-white">
                            {job.title}
                        </h2>
                    </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 whitespace-nowrap">
                    {job.status}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faDollarSign} className="text-emerald-400" />
                    <span>
                        {job.currency} {Number(job.budget).toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-orange-400" />
                    <span>
                        Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}
                    </span>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                </span>

                <Button
                    onClick={() => navigate(`${JOBS_ROUTE}/${job.id}`)}
                >
                    View Job
                </Button>
            </div>
        </div>
    )
}

export default JobCard