import React from "react";
import { G, Line } from "react-native-svg"; // Use `react-native-svg` for React Native

const DateLine: React.FC<{ radius: number; angle: number }> = ({
	radius,
	angle,
}) => {
	// Convert angle to radians
	const angleInRadians = (angle - 90) * (Math.PI / 180);
	// Calculate start and end points for the line
	const x1 = radius + radius * 0.55 * Math.cos(angleInRadians);
	const y1 = radius + radius * 0.55 * Math.sin(angleInRadians);
	const x2 = radius + radius * 0.8 * Math.cos(angleInRadians); // Adjust the length of the line
	const y2 = radius + radius * 0.8 * Math.sin(angleInRadians);

	return (
		<G>
			<Line
				pointerEvents='none'
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				stroke='#800020' // Set the line color
				strokeWidth='2' // Set the line thickness
			/>
		</G>
	);
};

export default DateLine;
