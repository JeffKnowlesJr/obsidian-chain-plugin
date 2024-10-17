import { App, TFile, moment, Notice } from "obsidian";
import { SettingsManager } from "./settingsManager";
import { FileSystemManager } from "./fileSystemManager";
import { Logger } from "../services/logger";
import { TemplateManager } from "./templateManager";

export class EntryCreator {
	private templateManager: TemplateManager;

	constructor(
		private app: App,
		private settingsManager: SettingsManager,
		private fileSystemManager: FileSystemManager
	) {
		this.templateManager = new TemplateManager(app, settingsManager);
	}

	async createOrUpdateDailyNote(date: moment.Moment = moment()) {
		const { folderPath, filePath } = this.getFilePaths(date);

		try {
			await this.fileSystemManager.ensureFolderStructure(folderPath);
			let file = this.app.vault.getAbstractFileByPath(filePath);

			if (!file) {
				file = await this.createNewFile(filePath, date);
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

	private getFilePaths(date: moment.Moment) {
		const baseFolder =
			this.settingsManager.getSetting("journalFolder") || "Journal";
		const folderPath = `${baseFolder}/${date.format("YYYY")}/${date.format(
			"MM-MMMM"
		)}`;
		const fileName = `${date.format(
			this.settingsManager.getSetting("dateFormat")
		)}.md`;
		const filePath = `${folderPath}/${fileName}`;
		return { folderPath, filePath };
	}

	private async createNewFile(filePath: string, date: moment.Moment) {
		const templateContent = await this.templateManager.getTemplateContent();
		const finalContent = templateContent
			? this.templateManager.replaceDatePlaceholder(templateContent, date)
			: this.templateManager.getDefaultTemplate(date);
		return await this.fileSystemManager.createFile(filePath, finalContent);
	}

	// ... (include getTemplateContent, replaceDatePlaceholder, and getDefaultTemplate methods)
}
