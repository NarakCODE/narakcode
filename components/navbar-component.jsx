'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { Sling as Hamburger } from 'hamburger-react';
import {
	Facebook,
	GanttChartSquare,
	Github,
	Home,
	Instagram,
	Keyboard,
	Moon,
	Sun,
	UserRound,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { FaTiktok } from 'react-icons/fa';
import Logo from './logo-component';

const variant = {
	open: {
		width: 'auto',
		height: 'auto',
		top: 60,
		left: -10,
		transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
	},
	closed: {
		width: 0,
		height: 0,
		top: 20,
		left: 20,
	},
};

const perspective = {
	initial: {
		opacity: 0,
		x: -30,
	},
	open: (i) => ({
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.2,
			delay: 0.3 + i * 0.1,
			ease: [0.76, 0, 0.24, 1],
		},
	}),
	exit: {
		opacity: 0,
		x: -30,
	},
};

const CustomLink = ({ href, title, className = '' }) => {
	const pathname = usePathname();

	return (
		<Link href={href} className={`${className} relative group`}>
			{title}

			<span
				className={`h-[2px] inline-block bg-black dark:bg-white absolute left-0 -bottom-0.5 group-hover:w-full transition-all ease duration-300 ${
					pathname === href ? 'w-full' : 'w-0'
				}`}
			>
				&nbsp;
			</span>
		</Link>
	);
};

const Navbar = () => {
	const { setTheme } = useTheme();
	const [isActive, setIsActive] = useState(false);

	const onMenuClick = () => {
		setIsActive((prev) => !prev);
	};

	const Links = [
		{ name: 'Home', href: '/', icon: <Home size={24} /> },
		{
			name: 'Projects',
			href: '/projects',
			icon: <GanttChartSquare size={24} />,
		},
		{ name: 'Gear', href: '/gear', icon: <Keyboard size={24} /> },
		{ name: 'About', href: '/about', icon: <UserRound size={24} /> },
	];

	return (
		<header className="fixed top-4 right-0 left-0 z-[99] w-full lg:max-w-4xl md:max-w-3xl max-w-xl mx-auto px-4 md:px-6 py-2 flex items-center justify-between bg-card rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:border-b border-gray-800">
			<nav className="hidden items-center space-x-6 lg:flex">
				<CustomLink href={'/'} title={'Home'} />
				<CustomLink href={'/projects'} title={'Projects'} />
				<CustomLink href={'/gear'} title={'Gear'} />
				<CustomLink href={'/about'} title={'About'} />
			</nav>

			<div className="relative lg:hidden flex">
				<span className="relative z-20">
					<Hamburger toggled={isActive} toggle={onMenuClick} size={26} />
				</span>

				{/* Menu */}
				<motion.div
					className={`absolute z-10 left-[0px] top-[50px] bg-card w-[auto] h-[400px] rounded-xl overflow-hidden shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] ${
						isActive && 'border-secondary border-2'
					}`}
					variants={variant}
					initial={'closed'}
					animate={isActive ? 'open' : 'closed'}
					transition="transition"
				>
					<AnimatePresence>
						{isActive && (
							<div className="p-8 overflow-hidden ">
								{Links.map((link, index) => (
									<motion.div
										key={index}
										custom={index}
										variants={perspective}
										animate="open"
										exit="exit"
										initial="initial"
										onClick={onMenuClick}
										className="flex items-center gap-4"
									>
										<span>{link.icon}</span>

										<CustomLink
											href={link.href}
											title={link.name}
											className="text-[30px]"
										/>
									</motion.div>
								))}
							</div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>

			<div className="absolute left-[50%] lg:flex hidden top-2 translate-x-[-50%]">
				<Logo />
			</div>

			<nav className="flex items-center space-x-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<Sun
								className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
								size={26}
							/>
							<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
							<span className="sr-only">Toggle theme</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="relative z-[1000]">
						<DropdownMenuItem onClick={() => setTheme('light')}>
							Light
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme('dark')}>
							Dark
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme('system')}>
							System
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<span className="flex items-center space-x-4 ">
					<motion.span whileHover={{ y: -3 }}>
						<Link
							href={'https://www.facebook.com/Unforget.You'}
							target="_blank"
						>
							<Facebook size={26} />
						</Link>
					</motion.span>
					<motion.span whileHover={{ y: -3 }}>
						<Link
							href={
								'https://www.instagram.com/channaraklu?fbclid=IwAR2V42ACrLE6m9R2yooqzRuCi5MXwKizQwtvLzeo7hpgf1rLZo6nQkSMXMA'
							}
							target="_blank"
						>
							<Instagram size={26} />
						</Link>
					</motion.span>
					<motion.span whileHover={{ y: -3 }}>
						<Link href={'https://github.com/NarakCODE'} target="_blank">
							<Github size={26} />
						</Link>
					</motion.span>
					<motion.span whileHover={{ y: -3 }}>
						<Link
							href={
								'https://www.tiktok.com/@narakcode?fbclid=IwAR0U3-D0GCFbaZS1GjrklXE6D-AHPRLQb4m9xPwOeZXbr0g35KMUSvow7ME'
							}
							target="_blank"
						>
							<FaTiktok size={26} />
						</Link>
					</motion.span>
				</span>
			</nav>
		</header>
	);
};

export default Navbar;
