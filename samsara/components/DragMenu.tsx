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

const DragMenu: React.FC<{
	serviceUsestate: [string[], React.Dispatch<React.SetStateAction<string[]>>];
	centerUsestate: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}> = ({ serviceUsestate, centerUsestate }) => {
	const initialYPosition = Dimensions.get("window").height - 150;
	const minYPosition = initialYPosition * 0.6;
	const translateY = useRef(new Animated.Value(initialYPosition)).current;
	const isChildActive = useRef(false);

	const [selected_services, setSelected_services] = serviceUsestate;

	//const [addServiceVisual, setAddServiceVisual] = centerUsestate;

	let plusOpacityValue = 0; // Opacity of the plus sign
	const plusOpacity = useRef(new Animated.Value(0)).current; // Opacity of the plus sign

	const animatePlusSign = () => {
		Animated.timing(plusOpacity, {
			toValue: plusOpacityValue,
			duration: 200,
			useNativeDriver: true,
		}).start();
	};

	const containerResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => !isChildActive.current,
			onPanResponderGrant: () => {
				translateY.setOffset(Math.min(translateY._value, initialYPosition));
				translateY.setValue(0);
			},
			onPanResponderMove: (event, gestureState) => {
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

				if (gestureState.moveY < minYPosition + 150 && plusOpacityValue === 0) {
					plusOpacityValue = 0.6;
					animatePlusSign();
				} else if (
					gestureState.moveY > minYPosition + 150 &&
					plusOpacityValue > 0
				) {
					plusOpacityValue = 0;
					animatePlusSign();
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				plusOpacityValue = 0;
				animatePlusSign(); // Mark the end of an animation
				pan.flattenOffset();
				if (
					gestureState.moveY < minYPosition + 150 &&
					!selected_services.includes(serviceKey)
				) {
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
			onPanResponderTerminate: () => {
				plusOpacityValue = 0;
				animatePlusSign(); // Mark the end of an animation
			},
		});

		return { pan, panResponder, scale };
	};

	const serviceItems = Object.entries(services)
		.filter(
			([key, service]) =>
				100 > service.id && service.id > 0 && !selected_services.includes(key)
		)
		.map(([key, service], index) => {
			const { pan, panResponder, scale } = createServicePanResponder(key);

			return (
				<Animated.View
					key={key}
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
			<Animated.View
				pointerEvents='none'
				style={{
					opacity: plusOpacity,
					position: "absolute",
					bottom: "100%",
					alignSelf: "center",
					width: "10%",
					aspectRatio: 1,
					margin: 10,
				}}>
				<Image
					source={require("../assets/images/add_service.png")}
					style={{ width: "100%", height: "100%" }}
					resizeMode={"contain"}></Image>
			</Animated.View>
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
		margin: 10,
		padding: 8,
		width: "25%",
		aspectRatio: 2,
		borderRadius: 10,
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
		backgroundColor: "rgba(173, 216, 230, 0.8)",
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
		flex: 1,
	},
	text: {
		color: "white",
		opacity: 0.5,
	},
	tag_text: {
		fontSize: 20,
	},
});

export default DragMenu;
