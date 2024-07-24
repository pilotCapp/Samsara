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
	angleUsestate: [number, React.Dispatch<React.SetStateAction<number>>];
}> = ({ serviceUsestate, centerUsestate, periodUsestate, angleUsestate }) => {
	const today = new Date();
	const dimensions = Dimensions.get("window");
	const radius = dimensions.width / 3;
	const init_edit = false;
	let graphicData: DataItem[] = [];

	const [editMode, setEditMode] = useState(init_edit);
	const [edit_index, setEdit_index] = useState<number | null>(1);
	const [selected_services, setSelected_services] = serviceUsestate;
	const [addServiceVisual, setAddServiceVisual] = centerUsestate;
	const [data, setData] = useState(graphicData);
	const [endAngle, setEndAngle] = angleUsestate;

	const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0

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
			if (selected_services.length > 1) {
				setEndAngle(360);
			} else {
				setEndAngle(359);
			}
		}, 100);
		initiallizeData();
	}, []);
	useEffect(() => {
		setTimeout(() => {
			if (selected_services.length > 1) {
				setEndAngle(360);
			} else {
				setEndAngle(359);
			}
		}, 10);
	}, [endAngle]);

	useEffect(() => {}, [data]);

	useEffect(() => {
		alterData();
		setEdit_index(null);
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

	function sectionSelection(name: string, index: number) {
		setData((prevData) =>
			prevData.map((item) =>
				item.x === name
					? { ...item, selected: !item.selected }
					: { ...item, selected: false }
			)
		);

		setEdit_index((prevIndex) => (index == prevIndex ? null : index));
	}

	function getSectionAngle() {
		const sectiondegree = 360 / selected_services.length;
		const timedifference = Math.ceil(
			30 -
				(periodUsestate[0].getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
		);
		return (sectiondegree * timedifference) / 32;
	}

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
						radius={({ index }) => radius + (index === 0 ? radius * 0.09 : 0)}
						innerRadius={({ datum }) =>
							radius - 30 - (datum.selected ? radius * 0.09 : 0)
						}
						labelRadius={({ datum }) =>
							radius - 60 - (datum.selected ? radius * 0.09 : 0)-radius/12
						}
						labelPlacement={"perpendicular"}
						style={{
							labels: {
								fill: ({ datum }: { datum: DataItem }) =>
									datum.selected ? "white" : "white",
								fontSize: radius / 12,
								pointerEvents: "none",
								bold: true,
								opacity: ({ datum }: { datum: DataItem }) =>
									datum.selected ? 1 : 0.7,
								fontWeight: ({ datum }: { datum: DataItem }) =>
									datum.selected ? "bold" : "normal",
							} as any,
							data: {
								opacity: ({ index }: { index: number }) =>
									index === 0 ? 1 : 0.9,
								stroke: ({ index }: { index: number }) =>
									index === 0 ? "white" : "none",
								strokeWidth: 3,
								strokeOpacity: 0.5,
							} as any,
						}}
						padAngle={3}
						events={[
							{
								target: "data",
								eventHandlers: {
									onPress: (event, props) => {
										sectionSelection(props.datum.x, props.index);
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
					/>
				</View>
				<EditComponents
					Radius={radius}
					service_usestate={[selected_services, setSelected_services]}
					angle_usestate={[endAngle, setEndAngle]}
					period_usestate={periodUsestate}
					edit_usestate={[edit_index, setEdit_index]}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		width: "auto",
		pointerEvents: "box-none",
		borderRadius: 100,
	},
});

export default SamsaraWheel;
