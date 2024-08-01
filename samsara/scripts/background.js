import React, { useEffect } from "react";
import { View, Text } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as FileSystem from "expo-file-system";

import {
	registerForPushNotificationsAsync,
	schedulePushNotification,
	alterPushNotifications,
} from "@/scripts/notifications";

const fileUri = FileSystem.documentDirectory + "state.json"; //possible duplicate
const BACKGROUND_FETCH_TASK = "update_state_file";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
	const now = Date.now();

	console.log(
		`Got background fetch call at date: ${new Date(now).toISOString()}`
	);

	return await updateStateFile();
});

(async () => {
	try {
		const fetchStatus = await BackgroundFetch.getStatusAsync();
		console.log("Background fetch status:", fetchStatus);
		if (fetchStatus === BackgroundFetch.BackgroundFetchStatus.Available) {
			const taskStatus = await TaskManager.isTaskRegisteredAsync(
				BACKGROUND_FETCH_TASK
			);
			console.log("Task status:", taskStatus);
			if (taskStatus) {
				const result = await registerBackgroundFetchAsync();
				console.log("Background fetch registered with result:", result);
				return;
			}
			else{
				TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
					const now = Date.now();
				
					console.log(
						`Got background fetch call at date: ${new Date(now).toISOString()}`
					);
				
					return await updateStateFile();
				});
				const result = await registerBackgroundFetchAsync();
				console.log("Background fetch registered with result:", result);
			}
		} else {
			console.log("Background fetch not available");
			return;
		}
	} catch (error) {
		console.error("Error registering background task:", error);
	}
})();

const saveStateToFile = async (state) => {
	try {
		const stateJson = JSON.stringify(state);
		await FileSystem.writeAsStringAsync(fileUri, stateJson);
		return BackgroundFetch.BackgroundFetchResult.NewData;
	} catch (error) {
		console.error("Error saving state:", error);
		return BackgroundFetch.BackgroundFetchResult.Failed;
	}
};

const updateStateFile = async () => {
	try {
		const fileInfo = await FileSystem.getInfoAsync(fileUri);
		console.log(fileUri);
		if (!fileInfo.exists) {
			console.log("File does not exist, background task will not run");
			return BackgroundFetch.BackgroundFetchResult.Failed;
		} else {
			const stateJson = await FileSystem.readAsStringAsync(fileUri);
			const state = JSON.parse(stateJson);

			if (state.end_period) {
				const now = new Date();
				const endPeriod = new Date(state.end_period);
				const selected_services = state.selected_services;

				if (endPeriod < now && selected_services.length > 0) {
					console.log("End period reached, resetting state");
					const monthsDiff = Math.ceil(
						(now.getTime() - endPeriod.getTime()) / (1000 * 60 * 60 * 24 * 30)
					);

					const new_period = new Date(
						endPeriod.setMonth(endPeriod.getMonth() + monthsDiff)
					);
					new_period.setHours(23, 59, 59, 999);

					let new_services;
					if (state.selected_services && state.selected_services != ["init"]) {
						new_services = state.selected_services;
					} else {
						new_services = [];
					}
					if (new_services.length > 1) {
						for (let i = 0; i < monthsDiff; i++) {
							const firstElement = new_services.shift();
							if (firstElement != undefined) {
								new_services.push(firstElement);
							}
						}
					}

					const new_state = {
						end_period: new_period,
						selected_services: new_services,
						notifications: true,
					};

					if (new_state.notifications) {
						if (new_services.length > 1) {
							alterPushNotifications(
								new_period,
								new_services[0],
								new_services[1]
							);
						} else if (selected_services.length == 1) {
							alterPushNotifications(
								new_period,
								new_services[0],
								new_services[0]
							);
						} else {
							cancelAllScheduledNotifications();
						}
					} else {
						cancelAllScheduledNotifications();
					}
					console.log("Push notifications altered from bacground fetch");
					return await saveStateToFile(new_state);
				} else {
					console.log("End period not reached, no state update needed");
					return BackgroundFetch.BackgroundFetchResult.NoData;
				}
			} else {
				console.log("End period not available");
				return BackgroundFetch.BackgroundFetchResult.Failed;
			}
		}
	} catch (error) {
		console.error("Error loading state:", error);
		return BackgroundFetch.BackgroundFetchResult.Failed;
	}
};

// Start the background worker
async function registerBackgroundFetchAsync() {
	const status = await BackgroundFetch.registerTaskAsync(
		BACKGROUND_FETCH_TASK,
		{
			minimumInterval: 15 * 60, // 15 minutes
			stopOnTerminate: false, // Whether to stop background fetch on app termination
			startOnBoot: true, // Whether to start background fetch on device boot
			enableHeadless: true, // Whether to run the task even if the app is not running
		}
	);

	console.log("[ Bacground fetch status ]", status);
	return status;
}

export default { registerBackgroundFetchAsync, updateStateFile };
