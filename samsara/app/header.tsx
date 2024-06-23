// RadialGradientHeader.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Service } from "@/types";
import Svg, { Path } from "react-native-svg";
import { Image, ImageTransition } from "expo-image";

const Header = ({ service_data }: { service_data: Service }) => {
	return (
		<LinearGradient
			// Button Linear Gradient
			locations={[0, 0.95, 1]}
			colors={service_data.colors}
			style={styles.container}>
			<Image
				source={service_data.image}
				style={styles.logo}
				transition={{
					duration: 300, // Duration of the transition in milliseconds
				}}
				contentFit='contain'
			/>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "flex-end",
		alignItems: "center",
		height: 150,
		paddingBottom:20,
	},
	title: {
		color: "white",
		fontSize: 40,
		fontWeight: "bold",
	},
	logo: { height: "60%", width: "40%"},
});

export default Header;
