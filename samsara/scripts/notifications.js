import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MIN,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
		return finalStatus;
	}

	if (finalStatus !== "granted") {
		alert("Failed to get push token for push notification");
		return finalStatus;
	}

	return finalStatus;
}

export async function schedulePushNotification(
	date,
	current_service,
	next_service
) {
	const today = new Date();

	let dayBefore = new Date(date);
	dayBefore.setDate(date.getDate() - 1);
	let weekBefore = new Date(date);
	weekBefore.setDate(date.getDate() - 7);

	if (date > today) {
		await Notifications.scheduleNotificationAsync({
			content: {
				title: "Subscription Changed",
				body: `Remember to start your subsrciption to ${next_service}, and cancel your current subscription`,
			},
			trigger: { date: date }, // Schedule for the date
		});
		if (dayBefore > today) {
			await Notifications.scheduleNotificationAsync({
				content: {
					title: `Subscription to ${current_service} ends in one day!`,
					body: `Please cancel your subscription to avoid charges, and create a subscription to ${next_service}`,
				},
				trigger: { date: dayBefore }, // Schedule for one day ahead of date
			});
			if (weekBefore > today) {
				await Notifications.scheduleNotificationAsync({
					content: {
						title: `Subscription to ${current_service} ends in one week!`,
						body: `If you plan to change subscription to ${next_service} there is no point in waiting. Remember to turn of further notices in the app after you have made the change`,
					},
					trigger: { date: weekBefore }, // Schedule for one week ahead of date
				});
			}
		}
	}
}

export async function cancelAllScheduledNotifications() {
	await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function alterPushNotifications(
	date,
	current_service,
	next_service
) {
	await cancelAllScheduledNotifications();
	await schedulePushNotification(date, current_service, next_service);
	const scheduledNotifications =
		await Notifications.getAllScheduledNotificationsAsync();
	console.log(scheduledNotifications.length, scheduledNotifications);
}
