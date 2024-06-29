import React, { useRef, useState } from "react";
import {
	View,
	StyleSheet,
	Animated,
	PanResponder,
	Pressable,
	Dimensions,
	Image,
	Text,
} from "react-native";
import { services } from "@/constants/services";
import { Service } from "@/types";
import AutoSizeText from "react-native-auto-sizing-text";

const DragMenu: React.FC<{
	serviceUsestate: [string[], React.Dispatch<React.SetStateAction<string[]>>];
}> = ({ serviceUsestate }) => {
	console.log("window height is ", Dimensions.get("window").height);
	const initialYPosition = Dimensions.get("window").height - 150;
	const minYPosition = initialYPosition * 0.7;
	const translateY = useRef(new Animated.Value(initialYPosition)).current;
	const isChildActive = useRef(false); // Corrected useRef usage

	const [selected_services, setSelected_services] = serviceUsestate;

	const containerResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => !isChildActive.current,
			onPanResponderGrant: () => {
				translateY.setOffset(Math.min(translateY._value, initialYPosition));
				translateY.setValue(0);
			},
			onPanResponderMove: (event, gestureState) => {
				console.log(translateY);
				let newTranslateY = gestureState.dy + translateY._offset;
				// Restrict movement to maxYPosition
				if (newTranslateY < minYPosition) {
					newTranslateY = minYPosition;
				}
				translateY.setValue(newTranslateY - translateY._offset);
			},
			onPanResponderRelease: (_, gestureState) => {
				translateY.flattenOffset();
				if (gestureState.dy < -50) {
					Animated.spring(translateY, {
						toValue: minYPosition,
						useNativeDriver: true,
						speed: 20,
					}).start();
				} else {
					Animated.spring(translateY, {
						toValue: initialYPosition,
						useNativeDriver: true,
						speed: 20,
					}).start();
				}
			},
		})
	).current;

	const createServicePanResponder = (serviceKey: string) => {
		const originalPosition = { x: 0, y: 0 };
		const scale = new Animated.Value(1);
		const addVisualOpacity = new Animated.Value(0);

		const pan = new Animated.ValueXY();
		const panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderGrant: () => {
				isChildActive.current = true;

				pan.setOffset({
					x: pan.x._value,
					y: pan.y._value,
				});
				pan.setValue({ x: 0, y: 0 });
				Animated.spring(scale, {
					toValue: 0.8,
					useNativeDriver: true,
				}).start();
			},
			onPanResponderMove: (event, gestureState) => {
				pan.setValue({
					x: gestureState.dx,
					y: gestureState.dy,
				});
				if (gestureState.moveY < minYPosition && addVisualOpacity._value == 0) {
					Animated.spring(addVisualOpacity, {
						toValue: 0.8,
						useNativeDriver: true,
					}).start();
					console.log("opacity shifted to");
				} else if (
					gestureState.moveY > minYPosition &&
					addVisualOpacity._value == 0.8
				) {
					console.log("opacity shifted from");
					Animated.spring(addVisualOpacity, {
						toValue: 0,
						useNativeDriver: true,
					}).start();
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				addVisualOpacity.setValue(0);
				pan.flattenOffset();
				if (
					gestureState.moveY < minYPosition &&
					!selected_services.includes(serviceKey)
				) {
					console.log("added", serviceKey);
					setSelected_services((prevData) => [...prevData, serviceKey]); // Update selected_services correctly
				} else {
					Animated.spring(pan, {
						toValue: originalPosition,
						useNativeDriver: true,
						speed: 20,
					}).start();
				}
				Animated.spring(scale, {
					toValue: 1,
					useNativeDriver: true,
					speed: 10,
				}).start();

				isChildActive.current = false;
			},
		});
		return { pan, panResponder, scale, addVisualOpacity };
	};

	const serviceItems = Object.entries(services)
		.filter(
			([key, service]) =>
				100 > service.id && service.id > 0 && !selected_services.includes(key)
		)
		.map(([key, service], index) => {
			const { pan, panResponder, scale, addVisualOpacity } =
				createServicePanResponder(key);
			return (
				<Animated.View
					key={index}
					{...panResponder.panHandlers}
					style={[
						styles.serviceBox,
						{
							transform: [...pan.getTranslateTransform(), { scale: scale }],
						},
					]}>
					<Pressable>
						<Image
							source={service.image}
							style={{ height: "100%", width: "100%", opacity: 1 }}
							resizeMode='contain'
						/>
					</Pressable>
					<Animated.View
						style={{
							left: -50,
							top: -50,
							height: 50,
							width: 50,
							opacity: addVisualOpacity,
							backgroundColor: "white",
							borderRadius: 25,
							position: "absolute",
						}}
					/>
				</Animated.View>
			);
		});

	return (
		<Animated.View
			{...containerResponder.panHandlers}
			style={[
				styles.box,
				{
					transform: [{ translateY }],
				},
			]}>
			<View style={styles.tag}>
				<Text
					style={styles.text}
					adjustsFontSizeToFit={true}
					minimumFontScale={2}>
					Services
				</Text>
			</View>
			{serviceItems}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	box: {
		height: 800,
		width: "100%",
		backgroundColor: "rgba(173, 216, 230, 0.5)",
		flex: 1,
		flexDirection: "row", // items are laid out in a row
		flexWrap: "wrap",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 0, // Starting position at the bottom
		borderRadius: 10,
	},
	serviceBox: {
		backgroundColor: "rgba(173, 216, 230, 0.8)",
		margin: 10,
		padding: 8,
		width: "20%",
		aspectRatio: 2,
		borderRadius: 10,
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
	},
	tag: {
		position: "absolute",
		top: -50,
		left: 20,
		height: 50,
		width: "30%",
		backgroundColor: "rgba(173, 216, 230, 0.5)",
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		zIndex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: "white",
		opacity: 0.8,
	},
});

export default DragMenu;
