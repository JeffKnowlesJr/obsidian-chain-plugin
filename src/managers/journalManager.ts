/*
journalManager.ts: Manages journal entries
- Creates and opens journal entries
- Handles date formatting for entries
- Interacts with Obsidian's file system
- Applies user-defined templates to new entries
*/

import { App, TFile, Notice, moment } from "obsidian";
import { SettingsManager } from "./settingsManager";
import { FileSystemManager } from "./fileSystemManager";
import {
	formatDate,
	getYearFolderName,
	getMonthFolderName,
	getDayFileName,
} from "../utils/dateUtils";
import { Logger } from "../services/logger";
import { SETTINGS } from "../constants";

export class JournalManager {
	constructor(
		private app: App,
		private settingsManager: SettingsManager,
		private fileSystemManager: FileSystemManager
	) {}

	async createOrUpdateDailyNote(date: moment.Moment = moment()) {
		Logger.log("createOrUpdateDailyNote called with date:", date.format());
		const baseFolder =
			this.settingsManager.getSetting("newFileLocation") || "Daily Notes";
		const yearFolder = date.format("YYYY");
		const monthFolder = date.format("MMMM");
		const fileName = date.format("YYYY-MM-DD dddd") + ".md";
		const folderPath = `${baseFolder}/${yearFolder}/${monthFolder}`;
		const filePath = `${folderPath}/${fileName}`;
		Logger.log("Constructed file path:", filePath);

		try {
			await this.fileSystemManager.ensureFolderStructure(folderPath);
			Logger.log("Folder structure ensured");
			let file = this.app.vault.getAbstractFileByPath(filePath);
			Logger.log("Existing file:", file);

			if (!file) {
				Logger.log("Creating new file");
				const templateContent = await this.getTemplateContent();
				file = await this.fileSystemManager.createFile(
					filePath,
					templateContent || this.getDefaultTemplate(date)
				);
				Logger.log("New file created:", file);
			}

			if (file instanceof TFile) {
				Logger.log("Opening file in main pane");
				await this.fileSystemManager.openFileInMainPane(file);
			} else {
				throw new Error("Created file is not a TFile");
			}
		} catch (error) {
			Logger.error("Error in createOrUpdateDailyNote:", error as Error);
			new Notice(
				"Failed to create or open daily note. Check the console for details."
			);
		}
	}

	private async getTemplateContent(): Promise<string | null> {
		const templatePath = this.settingsManager.getSetting(
			"templateFileLocation"
		);
		if (!templatePath) return null;

		const templateFile = this.app.vault.getAbstractFileByPath(templatePath);
		if (templateFile instanceof TFile) {
			return await this.app.vault.read(templateFile);
		}
		return null;
	}

	private getDefaultTemplate(date: moment.Moment): string {
		const template =
			this.settingsManager.getSetting(SETTINGS.DEFAULT_TEMPLATE) ||
			"# Journal Entry for {date}";
		return template.replace("{date}", date.format("YYYY-MM-DD dddd"));
	}

	async createJournalEntry(date: moment.Moment = moment()) {
		await this.createOrUpdateDailyNote(date);
	}
	// Other journal-related methods
}
