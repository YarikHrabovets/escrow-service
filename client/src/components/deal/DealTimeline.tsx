import type { Deal } from '../../types/deal'

type Props = {
    deal: Deal
}

const steps = ['CREATED', 'FUNDED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED']

function DealTimeline({ deal }: Props) {
    const currentIndex = steps.indexOf(deal.status)

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-semibold text-white mb-4">
                Progress
            </h2>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-0">
                    {steps.map((step, index) => {
                        const active = currentIndex >= index
                        const lineActive = currentIndex > index

                        return (
                            <div
                                key={step}
                                className="relative flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0"
                            >
                                {index < steps.length - 1 && (
                                    <div
                                        className={`hidden sm:block absolute top-4 left-[calc(50%+16px)] w-[calc(100%-32px)] h-px ${
                                            lineActive ? 'bg-primary/60' : 'bg-zinc-800'
                                        }`}
                                    />
                                )}

                                <div
                                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border ${
                                        active
                                            ? 'bg-zinc-950 text-primary border-primary/60'
                                            : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                                    }`}
                                >
                                    {index + 1}
                                </div>

                                <div
                                    className={`sm:mt-3 text-sm font-medium text-center ${
                                        active ? 'text-white' : 'text-zinc-500'
                                    }`}
                                >
                                    {step.replace('_', ' ')}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default DealTimeline