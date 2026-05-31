import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { useAppContext } from '../main'
import { getErrorMessage } from '../utils/error'
import CenteredSpinner from '../components/ui/CenteredSpinner'

import DealHeader from '../components/deal/DealHeader'
import DealParties from '../components/deal/DealParties'
import DealInfoCards from '../components/deal/DealInfoCards'
import DealDescription from '../components/deal/DealDescription'
import DealTimeline from '../components/deal/DealTimeline'
import DealMessages from '../components/deal/DealMessages'
import DealActions from '../components/deal/DealActions'
import SubmitWorkModal from '../components/modals/SubmitWorkModal'

import {
    approveDealWork,
    getDeal,
    startDealWork,
} from '../api/dealAPI'

import { createDealCheckoutSession } from '../api/paymentAPI'

import type { Deal } from '../types/deal'

function DealView() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const { user } = useAppContext()

    const [deal, setDeal] = useState<Deal | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [isSubmitOpen, setIsSubmitOpen] = useState(false)

    const fetchDeal = async () => {
        try {
            if (!id) return

            const data = await getDeal(id)
            setDeal(data)
        } catch (e) {
            toast.error(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDeal()
    }, [id])

    useEffect(() => {
        const paymentStatus = searchParams.get('payment')

        if (paymentStatus === 'success') {
            toast.success('Payment completed. Waiting for confirmation...')
            fetchDeal()
            setSearchParams({})
        }

        if (paymentStatus === 'cancelled') {
            toast.info('Payment was cancelled')
            setSearchParams({})
        }
    }, [searchParams])

    const handleAction = async (action: () => Promise<Deal>, successMessage: string) => {
        setActionLoading(true)

        try {
            const updatedDeal = await action()
            setDeal(updatedDeal)
            toast.success(successMessage)
        } catch (e) {
            toast.error(getErrorMessage(e))
        } finally {
            setActionLoading(false)
        }
    }

    const handleFundEscrow = async () => {
        if (!deal) return

        setActionLoading(true)

        try {
            const data = await createDealCheckoutSession(deal.id)
            window.location.href = data.checkout_url
        } catch (e) {
            toast.error(getErrorMessage(e))
            setActionLoading(false)
        }
    }

    if (loading) {
        return <CenteredSpinner size="xl" />
    }

    if (!deal) {
        return (
            <div className="flex items-center justify-center text-zinc-400">
                Deal not found
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto py-10">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors cursor-pointer"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
            </button>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                <DealHeader deal={deal} />
                <DealParties
                    client={deal.client}
                    freelancer={deal.freelancer}
                />
                <DealInfoCards deal={deal} />
                <DealTimeline deal={deal} />
                <DealDescription deal={deal} />
                <DealMessages messages={deal.messages} />
                <DealActions
                    deal={deal}
                    currentUser={user.user}
                    loading={actionLoading}
                    onFund={handleFundEscrow}
                    onStart={() => handleAction(() => startDealWork(deal.id), 'Work started successfully')}
                    onSubmit={() => setIsSubmitOpen(true)}
                    onApprove={() => handleAction(() => approveDealWork(deal.id), 'Work approved successfully')}
                />
            </div>
            <SubmitWorkModal
                isOpen={isSubmitOpen}
                setIsOpen={setIsSubmitOpen}
                dealId={deal.id}
                onSubmitted={fetchDeal}
            />
        </div>
    )
}

export default observer(DealView)