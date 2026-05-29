
import { observer } from 'mobx-react-lite'
import { useAppContext } from '../main'
import Analytics from './freelancer/Analytics'
import Earning from './freelancer/Earnings'
import ActiveDeals from './deal/ActiveDeals'
import ClientMessages from './freelancer/ClientMessages'
import Profile from './Profile'

function FreelancerDashboard() {
    const { user } = useAppContext()

    return (
        <div className="px-10">
            <p className="text-2xl mb-5">Welcome back, {user.user?.username || user.user?.email} 👋</p>
            <div className="flex gap-5">
                <div className="basis-3/4">
                    <div className="flex gap-5 mb-5">
                        <Analytics />
                        <Earning />
                    </div>
                    <ActiveDeals />
                </div>
                <div className="basis-1/4">
                    <Profile />
                    <ClientMessages />
                </div>
            </div>
        </div>
    )
}

export default observer(FreelancerDashboard)