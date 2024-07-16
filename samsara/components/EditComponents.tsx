import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	Alert,
	Animated,
} from "react-native";
import Svg, { G, Circle, Defs } from "react-native-svg";
import { Line } from "victory-native";

const EditComponents: React.FC<{
	Radius: number;
	service_usestate: [string[], React.Dispatch<React.SetStateAction<string[]>>];
	angle_usestate: [number, React.Dispatch<React.SetStateAction<number>>];
	period_usestate: [Date, React.Dispatch<React.SetStateAction<Date>>];
	edit_usestate: [
		number | null,
		React.Dispatch<React.SetStateAction<number | null>>
	];
}> = ({
	Radius,
	service_usestate,
	angle_usestate,
	period_usestate,
	edit_usestate,
}) => {
	Radius = Radius * 1.1;
	const smallRadius = Math.min(Radius / 10, 20);
	const [selected_services, setSelected_services] = service_usestate;
	const [endAngle, setEndAngle] = angle_usestate;
	const [end_period, setEnd_period] = period_usestate;
	const [edit_index, setEdit_index] = edit_usestate;

	// Helper function to calculate position
	const calculatePosition = (angle: number, radius: number) => {
		const angleInRadians = (angle * Math.PI) / 180;
		return {
			x: radius * 1.5 + 1.2 * radius * Math.cos(angleInRadians),
			y: radius * 1.5 + 1.2 * radius * Math.sin(angleInRadians),
		};
	};

	// Generate positions for the small circles
	const smallCirclePositions = Array.from(
		{ length: selected_services.length },
		(_, index) => {
			const angle =
				(index * 360) / selected_services.length -
				90 +
				180 / selected_services.length;
			return calculatePosition(angle, Radius);
		}
	);

	useEffect(() => {}, [edit_index]);

	const CurrentPeriodAlert = (callback: Function) => {
		Alert.alert(
			"Warning",
			"Do you wish to skip current period?",
			[
				{
					text: "Cancel",
					onPress: () => callback(false),
					style: "cancel",
				},
				{
					text: "OK",
					onPress: () => callback(true),
				},
			],
			{ cancelable: false }
		);
	};

	function handlePress(index: number) {
		if (index == 0) {
			CurrentPeriodAlert((response: boolean) => {
				if (response) {
					const new_services = selected_services.filter(
						(item) => item !== selected_services[index]
					);
					setSelected_services(new_services);

					setEndAngle((360 / selected_services.length) * index);

					const today = new Date();
					setEnd_period(new Date(today.getTime() + 30 * 1000 * 60 * 60 * 24));
					console.log("end period reset");
				}
			});
		} else {
			const new_services = selected_services.filter(
				(item) => item !== selected_services[index]
			);
			setSelected_services(new_services);
			setEndAngle((360 / selected_services.length) * index);
		}
	}

	return (
		<View style={styles.container}>
			<View
				style={{
					height: Radius * 3,
					width: Radius * 3,
					position: "absolute",
					pointerEvents: "box-none",
				}}>
				{selected_services.map((service, index) => {
					return (
						<Pressable
							key={service}
							onPress={() => {
								handlePress(index);
							}}
							style={{
								position: "absolute",
								left: smallCirclePositions[index].x - smallRadius,

								top: smallCirclePositions[index].y - smallRadius,
								width: smallRadius * 2,
								height: smallRadius * 2,
								justifyContent: "center",
								alignItems: "center",
								backgroundColor: "white",
								borderRadius: smallRadius,
								borderColor: "black",
								opacity: edit_index === index ? 1 : 0,
								pointerEvents: edit_index === index ? "auto" : "none",
							}}>
							<View
								style={{
									backgroundColor: "black",
									height: smallRadius / 5,
									width: smallRadius,
									borderRadius: smallRadius / 2,
									justifyContent: "center",
									alignItems: "center",
								}}
							/>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		pointerEvents: "box-none",
	},
	svg_container: {
		height: "100%",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		pointerEvents: "box-none",
	},
});

export default EditComponents;
