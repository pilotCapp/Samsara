import { Button, Pressable, StyleSheet, Text, View, Image } from "react-native";
import SamsaraWheel from "@/components/SamsaraWheel";
import Header from "./header";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Service } from "@/types";
import { services } from "@/constants/services";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import DragMenu from "@/components/DragMenu";

export default function Page() {
	const fileUri = FileSystem.documentDirectory + "state.json";

	const [end_period, setEnd_period] = useState(() => {
		const today = new Date();
		const futureDate = new Date(today);
		futureDate.setDate(futureDate.getDate() + 20);
		return futureDate;
	});

	const init_services: string[] = ["init"];
	const [endAngle, setEndAngle] = useState(0);
	const [selected_services, setSelected_services] =
		useState<string[]>(init_services);
	const [selected_service_data, setSelected_service_data] = useState<
		Service[] | null
	>([services["init"], services["init"]]);

	const [addServiceVisual, setAddServiceVisual] = useState(false);

	useEffect(() => {
		loadStateFromFile();
	}, []);

	useEffect(() => {
		if (selected_services.length > 1) {
			const selectedServiceKey = selected_services[0].toLowerCase();
			const nextServiceKey = selected_services[1].toLowerCase();
			const serviceData = [
				services[selectedServiceKey],
				services[nextServiceKey],
			];
			setSelected_service_data(serviceData);
		} else if (selected_services.length == 1) {
			const selectedServiceKey = selected_services[0].toLowerCase();
			const nextServiceKey = selected_services[0].toLowerCase();
			const serviceData = [
				services[selectedServiceKey],
				services[nextServiceKey],
			];
			setSelected_service_data(serviceData);
		} else {
			setSelected_service_data([services["none"], services["none"]]);
		}

		if (!selected_services.includes(init_services[0])) {
			const newState = {
				end_period: end_period, // Use current date for initial state
				selected_services: selected_services,
			};

			saveStateToFile(newState);
		}
	}, [selected_services]);

	useEffect(() => {
		const today = new Date();
		today.setHours(23, 59, 59, 999);
		const timedifference = end_period.getTime() - today.getTime();
		if (timedifference < 0 || timedifference > 30 * (1000 * 60 * 60 * 24)) {
			console.log(
				"end period",
				end_period,
				"is not valid with timedifference",
				timedifference
			);
			throw new Error("date is invalid");
		} else if (!selected_services.includes(init_services[0])) {
			const newState = {
				end_period: end_period, // Use current date for initial state
				selected_services: selected_services,
			};

			saveStateToFile(newState);
			console.log(
				"period changed to",
				end_period,
				"with timedifference",
				timedifference
			);
		}
	}, [end_period]);

	const saveStateToFile = async (state) => {
		try {
			const stateJson = JSON.stringify(state);
			await FileSystem.writeAsStringAsync(fileUri, stateJson);
		} catch (error) {
			console.error("Error saving state:", error);
		}
	};

	const loadStateFromFile = async () => {
		try {
			const fileInfo = await FileSystem.getInfoAsync(fileUri);

			if (!fileInfo.exists) {
				console.log("File does not exist, creating with default values.");

				const currentDate = new Date();

				// Step 2: Add 30 days
				const futureDate = new Date();
				futureDate.setDate(currentDate.getDate() + 30);
				const defaultState = {
					end_period: futureDate, // Use current date for initial state
					selected_services: init_services,
				};

				saveStateToFile(defaultState); // Create the file with default values

				setEnd_period(new Date(defaultState.end_period));
				setSelected_services(defaultState.selected_services);

				return;
			}

			const stateJson = await FileSystem.readAsStringAsync(fileUri);
			const state = JSON.parse(stateJson);

			// Convert string back to Date object
			if (state.end_period) {
				setEnd_period(new Date(state.end_period));
			} else {
				setEnd_period(new Date());
				throw new Error("End period not found in state");
			}
			if (state.selected_services) {
				setSelected_services(state.selected_services);
			} else {
				setSelected_services(init_services);
				throw new Error("Selected services not found in state");
			}
		} catch (error) {
			console.error("Error loading state:", error);
		}
	};

	return (
		<View style={{ height: "100%", width: "100%" }}>
			{/* Your always-rendered component goes here */}
			{selected_services.length > 0 && selected_service_data ? (
				<LinearGradient
					// Button Linear Gradient
					locations={[0.05, 0.7, 1]}
					colors={selected_service_data[0].colors.slice(0, 3).reverse()} // Fixed reverse method
					style={styles.container}>
					<Stack.Screen
						name=''
						options={{
							title: "main_header",
							header: () =>
								selected_services.length > 0 ? (
									<Header service_data={selected_service_data[0]} />
								) : (
									<View />
								),
						}}
					/>
					<View style={styles.main}>
						<SamsaraWheel
							serviceUsestate={[selected_services, setSelected_services]}
							centerUsestate={[addServiceVisual, setAddServiceVisual]}
							periodUsestate={[end_period, setEnd_period]}
							angleUsestate={[endAngle, setEndAngle]}
						/>
					</View>
					<View
						style={{
							position: "absolute",
							width: "100%",
							alignItems: "flex-end",
						}}>
						<View style={{ alignItems: "flex-start" }}>
							<Text
								style={{
									color: "white",
									opacity: 0.8,
									fontSize: 12,
									margin: 5,
								}}>
								upcoming:
							</Text>
							<View
								style={{
									width: "25%",
									aspectRatio: 2,
									backgroundColor: selected_service_data[1].colors[0],
									borderRadius: 10,
									borderColor: "white",
									borderWidth: 1,
									alignSelf: "flex-end",
									padding: 10,
									marginRight: 15,
									shadowOffset: {
										width: 0,
										height: 3,
									},
									shadowOpacity: 0.5,
									shadowRadius: 5,
								}}>
								<Image
									source={selected_service_data[1].image}
									style={{ height: "100%", width: "100%" }}
									resizeMode={"contain"}
								/>
							</View>
						</View>
					</View>
				</LinearGradient>
			) : (
				<View
					style={{
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#E5E4E2",
						flex: 1,
					}}>
					<Stack.Screen
						options={{
							title: "null_header",
							header: () => (
								<View style={styles.no_services_header}>
									<Text style={styles.subtitle}>
										Please add some services below
									</Text>
								</View>
							),
						}}
					/>
				</View>
			)}
			<DragMenu
				serviceUsestate={[selected_services, setSelected_services]}
				centerUsestate={[addServiceVisual, setAddServiceVisual]}
				angleUsestate={[endAngle, setEndAngle]}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	main: {
		flex: 1,
		justifyContent: "center",
		maxWidth: 960,
		marginHorizontal: "auto",
	},
	title: {
		fontSize: 64,
		fontWeight: "bold",
	},
	subtitle: {
		fontSize: 36,
	},
	no_services_header: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
		backgroundColor: "white",
		top: 0,
		left: 0,
		height: 150,
		width: "100%",
		position: "absolute",
		borderRadius: 10,
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
	},
});

const serviceStyles = StyleSheet.create({
	prime: {
		backgroundColor: "#CFE8FF",
	},
	disney: {
		backgroundColor: "#1B1F4A",
	},
	netflix: {
		backgroundColor: "#8B3C3C",
	},
	roku: {
		backgroundColor: "#6f1ab1",
	},
	hulu: {
		backgroundColor: "#1ce783",
	},
	hbo: {
		backgroundColor: "#000",
	},
	apple: {
		backgroundColor: "#000",
	},
	youtube: {
		backgroundColor: "#ff0000",
	},
	paramount: {
		backgroundColor: "#000",
	},
});

// selected_service_data
// 					? {
// 							flex: 1,
// 							alignItems: "center",
// 							padding: 24,
// 							...serviceStyles[selected_services[0].toLowerCase()],
// 					  }
// 					: styles.container
