'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

const variants = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
		transition: {
			type: 'spring',
		},
	},
	exit: {
		opacity: 0,
	},
};

const GearCard = ({ data }) => {
	const { name, href, imgUrl } = data;

	return (
		<motion.div
			variants={variants}
			initial="initial"
			animate="animate"
			exit="exit"
			className="dark:bg-[#191919] bg-white rounded-2xl md:p-4 p-2"
		>
			{/* IMAGE */}
			<div className="rounded-xl overflow-hidden aspect-video group">
				<img
					src={imgUrl}
					alt="Gear image"
					className="object-cover object-center w-full h-full group-hover:scale-105 duration-500 ease-in-out"
				/>
			</div>

			{/* INFO */}
			<div className="flex md:flex-row flex-col gap-4 items-center justify-between pt-4">
				<h2 className="text-sm md:text-md font-medium">{name}</h2>
				<Link
					href={href}
					target="_blank"
					className="dark:bg-[#222] md:w-fit w-full text-center px-4 py-2 rounded-full hover:bg-[#85e66f] hover:text-black border duration-300"
				>
					Watch
				</Link>
			</div>
		</motion.div>
	);
};

export default GearCard;
