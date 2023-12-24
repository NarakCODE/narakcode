'use client';
import { motion, useAnimation, useInView } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

export const Reveal = ({ children, className }) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	const mainControls = useAnimation();

	useEffect(() => {
		if (isInView) {
			mainControls.start('visible');
		}
	}, [isInView]);

	return (
		<div ref={ref} className={`relative w-fit overflow-hidden ${className}`}>
			<motion.div
				variants={{
					hidden: { opacity: 0, y: 75 },
					visible: { opacity: 1, y: 0 },
				}}
				initial="hidden"
				animate={mainControls}
				whileInView={mainControls}
				viewport={{
					once: true,
				}}
				transition={{ duration: 0.5, delay: 0.55 }}
				
			>
				{children}
			</motion.div>
		</div>
	);
};
