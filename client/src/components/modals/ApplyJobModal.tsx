import { useState } from 'react'
import ModalBase from './ModalBase'
import TextArea from '../ui/TextArea'
import Input from '../ui/Input'
import { applyForJob } from '../../api/jobAPI'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../utils/error'
import type { JobApplication } from '../../types/job'

type Props = {
    isOpen: boolean
    setIsOpen: (v: boolean) => void
    jobId: string
    onApplied?: (application: JobApplication) => void
}

function ApplyJobModal({ isOpen, setIsOpen, jobId, onApplied }: Props) {
    const [coverLetter, setCoverLetter] = useState('')
    const [proposedAmount, setProposedAmount] = useState('')
    const [loading, setLoading] = useState(false)

    const resetForm = () => {
        setCoverLetter('')
        setProposedAmount('')
    }

    const applyHandler = async () => {
        if (coverLetter.trim().length > 5000) {
            toast.error('Cover letter is too long')
            return
        }

        if (proposedAmount && Number(proposedAmount) <= 0) {
            toast.error('Proposed amount must be greater than 0')
            return
        }

        setLoading(true)

        try {
            const application = await applyForJob(
                jobId,
                coverLetter.trim(),
                proposedAmount ? Number(proposedAmount) : null
            )

            toast.success('Application sent successfully')
            resetForm()
            setIsOpen(false)
            onApplied?.(application)
        } catch (e) {
            toast.error(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    return (
        <ModalBase
            title="Apply for Job"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            modalHandler={applyHandler}
            loading={loading}
        >
            <div className="space-y-3">
                <TextArea
                    label="Cover letter:"
                    id="coverLetter"
                    name="coverLetter"
                    value={coverLetter}
                    placeholder="Tell the client why you're a good fit..."
                    onChange={e => setCoverLetter(e.target.value)}
                />

                <Input
                    label="Proposed amount:"
                    id="proposedAmount"
                    name="proposedAmount"
                    type="number"
                    value={proposedAmount}
                    placeholder="Optional proposed amount..."
                    onChange={e => setProposedAmount(e.target.value)}
                />
            </div>
        </ModalBase>
    )
}

export default ApplyJobModal