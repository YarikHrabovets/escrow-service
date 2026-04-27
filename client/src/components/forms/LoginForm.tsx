import { useState } from 'react'
import { motion } from 'framer-motion'
import { formVariants, transition } from '../../animations/formVariants'
import SubmitButton from '../ui/SubmitButton'
import Input from '../ui/Input'

type Props = {
    formChangeHandler?: () => void
}

function LoginForm({formChangeHandler}: Props) {
    const [emial, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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
                    value={emial}
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
                <SubmitButton>Sign In</SubmitButton>
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
