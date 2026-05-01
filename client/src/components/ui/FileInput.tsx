import { useRef } from 'react'
import Button from '../ui/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'

type Props = {
    label?: string
    onChange: (file: File | null) => void
    preview?: string | null
}

function FileInput({label = 'Upload file', onChange, preview}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleClick = () => {
        inputRef.current?.click()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        onChange(file)
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 rounded-full overflow-hidden border border-base-300 bg-base-100">
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                        📁
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />

            {/* BUTTON */}
            <Button
                onClick={handleClick}
            >
                <FontAwesomeIcon icon={faCloudArrowUp} />
                {label}
            </Button>
        </div>
    )
}

export default FileInput