import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useAppContext } from '../main'
import { getJobs } from '../api/jobAPI'
import JobCard from '../components/JobCard'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../utils/error'
import CenteredSpinner from '../components/ui/CenteredSpinner'
import Button from '../components/ui/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import CreateJobModal from '../components/modals/CreateJobModal'

type Job = {
    id: string
    title: string
    budget: string
    currency: string
    deadline: string | null
    status: string
    created_at: string
}

function Jobs() {
    const { user } = useAppContext()
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getJobs()
                setJobs(data)
            } catch (e) {
                toast.error(getErrorMessage(e))
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    }, [refreshKey])

    if (loading) {
        return (
            <CenteredSpinner size="xl" />
        )
    }

    return (
        <>
            <div className="max-w-6xl mx-auto py-10">
                <div className="mb-10">
                    {user.user && user.user.role === 'client' ? (
                        <div className="flex justify-between">
                            <h1 className="text-4xl font-bold text-white">
                                Browse Jobs
                            </h1>
                            <Button
                                onClick={() => setIsOpen(true)}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                Create new job
                            </Button>
                        </div>
                    ) : (
                        <h1 className="text-4xl font-bold text-white">
                            Browse Jobs
                        </h1>
                    )}
                    <p className="text-zinc-400 mt-2">
                        Find freelance opportunities from clients worldwide
                    </p>
                </div>
                {jobs.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center text-zinc-400">
                        No jobs available right now.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {jobs.map(job => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                )}
            </div>
            <CreateJobModal isOpen={isOpen} setIsOpen={setIsOpen} onCreated={() => setRefreshKey(prev => prev + 1)} />
        </>
    )
}

export default observer(Jobs)