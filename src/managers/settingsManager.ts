// settingsManager.ts
import { Plugin } from "obsidian";

interface ChainPluginSettings {
	journalFolder: string;
	defaultTemplate: string;
}

const DEFAULT_SETTINGS: ChainPluginSettings = {
	journalFolder: "Journal",
	defaultTemplate:
		"# Journal Entry for {date}\n\n## Today's Goals\n\n## Notes\n\n## Reflections\n",
};

export class SettingsManager {
	private settings: ChainPluginSettings;

	constructor(private plugin: Plugin) {
		this.settings = DEFAULT_SETTINGS;
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.plugin.loadData()
		);
	}

	async saveSettings() {
		await this.plugin.saveData(this.settings);
	}

	getSetting(key: keyof ChainPluginSettings) {
		return this.settings[key];
	}

	setSetting(key: keyof ChainPluginSettings, value: string) {
		this.settings[key] = value;
		this.saveSettings();
	}
}
