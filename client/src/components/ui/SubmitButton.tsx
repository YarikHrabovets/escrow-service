type Props = {
    children: React.ReactNode
}

function SubmitButton({children}: Props) {
    return (
        <button
            type="submit"
            className="btn btn-primary rounded-md w-full"
        >
            {children}
        </button>
    )
}

export default SubmitButton