import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBriefcase,
    faUser,
    faStar,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import type { Job } from '../../types/job'

type Props = {
    job: Job
}

function JobHeader({ job }: Props) {
    const clientName = job.client.full_name || job.client.username || 'Unknown client'

    return (
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
    )
}

export default JobHeader