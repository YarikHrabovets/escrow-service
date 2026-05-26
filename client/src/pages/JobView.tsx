import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useAppContext } from '../main'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../utils/error'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import CenteredSpinner from '../components/ui/CenteredSpinner'
import ApplyJobModal from '../components/modals/ApplyJobModal'

import JobHeader from '../components/job/JobHeader'
import JobInfoCards from '../components/job/JobInfoCards'
import JobDescription from '../components/job/JobDescription'
import JobActions from '../components/job/JobActions'
import JobApplicationsList from '../components/job/JobApplicationsList'

import { getJob, getJobApplications, getMyJobApplication, acceptJobApplication } from '../api/jobAPI'
import type { Job, JobApplication } from '../types/job'

function JobView() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAppContext()

    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true)

    const [isApplyOpen, setIsApplyOpen] = useState(false)

    const [applications, setApplications] = useState<JobApplication[]>([])
    const [applicationsLoading, setApplicationsLoading] = useState(false)

    const [myApplication, setMyApplication] = useState<JobApplication | null>(null)
    const [checkingMyApplication, setCheckingMyApplication] = useState(false)

    const isOwner = Boolean(user.user && job && user.user.id === job.client.id)

    const handleAcceptApplication = async (applicationId: string, jobId: string) => {
        try {
            await acceptJobApplication(jobId, applicationId)

            toast.success('Freelancer accepted')

            const data = await getJobApplications(jobId)
            setApplications(data)

            const updatedJob = await getJob(jobId)
            setJob(updatedJob)
        } catch (e) {
            toast.error(getErrorMessage(e))
        }
    }

    useEffect(() => {
        const fetchJob = async () => {
            try {
                if (!id) return

                const data = await getJob(id)
                setJob(data)
            } catch (e) {
                toast.error(getErrorMessage(e))
            } finally {
                setLoading(false)
            }
        }

        fetchJob()
    }, [id])

    useEffect(() => {
        const fetchApplications = async () => {
            if (!id || !job || !user.user || user.user.id !== job.client.id) return

            setApplicationsLoading(true)

            try {
                const data = await getJobApplications(id)
                setApplications(data)
            } catch (e) {
                toast.error(getErrorMessage(e))
            } finally {
                setApplicationsLoading(false)
            }
        }

        fetchApplications()
    }, [id, job, user.user])

    useEffect(() => {
        const fetchMyApplication = async () => {
            if (!id || !job || !user.user || user.user.role !== 'freelancer') return

            setCheckingMyApplication(true)

            try {
                const data = await getMyJobApplication(id)
                setMyApplication(data)
            } catch (e) {
                toast.error(getErrorMessage(e))
            } finally {
                setCheckingMyApplication(false)
            }
        }

        fetchMyApplication()
    }, [id, job, user.user])

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
                <JobHeader job={job} />

                <JobInfoCards job={job} />

                <JobDescription job={job} />

                {isOwner && (
                    <JobApplicationsList
                        job={job}
                        applications={applications}
                        loading={applicationsLoading}
                        onAccept={(applicationId) => handleAcceptApplication(applicationId, job.id)}
                    />
                )}

                <JobActions
                    job={job}
                    currentUser={user.user}
                    myApplication={myApplication}
                    checkingMyApplication={checkingMyApplication}
                    onApply={() => setIsApplyOpen(true)}
                />
            </div>

            <ApplyJobModal
                isOpen={isApplyOpen}
                setIsOpen={setIsApplyOpen}
                jobId={job.id}
                onApplied={(application) => setMyApplication(application)}
            />
        </div>
    )
}

export default observer(JobView)