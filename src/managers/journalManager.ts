/*
journalManager.ts: Manages journal entries
- Creates and opens journal entries
- Handles date formatting for entries
- Interacts with Obsidian's file system
- Applies user-defined templates to new entries
*/

import { App, TFile, Notice } from "obsidian";
import { SettingsManager } from "./settingsManager";
import { FileSystemManager } from "./fileSystemManager";
import {
	formatDate,
	getYearFolderName,
	getMonthFolderName,
	getDayFileName,
} from "../utils/dateUtils";
import { Logger } from "../services/logger";
import { SETTINGS, MONTHLY_FILES, TEMPLATES } from "../constants";

export class JournalManager {
	constructor(
		private app: App,
		private settingsManager: SettingsManager,
		private fileSystemManager: FileSystemManager
	) {}

	async createJournalEntry(date: Date = new Date()) {
		const yearFolder = getYearFolderName(date);
		const monthFolder = getMonthFolderName(date);
		const fileName = getDayFileName(date);
		const journalFolder = this.settingsManager.getSetting(
			SETTINGS.JOURNAL_FOLDER
		);
		const folderPath = `${journalFolder}/${yearFolder}/${monthFolder}`;
		const filePath = `${folderPath}/${fileName}`;
		try {
			await this.fileSystemManager.ensureFolderStructure(folderPath);
			await this.createMonthlyFiles(date, folderPath);
			const fileExists = await this.fileSystemManager.fileExists(
				filePath
			);
			if (!fileExists) {
				const file = await this.fileSystemManager.createFile(
					filePath,
					this.getDefaultTemplate(date)
				);
				await this.fileSystemManager.openFileInMainPane(file);
			} else {
				const file = this.app.vault.getAbstractFileByPath(
					filePath
				) as TFile;
				await this.fileSystemManager.openFileInMainPane(file);
			}
		} catch (error) {
			Logger.error(
				"Failed to create or open journal entry",
				error as Error
			);
			new Notice(
				"Failed to create or open journal entry. Check the console for details."
			);
		}
	}
	async openTodayEntry() {
		const date = new Date();
		const yearFolder = getYearFolderName(date);
		const monthFolder = getMonthFolderName(date);
		const fileName = getDayFileName(date);
		const journalFolder = this.settingsManager.getSetting(
			SETTINGS.JOURNAL_FOLDER
		);
		const folderPath = `${journalFolder}/${yearFolder}/${monthFolder}`;
		const filePath = `${folderPath}/${fileName}`;
		const file = this.app.vault.getAbstractFileByPath(filePath);
		if (file instanceof TFile) {
			await this.fileSystemManager.openFileInMainPane(file);
		} else {
			await this.createJournalEntry(date);
		}
	}

	private async ensureFolderStructure(folderPath: string) {
		const folders = folderPath
			.split("/")
			.filter((folder) => folder.length > 0);
		let currentPath = "";

		for (const folder of folders) {
			currentPath += folder + "/";
			try {
				const folderExists = await this.app.vault.adapter.exists(
					currentPath
				);
				if (!folderExists) {
					await this.app.vault.createFolder(currentPath);
				}
			} catch (error) {
				Logger.error(
					`Failed to create folder: ${currentPath}`,
					error as Error
				);
				throw new Error(
					`Failed to create folder structure: ${
						(error as Error).message
					}`
				);
			}
		}
	}

	private async createMonthlyFiles(date: Date, folderPath: string) {
		const monthName = getMonthFolderName(date);
		const files = [
			{ name: `${monthName} List.md`, template: TEMPLATES.MONTHLY_LIST },
			{ name: `${monthName} Log.md`, template: TEMPLATES.MONTHLY_LOG },
			{
				name: `${monthName} Tracker.md`,
				template: TEMPLATES.MONTHLY_TRACKER,
			},
		];

		for (const file of files) {
			const filePath = `${folderPath}/${file.name}`;
			if (!(await this.app.vault.adapter.exists(filePath))) {
				const template = this.settingsManager.getSetting(file.template);
				const content = template.replace("{month}", monthName);
				await this.app.vault.create(filePath, content);
			}
		}
	}

	private getDefaultTemplate(date: Date): string {
		const template =
			this.settingsManager.getSetting(SETTINGS.DEFAULT_TEMPLATE) ||
			"# Journal Entry for {date}";
		return template.replace("{date}", formatDate(date));
	}
	// Other journal-related methods
}
