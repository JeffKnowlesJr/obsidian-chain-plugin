import { Plugin } from "obsidian";
import { SETTINGS, DEFAULT_SETTINGS, ChainPluginSettings } from "../constants";
import { Logger } from "../services/logger";
import ChainPlugin from "../main";

export class SettingsManager {
	private settings: ChainPluginSettings;

	constructor(private plugin: ChainPlugin) {
		this.settings = DEFAULT_SETTINGS;
	}

	async loadSettings() {
		try {
			const loadedData = await this.plugin.loadData();
			if (loadedData && typeof loadedData === "object") {
				this.settings = {
					...DEFAULT_SETTINGS,
					...loadedData,
				};
			} else {
				console.warn(
					"Invalid or empty plugin data, using default settings"
				);
				this.settings = DEFAULT_SETTINGS;
			}
		} catch (error) {
			console.error("Failed to load plugin settings:", error);
			Logger.error(error as Error);
			this.settings = DEFAULT_SETTINGS;
		}

		// Ensure the settings file is properly saved after loading
		await this.saveSettings();
	}

	async saveSettings() {
		try {
			await this.plugin.saveData(this.settings);
		} catch (error) {
			console.error("Failed to save plugin settings:", error);
			Logger.error(error as Error);
			new Notice(
				"Failed to save Chain Plugin settings. Check console for details."
			);
		}
	}

	getSetting(key: keyof ChainPluginSettings): any {
		return this.settings[key];
	}

	async setSetting(key: keyof ChainPluginSettings, value: any) {
		if (this.settings[key] !== value) {
			this.settings[key] = value;
			await this.saveSettings();
			if (
				key === "dateFormat" ||
				key === "newFileLocation" ||
				key === "templateFileLocation"
			) {
				await this.plugin.updateDailyNotesSettings();
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
		}
	}
}
