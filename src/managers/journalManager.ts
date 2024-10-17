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
import { Logger } from "../services/logger";

export class JournalManager {
	constructor(
		private app: App,
		private settingsManager: SettingsManager,
		private fileSystemManager: FileSystemManager
	) {}

	async createOrUpdateDailyNote(date: moment.Moment = moment()) {
		const baseFolder =
			this.settingsManager.getSetting("journalFolder") || "Journal";
		const yearFolder = date.format("YYYY");
		const monthFolder = date.format("MM-MMMM");
		const fileName = `${date.format(
			this.settingsManager.getSetting("dateFormat")
		)}.md`;
		const folderPath = `${baseFolder}/${yearFolder}/${monthFolder}`;
		const filePath = `${folderPath}/${fileName}`;

		try {
			// Ensure the folder structure exists
			await this.fileSystemManager.ensureFolderStructure(folderPath);

			let file = this.app.vault.getAbstractFileByPath(filePath);

			if (!file) {
				const templateContent = await this.getTemplateContent();
				const finalContent = templateContent
					? this.replaceDatePlaceholder(templateContent, date)
					: this.getDefaultTemplate(date);
				file = await this.fileSystemManager.createFile(
					filePath,
					finalContent
				);
				Logger.log(`Created new daily note: ${filePath}`);
			} else {
				Logger.log(`Daily note already exists: ${filePath}`);
			}

			if (file instanceof TFile) {
				await this.app.workspace.getLeaf(false).openFile(file);
				Logger.log(`Opened daily note: ${filePath}`);
			} else {
				throw new Error("Created file is not a TFile");
			}
		} catch (error) {
			Logger.error(`Error in createOrUpdateDailyNote: ${error}`);
			throw error; // Propagate the error to be handled in handleStartup
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

	private replaceDatePlaceholder(
		content: string,
		date: moment.Moment
	): string {
		return content.replace(/{date}/g, date.format("YYYY-MM-DD dddd"));
	}

	private getDefaultTemplate(date: moment.Moment): string {
		const formattedDate = date.format("YYYY-MM-DD dddd");
		return `# Journal Entry for ${formattedDate}\n\n## Today's Goals\n\n## Notes\n\n## Reflections\n`;
	}

	async createJournalEntry(date: moment.Moment = moment()) {
		await this.createOrUpdateDailyNote(date);
	}
	// Other journal-related methods
}
