import { Reveal } from '@/common/Reveal';
import { projects } from '@/lib/data';
import Link from 'next/link';
import React from 'react';

const Project = () => {
	return (
		<div className="mt-20">
			{/* Title */}
			<Reveal className={'max-w-xl my-10'}>
				<h1 className="text-2xl font-bold">Projects</h1>
				<p className="text-gray-500 text-sm mt-2">
					Following projects showcases my skills and experience through
					real-world examples of my work. Each project is briefly described with
					links to code repositories and live demos in it. It reflects my
					ability to solve complex problems, work with different technologies,
					and manage projects effectively.
				</p>
			</Reveal>

			<div className="grid md:grid-cols-2 gap-6 ">
				{projects.map((item, index) => (
					<Reveal key={index}>
						<Link href={item.href} className="group">
							<div className="relative overflow-hidden aspect-square rounded-xl">
								<img
									src={item.imgUrl}
									alt=""
									className="object-center object-cover h-full group-hover:scale-105 duration-300"
								/>

								<div className="absolute right-0 left-0 bottom-0 top-0 bg-black/50 text-white flex items-center justify-center">
									<span>
										<p className="text-sm">Coming Soon</p>
									</span>
								</div>
							</div>

							<div className="flex flex-col gap-1 py-4">
								<h2 className="text-sm md:text-md font-semibold">
									{item.name}
								</h2>
								<p className="text-sm text-gray-500">{item.desc}</p>
								<p className="dark:text-[#93ff7a] text-sm text-black">
									{item.date}
								</p>
							</div>
						</Link>
					</Reveal>
				))}
			</div>
		</div>
	);
};

export default Project;
