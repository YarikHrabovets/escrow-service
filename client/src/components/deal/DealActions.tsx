import Button from '../ui/Button'
import type { Deal } from '../../types/deal'

type CurrentUser = {
    id: string
    role: string
} | null

type Props = {
    deal: Deal
    currentUser: CurrentUser
    loading: boolean
    onFund: () => void
    onStart: () => void
    onSubmit: () => void
    onApprove: () => void
}

function DealActions({
    deal,
    currentUser,
    loading,
    onFund,
    onStart,
    onSubmit,
    onApprove,
}: Props) {
    const isClient = currentUser?.id === deal.client.id
    const isFreelancer = currentUser?.id === deal.freelancer.id

    return (
        <div className="mt-10 bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
                Actions
            </h2>

            {!currentUser ? (
                <div className="text-zinc-500">
                    Sign in to manage this deal.
                </div>
            ) : deal.status === 'CREATED' && isClient ? (
                <Button disabled={loading} onClick={onFund}>
                    Fund Escrow
                </Button>
            ) : deal.status === 'CREATED' && isFreelancer ? (
                <div className="text-zinc-500">
                    Waiting for client to fund escrow.
                </div>
            ) : deal.status === 'FUNDED' && isFreelancer ? (
                <Button disabled={loading} onClick={onStart}>
                    Start Work
                </Button>
            ) : deal.status === 'FUNDED' && isClient ? (
                <div className="text-zinc-500">
                    Escrow funded. Waiting for freelancer to start work.
                </div>
            ) : deal.status === 'IN_PROGRESS' && isFreelancer ? (
                <Button disabled={loading} onClick={onSubmit}>
                    Submit Work
                </Button>
            ) : deal.status === 'IN_PROGRESS' && isClient ? (
                <div className="text-zinc-500">
                    Work is in progress.
                </div>
            ) : deal.status === 'SUBMITTED' && isClient ? (
                <Button disabled={loading} onClick={onApprove}>
                    Approve Work
                </Button>
            ) : deal.status === 'SUBMITTED' && isFreelancer ? (
                <div className="text-zinc-500">
                    Work submitted. Waiting for client approval.
                </div>
            ) : deal.status === 'COMPLETED' ? (
                <div className="text-green-400">
                    Deal completed successfully.
                </div>
            ) : (
                <div className="text-zinc-500">
                    No available actions.
                </div>
            )}
        </div>
    )
}

export default DealActions