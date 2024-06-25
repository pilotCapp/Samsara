import { StyleSheet, Text, View } from "react-native";
import SamsaraWheel from "@/components/SamsaraWheel";
import Header from "./header";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Service } from "@/types";
import { services } from "@/constants/services";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";

export default function Page() {
	const fileUri = FileSystem.documentDirectory + "state.json";

	const [end_period, setEnd_period] = useState(() => {
		const today = new Date();
		const futureDate = new Date(today);
		futureDate.setDate(futureDate.getDate() + 20);
		return futureDate;
	});

	const init_services: string[] = [
		"paramount",
		"hulu",
		"youtube",
		"apple",
		"roku",
		"netflix",
		"prime",
		"disney",
		"hbo",
	];

	const [selected_services, setSelected_services] =
		useState<String[]>(init_services);
	const [selected_service_data, setSelected_service_data] =
		useState<Service | null>({
			name: "test",
			colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
			id: 0,
			image: require("../assets/logos/disney.png"),
		});

	useEffect(() => {
		loadStateFromFile();
		setSelected_service_data(selected_services);
	}, []);

	useEffect(() => {
		console.log("Selected services changed:", selected_services);
		if (selected_services.length > 0) {
			const serviceKey = selected_services[0].toLowerCase();
			const serviceData = services[serviceKey];
			setSelected_service_data(serviceData);
		} else {
			setSelected_service_data({
				name: "test",
				colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
				id: 0,
				image: require("../assets/logos/disney.png"),
			});
		}
		if (selected_services != init_services || true) { //true for testing only
			const newState = {
				end_period: end_period, // Use current date for initial state
				selected_services: selected_services,
			};

			saveStateToFile(newState);
		}
	}, [selected_services]);

	const saveStateToFile = async (state) => {
		try {
			const stateJson = JSON.stringify(state);
			await FileSystem.writeAsStringAsync(fileUri, stateJson);
			console.log("State saved successfully");
		} catch (error) {
			console.error("Error saving state:", error);
		}
	};

	const loadStateFromFile = async () => {
		try {
			const fileInfo = await FileSystem.getInfoAsync(fileUri);

			if (!fileInfo.exists) {
				console.log("File does not exist, creating with default values.");

				const defaultState = {
					end_period: new Date().toISOString(), // Use current date for initial state
					selected_services: init_services,
				};

				await saveStateToFile(defaultState); // Create the file with default values

				setEnd_period(new Date(defaultState.end_period));
				setSelected_services(defaultState.selected_services);

				return;
			}

			const stateJson = await FileSystem.readAsStringAsync(fileUri);
			const state = JSON.parse(stateJson);

			// Convert string back to Date object
			if (state.end_period) {
				setEnd_period(new Date(state.end_period));
			}
			if (state.selected_services) {
				console.log("selected services gathered");
				setSelected_services(state.selected_services);
			}

			console.log("State loaded successfully");
		} catch (error) {
			console.error("Error loading state:", error);
		}
	};

	return selected_services.length > 0 ? (
		<LinearGradient
			// Button Linear Gradient
			locations={[0.05, 0.7, 1]}
			colors={selected_service_data.colors.slice(0, 3).reverse()} // Fixed reverse method
			style={styles.container}>
			<Stack.Screen
				name=''
				options={{
					title: "test",
					header: () =>
						selected_services.length > 0 ? (
							<Header service_data={selected_service_data} />
						) : (
							<View />
						),
				}}
			/>
			<View style={styles.main}>
				<SamsaraWheel
					serviceUsestate={[selected_services, setSelected_services]}
					end_period={end_period}
				/>
			</View>
		</LinearGradient>
	) : (
		<View>
			<Stack.Screen />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		padding: 24,
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
		color: "#38434D",
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
