import { observer } from 'mobx-react-lite'
import { Outlet, Navigate } from 'react-router-dom'
import { useAppContext } from '../main'
import { DASHBOARD_ROUTE } from '../utils/constants'

function PublicOnlyRoute() {
    const { user } = useAppContext()
    if (user.isAuth) {
        return <Navigate to={DASHBOARD_ROUTE} replace />
    }

    return <Outlet />
}

export default observer(PublicOnlyRoute)