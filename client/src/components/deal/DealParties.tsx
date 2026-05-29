import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import type { UserPreview } from '../../types/deal'

type Props = {
    client: UserPreview
    freelancer: UserPreview
}

function UserCard({ user, label }: { user: UserPreview; label: string }) {
    const name = user.full_name || user.username || 'Unknown user'

    return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
            <div className="text-sm text-zinc-500 mb-3">
                {label}
            </div>

            <div className="flex items-center gap-3">
                {user.avatar_url ? (
                    <img
                        src={user.avatar_url}
                        alt={name}
                        className="w-11 h-11 rounded-full object-cover border border-zinc-700"
                    />
                ) : (
                    <div className="w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-zinc-500" />
                    </div>
                )}

                <div>
                    <div className="text-white font-semibold">
                        {name}
                    </div>

                    <div className="text-sm text-zinc-500">
                        {user.role}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faStar} className="text-orange-400" />
                    <span>Reputation {user.reputation_score}</span>
                </div>

                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-400" />
                    <span>{user.completed_deals} completed</span>
                </div>
            </div>
        </div>
    )
}

function DealParties({ client, freelancer }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <UserCard user={client} label="Client" />
            <UserCard user={freelancer} label="Freelancer" />
        </div>
    )
}

export default DealParties