import React, { useEffect } from "react";
import { View, Text } from "react-native";
import BackgroundTask from "react-native-background-task";
import BackgroundFetch from "react-native-background-fetch";
import * as FileSystem from "expo-file-system";

const fileUri = FileSystem.documentDirectory + "state.json"; //possible duplicate

const saveStateToFile = async (state) => {
	try {
		const stateJson = JSON.stringify(state);
		await FileSystem.writeAsStringAsync(fileUri, stateJson);
	} catch (error) {
		console.error("Error saving state:", error);
	}
};

const updateStateFile = async () => {
	try {
		const stateJson = await FileSystem.readAsStringAsync(fileUri);

		if (!stateJson.exists) {
			console.log("File does not exist, background task will not run");
			return;
		} else {
			const state = JSON.parse(stateJson);

			if (state.end_period) {
				const now = new Date();
				const endPeriod = new Date(state.end_period);
				const selected_services = state.selected_services;

				if (
					now.getTime() >= endPeriod.getTime() &&
					selected_services.length > 0
				) {
					console.log("End period reached, resetting state");
					const monthsDiff = Math.ceil(
						(endPeriod.getTime() - now.getTime()) / 1000 / 60 / 60 / 24 / 30
					);

					const new_period = new Date(
						endPeriod.setMonth(endPeriod.getMonth() + monthsDiff)
					);
					const new_services = selected_services;

					const lastElement = new_services.pop();
					new_services.unshift(lastElement);

					const new_state = {
						end_period: new_period,
						selected_services: new_services,
						notifications: state.notifications,
					};

					await saveStateToFile(new_state);

					return;
				}
			}
		}
	} catch (error) {
		console.error("Error loading state:", error);
	}
};

// Example of OS determined task schedule

// Start the background worker
const initBackgroundFetch = async () => {
	const status = await BackgroundFetch.configure(
		{
			minimumFetchInterval: 12 * 60, // Minimum fetch interval in minutes
			stopOnTerminate: false, // Whether to stop background fetch on app termination
			startOnBoot: true, // Whether to start background fetch on device boot
			enableHeadless: true, // Whether to run the task even if the app is not running
		},
		handleTask,
		onTimeout
	);

	console.log("[ RNBF STATUS ]", status);
	return status;
};

// handleTask is called periodically when RNBF triggers an event
const handleTask = async (taskId) => {
	console.log("[ RNBF TASK ID ]", taskId);

	// DO BACKGROUND WORK HERE
	await updateStateFile();

	// This MUST be called in order to signal to the OS that your task is complete
	BackgroundFetch.finish(taskId);
};

const onTimeout = async () => {
	// The timeout function is called when the OS signals that the task has reached its maximum execution time.

	// ADD CLEANUP WORK HERE (IF NEEDED)
	BackgroundFetch.finish(taskId);
};

export default initBackgroundFetch();
