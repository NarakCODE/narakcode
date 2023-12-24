'use client';

import { motion } from 'framer-motion';
import React from 'react';

const PageTitle = ({ className, title, desc }) => {
	return (
		<div
			className={
				className +
				'w-full max-w-xl flex flex-col gap-2 md:text-start text-center'
			}
		>
			<motion.h1
				initial={{ opacity: 0, x: -10 }}
				animate={{
					opacity: 1,
					x: 0,
					transition: { delay: 0.5, ease: [0.37, 0, 0.63, 1] },
				}}
				transition={{ duration: 0.3 }}
				className="archivo text-4xl md:text-5xl font-bold"
			>
				{title}
			</motion.h1>
			<motion.p
				initial={{ opacity: 0, x: -10 }}
				animate={{
					opacity: 1,
					x: 0,
					transition: { delay: 0.7, ease: [0.37, 0, 0.63, 1] },
				}}
				transition={{ duration: 0.3 }}
				className="dark:text-gray-200 text-sm md:text-md"
			>
				{desc}
			</motion.p>
		</div>
	);
};

export default PageTitle;
