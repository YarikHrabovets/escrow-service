import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { formVariants, transition } from '../../animations/formVariants'
import SubmitButton from '../ui/SubmitButton'
import Input from '../ui/Input'
import { useAppContext } from '../../main'
import { login } from '../../api/authAPI'
import { DASHBOARD_ROUTE } from '../../utils/constants'
import Spinner from '../ui/Spinner'
import { getErrorMessage } from '../../utils/error'


type Props = {
    formChangeHandler?: () => void
}

function LoginForm({formChangeHandler}: Props) {
    const { user } = useAppContext()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = await login(email, password)
            user.setIsAuth(true)
            user.setUser(data)
            navigate(DASHBOARD_ROUTE)
        } catch (e: any) {
            toast.error(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            variants={formVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            transition={transition}
        >
            <p className="text-3xl font-bold text-center">Sign In</p>
            <div className="relative h-1 w-full mt-3 mb-5 rounded bg-gray-700"></div>
            <form className="w-150" onSubmit={submitHandler}>
                <Input
                    label="Email:"
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    placeholder="Enter your email..."
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Password:"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    placeholder="Enter your password..."
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <SubmitButton disabled={loading}>
                    <span className='flex items-center gap-2'>
                        Sign In
                        {loading && <Spinner size="sm" />}
                    </span>
                </SubmitButton>
            </form>
            <p className="text-center mt-3">
                Don't have an account?&nbsp;
                <a
                    className="link link-info"
                    onClick={formChangeHandler}
                >
                    Sign Up!
                </a>
            </p>
        </motion.div>
    )
}

export default LoginForm
