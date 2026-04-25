import { useState } from 'react'
import { motion } from 'framer-motion'
import { formVariants, transition } from '../../animations/formVariants'

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
                <label htmlFor="email">Email:</label>
                <input className='input w-full mb-5' id="email" name="email" type="email" value={emial} onChange={e => setEmail(e.target.value)} required />
                <label htmlFor="password">Password:</label>
                <input className='input w-full mb-5' id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button className="btn btn-success w-full" type="submit">Sign In</button>
            </form>
            <p className="text-center mt-3">
                Don't have an account? 
                <a
                    className="link link-secondary"
                    onClick={formChangeHandler}
                >
                    Sign Up!
                </a>
            </p>
        </motion.div>
    )
}

export default LoginForm
