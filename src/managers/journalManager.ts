// journalManager.ts
import { App, TFile, Vault } from "obsidian";
import { SettingsManager } from "./settingsManager";
import { formatDate } from "../utils/dateUtils";

export class JournalManager {
	constructor(private app: App, private settingsManager: SettingsManager) {}

	async createJournalEntry() {
		const date = new Date();
		const fileName = `${formatDate(date)}.md`;
		const folderPath = this.settingsManager.getSetting("journalFolder");
		const filePath = `${folderPath}/${fileName}`;

		try {
			const file = await this.app.vault.create(
				filePath,
				this.getDefaultTemplate(date)
			);
			await this.app.workspace.activeLeaf.openFile(file);
		} catch (error) {
			console.error("Error creating journal entry:", error);
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
