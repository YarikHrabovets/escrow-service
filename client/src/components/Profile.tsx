import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useAppContext } from '../main'
import { logout } from '../api/authAPI'
import DefaultAvatar from '../assets/default_avatar.png'
import EditProfileModal from './modals/EditProfileModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'


function Profile() {
    const { user } = useAppContext()
    const [isOpen, setIsOpen] = useState(false)

    const logoutHandler = async () => {
        try {
            await logout()
        } catch (e) {
            console.log(e)
        } finally {
            user.logout()
        }
    }

    return (
        <>
            <div className="bg-zinc-900 border border-zinc-700 p-7 rounded-xl shadow-sm flex justify-between items-center flex-col gap-5 mb-5">
                <div>
                    <div className="border border-neutral-700 h-32 w-32 rounded-full overflow-hidden mx-auto">
                        <img className="w-full h-full object-cover" src={user.user?.avatar_url || DefaultAvatar} alt="User Avatar" />
                    </div>
                    <p className="text-center">{user.user?.full_name || user.user?.email}</p>
                </div>
                <div>
                    <button className="btn btn-outline btn-primary mb-2 w-full" onClick={() => setIsOpen(true)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                        Edit Profile
                    </button>
                    <button className="btn btn-outline btn-warning w-full" onClick={logoutHandler}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        Log Out
                    </button>
                </div>
            </div>
            <EditProfileModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    )
}

export default observer(Profile)