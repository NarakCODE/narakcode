import ProjectImage1 from '../asset/project-images/project1.png';
import ProjectImage2 from '../asset/project-images/project2.png';
import ProjectImage3 from '../asset/project-images/project3.png';

export const projects = [
	{
		name: 'KBSFans Clone',
		desc: 'An Ecommerce store using Nextjs, Tailwindcss, and Sanity for content management.',
		date: 'Oct 7 2023',
		imgUrl: ProjectImage1,
		href: 'https://kbdfans-clone-deploy.vercel.app/',
	},
	{
		name: 'Rukuten Clone',
		desc: 'Simple Movie app using Nextjs, Tailwindcss, and OMDB movie api and beautiful ui design.',
		date: 'Oct 7 2023',
		imgUrl: ProjectImage2,
		href: '/',
	},
	{
		name: 'Keystore Landing Page',
		desc: 'A static landing page with beautiful ui design',
		date: 'Oct 7 2023',
		imgUrl: ProjectImage3,
		href: 'https://keystore-deploy.vercel.app/',
	},
];

import CssLogo from '@/asset/css-svgrepo-com.svg';
import FramerLogo from '@/asset/framer-svgrepo-com.svg';
import GithubLogo from '@/asset/github.png';
import HtmlLogo from '@/asset/html-5.svg';
import JsLogo from '@/asset/javascript-svgrepo-com.svg';
import MongoLogo from '@/asset/mongo-svgrepo-com.svg';
import NextLogo from '@/asset/nextjs.png';
import NodeLogo from '@/asset/nodejs-svgrepo-com.svg';
import ReactLogo from '@/asset/react-svgrepo-com.svg';
import TailwindLogo from '@/asset/tailwind-svgrepo-com.svg';
import TsLogo from '@/asset/typescript-svgrepo-com.svg';
import MysqlLogo from '@/asset/mysql-logo.png'

export const aboutMeData = {
	desc: "Hi, I'm Channarak Lu, a college student at RUPP Bachelor's degree in Computer Science. With a strong passion for technology, software, and programming languages, I am constantly seeking to expand my knowledge and skills in these areas. I'm also interested in researching and coding. Thank you for visiting my portfolio, and I look forward to sharing my work with you.",
	education: [
		'Completed coursework in Web Development and Design, acquiring a solid foundation in front-end technologies and design principles.',
		'Engaged in self-paced learning through online resources, continually exploring emerging trends and technologies in the web development sphere.',
	],
	project: [
		{
			title:
				'E-commerce Platform (Sanity, Framer Motion, Next.js, Tailwind CSS)',
			desc: 'Developed an intuitive e-commerce platform leveraging the power of Framer Motion for seamless animations, Next.js for server-side rendering, and Tailwind CSS for streamlined styling. Integrated Sanity as the backend framework to manage product data, ensuring a fluid and dynamic user experience.',
		},
		{
			title: 'Blog Website (MongoDB, Node.js, Tailwind CSS, Shadcn)',
			desc: 'Created a nice blog site where people can read articles by using MongoDB and Node.js for backend operations. Implemented Tailwind CSS for efficient styling and Shadcn for sleek shadow effects, providing a visually ',
		},
		{
			title: 'Full Stack CRUD Todo App (React, MongoDB, Node.js, Tailwind CSS)',
			desc: 'Designed a task management application with React, incorporating MongoDB and Node.js for database management. Employed Tailwind CSS for rapid UI development, ensuring a clean and modern interface for efficient task handling.',
		},
		{
			title: 'Interactive Portfolio (Framer Motion, Next.js, Tailwind CSS)',
			desc: 'Made a website to show my work using Fun Moves to make things move around. It loads fast thanks to Quick Loading. I used Next.js and Tailwind CSS to make it look cool and work well.',
		},
	],
};

export const skills = [
	HtmlLogo,
	CssLogo,
	JsLogo,
	MongoLogo,
	NodeLogo,
	ReactLogo,
	TailwindLogo,
	TsLogo,
	NextLogo,
	GithubLogo,
	FramerLogo,
	MysqlLogo
];

import BoseQuietImage from '../asset/gear-images/bose-quiet-35.webp';
import DraconicK350 from '../asset/gear-images/draconic-k530.jpg';
import HpOmen16 from '../asset/gear-images/hp-omen-16.jpg';
import Iphone13 from '../asset/gear-images/iphone-13-pro-max.jpg';
import Logitech from '../asset/gear-images/logitech-g304.webp';
import ZsnProX from '../asset/gear-images/zsn-pro-x.jpg';

export const gearData = [
	{
		name: 'HP Omen 16 2022',
		imgUrl: HpOmen16,
		href: 'https://youtu.be/2C1jCqQJ0pI?si=ypxP63IfQcCLDJ5C',
		category: 'laptop',
	},
	{
		name: 'iPhone 13 Pro Max',
		imgUrl: Iphone13,
		href: 'https://youtu.be/l11zDap019Q?si=n3U8stA7ZDOsRXOr',
		category: 'mobile',
	},
	{
		name: 'Bose QuitComfort 35',
		imgUrl: BoseQuietImage,
		href: 'https://youtu.be/DAxj9CjczXw?si=yPidKPuDbPIBklnR',
		category: 'earphone',
	},
	{
		name: 'KZ ZSN Pro X',
		imgUrl: ZsnProX,
		href: 'https://youtu.be/g14YF4p2li4?si=lvt5p0PDmfB-O840',
		category: 'earphone',
	},
	{
		name: 'Logitech G304',
		imgUrl: Logitech,
		href: 'https://youtube.com/shorts/R0aJo-KdGlo?si=v1meLyKsR9wZ_Rv5',
		category: 'mouse',
	},
	{
		name: 'Redragon Draconic K530 60% Wireless Keyboard',
		imgUrl: DraconicK350,
		href: 'https://youtu.be/KwO8jD-lsQM?si=qWRBKrXIbqdm1aVj',
		category: 'keyboard',
	},
];
