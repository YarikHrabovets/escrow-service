import { useState, useEffect } from 'react'
import { fetchCurrencies } from '../../api/currencyAPI'
import ModalBase from './ModalBase'
import Input from '../ui/Input'
import Select from '../ui/Select'
import TextArea from '../ui/TextArea'
import { createJob } from '../../api/jobAPI'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../utils/error'

type Props = {
    isOpen: boolean
    setIsOpen: (v: boolean) => void
    onCreated?: () => void
}

type Currency = {
    code: string
    name: string
    type: string
}

function CreateJobModal({ isOpen, setIsOpen, onCreated }: Props) {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [budget, setBudget] = useState<string>('')
    const [currency, setCurrency] = useState<string>('USD')
    const [deadline, setDeadline] = useState<string>('')
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const loadCurrencies = async () => {
            try {
                const data = await fetchCurrencies()
                setCurrencies(data)

                if (data.length > 0 && !currency) {
                    setCurrency(data[0].code)
                }
            } catch (e) {
                toast.error(getErrorMessage(e))
            }
        }

        if (isOpen) {
            loadCurrencies()
        }
    }, [isOpen])

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setBudget('')
        setCurrency('USD')
        setDeadline('')
    }

    const createJobHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!title.trim()) {
            toast.error('Job title is required')
            return
        }

        if (title.trim().length < 5) {
            toast.error('Job title must be at least 5 characters')
            return
        }

        if (!budget || Number(budget) <= 0) {
            toast.error('Budget must be greater than 0')
            return
        }

        if (!currency) {
            toast.error('Currency is required')
            return
        }

        setLoading(true)

        try {
            await createJob(
                title.trim(),
                description.trim(),
                Number(budget),
                currency,
                deadline || ''
            )

            onCreated?.()

            toast.success('Job was successfully created')
            resetForm()
            setIsOpen(false)
        } catch (e) {
            toast.error(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    return (
        <ModalBase
            title="Create Job"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            modalHandler={createJobHandler}
            loading={loading}
        >
            <div className="space-y-3">
                <Input
                    label="Job title:"
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    placeholder="Enter job title..."
                    onChange={e => setTitle(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-8">
                        <Input
                            label="Job budget:"
                            id="budget"
                            name="budget"
                            type="number"
                            value={budget}
                            placeholder="Enter job budget..."
                            onChange={e => setBudget(e.target.value)}
                        />
                    </div>
                    <div className="sm:col-span-4">
                        <Select
                            label="Currency:"
                            id="currency"
                            name="currency"
                            value={currency}
                            options={currencies.map(item => ({
                                label: `${item.code} - ${item.name}`,
                                value: item.code,
                            }))}
                            onChange={e => setCurrency(e.target.value)}
                        />
                    </div>
                </div>
                <Input
                    label="Deadline:"
                    id="deadline"
                    name="deadline"
                    type="datetime-local"
                    value={deadline}
                    placeholder="Select deadline..."
                    onChange={e => setDeadline(e.target.value)}
                />
                <TextArea
                    label="Job description:"
                    id="description"
                    name="description"
                    value={description}
                    placeholder="Enter job description..."
                    onChange={e => setDescription(e.target.value)}
                />
            </div>
        </ModalBase>
    )
}

export default CreateJobModal