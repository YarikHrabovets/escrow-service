import { useState } from 'react'
import { motion } from 'framer-motion'
import { formVariants, transition } from '../../animations/formVariants'
import SubmitButton from '../ui/SubmitButton'
import Input from '../ui/Input'
import Select from '../ui/Select'

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
                    label="Username:"
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    placeholder="Enter your username..."
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <Input
                    label="Full Name:"
                    id="fullname"
                    name="fullname"
                    type="text"
                    value={fullname}
                    placeholder="Enter your full name..."
                    onChange={e => setFullName(e.target.value)}
                    required
                />
                <Select
                    id="role"
                    name="role"
                    label="Select who are you:"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    options={[
                        { value: "client", label: "Client" },
                        { value: "freelancer", label: "Freelancer" },
                    ]}
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
                <SubmitButton>Sign Up</SubmitButton>
            </form>
            <p className="text-center mt-3">
                Already have an account?&nbsp;
                <a
                    className="link link-info"
                    onClick={formChangeHandler}
                >
                    Sign In!
                </a>
            </p>
        </motion.div>
    )
}

export default RegisterForm
