import { Reveal } from '@/common/Reveal';
import React from 'react';

const MainExpertise = () => {
	return (
		<Reveal className={'mt-20 w-full'}>
			<section className="grid md:grid-cols-2 grid-cols-1 gap-4 ">
				<div className="dark:bg-[#111] bg-white p-8 rounded-2xl border flex flex-col gap-2 md:items-center items-start">
					<h1 className="font-bold text-4xl">50+</h1>
					<p className="text-card-foreground">Design projects</p>
				</div>

				<div className="dark:bg-[#111] bg-white p-8 rounded-2xl border flex flex-col gap-2 md:items-center items-start">
					<h1 className="font-bold text-4xl">01+</h1>
					<p className="text-card-foreground">Years of experience</p>
				</div>
			</section>
		</Reveal>
	);
};

export default MainExpertise;
