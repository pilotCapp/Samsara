// RadialGradientHeader.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Service } from "@/types";

const Header = ({ service_data }: { service_data: Service }) => {
	console.log(service_data.colors);
	return (
		<LinearGradient
			// Button Linear Gradient
			locations={[0, 0.9, 1]}
			colors={service_data.colors}
			style={styles.container}>
			<Text style={styles.title}>{service_data.name}</Text>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "flex-end",
		alignItems: "center",
		height: 150,
		paddingHorizontal: 15,
	},
	title: {
		color: "white",
		fontSize: 40,
		fontWeight: "bold",
		marginBottom: 40,
	},
});

export default Header;
