'use client';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

const AnimatedText = ({
	children,
	className,
	initial = { y: 40, opacity: 0 },
	animate = { y: 0, opacity: 1 },
	exit = { y: 40, opacity: 0 },
	transition = {
		duration: 0.5,
		delay: 0.25,
		ease: [0.22, 1, 0.36, 1],
	},
}) => {
	return (
		<AnimatePresence>
			<motion.div
				className={className}
				initial={initial}
				animate={animate}
				exit={exit}
				transition={transition}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};

export default AnimatedText;
