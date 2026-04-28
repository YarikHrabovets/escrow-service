import { useState, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CenteredSpinner from './components/ui/CenteredSpinner'
import { router } from './router'
import { useAppContext } from './main'
import { refresh } from './api/authAPI'

function App() {
    const { user } = useAppContext()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            try {
                await refresh()
                user.setIsAuth(true)
            } catch (e: any) {
                user.logout()
            }
            finally {
                setLoading(false)
            }
        }

        initAuth()
    }, [])

    if (loading) return <CenteredSpinner size="xl" />

    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer />
        </>
    )
}

export default App
