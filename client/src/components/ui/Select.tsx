// src/components/ui/Select.tsx
import type { SelectHTMLAttributes } from 'react'

type Option = {
    label: string
    value: string
}

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string
    options: Option[]
    error?: string
};

function Select({label, options, error, className = "", ...props}: Props) {
    return (
        <div className="w-full mb-5">
            {label && (
                <label htmlFor={props.id} className="block mb-1 text-sm font-medium">
                    {label}
                </label>
            )}
            <select
                {...props}
                className={`select w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 ${className}`}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-red-500 text-sm mt-1">&bull; {error}</p>
            )}
        </div>
    )
}

export default Select
