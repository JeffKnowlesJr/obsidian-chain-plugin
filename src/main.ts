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

		if (!this.app.internalPlugins.plugins["daily-notes"]) {
			console.log("Daily Notes plugin is not enabled");
			new Notice(
				"The Daily Notes core plugin is required for the Chain Plugin to work properly. Please enable it in the core plugins settings."
			);
			return;
		}

		this.settingsManager = new SettingsManager(this);
		await this.settingsManager.loadSettings();

		this.fileSystemManager = new FileSystemManager(this.app);

		this.journalManager = new JournalManager(
			this.app,
			this.settingsManager,
			this.fileSystemManager
		);
		this.uiManager = new UIManager(this);
		this.uiManager.addRibbonIcon(); // This will now add both icons
		this.uiManager.addCommands();

		console.log("Chain Plugin loaded successfully");
		Logger.log("Chain Plugin loaded successfully");
	}

	onunload() {
		console.log("Chain Plugin unloaded");
	}
}
