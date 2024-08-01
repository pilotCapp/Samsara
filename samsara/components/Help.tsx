import {
	View,
	Pressable,
	StyleSheet,
	Dimensions,
	Animated,
	Button,
} from "react-native";
import { Image } from "expo-image";

import React, { useState, useEffect, useRef } from "react";

const HelpButton = () => {
	const [helpWindow, setHelpWindow] = useState(false);

	function toggleWindow() {
		setHelpWindow((oldValue) => !oldValue);
	}

	return helpWindow ? (
		<Pressable
			style={{
				height: "100%",
				width: "100%",
				position: "absolute",
				backgroundColor: "rgba(255, 255, 255, 0.5)",
				alignSelf: "center",
				padding: 30,
				alignItems: "center",
				justifyContent: "center",
				borderRadius: 10,
			}}
			onPress={toggleWindow}>
			<View
				style={{
					alignItems: "center",
					justifyContent: "center",
					shadowOffset: {
						width: 0,
						height: 3,
					},
					shadowOpacity: 0.5,
					shadowRadius: 10,
					height: "100%",
					width: "100%",
				}}>
				<Image
					source={require("../assets/images/help_window.png")}
					placeholder={require("../assets/images/help_window_medium.png")}
					style={{
						height: "90%",
						width: "90%",
					}}
					contentFit='contain'
					placeholderContentFit='contain'
					cachePolicy={"memory-disk"}
					transition={100}></Image>
			</View>
		</Pressable>
	) : (
		<Pressable
			style={{
				height: "10%",
				aspectRatio: 1,
				position: "absolute",
				alignSelf: "center",
				bottom: 0,
				opacity: 0.7,
				margin: 30,
				shadowOffset: {
					width: 0,
					height: 3,
				},
				shadowOpacity: 0.5,
				shadowRadius: 3,
			}}
			onPress={toggleWindow}>
			<Image
				source={require("../assets/images/help_button.png")}
				style={{ height: "100%", width: "100%" }}
				contentFit='contain'></Image>
		</Pressable>
	);
};

export default HelpButton;
