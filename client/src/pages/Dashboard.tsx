import { useAppContext } from '../main'
import { observer } from 'mobx-react-lite'
import { logout } from '../api/authAPI'
import FreelancerDashboard from '../components/FreelancerDashboard'
import ClientDashboard from '../components/ClientDashboard'

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
        <>
            {user.user && user.user.role === 'freelancer' && <FreelancerDashboard logoutHandler={logoutHandler} />}
            {user.user && user.user.role === 'client' && <ClientDashboard logoutHandler={logoutHandler} />}
        </>
    )
}

export default observer(Dashboard)