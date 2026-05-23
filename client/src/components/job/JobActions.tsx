import Button from '../ui/Button'
import type { Job, JobApplication } from '../../types/job'

type CurrentUser = {
    id: string
    role: string
} | null

type Props = {
    job: Job
    currentUser: CurrentUser
    myApplication: JobApplication | null
    checkingMyApplication: boolean
    onApply: () => void
}

function JobActions({job, currentUser, myApplication, checkingMyApplication, onApply, }: Props) {
    return (
        <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-zinc-500">
                Posted on {new Date(job.created_at).toLocaleDateString()}
            </div>

            {!currentUser ? (
                <div className="text-sm text-zinc-500">
                    Sign in to apply for this job
                </div>
            ) : currentUser.id === job.client.id ? (
                <div className="text-sm text-zinc-500">
                    This is your posted job
                </div>
            ) : currentUser.role === 'client' ? (
                <div className="text-sm text-zinc-500">
                    Only freelancers can apply for this job
                </div>
            ) : checkingMyApplication ? (
                <div className="text-sm text-zinc-500">
                    Checking application status...
                </div>
            ) : myApplication ? (
                <div className="text-sm text-green-400">
                    You have already applied for this job
                </div>
            ) : (
                <Button onClick={onApply}>
                    Apply for Job
                </Button>
            )}
        </div>
    )
}

export default JobActions