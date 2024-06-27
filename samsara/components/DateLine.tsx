import React from "react";
import { Defs, G, Line, Marker, Path } from "react-native-svg"; // Use `react-native-svg` for React Native

const DateLine: React.FC<{ radius: number; angle: number }> = ({
	radius,
	angle,
}) => {
	// Convert angle to radians
	const angleInRadians = (angle - 90) * (Math.PI / 180);
	// Calculate start and end points for the line
	const x1 = radius * 1.1 + (radius + 10) * Math.cos(angleInRadians);
	const y1 = radius * 1.1 + (radius + 10) * Math.sin(angleInRadians);
	const x2 = radius * 1.1 + (radius - 40) * Math.cos(angleInRadians); // Adjust the length of the line
	const y2 = radius * 1.1 + (radius - 40) * Math.sin(angleInRadians);

	return (
		<G style={{ pointerEvents: "none" }}>
			<Defs>
				{/* Arrowhead marker for the start of the line */}
				<Marker
					id='arrowStart'
					viewBox='0 0 10 10'
					refX='5'
					refY='5'
					markerWidth='6'
					markerHeight='6'
					orient='auto'>
					<Path d='M 5 0 L -5 5 L 5 10 z' fill='white' />
				</Marker>
				{/* Arrowhead marker for the end of the line */}
				<Marker
					id='arrowEnd'
					viewBox='0 0 10 10'
					refX='5'
					refY='5'
					markerWidth='6'
					markerHeight='6'
					orient='auto'>
					<Path d='M 0 0 L 10 5 L 0 10 z' fill='white' />
				</Marker>
				<Marker
                        id="buttEnd"
                        viewBox="0 0 10 10"
                        refX="5"
                        refY="5"
                        markerWidth="4"
                        markerHeight="4"
                        orient="auto"
                    >
                        <Path d="M 5 3 L 5 7" stroke="white" strokeWidth="2" />
                    </Marker>
			</Defs>
			<Line
				pointerEvents='none'
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				stroke='#FFFFFF' // Set the line color
				strokeWidth='4' // Set the line thickness
				markerStart='url(#arrowStart)'
				markerEnd='url(#arrowEnd)'
				opacity={0.8}
			/>
			<Line
				pointerEvents='none'
				x1={radius * 1.1}
				y1={20}
				x2={radius * 1.1}
				y2={75}
				stroke='#FFFFFF' // Set the line color
				strokeWidth='20' // Set the line thickness
				markerStart='url(#buttEnd)'
				markerEnd='url(#buttEnd)'
			/>
		</G>
	);
};

export default DateLine;
