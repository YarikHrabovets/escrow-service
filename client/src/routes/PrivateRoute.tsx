import { observer } from 'mobx-react-lite'
import { Outlet, Navigate } from 'react-router-dom'
import { useAppContext } from '../main'
import { AUTH_ROUTE } from '../utils/constants'

function PrivateRoute() {
    const { user } = useAppContext()
    if (!user.isAuth) {
        return <Navigate to={AUTH_ROUTE} replace />
    }

    return <Outlet />
}

export default observer(PrivateRoute)