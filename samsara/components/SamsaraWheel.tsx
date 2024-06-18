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

import { Line, VictoryPie, VictoryContainer } from "victory-native";
import { services } from "@/constants/services";
import DateLine from "@/components/DateLine";
import EditComponents from "@/components/EditComponents";

interface Service {
	id: number;
	name: string;
	color: string;
}

interface DataItem {
	x: string;
	y: number;
	selected: boolean;
}

const SamsaraWheel: React.FC<{
	input_services: string[];
	end_period: Date;
}> = ({ input_services, end_period }) => {
	const today = new Date();
	const dimensions = Dimensions.get("window");
	const radius = dimensions.width / 4;
	const init_edit = false;
	const calendarSource = require("../assets/images/calendar.png"); // Adjust path if necessary
	let graphicData: DataItem[] = [];

	const [editMode, setEditMode] = useState(init_edit);
	const [selected_services, setSelected_services] = useState(input_services);
	const [data, setData] = useState(graphicData);

	const [streaming_services, setStreaming_services] = useState<Service[]>(
		Object.values(services).filter((service) =>
			selected_services.includes(service.name)
		)
	);
	const [colorScale, setColorScale] = useState(
		streaming_services.map((section) => section.color)
	);

	useEffect(() => {
		setStreaming_services(
			Object.values(services).filter((service) =>
				selected_services.includes(service.name)
			)
		);
	}, [selected_services]);

	useEffect(() => {
		setColorScale(streaming_services.map((section) => section.color));

		graphicData = [];

		for (let i = 0; i < streaming_services.length; i++) {
			graphicData.push({
				y: 100 / streaming_services.length,
				x: streaming_services[i].name,
				selected: false,
			});
		}

		console.log("resetting gaphic data: ", graphicData);
		setData(graphicData);
	}, [streaming_services]);

	function sectionSelection(name: string) {
		let newData: DataItem[] = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].x != name) {
				newData[i] = { y: data[i].y, x: data[i].x, selected: false };
			} else {
				newData[i] = {
					y: data[i].y,
					x: data[i].x,
					selected: !data[i].selected,
				};
			}
			setData(newData);
		}
	}

	function getSectionAngle() {
		const sectiondegree = 360 / streaming_services.length;
		const timedifference = Math.ceil(
			30 - (end_period.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
		);
		return (sectiondegree * timedifference) / 32;
	}

	function toggleEdit() {
		setEditMode(!editMode);
	}

	const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: editMode ? 1 : 0, // Fade in if editMode is true, fade out otherwise
			duration: 500, // Duration of the animation in ms
			useNativeDriver: true, // Use native driver for better performance
		}).start();
	}, [editMode, fadeAnim]);

	useEffect(() => {
		//console.log("data is updated: ", selected_services);
		//console.log("data is updated: ", data);
	}, [data]);

	return (	
		<View style={styles.container}>
			<View style={styles.container}>
				<View style={styles.container}>
					<VictoryPie
						key={data.map((datum) => datum.selected).join(",")}
						data={data}
						width={2 * radius}
						height={2 * radius}
						innerRadius={({ datum }) =>
							radius * 0.8 + (datum.selected ? 10 : 0)
						}
						style={{
							labels: {
								fill: ({ datum }: { datum: DataItem }) =>
									datum.selected ? "white" : "none",
								fontSize: 15,
								padding: 7,
								pointerEvents: "none",
							} as any,
						}}
						colorScale={colorScale}
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
						},
					]}>
					<EditComponents
						Radius={radius}
						service_usestate={[selected_services, setSelected_services]}
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
