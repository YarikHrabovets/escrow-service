import { NavLink } from 'react-router-dom'
import { HOME_ROUTE, AUTH_ROUTE, PRICING_ROUTE, FEATURES_ROUTE, DASHBOARD_ROUTE } from '../../utils/constants'
import { observer } from 'mobx-react-lite'
import { useAppContext } from '../../main'
import DefaultAvatar from '../../assets/default_avatar.png'

function Header() {
    const { user } = useAppContext()

    return (
        <header className="navbar bg-base-300 px-10 sticky top-0 z-50 border-b border-neutral-700">
            <div className="flex-1">
                <NavLink to={HOME_ROUTE}>
                    <span className="text-xl font-bold text-primary">EscrowX</span>
                </NavLink>
            </div>
            <div className="flex items-center space-x-6">
                <NavLink
                    to={FEATURES_ROUTE}
                    className={({ isActive }) => {
                        return isActive ? "link link-hover" : "link link-hover";
                    }}
                >
                    Features
                </NavLink>
                <NavLink
                    to={PRICING_ROUTE}
                    className={({ isActive }) => {
                        return isActive ? "link link-hover" : "link link-hover";
                    }}
                >
                    Pricing
                </NavLink>
                {user.isAuth ? 
                    (
                        <NavLink 
                            to={DASHBOARD_ROUTE}
                            className="border border-neutral-700 h-7 w-7 rounded-full overflow-hidden"
                        >
                            <img className="w-full h-full object-cover" src={user.user?.avatar_url || DefaultAvatar} alt="User Avatar" />
                        </NavLink>
                    )
                    :
                    (
                        <NavLink 
                            to={AUTH_ROUTE}
                            className={({ isActive }) => {
                                return isActive ? "link link-hover" : "link link-hover";
                            }}
                        >
                            Login/Signup
                        </NavLink>
                    )
                }
            </div>
        </header>
    )
}

export default observer(Header)
