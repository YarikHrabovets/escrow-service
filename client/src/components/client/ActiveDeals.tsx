const deals = [
    { id: 1, title: 'Website redesign', price: '$1200', status: 'In progress' },
    { id: 2, title: 'Logo design', price: '$300', status: 'Review' },
    { id: 3, title: 'Mobile app UI', price: '$900', status: 'In progress' }
]

const ActiveDeals = () => {
    return (
        <div className="bg-base-200 border border-base-300 rounded-xl p-7 shadow-sm">
            <h2 className="font-semibold mb-4">Active Deals</h2>

            <div className="space-y-3">
                {deals.map(d => (
                    <div
                        key={d.id}
                        className="bg-base-100 border border-base-300 rounded-lg p-4 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-medium">{d.title}</p>
                            <p className="text-sm text-gray-500">{d.status}</p>
                        </div>

                        <p className="font-semibold">{d.price}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ActiveDeals