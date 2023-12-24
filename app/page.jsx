'use client';

import profileImage from '@/asset/profile.png';
import AnimatedText from '@/common/AnimatedText';
import AnimatedTextWrite from '@/common/AnimatedTextWrite';
import { ParallaxText } from '@/common/ParallaxText';
import Experience from '@/components/experience-component';
import HeadGradientBackground from '@/components/head-gradient-bg';
import Project from '@/components/project-component';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const variants = {
	initial: {
		scale: 0.3,
		opacity: 0,
	},
	animate: {
		scale: 0.9,
		opacity: 1,
		transition: {
			duration: 0.8,
			delay: 0.5,
			ease: [0, 0.71, 0.2, 1.01],
		},
	},
	exit: {
		scale: 0.3,
		opacity: 0,
	},
};

const HomePage = () => {
	return (
		<>
			<HeadGradientBackground
				firstColor={'from-green-700'}
				secondColor={'to-green-500'}
			/>
			<div className="w-full min-h-[100%] flex justify-center flex-col">
				<AnimatedText>
					<div className=" flex flex-col lg:flex-row-reverse items-center lg:gap-0 gap-8 justify-between mt-24">
						<div className="relative border-2 border-[#93ff7a] rounded-full">
							<motion.div
								className="w-[200px] h-[200px] md:w-[300px] md:h-[300px]  rounded-full overflow-hidden my-shadow bg-[#93ff7a]"
								variants={variants}
								initial="initial"
								animate="animate"
								exit="exit"
							>
								<Image
									src={profileImage}
									alt="NarakCODE"
									className="w-full h-auto object-cover object-center"
								/>
							</motion.div>

							<span className="absolute md:text-6xl text-3xl -left-2 md:-bottom-4 bottom-10">
								🦄
							</span>
							<span className="absolute md:text-5xl text-3xl md:top-28 top-10 -left-4">
								🎮
							</span>
							<span className="absolute md:text-6xl text-3xl top-6 -right-4">
								💻
							</span>
							<span className="absolute md:text-6xl text-3xl bottom-6 -right-6">
								🎨
							</span>
						</div>

						<div className="max-w-xl lg:text-start text-center">
							<AnimatedTextWrite
								fText={'Coding'}
								sText={'Gaming'}
								tText={'Designing'}
							/>
							<h1 className={'archivo font-bold lg:text-6xl text-4xl '}>
								Web Developer
								<br />
								<span className={`text-[#93ff7a]`}>&</span> Web Designer
							</h1>

							<p className="mt-4 text-sm md:text-md">
								{
									"Hi, I'm Channarak Lu, a web developer living in Phnom Penh, Cambodia. I develop software interfaces and web applications."
								}
							</p>
						</div>
					</div>
					<section className="md:mt-32 mt-14">
						<ParallaxText baseVelocity={-5}>Web Developer</ParallaxText>
						<ParallaxText baseVelocity={5}>Web Designer</ParallaxText>
					</section>
				</AnimatedText>

				<Project />
				<Experience />
			</div>
		</>
	);
};

export default HomePage;
