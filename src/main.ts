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
		Logger.log("Chain Plugin loaded successfully");
	}

	onunload() {
		Logger.log("Chain Plugin unloaded");
	}

	private async initializeManagers() {
		this.settingsManager = new SettingsManager(this);
		await this.settingsManager.loadSettings();

		this.fileSystemManager = new FileSystemManager(this.app);
		this.journalManager = new JournalManager(
			this.app,
			this.settingsManager,
			this.fileSystemManager
		);

		this.uiManager = new UIManager(this);
		this.uiManager.initialize();

		this.pluginManager = new PluginManager(this, this.settingsManager);

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
