// settingsManager.ts
import { Plugin } from "obsidian";
import { SETTINGS } from "../constants";
import { Logger } from "../services/logger";

/*
settingsManager.ts: Manages plugin settings
- Defines default settings and types
- Loads and saves user settings
- Provides methods to get and set individual settings
*/

interface ChainPluginSettings {
	journalFolder: string;
	defaultTemplate: string;
	dailyNotesFolderOverride: string;
	dateFormat: string;
	newFileLocation: string;
	templateFileLocation: string;
	openDailyNoteOnStartup: boolean;
}

const DEFAULT_SETTINGS: ChainPluginSettings = {
	journalFolder: "Journal",
	defaultTemplate:
		"# Journal Entry for {date}\n\n## Today's Goals\n\n## Notes\n\n## Reflections\n",
	dailyNotesFolderOverride: "",
	dateFormat: "YYYY-MM-DD",
	newFileLocation: "",
	templateFileLocation: "",
	openDailyNoteOnStartup: false,
};

export class SettingsManager {
	private settings: ChainPluginSettings;

	constructor(private plugin: Plugin) {
		this.settings = DEFAULT_SETTINGS;
	}

	async loadSettings() {
		try {
			const loadedData = await this.plugin.loadData();
			this.settings = {
				...DEFAULT_SETTINGS,
				...loadedData,
			};
		} catch (error) {
			Logger.error(error as Error);
			this.settings = DEFAULT_SETTINGS;
		}
	}

	async saveSettings() {
		try {
			await this.plugin.saveData(this.settings);
		} catch (error) {
			Logger.error(error as Error);
		}
	}

	getSetting(key: keyof ChainPluginSettings): any {
		return this.settings[key];
	}

	setSetting(key: keyof ChainPluginSettings, value: any) {
		this.settings[key] = value;
		this.saveSettings();
	}
}
