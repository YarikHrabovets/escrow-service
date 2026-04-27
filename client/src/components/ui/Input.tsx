import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    error?: string
}

function Input({ label, error, className = '', type, ...props }: Props) {
    const [toggle, setToggle] = useState(false)
    const isPassword = type === 'password'

    return (
        <div className="w-full mb-5">
            {label && (
                <label htmlFor={props.id} className="block mb-1 text-sm font-medium">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    {...props}
                    type={isPassword && toggle ? 'text' : type}
                    className={`input w-full pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 ${className}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => setToggle(prev => !prev)}
                    >
                        <FontAwesomeIcon icon={toggle ? faEyeSlash : faEye} />
                    </button>
                )}
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-1">&bull; {error}</p>
            )}
        </div>
    )
}

export default Input
