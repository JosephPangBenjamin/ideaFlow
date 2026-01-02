import { Variants } from "framer-motion";

// Apple-style spring physics
export const spring = {
    type: "spring",
    stiffness: 400,
    damping: 30,
} as const;

export const softSpring = {
    type: "spring",
    stiffness: 300,
    damping: 30,
};

// Micro-interactions
export const tapAnimation = {
    scale: 0.95,
    transition: spring,
} as const;

export const hoverAnimation = {
    scale: 1.05,
    transition: spring,
} as const;

// Staggered Entrance
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: spring
    },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
        opacity: 1,
        scale: 1,
        transition: spring
    },
};
