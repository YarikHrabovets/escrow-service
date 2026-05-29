type Props = {
    children: React.ReactNode
    disabled?: boolean
    onClick?: () => void
}

function Button({children, disabled, onClick}: Props) {
    return (
        <button
            type="button"
            disabled={disabled || false}
            onClick={onClick}
            className="btn btn-primary rounded-md"
        >
            {children}
        </button>
    )
}

export default Button
