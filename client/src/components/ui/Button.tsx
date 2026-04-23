type Props = {
    children: React.ReactNode
    onClick?: () => void
}

function Button({children, onClick}: Props) {
    return (
        <button
            onClick={onClick}
            className="btn btn-primary rounded-xl"
        >
            {children}
        </button>
    )
}

export default Button
