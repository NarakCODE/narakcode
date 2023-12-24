'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

const MotionLink = motion(Link);

const Logo = () => {
	return (
		<div className="flex items-center justify-between mt-2 border-white border-2 rounded-full">
			<MotionLink
				href={'/'}
				className="w-16 h-16 dark:bg-white bg-black text-white dark:text-black flex hover:text-white items-center justify-center rounded-full text-2xl font-bold"
				whileHover={{
					backgroundColor: [
						'#121212',
						'rgba(131,58,180,1)',
						'rgba(253,29,29,1)',
						'rgba(252,176,69,1)',
						'rgba(131,58,180,1)',
						'#121212',
					],
					color: 'white',
					transition: { duration: 1, repeat: Infinity },
				}}
			>
				NC
			</MotionLink>
		</div>
	);
};

export default Logo;
