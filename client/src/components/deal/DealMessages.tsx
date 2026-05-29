import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faRobot, faUser } from '@fortawesome/free-solid-svg-icons'
import type { Message } from '../../types/deal'

type Props = {
    messages: Message[]
}

function DealMessages({ messages }: Props) {
    return (
        <div className="mt-10">
            <h2 className="text-2xl font-semibold text-white mb-4">
                Activity
            </h2>

            {messages.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-zinc-400">
                    No activity yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map(message => {
                        const isSystem = message.type === 'system'
                        const senderName = message.sender?.full_name || message.sender?.username || 'System'

                        return (
                            <div
                                key={message.id}
                                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon
                                            icon={isSystem ? faRobot : faUser}
                                            className={isSystem ? 'text-primary' : 'text-zinc-500'}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-4 flex-wrap">
                                            <div className="text-white font-medium">
                                                {senderName}
                                            </div>

                                            <div className="text-xs text-zinc-500">
                                                {new Date(message.created_at).toLocaleString()}
                                            </div>
                                        </div>

                                        {message.body && (
                                            <p className="mt-3 text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                                {message.body}
                                            </p>
                                        )}

                                        {message.attachment_url && (
                                            <a
                                                href={message.attachment_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
                                            >
                                                <FontAwesomeIcon icon={faFile} />
                                                View attachment
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default DealMessages