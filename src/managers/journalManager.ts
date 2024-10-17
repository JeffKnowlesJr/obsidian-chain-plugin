/*
journalManager.ts: Manages journal entries
- Creates and opens journal entries
- Handles date formatting for entries
- Interacts with Obsidian's file system
- Applies user-defined templates to new entries
*/

import { App, moment } from "obsidian";
import { SettingsManager } from "./settingsManager";
import { FileSystemManager } from "./fileSystemManager";
import { EntryCreator } from "./entryCreator";

export class JournalManager {
	private entryCreator: EntryCreator;

	constructor(
		private app: App,
		private settingsManager: SettingsManager,
		private fileSystemManager: FileSystemManager
	) {
		this.entryCreator = new EntryCreator(
			app,
			settingsManager,
			fileSystemManager
		);
	}

	async createOrUpdateDailyNote(date: moment.Moment = moment()) {
		await this.entryCreator.createOrUpdateDailyNote(date);
	}

	// Other journal-related methods
}
