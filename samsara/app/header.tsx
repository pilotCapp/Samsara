// RadialGradientHeader.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Service } from "@/types";
import Svg, { Path } from "react-native-svg";
import { Image, ImageTransition } from "expo-image";

const Header = ({
	service_data,
	period_usestate,
	notification_usestate,
}: {
	service_data: Service;
	period_usestate: [Date, React.Dispatch<React.SetStateAction<Date>>];
	notification_usestate: [
		boolean,
		React.Dispatch<React.SetStateAction<boolean>>
	];
}) => {
	const days_left = Math.round(
		(period_usestate[0].getTime() - new Date().getTime()) /
			(1000 * 60 * 60 * 24)
	);

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
			<View
				style={{
					position: "absolute",
					alignSelf: "flex-end",
					height: "100%",
					width: "30%",
					alignItems: "center",
					justifyContent: "center",
					paddingRight: 10,
					paddingLeft: 10,
				}}>
				<View
					style={{
						height: "50%",
						flexDirection: "row",
						borderColor: "white",
						borderRadius: 15,
						borderWidth: 2,
						padding: 5,
					}}>
					<View
						style={{
							height: "100%",
							alignItems: "flex-end",
							justifyContent: "center",
						}}>
						<Text
							style={{
								color: "white",
								fontSize: 100,
								fontWeight: "bold",
								fontFamily: "inter",
							}}
							adjustsFontSizeToFit={true}
							minimumFontScale={0.1}
							maxFontSizeMultiplier={1}
							numberOfLines={1}>
							{days_left}
						</Text>
					</View>
					<View
						style={{
							height: "100%",
							width: "30%",
							alignItems: "center",
							justifyContent: "center",
						}}>
						<Text
							style={{
								color: "white",
								fontSize: 35,
								fontWeight: "bold",
								fontFamily: "roboto",
							}}
							adjustsFontSizeToFit={true}
							minimumFontScale={0.1}
							maxFontSizeMultiplier={1}
							numberOfLines={2}>
							{days_left == 1 ? "day" : "days"} left
						</Text>
					</View>
				</View>
			</View>
			<Pressable
				style={{
					position: "absolute",
					alignSelf: "flex-start",
					height: "100%",
					width: "30%",
					alignItems: "flex-start",
					justifyContent: "center",
					margin: 20,
				}}
				onPress={() => {
					if (notification_usestate !== undefined) {
						notification_usestate[1]((prevValue) => !prevValue);
					}
				}}>
				<Image
					style={{ height: "50%", width: "50%" }}
					source={
						notification_usestate !== undefined && notification_usestate[0]
							? require("../assets/images/bell_on.png")
							: require("../assets/images/bell_off.png")
					}
					contentFit='contain'
				/>
			</Pressable>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "flex-end",
		alignItems: "center",
		height: 150,
		paddingBottom: 20,
	},
	title: {
		color: "white",
		fontSize: 40,
		fontWeight: "bold",
	},
	logo: { height: "80%", width: "40%" },
});

export default Header;
