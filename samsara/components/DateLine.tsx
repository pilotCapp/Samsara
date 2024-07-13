import { transform } from "@babel/core";
import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	PanResponder,
	View,
	StyleSheet,
	Dimensions,
	Image,
} from "react-native";
import Svg, { Defs, G, Line, Polyline, Marker, Path } from "react-native-svg"; // Use `react-native-svg` for React Native

const DateLine: React.FC<{
	radius: number;
	periodUsestate: [Date, React.Dispatch<React.SetStateAction<Date>>];
	selected_services: string[];
}> = ({ radius, periodUsestate, selected_services }) => {
	const today = new Date();
	const dimensions = Dimensions.get("window");
	const angleRef = useRef(0);
	const selectedServicesRef = useRef(selected_services);
	const c = 1000 * 60 * 60 * 24;

	const [linePositions, setLinePositions] = useState<number[]>(
		presentLinePositions(getAngleFromDate(periodUsestate[0]))
	);
	const periodUsestateRef = useRef(periodUsestate);

	useEffect(() => {
		periodUsestateRef.current = periodUsestate;
	}, [periodUsestate[0]]);

	useEffect(() => {
		selectedServicesRef.current = selected_services;
		const angle = getAngleFromDate(periodUsestate[0]);
		angleRef.current = angle;
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
		const timedifference = 30 - (angle / serviceAngle) * 30;
		// console.log(
		// 	angle,
		// 	serviceAngle,
		// 	selectedServicesRef.current.length,
		// 	timedifference
		// );
		const daysDifference = Math.max(
			0,
			Math.min(30, Math.round(timedifference))
		);
		return new Date(today.getTime() + daysDifference * c);
	}

	function presentLinePositions(angle: number) {
		// Calculate start and end points for the line
		const x = radius * 1.1 + (radius - 20) * Math.sin(angle);
		const y = radius * 1.1 - (radius - 20) * Math.cos(angle);
		return [x, y];
	}

	return (
		<View style={styles.svg_container}>
			<Animated.View
				{...panResponder.panHandlers}
				style={{
					position: "absolute",
					height: 80,
					width: 80,
					top: linePositions[1] - 40,
					left: linePositions[0] - 40,
					borderRadius: 100,
					transform: [{ rotate: `${angleRef.current}rad` }],
				}}>
				<Image
					source={require("../assets/images/watchhand.png")}
					style={{ width: "100%", height: "100%" }}
					resizeMode={"contain"}></Image>
			</Animated.View>
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
