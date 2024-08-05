import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
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

	const periodDate = new Date(date);
	let dayBefore = new Date(periodDate);
	dayBefore.setDate(periodDate.getDate() - 1);
	let weekBefore = new Date(periodDate);
	weekBefore.setDate(periodDate.getDate() - 7);

	const titles =
		current_service == next_service
			? [
					"Subscription Renewed",
					`Subscription to ${current_service} renewes in one day!`,
					`Subscription to ${current_service} renewes in one week!`,
			  ]
			: [
					"Subscription Changed",
					`Subscription to ${current_service} ends in one day!`,
					`Subscription to ${current_service} ends in one week!`,
			  ];
	const bodies =
		current_service == next_service
			? [
					`You have renewed your subscription to ${current_service}`,
					`If you want to cancel or switch out your subscription to ${current_service} you have one day left`,
					`If you want to cancel or switch out your subscription to ${current_service} you have one day left, if not you can turn of further notices in the app`,
			  ]
			: [
					`Remember to start your subsrciption to ${next_service}, and cancel your current subscription`,
					`Please cancel your subscription to avoid charges, and create a subscription to ${next_service}`,
					`If you plan to change subscription to ${next_service} there is no point in waiting. Remember to turn of further notices in the app after you have made the change`,
			  ];

	const testDate = new Date(today.getTime() + 10000);

	console.log("attempting to schedule test notification");
	testStatus = await Notifications.scheduleNotificationAsync({
		content: {
			title: titles[0],
			body: bodies[0],
		},
		trigger: { date: testDate }, // Schedule in 10 seconds
	});
	console.log("test notification scheduled with status", testStatus);

	if (periodDate > today) {
		await Notifications.scheduleNotificationAsync({
			content: {
				title: titles[0],
				body: bodies[0],
			},
			trigger: { date: periodDate }, // Schedule for the date
		});

		if (dayBefore > today) {
			await Notifications.scheduleNotificationAsync({
				content: {
					title: titles[1],
					body: bodies[1],
				},
				trigger: { date: dayBefore }, // Schedule for one day ahead of date
			});
			if (weekBefore > today) {
				await Notifications.scheduleNotificationAsync({
					content: {
						title: titles[2],
						body: bodies[2],
					},
					trigger: { date: weekBefore }, // Schedule for one week ahead of date
				});
			}
		}
		return "success";
	}
	return "failure";
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
	const notificationSatus = await schedulePushNotification(
		date,
		current_service,
		next_service
	);
	console.log("notifications scheduled with status", notificationSatus);
}

export async function getNotificationPermissions() {
	console.log("getting notification permissions");
	const permission = await Notification.getPermissionsAsync();
	return permission.status;
}
