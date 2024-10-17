/*
main.ts: Entry point for the Chain Plugin
- Initializes core plugin components
- Manages plugin lifecycle (load/unload)
- Coordinates interactions between managers
- Integrates with Obsidian's plugin system
*/

import { JournalManager } from "./managers/journalManager";
import { SettingsManager } from "./managers/settingsManager";
import { UIManager } from "./managers/uiManager";
import { FileSystemManager } from "./managers/fileSystemManager";
import { Plugin, Notice } from "obsidian";
import { Logger } from "./services/logger";

export default class ChainPlugin extends Plugin {
	journalManager: JournalManager;
	settingsManager: SettingsManager;
	uiManager: UIManager;
	fileSystemManager: FileSystemManager;

	async onload() {
		console.log("Chain Plugin is loading...");
		Logger.log("Chain Plugin onload method called");

		this.initializeManagers();
		await this.loadSettings();
		await this.updateDailyNotesSettings();
		this.checkDailyNotesPlugin();
		this.initializeUI();
		await this.handleStartup();

		console.log("Chain Plugin loaded successfully");
		Logger.log("Chain Plugin loaded successfully");
	}

	private initializeManagers() {
		this.settingsManager = new SettingsManager(this);
		this.fileSystemManager = new FileSystemManager(this.app);
		this.journalManager = new JournalManager(
			this.app,
			this.settingsManager,
			this.fileSystemManager
		);
	}

	private async loadSettings() {
		await this.settingsManager.loadSettings();
	}

	private checkDailyNotesPlugin() {
		const dailyNotesPlugin =
			this.app.internalPlugins.plugins["daily-notes"];
		if (!dailyNotesPlugin || !dailyNotesPlugin.enabled) {
			new Notice(
				"The Daily Notes core plugin is recommended for the Chain Plugin. Please enable it in the core plugins settings."
			);
		}
	}

	private initializeUI() {
		this.uiManager = new UIManager(this);
		this.uiManager.initialize();
	}

	private async handleStartup() {
		if (this.settingsManager.getSetting("openDailyNoteOnStartup")) {
			try {
				await this.journalManager.createOrUpdateDailyNote();
				Logger.log("Daily note created/opened on startup");
			} catch (error) {
				Logger.error(
					`Error creating/opening daily note on startup: ${error}`
				);
				new Notice(
					"Failed to create/open daily note on startup. Check console for details."
				);
			}
		}
	}

	public async updateDailyNotesSettings() {
		const dailyNotesPlugin =
			this.app.internalPlugins.plugins["daily-notes"];
		if (dailyNotesPlugin && dailyNotesPlugin.enabled) {
			const dailyNotesInstance = dailyNotesPlugin.instance;
			if (dailyNotesInstance && dailyNotesInstance.options) {
				const currentFormat = dailyNotesInstance.options.format;
				const currentFolder = dailyNotesInstance.options.folder;
				const currentTemplate = dailyNotesInstance.options.template;

				const newFormat = this.settingsManager.getSetting("dateFormat");
				const newFolder =
					this.settingsManager.getSetting("newFileLocation") ||
					"/Journal/YYYY/MM-mmmm/";
				const newTemplate =
					this.settingsManager.getSetting("templateFileLocation") ||
					"/Templates/Daily Note Template.md";

				if (
					currentFormat !== newFormat ||
					currentFolder !== newFolder ||
					currentTemplate !== newTemplate
				) {
					dailyNotesInstance.options.format = newFormat;
					dailyNotesInstance.options.folder = newFolder;
					dailyNotesInstance.options.template = newTemplate;
					await dailyNotesPlugin.saveData(dailyNotesInstance.options);
					Logger.log("Daily Notes plugin settings updated");
				}
			}
		}
	}

	private async ensureTemplateFileExists() {
		const templatePath = this.settingsManager.getSetting(
			"templateFileLocation"
		);
		const templateFile = this.app.vault.getAbstractFileByPath(templatePath);

		if (!templateFile) {
			const templateDir = templatePath.substring(
				0,
				templatePath.lastIndexOf("/")
			);
			try {
				await this.fileSystemManager.createDirectory(templateDir);

				const templateContent = `****
## Log

### Ideas
-
### To Do
- [ ]
### Contacts
- [ ]
### Events
-

****
## Routine Checklist

- [[Jeff + Tai]]
- [ ] **Daily**
    - [ ] Morning
        - [ ] Make Bed 🛏️ 
        - [ ] Brush Teeth 🦷
        - [ ] Get Dressed 👖
        - [ ] Morning Walk 🐕🚶🏻‍♂️
        - [ ] Feed Gus 🐶
        - [ ] Breakfast ☕️
        - [ ] Take Meds 💊
        - [ ] Gus Meds 🦴
        - [ ] Sync Weight ⚖️
        - [ ] Bio 💩 
        - [ ] Brush Teeth 🦷
    - [ ] Tech
        - [ ] Wear Watch ⌚️
        - [ ] Manage [Calendar](https://calendar.google.com/calendar/u/0?cid=amVmZmtub3dsZXNqckBnbWFpbC5jb20) 📆 
        - [ ] Check [Mail](https://mail.google.com/mail/u/0/) ✉️
        - [ ] Check [[_Journal/y_2024/October/October Log|October Log]] 🗓️ 
        - [ ] Check [[_Journal/y_2024/October/October List|October List]] ✅
        - [ ] Check [[October Time]] 🕒
        - [ ] Check [Coach Accountable](https://www.coachaccountable.com/app) 👨‍💼
        - [ ] Check [Trello](https://trello.com/w/userworkspace28736609/home) 📥
    - [ ] Afternoon
        - [ ] Lunch
        - [ ] Dental Hygeine
        - [ ] Walk Gus
        - [ ] Freelance Work
        - [ ] Learning
    - [ ] Evening
        - [ ] Feed Gus
        - [ ] Standing Desk
        - [ ] Dinner
        - [ ] Reading
        - [ ] Prayer / Meditation
        - [ ] Brush Teeth
    - [ ] Consistency (30 Minutes)
        - [ ] Guitar
        - [ ] Development
    - [ ] Work out
        - [ ] Running
        - [ ] Stretching
        - [ ] Lifting
****`;

				await this.fileSystemManager.createFile(
					templatePath,
					templateContent
				);
				Logger.log("Daily Notes Template created");
			} catch (error) {
				Logger.error(`Failed to create template file: ${error}`);
				console.error(`Failed to create template file: ${error}`);
			}
		}
	}
}
