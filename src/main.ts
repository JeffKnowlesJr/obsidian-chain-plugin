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
import { Plugin } from "obsidian";

export default class ChainPlugin extends Plugin {
	journalManager: JournalManager;
	settingsManager: SettingsManager;
	uiManager: UIManager;
	fileSystemManager: FileSystemManager;

	async onload() {
		if (!this.app.plugins.getPlugin("daily-notes")) {
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
		this.uiManager.addRibbonIcon();
		this.uiManager.addCommands();
		// ... (placeholder for additional initialization steps)
	}
}
