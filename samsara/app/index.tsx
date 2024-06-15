import { StyleSheet, Text, View } from "react-native";
import SamsaraWheel from "@/components/SamsaraWheel";

export default function Page() {
	const end_period = new Date();
	end_period.setDate(end_period.getDate() + 20);

	return (
		<View style={styles.container}>
			<View style={styles.main}>
				<SamsaraWheel
					input_services={["Netflix", "Disney+", "Hulu", "Prime", "HBO"]}
					end_period={end_period}
				/>
			</View>
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
