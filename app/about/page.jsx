'use client';

import bgImage1 from '@/asset/bg-image-1.webp';
import FileIcon from '@/asset/folder.png';
import EducationIcon from '@/asset/mortarboard.png';
import MyPhoto from '@/asset/my-photo.png';
import SkillIcon from '@/asset/skill.png';
import AnimatedText from '@/common/AnimatedText';
import { Reveal } from '@/common/Reveal';
import HeadGradientBackground from '@/components/head-gradient-bg';
import PageTitle from '@/components/pageTitle-component';
import { aboutMeData, skills } from '@/lib/data';
import {
	AnimatePresence,
	motion,
	useAnimation,
	useInView,
} from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

const variants = {
	initial: {
		opacity: 0,
		y: 20,
	},
	open: (index) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			delay: 0.3 + index * 0.1,
			ease: [0.76, 0, 0.24, 1],
		},
	}),
	exit: {
		opacity: 0,
		y: 20,
	},
};

const AboutPage = () => {
	const { desc, education, project } = aboutMeData;
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	const mainControls = useAnimation();

	useEffect(() => {
		if (isInView) {
			mainControls.start('open');
		}
	}, [isInView]);

	return (
		<>
			<HeadGradientBackground
				firstColor={'from-red-700'}
				secondColor={'to-red-500'}
			/>

			<AnimatedText>
				{/* Image */}
				<section className="relative mt-24 rounded-3xl overflow-hidden shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
					<Image
						src={bgImage1}
						alt="Background Image"
						height={1080}
						width={1920}
						className="md:h-[600px] h-[600px] w-full"
					/>

					<div className="absolute z-10 bottom-0 p-10 md:p-14 flex flex-col items-center md:items-start">
						<div className="p-2 rounded-full border-2 border-white w-28 h-28">
							<Image
								src={MyPhoto}
								alt="My profile"
								className="rounded-full w-full h-full object-cover object-center"
							/>
						</div>

						<PageTitle
							className={'text-white mt-4 md:text-start text-center'}
							title={'About me!'}
							desc={desc}
						/>
					</div>
				</section>

				{/* Details */}
				<section className="grid grid-cols-1 md:grid-cols-2 grid-rows-1 gap-6 mt-10">
					<Reveal
						className={
							'w-full md:col-span-2 dark:bg-[#111] bg-white rounded-3xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'
						}
					>
						<div className="h-full p-6  text-foreground ">
							<div className="w-fit rounded-full px-4 py-2 bg-[#65B741] flex items-center gap-2 ">
								<h2 className="font-semibold text-white">Projects</h2>
								<Image src={FileIcon} alt="Icon" width={26} height={26} />
							</div>
							<div className="mt-8 flex flex-col gap-4">
								{project.map((p, index) => (
									<span key={index}>
										<p>{p.title}</p>
										<li className="text-muted-foreground mt-2 text-sm">
											{p.desc}
										</li>
									</span>
								))}
							</div>
						</div>
					</Reveal>

					<Reveal
						className={
							'w-full dark:bg-[#111] bg-white rounded-3xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'
						}
					>
						<div className="  h-full p-6 rounded-3xl text-foreground ">
							<div className="w-fit rounded-full px-4 py-2 bg-[#B15EFF] flex items-center gap-2">
								<h2 className="font-semibold text-white">Educations</h2>
								<Image src={EducationIcon} alt="Icon" width={26} height={26} />
							</div>
							<p className="text-muted-foreground mt-8">{education}</p>
						</div>
					</Reveal>

					<Reveal
						className={
							'w-full dark:bg-[#111] bg-white rounded-3xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'
						}
					>
						<div ref={ref} className=" h-full p-6 rounded-3xl text-foreground ">
							<div className="w-fit rounded-full px-4 py-2 bg-[#3887BE] flex items-center gap-2">
								<h2 className="font-semibold text-white">
									Skills & Experiences
								</h2>
								<Image src={SkillIcon} alt="Icon" width={26} height={26} />
							</div>

							<p className="text-muted-foreground mt-8">
								Over the year of front-end and back-end development experience.
							</p>
							<div className="mt-4 flex flex-wrap gap-2">
								<AnimatePresence>
									{skills.map((s, index) => (
										<motion.div
											key={index}
											custom={index}
											variants={variants}
											animate={mainControls}
											exit="exit"
											initial="initial"
											viewport={{
												once: true,
											}}
											transition={{ duration: 0.5, delay: 0.55 }}
										>
											<Image src={s} alt="Icon" width={40} height={40} />
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						</div>
					</Reveal>
				</section>
			</AnimatedText>
		</>
	);
};

export default AboutPage;
