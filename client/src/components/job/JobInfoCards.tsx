import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import type { Job } from '../../types/job'

type Props = {
    job: Job
}

function JobInfoCards({ job }: Props) {
    return (
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
    )
}

export default JobInfoCards