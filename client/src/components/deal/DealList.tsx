import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDeals, getCompletedDeals } from '../../api/dealAPI'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../utils/error'
import DealCard from './DealCard'
import Spinner from '../ui/Spinner'

type Deal = {
    id: string
    title: string
    amount: string
    currency: string
    status: string
    milestone_based: boolean
    deadline: string | null
    created_at: string
    client_id: string
    freelancer_id: string
}

type Props = {
    isActive: boolean
}

function DealList({ isActive }: Props) {
    const navigate = useNavigate()
    const [deals, setDeals] = useState<Deal[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                let data
                if (isActive) {
                    data = await getDeals()
                } else {
                    data = await getCompletedDeals()
                }
                setDeals(data)
            } catch (e) {
                toast.error(getErrorMessage(e))
            } finally {
                setLoading(false)
            }
        }

        fetchDeals()
    }, [])

    if (loading) return <Spinner size="md" />

    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-7 shadow-sm">
            <h2 className="font-semibold mb-4">{isActive ? "Active Deals" : "Completed Deals"}</h2>

            <div className="space-y-3">
                {deals.map(d => (
                    <DealCard
                        key={d.id}
                        title={d.title}
                        status={d.status}
                        amount={d.amount}
                        currency={d.currency}
                        onClick={() => navigate(`/deals/${d.id}`)}
                    />
                ))}
            </div>
        </div>
    )
}

export default DealList