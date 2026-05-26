import type { Job, JobApplication } from '../../types/job'
import Button from '../ui/Button'

type Props = {
    job: Job
    applications: JobApplication[]
    loading: boolean
    onAccept: (applicationId: string) => void
}

function JobApplicationsList({ job, applications, loading, onAccept }: Props) {
    const getStatusClassName = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            case 'ACCEPTED':
                return 'bg-green-500/10 text-green-400 border-green-500/20'
            case 'REJECTED':
                return 'bg-red-500/10 text-red-400 border-red-500/20'
            case 'WITHDRAWN':
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
            default:
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
        }
    }

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-semibold text-white mb-4">
                Applications
            </h2>

            {loading ? (
                <div className="text-zinc-400">
                    Loading applications...
                </div>
            ) : applications.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-zinc-400">
                    No applications yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map(application => (
                        <div
                            key={application.id}
                            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-white font-semibold">
                                        {application.freelancer?.full_name ||
                                            application.freelancer?.username ||
                                            'Unknown freelancer'}
                                    </div>

                                    <div className="text-sm text-zinc-500 mt-1">
                                        Reputation: {application.freelancer?.reputation_score ?? 0}
                                        {' · '}
                                        Completed deals: {application.freelancer?.completed_deals ?? 0}
                                    </div>
                                </div>

                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusClassName(application.status)}`}>
                                    {application.status}
                                </span>
                            </div>
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    {application.cover_letter && (
                                        <p className="mt-4 text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                            {application.cover_letter}
                                        </p>
                                    )}
                                    {application.proposed_amount && (
                                        <div className="mt-4 text-sm text-zinc-400">
                                            Proposed amount:{' '}
                                            <span className="text-white font-medium">
                                                {job.currency} {Number(application.proposed_amount).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="mt-4 text-xs text-zinc-500">
                                        Applied on {new Date(application.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                {application.status === 'PENDING' && (
                                    <Button onClick={() => onAccept(application.id)}>
                                        Accept Freelancer
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default JobApplicationsList