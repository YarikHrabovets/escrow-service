import type { TextareaHTMLAttributes } from 'react'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string
    error?: string
}

function TextArea({ label, error, className = '', ...props }: Props) {
    return (
        <div className="w-full mb-5">
            {label && (
                <label htmlFor={props.id} className="block mb-1 text-sm font-medium">
                    {label}
                </label>
            )}

            <textarea
                {...props}
                className={`input w-full min-h-32 p-3 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 ${className}`}
            />

            {error && (
                <p className="text-red-500 text-sm mt-1">&bull; {error}</p>
            )}
        </div>
    )
}

export default TextArea