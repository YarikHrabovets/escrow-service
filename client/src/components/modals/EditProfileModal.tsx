import ModalBase from './ModalBase'
import DefaultAvatar from '../../assets/default_avatar.png'
import Input from '../ui/Input'
import FileInput from '../ui/FileInput'

type Props = {
    isOpen: boolean,
    setIsOpen: (v: boolean) => void
}

function EditProfileModal({isOpen, setIsOpen}: Props) {
    const saveHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <ModalBase title="Edit Profile" isOpen={isOpen} setIsOpen={setIsOpen} modalHandler={saveHandler}>
            <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-base-300">
                    <img
                        src={DefaultAvatar}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <div className="space-y-3">
                fields
            </div>
        </ModalBase>
    )
}

export default EditProfileModal