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

	async createOrUpdateDailyNote(date: Date = new Date()) {
		console.log("createOrUpdateDailyNote called with date:", date);
		const folder =
			this.settingsManager.getSetting("newFileLocation") || "Daily Notes";
		const format =
			this.settingsManager.getSetting("dateFormat") || "YYYY-MM-DD";
		console.log("Daily note settings:", { folder, format });
		const fileName = moment(date).format(format);
		const filePath = `${folder}/${fileName}.md`;
		console.log("File path:", filePath);

		try {
			await this.fileSystemManager.ensureFolderStructure(folder);
			console.log("Folder structure ensured");
			let file = this.app.vault.getAbstractFileByPath(filePath);
			console.log("Existing file:", file);

			if (!file) {
				console.log("Creating new file");
				const templateContent = await this.getTemplateContent();
				file = await this.fileSystemManager.createFile(
					filePath,
					templateContent || this.getDefaultTemplate(date)
				);
				console.log("New file created:", file);
			}

			if (file instanceof TFile) {
				console.log("Opening file in main pane");
				await this.fileSystemManager.openFileInMainPane(file);
			} else {
				throw new Error("Created file is not a TFile");
			}
		} catch (error) {
			console.error("Error in createOrUpdateDailyNote:", error);
			Logger.error("Failed to create or open daily note", error as Error);
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

	private getDefaultTemplate(date: Date): string {
		const template =
			this.settingsManager.getSetting(SETTINGS.DEFAULT_TEMPLATE) ||
			"# Journal Entry for {date}";
		return template.replace("{date}", formatDate(date));
	}

	async createJournalEntry(date: Date) {
		await this.createOrUpdateDailyNote(date);
	}
	// Other journal-related methods
}
