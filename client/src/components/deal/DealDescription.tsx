import type { Deal } from '../../types/deal'

type Props = {
    deal: Deal
}

function DealDescription({ deal }: Props) {
    return (
        <div className="mt-10">
            <h2 className="text-2xl font-semibold text-white mb-4">
                Description
            </h2>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {deal.description || 'No description provided.'}
                </p>
            </div>
        </div>
    )
}

export default DealDescription