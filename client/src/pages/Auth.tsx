import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoginForm from '../components/forms/LoginForm'
import RegisterForm from '../components/forms/RegisterForm'
import AuthImage from '../assets/vertical2.png'

function Auth() {
    const [isLogin, setIsLogin] = useState(true)

    const formChangeHandler = () => setIsLogin(prev => !prev)

    return (
        <div className="flex flex-row h-screen">
            <div className="basis-1/2 p-3">
                <img className="h-full w-full object-cover rounded-md" src={AuthImage} alt="Auth image" />
            </div>
            <div className="basis-1/2">
                <div className="flex justify-center items-center h-full w-full">
                    <div>
                        <AnimatePresence>
                            {isLogin ? 
                                <LoginForm formChangeHandler={formChangeHandler} /> 
                            : 
                                <RegisterForm formChangeHandler={formChangeHandler} />
                            }
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth
