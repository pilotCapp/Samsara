import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import Svg, { G, Circle, Defs } from "react-native-svg";
import { Line } from "victory-native";

const EditComponents: React.FC<{
	Radius: number;
	service_usestate: [string[], React.Dispatch<React.SetStateAction<string[]>>];
}> = ({ Radius, service_usestate }) => {
	Radius = Radius * 1.1;
	const smallRadius = Radius / 10;
	let [selected_services, setSelected_services] = service_usestate;

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
				}
			});
		} else {
			const new_services = selected_services.filter(
				(item) => item !== selected_services[index]
			);
			setSelected_services(new_services);
		}
	}

	useEffect(() => {
	}, [selected_services]);
	return (
		<View style={styles.container}>
			<View
				height={Radius * 3}
				width={Radius * 3}
				style={{
					position: "absolute",
					pointerEvents: "box-none",
				}}>
				{selected_services.map((service, index) => (
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
							shadowOffset: {
								width: 0,
								height: 3,
							},
							shadowOpacity: 0.5,
							shadowRadius: 5,
							 
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
				))}
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
