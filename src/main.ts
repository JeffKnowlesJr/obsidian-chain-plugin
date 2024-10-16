/*
main.ts: Entry point for the Chain Plugin
- Initializes core plugin components
- Manages plugin lifecycle (load/unload)
- Coordinates interactions between managers
- Integrates with Obsidian's plugin system
*/

import { JournalManager } from "./managers/journalManager";
import { SettingsManager } from "./managers/settingsManager";
import { UIManager } from "./managers/uiManager";
import { FileSystemManager } from "./managers/fileSystemManager";
import { Plugin, Notice } from "obsidian";
import { Logger } from "./services/logger";

export default class ChainPlugin extends Plugin {
	journalManager: JournalManager;
	settingsManager: SettingsManager;
	uiManager: UIManager;
	fileSystemManager: FileSystemManager;

	async onload() {
		console.log("Chain Plugin is loading...");
		Logger.log("Chain Plugin onload method called");

		this.settingsManager = new SettingsManager(this);
		await this.settingsManager.loadSettings();

		this.fileSystemManager = new FileSystemManager(this.app);

		this.journalManager = new JournalManager(
			this.app,
			this.settingsManager,
			this.fileSystemManager
		);

		// Check for Daily Notes plugin
		const dailyNotesPlugin =
			this.app.internalPlugins.plugins["daily-notes"];
		if (!dailyNotesPlugin) {
			console.warn(
				"Daily Notes plugin is not enabled. Some features may not work as expected."
			);
			new Notice(
				"The Daily Notes core plugin is recommended for the Chain Plugin to work properly. Please enable it in the core plugins settings."
			);
		} else if (dailyNotesPlugin.enabled) {
			// Update Daily Notes plugin settings
			try {
				const dailyNotesInstance = dailyNotesPlugin.instance;
				if (dailyNotesInstance && dailyNotesInstance.options) {
					const oldDateFormat =
						dailyNotesInstance.options.format || "YYYY-MM-DD";
					const oldNewFileLocation =
						dailyNotesInstance.options.folder || "";

					const newDateFormat =
						this.settingsManager.getSetting("dateFormat") ||
						oldDateFormat;
					const newFileLocation =
						this.settingsManager.getSetting("newFileLocation") ||
						oldNewFileLocation;

					console.log(
						"Checking if Daily Notes plugin settings need updating..."
					);
					console.log(
						`Old date format: ${oldDateFormat}, New date format: ${newDateFormat}`
					);
					console.log(
						`Old file location: ${oldNewFileLocation}, New file location: ${newFileLocation}`
					);
					if (
						newDateFormat !== oldDateFormat ||
						newFileLocation !== oldNewFileLocation
					) {
						console.log(
							"Settings differ, updating Daily Notes plugin options..."
						);
						dailyNotesInstance.options.format = newDateFormat;
						dailyNotesInstance.options.folder = newFileLocation;

						console.log(
							"Saving updated Daily Notes plugin options..."
						);
						await dailyNotesPlugin.saveData(
							dailyNotesInstance.options
						);

						console.log(
							"Daily Notes plugin settings updated successfully:"
						);
						console.log(
							`Date format: ${oldDateFormat} -> ${newDateFormat}`
						);
						console.log(
							`New file location: ${oldNewFileLocation} -> ${newFileLocation}`
						);
						Logger.log(
							"Daily Notes plugin settings updated successfully"
						);
					} else {
						console.log("Daily Notes plugin settings unchanged");
					}
				} else {
					console.warn(
						"Daily Notes plugin instance or options not found."
					);
					Logger.warn(
						"Daily Notes plugin instance or options not found."
					);
				}
			} catch (error) {
				console.error(
					"Failed to update Daily Notes plugin settings:",
					error
				);
				Logger.error(
					"Failed to update Daily Notes plugin settings: " + error
				);
				console.log(
					"Stack trace:",
					error instanceof Error
						? error.stack
						: "No stack trace available"
				);
			}
		}

		this.uiManager = new UIManager(this);
		this.uiManager.initialize();

		if (this.settingsManager.getSetting("openDailyNoteOnStartup")) {
			this.journalManager.createOrUpdateDailyNote();
			console.log("Chain Plugin loaded successfully");
			Logger.log("Chain Plugin loaded successfully");
		}
	}

	onunload() {
		console.log("Chain Plugin unloaded");
	}
}
