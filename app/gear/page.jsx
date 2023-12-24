'use client';

import NotFoundPage from '@/asset/404.webp';
import AnimatedText from '@/common/AnimatedText';
import GearCard from '@/components/gearCard-component';
import HeadGradientBackground from '@/components/head-gradient-bg';
import PageTitle from '@/components/pageTitle-component';
import { gearData } from '@/lib/data';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';

const tabs = [
	{ id: 'all', label: 'All' },
	{ id: 'laptop', label: 'Laptop' },
	{ id: 'keyboard', label: 'Keyboard' },
	{ id: 'earphone', label: 'Earphone' },
	{ id: 'mouse', label: 'Mouse' },
	{ id: 'mobile', label: 'Mobile' },
];

const ArticlePage = () => {
	let [activeTab, setActiveTab] = useState(tabs[0].id);
	const [current, setCurrent] = useState('all');

	return (
		<>
			<HeadGradientBackground
				firstColor={'from-violet-700'}
				secondColor={'to-purple-500'}
			/>

			<section className="mt-40">
				<PageTitle
					title="My Gear"
					desc="This is gear I actually own and recommend. The affiliate links come at no extra cost, but it does however help support my content creation."
				/>

				{/* TAB */}
				<AnimatedText>
					<div>
						<div className="mt-10 flex space-x-1">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => {
										setActiveTab(tab.id);
										setCurrent(tab.id);
									}}
									className={`${
										activeTab === tab.id
											? 'text-black font-semibold'
											: 'hover:opacity-80 dark:text-white'
									} relative rounded-full px-3 py-1.5 text-sm font-medium  outline-2 focus-visible:outline duration-300`}
								>
									{activeTab === tab.id && (
										<motion.div
											layoutId="active-pill"
											className="absolute inset-0 bg-[#93ff7a] rounded-full"
											transition={{ type: 'spring', duration: 0.5 }}
										/>
									)}
									<span className="relative z-10">{tab.label}</span>
								</button>
							))}
						</div>
					</div>

					<div className="mt-20 grid grid-cols-2 md:gap-6 gap-4">
						{/* {gearData.map((gear, index) => {
							const activeCat = gear.category === current
							return <GearCard key={index} data={gear} activeCat={activeCat}/>;
						})} */}
						{current === 'all'
							? gearData.map((gear, index) => (
									<GearCard key={index} data={gear} />
							  ))
							: gearData
									.filter((gear) => gear.category === current)
									.map((filteredGear, index) => (
										<GearCard key={index} data={filteredGear} />
									))}
					</div>
				</AnimatedText>
			</section>
		</>
	);
};

export default ArticlePage;
