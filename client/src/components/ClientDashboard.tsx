type Props = {
    logoutHandler: () => void
}

function ClientDashboard({logoutHandler}: Props) {
    return (
        <div>
            client
            <button className="btn btn-warning" onClick={logoutHandler}>Log Out</button>
        </div>
    )
}

export default ClientDashboard