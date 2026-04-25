import Spinner from './Spinner'

type Props = {
    size: string
}

function CenteredSpinner({size}: Props) {
    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Spinner size={size} />
        </div>
    )
}

export default CenteredSpinner