// main.ts
import { JournalManager } from "./handlers/journalManager";
import { SettingsManager } from "./handlers/settingsManager";
import { UIManager } from "./handlers/uiManager";

export default class ChainPlugin extends Plugin {
	journalManager: JournalManager;
	settingsManager: SettingsManager;
	uiManager: UIManager;

	async onload() {
		this.settingsManager = new SettingsManager(this);
		await this.settingsManager.loadSettings();

		this.journalManager = new JournalManager(this.app, this.settings);
		this.uiManager = new UIManager(this);

		this.uiManager.addRibbonIcon();
		this.uiManager.addCommands();
		// ...
	}
}
