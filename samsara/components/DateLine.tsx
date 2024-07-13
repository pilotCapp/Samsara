import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	PanResponder,
	View,
	StyleSheet,
	Dimensions,
} from "react-native";
import Svg, { Defs, G, Line, Marker, Path } from "react-native-svg"; // Use `react-native-svg` for React Native

const DateLine: React.FC<{
	radius: number;
	periodUsestate: [Date, React.Dispatch<React.SetStateAction<Date>>];
	selected_services: string[];
	parentLayout: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}> = ({ radius, periodUsestate, selected_services, parentLayout }) => {
	const today = new Date();
	const dimensions = Dimensions.get("window");
	const angleRef = useRef(0);
	const selectedServicesRef = useRef(selected_services);
	const c = 1000 * 60 * 60 * 24;

	const [linePositions, setLinePositions] = useState<number[][]>(
		presentLinePositions(getAngleFromDate(periodUsestate[0]))
	);
	const periodUsestateRef = useRef(periodUsestate);

	useEffect(() => {
		periodUsestateRef.current = periodUsestate;
	}, [periodUsestate[0]]);

	useEffect(() => {
		selectedServicesRef.current = selected_services;
		const angle = getAngleFromDate(periodUsestate[0]); //remove if temporary is deprecated
		setLinePositions(presentLinePositions(angle));
	}, [selected_services]);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderGrant: () => {},
			onPanResponderMove: (event, gestureState) => {
				const angle =
					-Math.atan2(
						gestureState.moveX - dimensions.width / 2 - 25,
						gestureState.moveY - dimensions.height / 2 - 25
					) + Math.PI;
				if (
					angle > 0 &&
					angle < (2 * Math.PI) / selectedServicesRef.current.length
				) {
					setLinePositions(presentLinePositions(angle));
					angleRef.current = angle;
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				const new_date = getDateFromAngle(angleRef.current);
				periodUsestate[1](new_date);
			},
		})
	).current;

	function getAngleFromDate(date: Date) {
		const timedifference = Math.ceil(
			30 - (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
		);
		const angle =
			(((2 * Math.PI) / selectedServicesRef.current.length) * timedifference) /
			32;

		return angle;
	}

	function getDateFromAngle(angle: number) {
		const serviceAngle = (2 * Math.PI) / selectedServicesRef.current.length;
		const timedifference = 32 - (angle / serviceAngle) * 32;
		// console.log(
		// 	angle,
		// 	serviceAngle,
		// 	selectedServicesRef.current.length,
		// 	timedifference
		// );
		const daysDifference = Math.round(timedifference);
		return new Date(today.getTime() + daysDifference * c);
	}

	function presentLinePositions(angle: number) {
		// Calculate start and end points for the line
		const x1 = radius * 1.1 + (radius + 10) * Math.sin(angle);
		const y1 = radius * 1.1 - (radius + 10) * Math.cos(angle);
		const x2 = radius * 1.1 + (radius - 40) * Math.sin(angle);
		const y2 = radius * 1.1 - (radius - 40) * Math.cos(angle);
		return [
			[x1, y1],
			[x2, y2],
		];
	}

	return (
		<View style={styles.svg_container}>
			<Svg height='100%' width='100%'>
				<G>
					<Defs>
						<Marker
							id='arrowStart'
							viewBox='0 0 10 10'
							refX='5'
							refY='5'
							markerWidth='6'
							markerHeight='6'
							orient='auto'>
							<Path d='M 5 0 L 0 5 L 5 10 z' fill='white' />
						</Marker>
						<Marker
							id='arrowEnd'
							viewBox='0 0 10 10'
							refX='5'
							refY='5'
							markerWidth='6'
							markerHeight='6'
							orient='auto'>
							<Path d='M 0 0 L 5 5 L 0 10 z' fill='white' />
						</Marker>
						<Marker
							id='buttEnd'
							viewBox='0 0 10 10'
							refX='5'
							refY='5'
							markerWidth='4'
							markerHeight='4'
							orient='auto'>
							<Path d='M 5 3 L 5 7' stroke='white' strokeWidth='2' />
						</Marker>
					</Defs>
					<Line
						pointerEvents='none'
						x1={linePositions[0][0]}
						y1={linePositions[0][1]}
						x2={linePositions[1][0]}
						y2={linePositions[1][1]}
						stroke='#FFFFFF'
						strokeWidth='4'
						markerStart='url(#arrowStart)'
						markerEnd='url(#arrowEnd)'
						opacity={0.8}
					/>
				</G>
			</Svg>
			<Animated.View
				{...panResponder.panHandlers}
				style={{
					position: "absolute",
					height: 50,
					width: 50,
					top: (linePositions[0][1] + linePositions[1][1]) / 2 - 25,
					left: (linePositions[0][0] + linePositions[1][0]) / 2 - 25,
				}}></Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	frame: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	container: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		width: "auto",
		pointerEvents: "box-none",
		borderRadius: 100,
	},
	svg_container: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
		borderRadius: 100,
		pointerEvents: "box-none",
	},
});

export default DateLine;
