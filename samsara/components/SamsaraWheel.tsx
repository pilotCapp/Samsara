import {
	View,
	Pressable,
	StyleSheet,
	Dimensions,
	Image,
	Animated,
	Button,
	LayoutChangeEvent,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Asset } from "expo-asset";
import { transform } from "@babel/core";
import Svg, {
	Path,
	Text as SvgText,
	Defs,
	TextPath,
	Circle,
} from "react-native-svg";

import { Service, DataItem } from "@/types";

import { VictoryPie } from "victory-native";

import { services } from "@/constants/services";
import DateLine from "@/components/DateLine";
import EditComponents from "@/components/EditComponents";

const SamsaraWheel: React.FC<{
	serviceUsestate: [string[], React.Dispatch<React.SetStateAction<string[]>>];
	centerUsestate: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
	periodUsestate: [Date, React.Dispatch<React.SetStateAction<Date>>];
}> = ({ serviceUsestate, centerUsestate, periodUsestate }) => {
	const today = new Date();
	const dimensions = Dimensions.get("window");
	const radius = dimensions.width / 3;
	const init_edit = false;
	let graphicData: DataItem[] = [];

	const [editMode, setEditMode] = useState(init_edit);
	const [selected_services, setSelected_services] = serviceUsestate;
	const [addServiceVisual, setAddServiceVisual] = centerUsestate;
	const [data, setData] = useState(graphicData);
	const [endAngle, setEndAngle] = useState(0);

	const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0
	const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

	const cacheImages = async () => {
		const images = [
			require("../assets/images/add_service.png"),
			require("../assets/images/calendar.png"),
		];

		const cachePromises = images.map((image) =>
			Asset.fromModule(image).downloadAsync()
		);
		await Promise.all(cachePromises);
	};

	let colorScale = selected_services.map(
		(key) => services[key.toLowerCase()].colors[0]
	);

	async function initiallizeData() {
		try {
			await cacheImages();
		} catch (error) {
			console.error("Error caching images:", error);
		}

		const newData: DataItem[] = selected_services.map((key) => ({
			y: 100 / selected_services.length,
			x: services[key].name,
			selected: false,
		}));

		setData(newData);
	}

	function alterData() {
		colorScale = selected_services.map(
			(key) => services[key.toLowerCase()].colors[0]
		);
		setData((prevData) => {
			// Step 1: Filter out items in prevData that are no longer in selected_services
			const filteredData = prevData.filter((item) =>
				selected_services.includes(item.x)
			);

			// Step 2: Create a set of existing x values for quick lookup
			const existingXValues = new Set(filteredData.map((item) => item.x));

			// Step 3: Add new items from selected_services that are not in prevData
			const newItems = selected_services
				.filter((service) => !existingXValues.has(service))
				.map((key) => ({
					y: 100 / selected_services.length,
					x: services[key].name,
					selected: false,
				}));

			// Step 4: Combine filteredData and newItems
			return [...filteredData, ...newItems];
		});
	}

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: editMode ? 1 : 0, // Fade in if editMode is true, fade out otherwise
			duration: 400, // Duration of the animation in ms
			useNativeDriver: true, // Use native driver for better performance
		}).start();
	}, [editMode, fadeAnim]);

	useEffect(() => {
		setTimeout(() => {
			setEndAngle(360);
		}, 100);
		initiallizeData();
	}, []);
	useEffect(() => {
		setTimeout(() => {
			setEndAngle(360);
		}, 1);
	}, [endAngle]);

	useEffect(() => {}, [data]);

	useEffect(() => {
		alterData();
	}, [selected_services]);

	const sectionSelectione2 = (name: string) => {
		const startTime = performance.now();

		setData((prevData) => {
			let hasChanged = false;

			const newData = prevData.map((item) => {
				if (item.x === name) {
					hasChanged = true;
					return { ...item, selected: !item.selected };
				}
				if (item.selected) {
					hasChanged = true;
					return { ...item, selected: false };
				}
				return item;
			});

			return hasChanged ? newData : prevData;
		});

		const endTime = performance.now();
		const elapsedTime = endTime - startTime;

		console.log(`Function 1 took ${elapsedTime} milliseconds`);
	};

	function sectionSelection(name: string) {
		setData((prevData) =>
			prevData.map((item) =>
				item.x === name
					? { ...item, selected: !item.selected }
					: { ...item, selected: false }
			)
		);
	}

	function getSectionAngle() {
		const sectiondegree = 360 / selected_services.length;
		const timedifference = Math.ceil(
			30 -
				(periodUsestate[0].getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
		);
		return (sectiondegree * timedifference) / 32;
	}

	function toggleEdit() {
		setEditMode(!editMode);
	}

	function presentLinePositions() {
		// Convert angle to radians
		const angleInRadians = (getSectionAngle() - 90) * (Math.PI / 180);
		// Calculate start and end points for the line
		const x1 = radius * 1.1 + (radius + 10) * Math.cos(angleInRadians);
		const y1 = radius * 1.1 + (radius + 10) * Math.sin(angleInRadians);
		const x2 = radius * 1.1 + (radius - 40) * Math.cos(angleInRadians); // Adjust the length of the line
		const y2 = radius * 1.1 + (radius - 40) * Math.sin(angleInRadians);
		return [
			[x1, y1],
			[x2, y2],
		];
	}
	const handleLayout = (event: LayoutChangeEvent) => {
		const { x, y, width, height } = event.nativeEvent.layout;
		setLayout({ x, y, width, height });
		console.log(event.nativeEvent.layout);
	};

	return (
		<View style={styles.container}>
			<View
				style={{
					...styles.container,
					shadowOffset: {
						width: 0,
						height: 3,
					},
					shadowOpacity: 0.5,
					shadowRadius: 5,
				}}>
				<View style={styles.container} onLayout={handleLayout}>
					<VictoryPie
						key={data.map((d) => d.x).join(",")}
						endAngle={endAngle}
						animate={{
							easing: "bounce",
							duration: 1000,
						}}
						data={data}
						width={2.2 * radius}
						height={2.2 * radius}
						radius={({ index }) => radius + (index === 0 ? 10 : 0)}
						innerRadius={({ datum }) => radius - 30 - (datum.selected ? 20 : 0)}
						labelRadius={radius * 0.7}
						labelPlacement={"perpendicular"}
						style={{
							labels: {
								fill: ({ datum }: { datum: DataItem }) =>
									datum.selected ? "white" : "none",
								fontSize: radius / 12,
								pointerEvents: "none",
								bold: true,
							} as any,
							data: {
								opacity: ({ index }: { index: number }) =>
									index === 0 ? 1 : 0.9,
								stroke: ({ index }: { index: number }) =>
									index === 0 ? "gold" : "none",
								strokeWidth: 2,
							} as any,
						}}
						padAngle={3}
						events={[
							{
								target: "data",
								eventHandlers: {
									onPress: (event, props) => {
										sectionSelection(props.datum.x);
									},
								},
							},
						]}
						colorScale={colorScale}
					/>
					<DateLine
						radius={radius}
						periodUsestate={periodUsestate}
						selected_services={selected_services}
						parentLayout={layout}
					/>

					<Pressable
						onPress={toggleEdit}
						style={{
							position: "absolute",
							alignItems: "center",
							justifyContent: "center",
							height: radius / 2,
							aspectRatio: 1,
						}}>
						<Image
							source={require("../assets/images/calendar.png")}
							resizeMode={"contain"}
							style={{
								width: "100%",
								height: "100%",
							}}
						/>
					</Pressable>
				</View>
				<Animated.View
					style={[
						styles.container,
						{
							opacity: fadeAnim,
							transform: [
								{
									scale: fadeAnim.interpolate({
										inputRange: [0, 1],
										outputRange: [0.7, 1],
									}),
								},
							],

							pointerEvents: editMode ? "box-none" : "none",
						},
					]}>
					<EditComponents
						Radius={radius}
						service_usestate={[selected_services, setSelected_services]}
						angle_usestate={[endAngle, setEndAngle]}
					/>
				</Animated.View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	frame: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	container: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		width: "auto",
		pointerEvents: "box-none",
		borderRadius: 100,
	},
	svg_container: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
		pointerEvents: "box-none",
		borderRadius: 100,
	},
});

export default SamsaraWheel;
//<DateLine radius={radius} angle={getSectionAngle()} />
