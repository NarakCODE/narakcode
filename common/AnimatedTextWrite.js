'use client';
import { TypeAnimation } from 'react-type-animation';

const AnimatedTextWrite = ({ fText, sText, tText, className }) => {
	return (
		<div>
			<TypeAnimation
				className={className}
				sequence={[
					// Same substring at the start will only be typed out once, initially
					fText,
					2000, // wait 2s before replacing "Mice" with "Hamsters"
					sText,
					2000,
					tText,
					2000,
				]}
				wrapper="span"
				speed={50}
				style={{ display: 'inline-block' }}
				repeat={Infinity}
			/>

			<span>✏️</span>
		</div>
	);
};

export default AnimatedTextWrite;
