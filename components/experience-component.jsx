import FramerLogo from '@/asset/Framer-Motion-Icon.webp';
import NextLogo from '@/asset/NextJS-Icon.webp';
import CssLogo from '@/asset/css-svgrepo-com.svg';
import HtmlLogo from '@/asset/html-5.svg';
import JsLogo from '@/asset/javascript-svgrepo-com.svg';
import MongoLogo from '@/asset/mongo-svgrepo-com.svg';
import NodeLogo from '@/asset/nodejs-svgrepo-com.svg';
import ReactLogo from '@/asset/react-svgrepo-com.svg';
import TailwindLogo from '@/asset/tailwind-svgrepo-com.svg';
import TsLogo from '@/asset/typescript-svgrepo-com.svg';
import GithubLogo from '@/asset/white-git.webp';
import { Reveal } from '@/common/Reveal';
import {
	AnimatePresence,
	motion,
	useAnimation,
	useInView,
} from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import ExperienceCard from './experienceCard-component';

const exp = [
	{ name: 'HTML', logo: HtmlLogo },
	{ name: 'CSS', logo: CssLogo },
	{ name: 'JavaScript', logo: JsLogo },
	{ name: 'TypeScript', logo: TsLogo },
	{ name: 'React.Js', logo: ReactLogo },
	{ name: 'Tailwind', logo: TailwindLogo },
	{ name: 'Node.Js', logo: NodeLogo },
	{ name: 'MongoDB', logo: MongoLogo },
	{ name: 'Framer Motion', logo: FramerLogo },
	{ name: 'Github', logo: GithubLogo },
	{ name: 'Next.Js', logo: NextLogo },
];

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

const Experience = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });
	const mainControls = useAnimation();

	useEffect(() => {
		if (isInView) {
			mainControls.start('open');
		}
	}, [isInView]);

	return (
		<div className="mt-20">
			{/* Title */}
			<Reveal className={'max-w-xl my-10'}>
				<h1 className="text-2xl font-bold">Experience</h1>
				<p className="text-gray-500 text-sm mt-2">
					{
						"I'm a skilled software developer with experience in TypeScript and JavaScript, and expertise in frameworks like React.js, Next.js, and Express.js. I'm a quick learner to create efficient, scalable, and user-friendly solutions that solve real-world problems. I'm happy to share my skills with you!"
					}
				</p>
			</Reveal>

			{/* Card */}
			<div ref={ref} className="grid md:grid-cols-4 grid-cols-2 gap-6">
				<AnimatePresence>
					{exp.map((item, index) => (
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
							<ExperienceCard item={item} />
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Experience;
