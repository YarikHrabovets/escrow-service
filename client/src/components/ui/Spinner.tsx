type Props = {
    size: string
}

function Spinner({size}: Props) {
    return <span className={`loading loading-dots loading-${size}`}></span>
}

export default Spinner