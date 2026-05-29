import { useState, useEffect } from 'react'
import { getDeals } from '../../api/dealAPI'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../utils/error'
import DealCard from './dealCard'
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

const ActiveDeals = () => {
    const [deals, setDeals] = useState<Deal[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const data = await getDeals()
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
            <h2 className="font-semibold mb-4">Active Deals</h2>

            <div className="space-y-3">
                {deals.map(d => (
                    <DealCard
                        key={d.id}
                        title={d.title}
                        status={d.status}
                        amount={d.amount}
                        currency={d.currency}
                    />
                ))}
            </div>
        </div>
    )
}

export default ActiveDeals