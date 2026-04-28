type Props = {
    children: React.ReactNode,
    disabled: boolean
}

function SubmitButton({children, disabled}: Props) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="btn btn-primary rounded-md w-full"
        >
            {children}
        </button>
    )
}

export default SubmitButton