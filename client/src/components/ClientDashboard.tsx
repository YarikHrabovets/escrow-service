import { observer } from 'mobx-react-lite'
import { useAppContext } from '../main'
import ClientStats from './client/ClientStats'
import DealList from './deal/DealList'
import SpendingChart from './client/SpendingChart'
import Profile from './Profile'
import FreelancerMessages from './client/FreelancerMessages'

function ClientDashboard() {
    const { user } = useAppContext()

    return (
        <div className="px-10 space-y-6">
            <p className="text-2xl mb-5">Welcome back, {user.user?.username || user.user?.email} 👋</p>
            <ClientStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <SpendingChart />
                    <DealList isActive={true} />
                    <DealList isActive={false} />
                </div>
                <div className="space-y-6">
                    <Profile />
                    <FreelancerMessages />
                </div>
            </div>
        </div>
    )
}

export default observer(ClientDashboard)