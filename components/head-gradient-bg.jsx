import React from 'react';

const HeadGradientBackground = ({ firstColor, secondColor }) => {
	return (
		<div
			className={`absolute left-0 right-0 z-[-1] -top-10 w-full max-w-4xl h-32 mx-auto opacity-20 blur-xl rounded-full bg-gradient-to-t ${firstColor} ${secondColor}`}
		/>
	);
};

export default HeadGradientBackground;
