/*
journalManager.ts: Manages journal entries
- Creates and opens journal entries
- Handles date formatting for entries
- Interacts with Obsidian's file system
- Applies user-defined templates to new entries
*/

import { App, TFile, Vault, Notice } from "obsidian";
import { SettingsManager } from "./settingsManager";
import { formatDate } from "../utils/dateUtils";
import { Logger } from "../services/logger";
import { SETTINGS } from "../constants";

export class JournalManager {
	constructor(private app: App, private settingsManager: SettingsManager) {}

	async createJournalEntry() {
		const date = new Date();
		const fileName = `${formatDate(date)}.md`;
		const folderPath = this.settingsManager.getSetting(
			SETTINGS.JOURNAL_FOLDER
		);
		const filePath = `${folderPath}/${fileName}`;

		try {
			// Ensure the folder exists
			if (!(await this.app.vault.adapter.exists(folderPath))) {
				await this.app.vault.createFolder(folderPath);
			}

			const file = await this.app.vault.create(
				filePath,
				this.getDefaultTemplate(date)
			);
			await this.app.workspace.activeLeaf.openFile(file);
		} catch (error) {
			Logger.error(error as Error);
			new Notice(
				"Failed to create journal entry. Check the console for details."
			);
		}
	}

	async openTodayEntry() {
		const date = new Date();
		const fileName = `${formatDate(date)}.md`;
		const folderPath = this.settingsManager.getSetting("journalFolder");
		const filePath = `${folderPath}/${fileName}`;

		const file = this.app.vault.getAbstractFileByPath(filePath);
		if (file instanceof TFile) {
			await this.app.workspace.activeLeaf.openFile(file);
		} else {
			await this.createJournalEntry();
		}
	}

	private getDefaultTemplate(date: Date): string {
		const template = this.settingsManager.getSetting("defaultTemplate");
		return template.replace("{date}", formatDate(date));
	}
	// Other journal-related methods
}
