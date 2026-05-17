const ClientStats = () => {
    const stats = [
        { label: 'Total Spent', emoji: '💰', value: '$12,430' },
        { label: 'Active Deals', emoji: '📦', value: '5' },
        { label: 'Completed', emoji: '✅', value: '42' },
        { label: 'Freelancers', emoji: '🧑‍💻', value: '18' }
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
                <div
                    key={i}
                    className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-sm"
                >
                    <p className="text-gray-500 mb-3">{s.label}</p>
                    <div className="flex justify-between">
                        <p className="text-xl font-bold">{s.value}</p>
                        <span className="text-xl">{s.emoji}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ClientStats