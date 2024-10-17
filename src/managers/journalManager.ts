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
		const newFileLocation =
			this.settingsManager.getSetting("newFileLocation");

		const folderPath = `${baseFolder}/${date.format("YYYY")}/${date.format(
			"MM-MMMM"
		)}`;
		const fileName = `${date.format(
			this.settingsManager.getSetting("dateFormat")
		)}.md`;
		const filePath = `${folderPath}/${fileName}`;

		try {
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
			}

			if (file instanceof TFile) {
				await this.app.workspace.getLeaf(false).openFile(file);
			} else {
				throw new Error("Created file is not a TFile");
			}
		} catch (error) {
			Logger.error(`Error in createOrUpdateDailyNote: ${error}`);
			new Notice(`Failed to create or open daily note: ${error.message}`);
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
