import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'

type Props = {
    title: string
    status: string
    amount: string
    currency: string
    onClick: () => void
}

function DealCard({title, status, amount, currency, onClick}: Props) {
    return (
        <div
            onClick={onClick}
            className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex justify-between items-center cursor-pointer"
        >
            <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-gray-500">{status}</p>
            </div>
            <div>
                <FontAwesomeIcon icon={faDollarSign} className="text-emerald-400" />
                <span>
                    {currency} {Number(amount).toFixed(2)}
                </span>
            </div>
        </div>
    )
}

export default DealCard