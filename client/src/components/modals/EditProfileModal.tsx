import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useAppContext } from '../../main'
import ModalBase from './ModalBase'
import DefaultAvatar from '../../assets/default_avatar.png'
import Input from '../ui/Input'
import FileInput from '../ui/FileInput'
import { updateProfile } from '../../api/userAPI'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../utils/error'

type Props = {
    isOpen: boolean,
    setIsOpen: (v: boolean) => void
}

function EditProfileModal({isOpen, setIsOpen}: Props) {
    const { user } = useAppContext()

    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [username, setUsername] = useState<string>('')
    const [fullname, setFullname] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (!user.user) return

        setPreview(user.user?.avatar_url || DefaultAvatar)
        setUsername(user.user?.username || '')
        setFullname(user.user?.full_name || '')
    }, [user.user])

    const handleFile = (file: File | null) => {
        setFile(file)

        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    const saveHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()
        if (file) formData.append("avatar", file as Blob)
        formData.append("username", username)
        formData.append("full_name", fullname)

        try {
            const data = await updateProfile(formData)
            user.setUser(data)
            setIsOpen(false)
            toast.success("Profile was successfuly updated!")
        } catch (e) {
            toast.error(getErrorMessage(e))
        } finally {
            setLoading(false)
        }

    }

    return (
        <ModalBase title="Edit Profile" isOpen={isOpen} setIsOpen={setIsOpen} modalHandler={saveHandler} loading={loading}>
            <div className="space-y-3">
                <FileInput
                    label="Change avatar"
                    preview={preview}
                    onChange={handleFile}
                />
                <Input
                    label="Username:"
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    placeholder="Enter your new username..."
                    onChange={e => setUsername(e.target.value)}
                />
                <Input
                    label="Full Name:"
                    id="fullname"
                    name="fullname"
                    type="text"
                    value={fullname}
                    placeholder="Enter your new full name..."
                    onChange={e => setFullname(e.target.value)}
                />
            </div>
        </ModalBase>
    )
}

export default observer(EditProfileModal)