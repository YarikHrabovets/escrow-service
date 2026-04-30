import { AnimatePresence, motion } from 'framer-motion'
import { formVariants, transition } from '../../animations/formVariants'

type Props = {
    title: string,
    children: React.ReactNode,
    isOpen: boolean,
    setIsOpen: (v: boolean) => void,
    modalHandler: (e: React.FormEvent<HTMLFormElement>) => void
}

function ModalBase({title, children, isOpen, setIsOpen, modalHandler}: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className='overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full bg-black/50'>
                    <motion.div
                        variants={formVariants}
                        initial='initial'
                        animate='animate'
                        transition={transition}
                    >
                        <div className='relative mx-auto p-4 max-w-7xl my-auto'>
                            <div className='bg-base-200 border border-base-300 p-7 rounded-lg shadow-sm'>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">{title}</h2>
                                    <button
                                        className="btn btn-sm btn-ghost"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <form onSubmit={modalHandler}>
                                    {children}
                                    <div className="flex flex-col gap-3 mt-3">
                                        <button
                                            type="submit"
                                            className="btn btn-outline btn-primary btn-block"
                                        >
                                            Save changes
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-block"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default ModalBase