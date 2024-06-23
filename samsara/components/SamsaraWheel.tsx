import {
	View,
	Pressable,
	StyleSheet,
	Dimensions,
	Image,
	Animated,
	Button,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";

import { ThemedText } from "@/components/ThemedText";
import { transform } from "@babel/core";
import Svg, {
	Path,
	Text as SvgText,
	Defs,
	TextPath,
	Circle,
} from "react-native-svg";

import { Service, DataItem } from "@/types";

import {
	Line,
	VictoryPie,
	VictoryContainer,
	VictoryLabel,
} from "victory-native";
import { services } from "@/constants/services";
import DateLine from "@/components/DateLine";
import EditComponents from "@/components/EditComponents";

const SamsaraWheel: React.FC<{
	serviceUsestate: [string[], React.Dispatch<React.SetStateAction<string[]>>];
	end_period: Date;
}> = ({ serviceUsestate, end_period }) => {
	const today = new Date();
	const dimensions = Dimensions.get("window");
	const radius = dimensions.width / 3;
	const init_edit = false;
	const calendarSource = require("../assets/images/calendar.png"); // Adjust path if necessary
	let graphicData: DataItem[] = [];

	const [editMode, setEditMode] = useState(init_edit);
	const [selected_services, setSelected_services] = serviceUsestate;
	const [data, setData] = useState(graphicData);
	const [endAngle, setEndAngle] = useState(0);

	const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0

	let colorScale = selected_services.map(
		(key) => services[key.toLowerCase()].colors[0]
	);

	function initiallizeData() {
		const newData: DataItem[] = selected_services.map((key) => ({
			y: 100 / selected_services.length,
			x: key,
			selected: false,
		}));

		setData(newData);
	}

	function alterData() {
		colorScale = selected_services.map(
			(key) => services[key.toLowerCase()].colors[0]
		);
		console.log("data altered");
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
					x: key,
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
		console.log("angle edited");
		setTimeout(() => {
			setEndAngle(360);
		}, 1);
	}, [endAngle]);

	useEffect(() => {
		console.log(data.length);
	}, [data]);

	useEffect(() => {
		alterData();
	}, [selected_services]);

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
			30 - (end_period.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
		);
		return (sectiondegree * timedifference) / 32;
	}

	function toggleEdit() {
		setEditMode(!editMode);
	}

	return (
		<View style={styles.container}>
			<View style={styles.container}>
				<View style={styles.container}>
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
						innerRadius={({ datum }) => radius - 30 - (datum.selected ? 10 : 0)}
						labelRadius={radius - 60}
						labelPlacement={"perpendicular"}
						style={{
							labels: {
								fill: ({ datum }: { datum: DataItem }) =>
									datum.selected ? "white" : "none",
								fontSize: 15,
								padding: 3,
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
					<Svg style={styles.svg_container}>
						<DateLine radius={radius} angle={getSectionAngle()} />
					</Svg>
					<Pressable onPress={toggleEdit} style={{ position: "absolute" }}>
						<Image
							source={calendarSource}
							style={{
								width: radius / 2,
								height: radius / 2,
							}}
							resizeMode='contain' // Maintain aspect ratio
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
