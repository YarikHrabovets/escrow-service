type Props = {
    title: string,
    description: string
}

function Card({title, description}: Props) {
    return (
        <div className="card bg-base-200 shadow-xl hover:bg-base-300 transition">
            <div className="card-body">
                <h3 className="text-primary text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </div>
    )
}

export default Card
