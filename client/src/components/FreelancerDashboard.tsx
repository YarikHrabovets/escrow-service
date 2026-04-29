
import { observer } from 'mobx-react-lite'
import { useAppContext } from '../main'
import DefaultAvatar from '../assets/default_avatar.png'
import Analytics from './Analytics'
import Earning from './Earnings'
import Projects from './Projects'

type Props = {
    logoutHandler: () => void
}

function FreelancerDashboard({logoutHandler}: Props) {
    const { user } = useAppContext()

    return (
        <div className="flex gap-5 px-10">
            <div className="basis-3/4">
                <p className="text-xl mb-5">Welcome back, {user.user?.username || user.user?.email} 👋</p>
                <div className="flex gap-3">
                    <Analytics />
                    <Earning />
                </div>
                <Projects />
            </div>
            <div className="basis-1/4">
                <div className="card bg-base-200 p-7 shadow-lg flex justify-between items-center flex-col gap-5">
                    <div>
                        <div className="p-3 border border-stone-400 rounded-full">
                            <img className="h-20" src={user.user?.avatar_url || DefaultAvatar} alt="User Avatar" />
                        </div>
                        <p className="text-center">{user.user?.full_name || user.user?.email}</p>
                    </div>
                    <div>
                        <button className="btn btn-outline btn-primary mb-2 w-full">Edit Profile</button>
                        <button className="btn btn-outline btn-warning w-full" onClick={logoutHandler}>Log Out</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(FreelancerDashboard)