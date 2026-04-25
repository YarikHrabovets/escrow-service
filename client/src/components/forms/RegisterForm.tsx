import { useState } from 'react'
import { motion } from 'framer-motion'
import { formVariants, transition } from '../../animations/formVariants'

type Props = {
    formChangeHandler?: () => void
}

function RegisterForm({formChangeHandler}: Props) {
    const [emial, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [fullname, setFullName] = useState('')
    const [role, setRole] = useState('client')
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
            <p className="text-3xl font-bold text-center">Sign Up</p>
            <div className="relative h-1 w-full mt-3 mb-5 rounded bg-gray-700"></div>
            <form className="w-150" onSubmit={submitHandler}>
                <label htmlFor="email">Email:</label>
                <input className="input w-full mb-5" id="email" name="email" type="email" value={emial} onChange={e => setEmail(e.target.value)} required />
                <label htmlFor="username">Username:</label>
                <input className="input w-full mb-5" id="username" name="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                <label htmlFor="fullname">Full Name:</label>
                <input className="input w-full mb-5" id="fullname" name="fullname" type="text" value={fullname} onChange={e => setFullName(e.target.value)} required />
                <label htmlFor="role">Select who are you:</label>
                <select className="select w-full mb-5" id="role" name="role" value={role} onChange={e => setRole(e.target.value)}>
                    <option value="client">Client</option>
                    <option value="freelancer">Freelancer</option>
                </select>
                <label htmlFor="password">Password:</label>
                <input className="input w-full mb-5" id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button className="btn btn-success w-full" type="submit">Sign Up</button>
            </form>
            <p className="text-center mt-3">
                Already have an account? 
                <a
                    className="link link-secondary"
                    onClick={formChangeHandler}
                >
                    Sign In!
                </a>
            </p>
        </motion.div>
    )
}

export default RegisterForm
