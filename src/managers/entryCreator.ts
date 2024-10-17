import { App, TFile, moment, Notice } from "obsidian";
import { SettingsManager } from "./settingsManager";
import { FileSystemManager } from "./fileSystemManager";
import { Logger } from "../services/logger";
import { TemplateManager } from "./templateManager";
import {
	getYearFolderName,
	getMonthFolderName,
	getDayFileName,
} from "../utils/dateUtils";

export class EntryCreator {
	private templateManager: TemplateManager;

	constructor(
		private app: App,
		private settingsManager: SettingsManager,
		private fileSystemManager: FileSystemManager
	) {
		this.templateManager = new TemplateManager(app, settingsManager);
		Logger.info("EntryCreator initialized");
	}

	async createOrUpdateDailyNote(date: moment.Moment = moment()) {
		Logger.info(
			`Creating or updating daily note for date: ${date.format(
				"YYYY-MM-DD"
			)}`
		);
		const { folderPath, filePath } = this.getFilePaths(date);

		try {
			Logger.debug(`Ensuring folder structure: ${folderPath}`);
			await this.fileSystemManager.ensureFolderStructure(folderPath);
			let file = this.app.vault.getAbstractFileByPath(filePath);
			if (!file) {
				Logger.info(`File not found. Creating new file: ${filePath}`);
				file = await this.createNewFile(filePath, date);
			} else if (file instanceof TFile) {
				Logger.info(`File already exists: ${filePath}`);
			} else {
				throw new Error(`Unexpected file type at ${filePath}`);
			}
			await this.app.workspace.getLeaf(false).openFile(file);
			if (file instanceof TFile) {
				Logger.debug(`Opening file: ${filePath}`);
				await this.fileSystemManager.openFileInMainPane(file);
			} else {
				throw new Error("Created file is not a TFile");
			}
		} catch (error) {
			Logger.error(`Error in createOrUpdateDailyNote: ${error}`);
			new Notice(`Failed to create or open daily note: ${error.message}`);
		}
	}

	private getFilePaths(date: moment.Moment) {
		Logger.debug(
			`Getting file paths for date: ${date.format("YYYY-MM-DD")}`
		);
		const baseFolder =
			this.settingsManager.getSetting("journalFolder") || "Journal";
		const newFileLocation =
			this.settingsManager.getSetting("newFileLocation") ||
			"/{{journalFolder}}/{{date:YYYY}}/{{date:MM-MMMM}}/";
		Logger.debug(`newFileLocation setting: ${newFileLocation}`);
		Logger.debug(`baseFolder setting: ${baseFolder}`);
		const folderPath = newFileLocation
			.replace(/\{\{journalFolder\}\}/g, baseFolder)
			.replace(/\{\{date:([^}]+)\}\}/g, (match, p1) => {
				switch (p1) {
					case "YYYY":
						return getYearFolderName(date);
					case "MM-MMMM":
						return getMonthFolderName(date);
					default:
						return date.format(p1);
				}
			});
		const fileName = getDayFileName(date);
		const filePath = `${folderPath}${fileName}`;
		Logger.debug(
			`Generated folder path: ${folderPath}, file path: ${filePath}`
		);
		return { folderPath, filePath };
	}

	private async createNewFile(filePath: string, date: moment.Moment) {
		Logger.info(`Creating new file: ${filePath}`);
		const templateContent = await this.templateManager.getTemplateContent();
		const finalContent = templateContent
			? this.templateManager.replaceDatePlaceholder(templateContent, date)
			: this.templateManager.getDefaultTemplate(date);
		Logger.debug(`File content prepared, length: ${finalContent.length}`);
		return await this.fileSystemManager.createFile(filePath, finalContent);
	}

	// ... (include getTemplateContent, replaceDatePlaceholder, and getDefaultTemplate methods)
}
