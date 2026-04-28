import { createContext, useContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UserStore from './store/UserStore'

type AppContextType = {
    user: typeof UserStore
}

const Context = createContext<AppContextType | null>(null)
export const useAppContext = () => {
    const ctx = useContext(Context)

    if (!ctx) {
        throw new Error('useAppContext must be used within Provider')
    }

    return ctx
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Context.Provider value={{
            user: UserStore
        }}>
            <App />
        </Context.Provider>
    </StrictMode>
)
