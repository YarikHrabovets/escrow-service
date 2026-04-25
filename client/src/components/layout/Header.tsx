import { NavLink } from 'react-router-dom'
import { HOME_ROUTE, AUTH_ROUTE, PRICING_ROUTE, FEATURES_ROUTE } from '../../utils/constants'

function Header() {
    return (
        <header className="navbar bg-base-100 px-10 sticky top-0 z-50 backdrop-blur">
            <div className="flex-1">
                <NavLink to={HOME_ROUTE}>
                    <span className="text-xl font-bold text-primary">SecureEscrow</span>
                </NavLink>
            </div>
            <div className="flex-none space-x-6">
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
                <NavLink 
                    to={AUTH_ROUTE}
                    className={({ isActive }) => {
                        return isActive ? "link link-hover" : "link link-hover";
                    }}
                >
                    Login/Signup
                </NavLink>
            </div>
        </header>
    )
}

export default Header
