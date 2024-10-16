/*
uiManager.ts: Manages the user interface for the Chain Plugin
- Adds ribbon icons and commands to Obsidian interface
- Creates and manages the settings tab
- Handles user interactions with the plugin UI
*/

import { Notice, addIcon, App, PluginSettingTab, Setting } from "obsidian";
import ChainPlugin from "../main";
import { ICON_DATA } from "../constants";

export class UIManager {
	constructor(private plugin: ChainPlugin) {}

	addRibbonIcon() {
		addIcon("chain-journal", ICON_DATA);

		const ribbonIconEl = this.plugin.addRibbonIcon(
			"chain-journal",
			"Create Journal Entry",
			(evt: MouseEvent) => {
				this.plugin.journalManager.createJournalEntry();
			}
		);

		ribbonIconEl.addClass("chain-journal-ribbon-class");
	}

	addCommands() {
		this.plugin.addCommand({
			id: "create-journal-entry",
			name: "Create Journal Entry",
			callback: () => {
				this.plugin.journalManager.createJournalEntry();
			},
		});

		this.plugin.addCommand({
			id: "open-today-entry",
			name: "Open Today's Entry",
			callback: () => {
				this.plugin.journalManager.openTodayEntry();
			},
		});
	}

	addSettingTab() {
		this.plugin.addSettingTab(
			new ChainPluginSettingTab(this.plugin.app, this.plugin)
		);
	}
}

class ChainPluginSettingTab extends PluginSettingTab {
	constructor(app: App, private plugin: ChainPlugin) {
		super(app, plugin);
	}

	display(): void {
		let { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Journal folder")
			.setDesc("Folder where journal entries will be saved")
			.addText((text) =>
				text
					.setPlaceholder("Journal")
					.setValue(
						this.plugin.settingsManager.getSetting("journalFolder")
					)
					.onChange(async (value) => {
						this.plugin.settingsManager.setSetting(
							"journalFolder",
							value
						);
					})
			);

		new Setting(containerEl)
			.setName("Default template")
			.setDesc(
				"Template for new journal entries. Use {date} for the current date."
			)
			.addTextArea((text) =>
				text
					.setPlaceholder("# Journal Entry for {date}")
					.setValue(
						this.plugin.settingsManager.getSetting(
							"defaultTemplate"
						)
					)
					.onChange(async (value) => {
						this.plugin.settingsManager.setSetting(
							"defaultTemplate",
							value
						);
					})
			);
	}
}
