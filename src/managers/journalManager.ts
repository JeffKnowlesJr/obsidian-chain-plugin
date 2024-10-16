/*
journalManager.ts: Manages journal entries
- Creates and opens journal entries
- Handles date formatting for entries
- Interacts with Obsidian's file system
- Applies user-defined templates to new entries
*/

import { App, TFile, Vault, Notice } from "obsidian";
import { SettingsManager } from "./settingsManager";
import {
	formatDate,
	getYearFolderName,
	getMonthFolderName,
	getDayFileName,
} from "../utils/dateUtils";
import { Logger } from "../services/logger";
import { SETTINGS, MONTHLY_FILES, TEMPLATES } from "../constants";

export class JournalManager {
	constructor(private app: App, private settingsManager: SettingsManager) {}

	async createJournalEntry(date: Date = new Date()) {
		const yearFolder = getYearFolderName(date);
		const monthFolder = getMonthFolderName(date);
		const fileName = getDayFileName(date);
		const folderPath = `${this.settingsManager.getSetting(
			SETTINGS.JOURNAL_FOLDER
		)}/${yearFolder}/${monthFolder}`;
		const filePath = `${folderPath}/${fileName}`;

		try {
			await this.ensureFolderStructure(folderPath);
			await this.createMonthlyFiles(date, folderPath);

			let file = this.app.vault.getAbstractFileByPath(filePath);
			if (!(file instanceof TFile)) {
				// File doesn't exist, create it
				file = await this.app.vault.create(
					filePath,
					this.getDefaultTemplate(date)
				);
			}
			// Open the file, whether it existed before or was just created
			await this.app.workspace.activeLeaf.openFile(file as TFile);
		} catch (error) {
			Logger.error(error as Error);
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
		const folderPath = `${this.settingsManager.getSetting(
			SETTINGS.JOURNAL_FOLDER
		)}/${yearFolder}/${monthFolder}`;
		const filePath = `${folderPath}/${fileName}`;

		const file = this.app.vault.getAbstractFileByPath(filePath);
		if (file instanceof TFile) {
			await this.app.workspace.activeLeaf.openFile(file);
		} else {
			await this.createJournalEntry(date);
		}
	}

	private async ensureFolderStructure(folderPath: string) {
		const folders = folderPath.split("/");
		let currentPath = "";
		for (const folder of folders) {
			currentPath += folder + "/";
			if (!(await this.app.vault.adapter.exists(currentPath))) {
				await this.app.vault.createFolder(currentPath);
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
		const template = this.settingsManager.getSetting(
			SETTINGS.DEFAULT_TEMPLATE
		);
		return template.replace("{date}", formatDate(date));
	}
	// Other journal-related methods
}
