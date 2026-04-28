import { useAppContext } from '../main'
import { observer } from 'mobx-react-lite'
import { logout } from '../api/authAPI'

function Dashboard() {
    const { user } = useAppContext()

    const logoutHandler = async () => {
        try {
            await logout()
        } catch (e) {
            console.log(e)
        } finally {
            user.logout()
        }
    }

    return (
        <div>
            <p>email: {user.user?.email}</p>
            <p>username: {user.user?.username}</p>
            <p>fullname: {user.user?.full_name}</p>
            <p>role: {user.user?.role}</p>
            <button className="btn btn-warning" onClick={logoutHandler}>Log Out</button>
        </div>
    )
}

export default observer(Dashboard)