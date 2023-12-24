'use client';

import { motion, useScroll } from 'framer-motion';
import React, { useRef } from 'react';
import styles from './style.module.css';

const Card = ({ name, desc, imgUrl, date, href }) => {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start end', 'start start'],
	});

	return (
		// cardContainer
		<motion.div ref={container} className={styles.cardContainer}>
			<img
				src={imgUrl}
				className="w-full h-full object-cover object-center"
				alt=""
			/>
			<div className={styles.card}>
				{/* content */}
				<div className="absolute  bottom-0 left-0 px-8 pb-8 py-20 bg-gradient-to-t from-black w-full">
					<div className="max-w-md text-white">
						<h4 className="font-bold text-xl md:text-2xl ">{name}</h4>
						<p className="text-sm md:text-md ">{desc}</p>
						<h4 className="dark:text-[#93ff7a] font-semibold text-md mt-2">
							{date}
						</h4>
					</div>
				</div>
			</div>
		</motion.div>
	);
};
export default Card;
