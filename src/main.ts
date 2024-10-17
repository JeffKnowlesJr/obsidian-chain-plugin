/*
Main Entry Point (src/main.ts):
This file serves as the primary entry point for the Chain Plugin. It initializes all plugin components,
manages the plugin lifecycle, and coordinates between different managers. The ChainPlugin class extends
Obsidian's Plugin class and implements the core functionality:

1. Imports necessary managers and services.
2. Defines the ChainPlugin class with manager properties.
3. Implements onload() method to initialize the plugin:
   - Initializes all managers
   - Checks for the Daily Notes plugin
   - Handles startup tasks (e.g., opening daily note)
   - Updates Daily Notes settings
4. Implements onunload() method for plugin cleanup.
5. Provides methods for initializing managers, handling startup, and updating settings.

This structure allows for modular development and easy maintenance of the plugin's core functionalities.
*/

import { JournalManager } from "./managers/journalManager";
import { SettingsManager } from "./managers/settingsManager";
import { UIManager } from "./managers/uiManager";
import { FileSystemManager } from "./managers/fileSystemManager";
import { PluginManager } from "./managers/pluginManager";
import { Plugin, Notice } from "obsidian";
import { Logger } from "./services/logger";

export default class ChainPlugin extends Plugin {
	journalManager: JournalManager;
	settingsManager: SettingsManager;
	uiManager: UIManager;
	fileSystemManager: FileSystemManager;
	pluginManager: PluginManager;

	async onload() {
		Logger.log("Chain Plugin is loading...");
		await this.initializeManagers();
		this.pluginManager.checkDailyNotesPlugin();
		await this.handleStartup();
		await this.updateDailyNotesSettings();
		Logger.log("Chain Plugin loaded successfully");
	}

	onunload() {
		Logger.log("Chain Plugin unloaded");
	}

	private async initializeManagers() {
		this.settingsManager = new SettingsManager(this);

		this.fileSystemManager = new FileSystemManager(this.app);
		this.journalManager = new JournalManager(
			this.app,
			this.settingsManager,
			this.fileSystemManager
		);

		this.pluginManager = new PluginManager(this, this.settingsManager);

		this.uiManager = new UIManager(this);
		this.uiManager.initialize();

		Logger.log("All managers initialized successfully.");
	}

	private async handleStartup() {
		if (this.settingsManager.getSetting("openDailyNoteOnStartup")) {
			try {
				await this.journalManager.createOrUpdateDailyNote();
				Logger.log("Daily note created/opened on startup");
			} catch (error) {
				Logger.error(
					`Error creating/opening daily note on startup: ${error}`
				);
				new Notice(
					"Failed to create/open daily note on startup. Check console for details."
				);
			}
		}
	}

	public async updateDailyNotesSettings() {
		await this.pluginManager.updateDailyNotesSettings();
	}
}
