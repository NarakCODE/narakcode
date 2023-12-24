'use client';

import AnimationText from '@/common/AnimatedText';
import Card from '@/components/card-component';
import HeadGradientBackground from '@/components/head-gradient-bg';
import PageTitle from '@/components/pageTitle-component';
import { projects } from '@/lib/data';
import Lenis from '@studio-freight/lenis';
import { useScroll } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import styles from './style.module.css';

const ProjectPage = () => {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	useEffect(() => {
		const lenis = new Lenis();

		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);
	});

	return (
		<>
			<HeadGradientBackground
				firstColor={'from-blue-700'}
				secondColor={'to-blue-500'}
			/>
			<AnimationText className="my-40">
				<PageTitle
					title={'Lastest Projects'}
					desc={
						'Following projects showcases my skills and experience through real-world examples of my work. Each project is briefly described with links to code repositories and live demos in it. It reflects my ability to solve complex problems, work with different technologies, and manage projects effectively.'
					}
				/>

				{/* main */}
				<main ref={container} className={styles.main}>
					<div className="flex flex-col gap-2">
						{projects.map((project, i) => {
							const targetScale = 1 - (projects.length - i) * 0.05;
							return (
								<Card
									key={`p_${i}`}
									i={i}
									{...project}
									progress={scrollYProgress}
									range={[i * 0.25, 1]}
									targetScale={targetScale}
								/>
							);
						})}
					</div>
				</main>
			</AnimationText>
		</>
	);
};

export default ProjectPage;
