import { useAppContext } from '../main'
import { observer } from 'mobx-react-lite'
import FreelancerDashboard from '../components/FreelancerDashboard'
import ClientDashboard from '../components/ClientDashboard'

function Dashboard() {
    const { user } = useAppContext()

    return (
        <div className="mt-10">
            {user.user && user.user.role === 'freelancer' && <FreelancerDashboard />}
            {user.user && user.user.role === 'client' && <ClientDashboard />}
        </div>
    )
}

export default observer(Dashboard)