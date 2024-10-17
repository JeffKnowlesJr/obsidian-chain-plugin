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

// EntryCreator class handles the creation and updating of daily notes
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

	// Creates or updates a daily note for the given date (or today if not specified)
	async createOrUpdateDailyNote(date: moment.Moment = moment()) {
		Logger.info(
			`Creating or updating daily note for date: ${date.format(
				"YYYY-MM-DD"
			)}`
		);
		const { folderPath, filePath } = this.getFilePaths(date);

		try {
			// Ensure the folder structure exists
			Logger.debug(`Checking folder structure: ${folderPath}`);
			const folderExists = await this.fileSystemManager.folderExists(
				folderPath
			);
			if (!folderExists) {
				Logger.info(
					`Folder structure not found. Creating: ${folderPath}`
				);
				await this.fileSystemManager.ensureFolderStructure(folderPath);
			} else {
				Logger.debug(`Folder structure already exists: ${folderPath}`);
			}

			// Check if the file already exists, create if it doesn't
			let file = this.app.vault.getAbstractFileByPath(filePath);
			if (!file) {
				Logger.info(`File not found. Creating new file: ${filePath}`);
				file = await this.createNewFile(filePath, date);
			} else if (file instanceof TFile) {
				Logger.info(`File already exists: ${filePath}`);
			} else {
				Logger.info(`Unexpected file type at ${filePath}`);
				return;
			}

			// Open the file in the main pane
			if (file instanceof TFile) {
				Logger.debug(`Opening file: ${filePath}`);
				await this.fileSystemManager.openFileInMainPane(file);
			} else {
				Logger.info("Created file is not a TFile");
			}
		} catch (error) {
			Logger.info(`Note creation info: ${error.message}`);
		}
	}

	// Generates the folder and file paths for the given date
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

		// Replace placeholders in the file location string
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

	// Creates a new file with the appropriate template content
	private async createNewFile(filePath: string, date: moment.Moment) {
		Logger.info(`Creating new file: ${filePath}`);
		const templateContent = await this.templateManager.getTemplateContent();
		const finalContent = templateContent
			? this.templateManager.replaceDatePlaceholder(templateContent, date)
			: this.templateManager.getDefaultTemplate(date);
		Logger.debug(`File content prepared, length: ${finalContent.length}`);
		return await this.fileSystemManager.createFile(filePath, finalContent);
	}

	// ... (other methods like getTemplateContent, replaceDatePlaceholder, and getDefaultTemplate)
}
