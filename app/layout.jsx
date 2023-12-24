import Footer from '@/components/footer-component';
import HeadGradientBackground from '@/components/head-gradient-bg';
import Navbar from '@/components/navbar-component';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata = {
	title: 'NarakCODE',
	description: 'Portfolio Website',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={montserrat.className}>
				<ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
					<div className="flex flex-col justify-between max-w-4xl mx-auto h-screen">
						<Navbar />
						<div className="relative flex-1  px-4 md:px-6 py-4">{children}</div>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
