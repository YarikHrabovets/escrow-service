import type { Variants, Transition } from 'framer-motion'

export const formVariants: Variants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
}

export const transition: Transition = {
    duration: 0.5,
    ease: 'easeInOut',
}