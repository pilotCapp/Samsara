import { View, Pressable, StyleSheet, Dimensions, Image } from "react-native";
import React, { useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { transform } from "@babel/core";
import Svg, {
	Path,
	Text as SvgText,
	Defs,
	TextPath,
	Circle,
} from "react-native-svg";

import { Line, VictoryPie } from "victory-native";
import { services } from "@/constants/services";
import DateLine from "@/components/DateLine";

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
	selected_services: string[];
	end_period: Date;
}> = ({ selected_services, end_period }) => {
	const today = new Date();
	const dimensions = Dimensions.get("window");
	const radius = dimensions.width / 4;

	const calendarSource = require("../assets/images/calendar.png"); // Adjust path if necessary

	let sections: Service[] = Object.values(services).filter((service) =>
		selected_services.includes(service.name)
	);

	const graphicData = [];
	for (let i = 0; i < sections.length; i++) {
		graphicData.push({
			y: 100 / sections.length,
			x: sections[i].name,
			selected: false,
		});
	}
	const [data, setData] = useState(graphicData);

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
		const sectiondegree = 360 / sections.length;
		const timedifference = Math.ceil(30-
			(end_period.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
		);
		return (sectiondegree * timedifference)/32;
	}

	const colorScale = sections.map((section) => section.color);

	let tall = 0;
	function testfunction() {
		tall++;
		console.log("test" + tall);
	}

	return (
		<View style={styles.frame}>
			<View style={styles.container}>
				<VictoryPie
					key={data.map((datum) => datum.selected).join(",")}
					data={data}
					width={2 * radius}
					height={2 * radius}
					innerRadius={({ datum }) => radius * 0.8 + (datum.selected ? 10 : 0)}
					style={{
						labels: {
							fill: ({ datum }: { datum: DataItem }) =>
								datum.selected ? "white" : "none",
							fontSize: 15,
							padding: 7,
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
				<Pressable onPress={testfunction} style={{ position: "absolute"}}>
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
		justifyContent: "center",
		alignItems: "center",
		width: "auto",
	},
	svg_container: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
	},
});

export default SamsaraWheel;
//<DateLine radius={radius} angle={getSectionAngle()} />