import ChainPlugin from "../main";
import { Plugin, Notice } from "obsidian";
import { Logger } from "../services/logger";
import { SettingsManager } from "./settingsManager";

export class PluginManager {
	constructor(
		private plugin: Plugin,
		private settingsManager: SettingsManager
	) {}

	checkDailyNotesPlugin() {
		const dailyNotesPlugin = (this.plugin.app as any).internalPlugins
			.plugins["daily-notes"];
		if (!dailyNotesPlugin || !dailyNotesPlugin.enabled) {
			Logger.warn(
				"Daily Notes plugin is not enabled. Some features may not work as expected."
			);
			new Notice(
				"The Daily Notes core plugin is recommended for the Chain Plugin. Please enable it in the core plugins settings."
			);
		} else {
			Logger.log("Daily Notes plugin is enabled and available.");
		}
	}

	async updateDailyNotesSettings() {
		Logger.log("Updating Daily Notes settings...");
		const dailyNotesPlugin = (this.plugin.app as any).internalPlugins
			.plugins["daily-notes"];
		if (dailyNotesPlugin && dailyNotesPlugin.enabled) {
			await this.updateDailyNotesPluginSettings(dailyNotesPlugin);
		} else {
			Logger.warn(
				"Daily Notes plugin is not enabled, skipping settings update"
			);
		}
	}

	private async updateDailyNotesPluginSettings(dailyNotesPlugin: any) {
		const dailyNotesInstance = dailyNotesPlugin.instance;
		if (dailyNotesInstance && dailyNotesInstance.options) {
			const { currentSettings, newSettings } =
				this.getDailyNotesSettings(dailyNotesInstance);

			if (this.settingsHaveChanged(currentSettings, newSettings)) {
				Object.assign(dailyNotesInstance.options, newSettings);
				await dailyNotesPlugin.saveData(dailyNotesInstance.options);
				Logger.log("Daily Notes plugin settings updated successfully");
			} else {
				Logger.log("No changes needed for Daily Notes plugin settings");
			}
		} else {
			Logger.warn("Daily Notes plugin instance or options not available");
		}
	}

	private getDailyNotesSettings(dailyNotesInstance: any) {
		const currentSettings = {
			format: dailyNotesInstance.options.format,
			folder: dailyNotesInstance.options.folder,
			template: dailyNotesInstance.options.template,
		};

		const newSettings = {
			format: this.settingsManager.getSetting("dateFormat"),
			folder:
				this.settingsManager.getSetting("newFileLocation") ||
				"/Journal/YYYY/MM-mmmm/",
			template:
				this.settingsManager.getSetting("templateFileLocation") ||
				"/Templates/Daily Note Template.md",
		};

		return { currentSettings, newSettings };
	}

	private settingsHaveChanged(currentSettings: any, newSettings: any) {
		return Object.keys(currentSettings).some(
			(key) => currentSettings[key] !== newSettings[key]
		);
	}

	overrideDailyNotesOpenToday() {
		const dailyNotesPlugin = (this.plugin.app as any).internalPlugins
			.plugins["daily-notes"];
		if (dailyNotesPlugin && dailyNotesPlugin.instance) {
			const dailyNotesInstance = dailyNotesPlugin.instance;

			// Override openToday method
			if (typeof dailyNotesInstance.openToday === "function") {
				const originalOpenToday =
					dailyNotesInstance.openToday.bind(dailyNotesInstance);
				dailyNotesInstance.openToday = async () => {
					await (
						this.plugin as ChainPlugin
					).journalManager.createOrUpdateDailyNote();
				};
				Logger.log("Daily Notes openToday method overridden");
			}

			// Override getOrCreateDailyNote method
			if (typeof dailyNotesInstance.getOrCreateDailyNote === "function") {
				const originalGetOrCreateDailyNote =
					dailyNotesInstance.getOrCreateDailyNote.bind(
						dailyNotesInstance
					);
				dailyNotesInstance.getOrCreateDailyNote = async (
					date: moment.Moment
				) => {
					await (
						this.plugin as ChainPlugin
					).journalManager.createOrUpdateDailyNote(date);
					return originalGetOrCreateDailyNote(date);
				};
				Logger.log(
					"Daily Notes getOrCreateDailyNote method overridden"
				);
			}

			// Override getDailyNote method
			if (typeof dailyNotesInstance.getDailyNote === "function") {
				const originalGetDailyNote =
					dailyNotesInstance.getDailyNote.bind(dailyNotesInstance);
				dailyNotesInstance.getDailyNote = (date: moment.Moment) => {
					(
						this.plugin as ChainPlugin
					).journalManager.createOrUpdateDailyNote(date);
					return originalGetDailyNote(date);
				};
				Logger.log("Daily Notes getDailyNote method overridden");
			}

			Logger.log("Daily Notes plugin integration complete");
		} else {
			Logger.log(
				"Daily Notes plugin not found or not enabled. Chain Plugin will operate independently."
			);
		}
	}
}
