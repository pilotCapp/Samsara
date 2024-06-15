import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { G, Circle } from "react-native-svg";

const EditComponents: React.FC<{
	Radius: number;
	service_usestate: [string[], React.Dispatch<React.SetStateAction<string[]>>];
}> = ({ Radius, service_usestate }) => {
	const smallRadius = Radius / 10;
	const [selected_services, setSelected_services] = service_usestate;

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

	return (
		<View style={styles.container}>
			<Svg height={Radius * 3} width={Radius * 3}>
				<G>
					{smallCirclePositions.map(
						(pos, index) => (
							console.log(pos),
							(
								<Circle
									key={index}
									cx={pos.x}
									cy={pos.y}
									r={smallRadius}
									stroke='black'
									strokeWidth='2'
									fill='red'
								/>
							)
						)
					)}
				</G>
			</Svg>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
	},
	svg_container: {
		height: "100%",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default EditComponents;
