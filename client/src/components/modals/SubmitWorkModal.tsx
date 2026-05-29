import { useState } from 'react'
import ModalBase from './ModalBase'
import Input from '../ui/Input'
import TextArea from '../ui/TextArea'
import { submitDealWork } from '../../api/dealAPI'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../utils/error'

type Props = {
    isOpen: boolean
    setIsOpen: (v: boolean) => void
    dealId: string
    onSubmitted?: () => void | Promise<void>
}

function SubmitWorkModal({ isOpen, setIsOpen, dealId, onSubmitted }: Props) {
    const [message, setMessage] = useState('')
    const [attachmentUrl, setAttachmentUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const resetForm = () => {
        setMessage('')
        setAttachmentUrl('')
    }

    const submitHandler = async () => {
        if (message.trim().length < 5) {
            toast.error('Message must be at least 5 characters')
            return
        }

        setLoading(true)

        try {
            await submitDealWork(
                dealId,
                message.trim(),
                attachmentUrl.trim() || null
            )

            toast.success('Work submitted successfully')
            resetForm()
            setIsOpen(false)
            await onSubmitted?.()
        } catch (e) {
            toast.error(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    return (
        <ModalBase
            title="Submit Work"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            modalHandler={submitHandler}
            loading={loading}
        >
            <div className="space-y-3">
                <TextArea
                    label="Submission message:"
                    id="submissionMessage"
                    name="submissionMessage"
                    value={message}
                    placeholder="Describe what you completed..."
                    onChange={e => setMessage(e.target.value)}
                />

                <Input
                    label="Attachment URL:"
                    id="attachmentUrl"
                    name="attachmentUrl"
                    type="url"
                    value={attachmentUrl}
                    placeholder="https://github.com/... or file link"
                    onChange={e => setAttachmentUrl(e.target.value)}
                />
            </div>
        </ModalBase>
    )
}

export default SubmitWorkModal