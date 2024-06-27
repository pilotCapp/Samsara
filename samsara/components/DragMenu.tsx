import { services } from "@/constants/services";
import { Service } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PropsWithChildren, useState, useRef } from "react";
import {
	View,
	StyleSheet,
	Animated,
	PanResponder,
	Pressable,
	useColorScheme,
	Dimensions,
	Image,
} from "react-native";

const DragMenu = () => {
	const initialYPosition = Dimensions.get("window").height - 500;
	console.log(initialYPosition);
	const translateY = useRef(new Animated.Value(initialYPosition)).current;

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderGrant: () => {
				// Set the current value as the offset
				translateY.setOffset(translateY._value); // or use `translateY.setOffset(translateY.getValue());`
				translateY.setValue(initialYPosition); // Reset value to avoid jump
			},
			onPanResponderMove: Animated.event([null, { dy: translateY }], {
				useNativeDriver: false,
			}),
			onPanResponderRelease: (_, gestureState) => {
				translateY.flattenOffset(); // Combine offset into the value

				if (gestureState.dy < -50) {
					// Dragged up more than 50 pixels
					Animated.spring(translateY, {
						toValue: 200,
						useNativeDriver: true,
					}).start();
				} else {
					Animated.spring(translateY, {
						toValue: initialYPosition,
						useNativeDriver: true,
					}).start();
				}
			},
		})
	).current;

	return (
		<Animated.View
			{...panResponder.panHandlers}
			style={[
				styles.box,
				{
					transform: [{ translateY }],
				},
			]}>
			{Object.values(services).map((service: Service, index: number) =>
				100 > service.id && service.id > 0 ? (
					<Pressable key={index} style={styles.serviceBox}>
						<Image
							source={service.image}
							style={{ height: "100%", width: "100%", opacity: 1 }}
							resizeMode='contain'
						/>
					</Pressable>
				) : null
			)}
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
		bottom: 50, // Starting position at the bottom
	},
	serviceBox: {
		backgroundColor: "rgba(173, 216, 230, 0.8)",
		padding: 20,
		height: 100,
		width: 200,
		margin: 10,
		borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },

});

export default DragMenu;
