'use client';

import { motion, useScroll } from 'framer-motion';

import React, { useRef } from 'react';

export const AnimateYScroll = ({ children, className }) => {
	const ref = useRef(null);

	const { scrollYProgress } = useScroll({
		target: '',
		offset: ['0 1', '1.33 1'],
	});

	return (
		<motion.div
			ref={ref}
			style={{
				scale: scrollYProgress,
				opacity: scrollYProgress,
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
};
