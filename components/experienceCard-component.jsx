'use client';

import { Reveal } from '@/common/Reveal';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const ExperienceCard = ({ item }) => {
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const mouseXSpring = useSpring(x);
	const mouseYSpring = useSpring(y);

	const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['25deg', '-25deg']);

	const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-25deg', '25deg']);

	const handleMouseMove = (e) => {
		const rect = e.target.getBoundingClientRect();

		const width = rect.width;
		const height = rect.height;

		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const xPct = mouseX / width - 0.5;
		const yPct = mouseY / height - 0.5;

		x.set(yPct);
		y.set(xPct);
	};

	const handleMouseLeave = () => {
		x.set(0);
		y.set(0);
	};

	return (
		<div
			className={'rounded-xl w-full shadow-[inset_-12px_-8px_40px_#46464620] '}
		>
			<motion.div
				style={{ rotateX, rotateY }}
				className="flex flex-col gap-2 items-center p-4 
				 rounded-xl border-2 border-secondary bg-card duration-300 cursor-pointer "
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				<Image
					src={item.logo}
					alt={item.name}
					width={80}
					height={80}
					className="rounded-lg"
				/>
				<h1 className="text-sm  md:text-md font-bold">{item.name}</h1>
			</motion.div>
		</div>
	);
};

export default ExperienceCard;
