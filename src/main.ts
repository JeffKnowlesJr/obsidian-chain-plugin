// main.ts
import { JournalManager } from "./managers/journalManager";
import { SettingsManager } from "./managers/settingsManager";
import { UIManager } from "./managers/uiManager";
import { Plugin } from "obsidian";

export default class ChainPlugin extends Plugin {
	journalManager: JournalManager;
	settingsManager: SettingsManager;
	uiManager: UIManager;

	async onload() {
		this.settingsManager = new SettingsManager(this);
		await this.settingsManager.loadSettings();

		this.journalManager = new JournalManager(
			this.app,
			this.settingsManager
		);
		this.uiManager = new UIManager(this);
		this.uiManager.addRibbonIcon();
		this.uiManager.addCommands();
		// ...
	}
}
