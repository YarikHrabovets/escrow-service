import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileContract } from '@fortawesome/free-solid-svg-icons'
import type { Deal } from '../../types/deal'

type Props = {
    deal: Deal
}

function getStatusClassName(status: string) {
    switch (status) {
        case 'CREATED':
            return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
        case 'FUNDED':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        case 'IN_PROGRESS':
            return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        case 'SUBMITTED':
            return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        case 'COMPLETED':
            return 'bg-green-500/10 text-green-400 border-green-500/20'
        case 'DISPUTED':
            return 'bg-red-500/10 text-red-400 border-red-500/20'
        case 'REFUNDED':
            return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
        default:
            return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
    }
}

function DealHeader({ deal }: Props) {
    return (
        <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <FontAwesomeIcon icon={faFileContract} className="text-primary text-xl" />

                    <h1 className="text-4xl font-bold text-white">
                        {deal.title}
                    </h1>
                </div>

                <div className="text-sm text-zinc-500">
                    Created on {new Date(deal.created_at).toLocaleDateString()}
                </div>
            </div>

            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusClassName(deal.status)}`}>
                {deal.status}
            </span>
        </div>
    )
}

export default DealHeader