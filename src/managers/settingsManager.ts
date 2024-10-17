/*
SettingsManager.ts: Manages settings for the Chain Plugin

This file defines the SettingsManager class, which is responsible for:
1. Loading and saving plugin settings

Key features:
- Loads settings from Obsidian's data storage
- Merges loaded settings with default settings
- Saves settings back to Obsidian's data storage
- Provides type-safe access to settings via getSetting and setSetting methods
- Triggers updates to Daily Notes plugin settings when relevant settings change
- Includes error handling and logging for robustness

The SettingsManager is a crucial component of the Chain Plugin, ensuring
consistent and reliable management of user preferences and plugin configuration.
*/

import { Plugin } from "obsidian";
import { SETTINGS, ChainPluginSettings } from "../config/constants";
import { Logger } from "../services/logger";
import ChainPlugin from "../main";
import { DEFAULT_SETTINGS } from "../config/defaultSettings";
import { DEFAULT_TEMPLATE } from "../config/defaultTemplate";

export class SettingsManager {
	private settings: ChainPluginSettings;

	constructor(private plugin: ChainPlugin) {
		this.settings = DEFAULT_SETTINGS;
	}

	async loadSettings() {
		try {
			const loadedData = await this.plugin.loadData();
			Logger.debug(`Loaded data: ${JSON.stringify(loadedData, null, 2)}`);

			if (loadedData && typeof loadedData === "object") {
				this.settings = {
					...DEFAULT_SETTINGS,
					...loadedData,
				};
				Logger.debug(
					`Merged settings: ${JSON.stringify(this.settings, null, 2)}`
				);
			} else {
				Logger.warn(
					"Invalid or empty plugin data, using default settings"
				);
				this.settings = DEFAULT_SETTINGS;
			}
		} catch (error) {
			Logger.error(`Failed to load plugin settings: ${error}`);
			this.settings = DEFAULT_SETTINGS;
		}

		// Ensure the settings file is properly saved after loading
		await this.saveSettings();
		Logger.debug(
			`Final settings after save: ${JSON.stringify(
				this.settings,
				null,
				2
			)}`
		);
	}

	async saveSettings() {
		try {
			await this.plugin.saveData(this.settings);
		} catch (error) {
			console.error("Failed to save plugin settings:", error);
			Logger.error(error as Error);
			new Notice(
				"Failed to save Chain Plugin settings. Check console for details."
			);
		}
	}

	getSetting(key: keyof ChainPluginSettings): any {
		const value = this.settings[key];
		Logger.debug(`Getting setting ${key}: ${value}`);
		return value;
	}

	async setSetting(key: keyof ChainPluginSettings, value: any) {
		if (this.settings[key] !== value) {
			this.settings[key] = value;
			await this.saveSettings();
			if (
				key === "dateFormat" ||
				key === "newFileLocation" ||
				key === "templateFileLocation"
			) {
				await this.plugin.updateDailyNotesSettings();
			}
		}
	}

	private async ensureTemplateFileExists() {
		const templatePath = this.settingsManager.getSetting(
			"templateFileLocation"
		);
		const templateFile = this.app.vault.getAbstractFileByPath(templatePath);

		if (!templateFile) {
			const templateDir = templatePath.substring(
				0,
				templatePath.lastIndexOf("/")
			);
			await this.fileSystemManager.createDirectory(templateDir);

			await this.fileSystemManager.createFile(
				templatePath,
				DEFAULT_TEMPLATE
			);
			Logger.log("Daily Notes Template created");
		}
	}
}
