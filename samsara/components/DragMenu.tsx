import React, { useEffect, useRef, useState } from "react";
import {
	View,
	StyleSheet,
	Animated,
	PanResponder,
	Pressable,
	Dimensions,
	Text,
} from "react-native";
import { services } from "@/constants/services";
import { Image } from "expo-image";

const DragMenu: React.FC<{
	serviceUsestate: [string[], React.Dispatch<React.SetStateAction<string[]>>];
	centerUsestate: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
	angleUsestate: [number, React.Dispatch<React.SetStateAction<number>>];
}> = ({ serviceUsestate, centerUsestate, angleUsestate }) => {
	const document = Dimensions.get("window");
	const height = document.height;
	const width = document.width;

	let initialYPosition = -800;
	const maxYPosition = initialYPosition + (width * 3) / 8 + 60;
	const dragBorder = maxYPosition + 800 + 150;

	const translateY = useRef(new Animated.Value(initialYPosition)).current;
	const isChildActive = useRef(false);

	const [selected_services, setSelected_services] = serviceUsestate;

	let plusOpacityValue = 0; // Opacity of the plus sign
	const plusOpacity = useRef(new Animated.Value(0)).current; // Opacity of the plus sign
	const serviceRef = useRef(selected_services);

	const animatePlusSign = () => {
		Animated.timing(plusOpacity, {
			toValue: plusOpacityValue,
			duration: 200,
			useNativeDriver: true,
		}).start();
	};

	function animateY(Ypos: number) {
		Animated.timing(translateY, {
			toValue: Ypos,
			useNativeDriver: true,
		}).start();
	}

	useEffect(() => {
		serviceRef.current = selected_services;
		if (serviceRef.current.length === 0) {
			animateY(maxYPosition + 150);
		} else {
			animateY(initialYPosition);
		}
	}, [selected_services]);

	const containerResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => !isChildActive.current,
			onPanResponderGrant: () => {
				translateY.setOffset(Math.max(translateY._value, initialYPosition));
				translateY.setValue(0);
			},
			onPanResponderMove: (event, gestureState) => {
				let newTranslateY = gestureState.dy + translateY._offset;
				// Restrict movement to maxYPosition
				if (newTranslateY > maxYPosition) {
					newTranslateY = maxYPosition;
				}
				translateY.setValue(newTranslateY - translateY._offset);
			},
			onPanResponderRelease: (_, gestureState) => {
				translateY.flattenOffset();
				if (serviceRef.current.length === 0) {
					animateY(maxYPosition + 150);
				} else if (gestureState.dy > 50) {
					animateY(maxYPosition);
				} else if (
					Math.abs(gestureState.dx) < 5 &&
					Math.abs(gestureState.dy) < 5
				) {
					if (translateY._value === maxYPosition) {
						animateY(initialYPosition);
					} else {
						animateY(maxYPosition);
					}
				} else {
					animateY(initialYPosition);
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
				Animated.timing(scale, {
					toValue: 0.8,
					useNativeDriver: true,
				}).start();
			},
			onPanResponderMove: (event, gestureState) => {
				pan.setValue({
					x: gestureState.dx,
					y: gestureState.dy,
				});
				if (gestureState.moveY > dragBorder && plusOpacityValue === 0) {
					plusOpacityValue = 0.8;
					animatePlusSign();
				} else if (gestureState.moveY < dragBorder && plusOpacityValue > 0) {
					plusOpacityValue = 0;
					animatePlusSign();
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				plusOpacityValue = 0;
				animatePlusSign(); // Mark the end of an animation
				pan.flattenOffset();
				if (
					gestureState.moveY > dragBorder &&
					!selected_services.includes(serviceKey)
				) {
					setSelected_services((prevData) => [...prevData, serviceKey]); // Update selected_services correctly
					angleUsestate[1](0);
				} else {
					Animated.timing(pan, {
						toValue: originalPosition,
						useNativeDriver: true,
					}).start();
				}
				Animated.timing(scale, {
					toValue: 1,
					useNativeDriver: true,
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
							contentFit='contain'
							placeholder={require("../assets/animations/loading3.gif")}
							placeholderContentFit='contain'
							cachePolicy={"memory-disk"}
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
					minimumFontScale={0.1}
					maxFontSizeMultiplier={1}
					numberOfLines={1}>
					Services
				</Text>
			</View>
			<Animated.View
				pointerEvents='none'
				style={{
					opacity: plusOpacity,
					position: "absolute",
					top: "105%",
					alignSelf: "center",
					width: "20%",
					aspectRatio: 1,
					left: "40%",
				}}>
				<Image
					source={require("../assets/images/add_service.png")}
					style={{ width: "100%", height: "100%" }}
					contentFit={"contain"}></Image>
			</Animated.View>
			{serviceItems}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	box: {
		flex: 1,
		height: 800,
		width: "100%",
		backgroundColor: "rgba(173, 216, 230, 0.5)",
		flexDirection: "row", // items are laid out in a row
		flexWrap: "wrap-reverse", // items wrap to the next line if needed
		justifyContent: "space-around",
		alignContent: "flex-start",
		position: "absolute",
		borderRadius: 10,
		marginBottom: 30,
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
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
		top: "100%",
		left: 20,
		width: "30%",
		aspectRatio: 2,
		backgroundColor: "rgba(173, 216, 230, 0.5)",
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		zIndex: 1,
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		borderColor: "gray",
		borderRadius: 1,
		borderWidth: 1,
		borderTopColor: "transparent",
		borderStyle: "solid",
		padding: 10,
	},
	text: {
		color: "white",
		opacity: 0.5,
		fontSize: 40,
	},
});

export default DragMenu;
