import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faCalendarDays, faPercent } from '@fortawesome/free-solid-svg-icons'
import type { Deal } from '../../types/deal'

type Props = {
    deal: Deal
}

function DealInfoCards({ deal }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <FontAwesomeIcon icon={faDollarSign} className="text-emerald-400" />
                    <span>Amount</span>
                </div>

                <div className="text-3xl font-bold text-white">
                    {deal.currency} {Number(deal.amount).toFixed(2)}
                </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <FontAwesomeIcon icon={faPercent} className="text-primary" />
                    <span>Platform Fee</span>
                </div>

                <div className="text-3xl font-bold text-white">
                    {deal.currency} {Number(deal.platform_fee).toFixed(2)}
                </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-orange-400" />
                    <span>Deadline</span>
                </div>

                <div className="text-2xl font-semibold text-white">
                    {deal.deadline
                        ? new Date(deal.deadline).toLocaleDateString()
                        : 'No deadline'}
                </div>
            </div>
        </div>
    )
}

export default DealInfoCards