/*
uiManager.ts: Manages the user interface for the Chain Plugin
- Adds ribbon icons and commands to Obsidian interface
- Creates and manages the settings tab
- Handles user interactions with the plugin UI
*/

import { Notice, addIcon, App, PluginSettingTab, Setting } from "obsidian";
import ChainPlugin from "../main";
import { ICON_DATA, COMMANDS, SETTINGS, TEMPLATES } from "../constants";

export class UIManager {
	constructor(private plugin: ChainPlugin) {}

	addRibbonIcon() {
		addIcon("chain-journal", ICON_DATA);

		this.plugin.addRibbonIcon(
			"chain-journal",
			"Create Future Entry",
			(evt: MouseEvent) => {
				this.showFutureEntryModal();
			}
		);
	}

	addCommands() {
		this.plugin.addCommand({
			id: COMMANDS.CREATE_FUTURE_ENTRY,
			name: "Create Future Entry",
			callback: () => {
				this.showFutureEntryModal();
			},
		});

		this.plugin.addCommand({
			id: COMMANDS.OPEN_TODAY,
			name: "Open Today's Entry",
			callback: () => {
				this.plugin.journalManager.createJournalEntry();
			},
		});
	}

	addSettingTab() {
		this.plugin.addSettingTab(
			new ChainPluginSettingTab(this.plugin.app, this.plugin)
		);
	}

	showFilesIcon() {
		this.plugin.app.workspace.leftRibbon.collapse();
		this.plugin.app.workspace.leftRibbon.expand();
	}

	private showFutureEntryModal() {
		// Implement the date picker modal here
		// For now, we'll just use a simple prompt
		const date = prompt("Enter date (YYYY-MM-DD):");
		if (date) {
			this.plugin.journalManager.createJournalEntry(new Date(date));
		}
	}
}

class ChainPluginSettingTab extends PluginSettingTab {
	constructor(app: App, private plugin: ChainPlugin) {
		super(app, plugin);
	}

	display(): void {
		let { containerEl } = this;
		containerEl.empty();

		this.addJournalFolderSetting(containerEl);
		this.addAllTemplateSettings(containerEl);
	}

	private addJournalFolderSetting(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName("Journal folder")
			.setDesc("Folder where journal entries will be saved")
			.addText((text) =>
				text
					.setPlaceholder("Journal")
					.setValue(
						this.plugin.settingsManager.getSetting(
							SETTINGS.JOURNAL_FOLDER
						)
					)
					.onChange(async (value) => {
						this.plugin.settingsManager.setSetting(
							SETTINGS.JOURNAL_FOLDER,
							value
						);
					})
			);
	}

	private addDefaultTemplateSetting(containerEl: HTMLElement) {
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
							SETTINGS.DEFAULT_TEMPLATE
						)
					)
					.onChange(async (value) => {
						this.plugin.settingsManager.setSetting(
							SETTINGS.DEFAULT_TEMPLATE,
							value
						);
					})
			);
	}

	private addTemplateSetting(
		containerEl: HTMLElement,
		name: string,
		desc: string,
		setting: string
	) {
		new Setting(containerEl)
			.setName(name)
			.setDesc(desc)
			.addTextArea((text) =>
				text
					.setPlaceholder(`Enter ${name.toLowerCase()} template`)
					.setValue(this.plugin.settingsManager.getSetting(setting))
					.onChange(async (value) => {
						this.plugin.settingsManager.setSetting(setting, value);
					})
			);
	}

	private addAllTemplateSettings(containerEl: HTMLElement) {
		this.addTemplateSetting(
			containerEl,
			"Daily Template",
			"Template for daily entries. Use {date} for the current date.",
			TEMPLATES.DAILY
		);
		this.addTemplateSetting(
			containerEl,
			"Monthly List Template",
			"Template for monthly list. Use {month} for the month name.",
			TEMPLATES.MONTHLY_LIST
		);
		this.addTemplateSetting(
			containerEl,
			"Monthly Log Template",
			"Template for monthly log. Use {month} for the month name.",
			TEMPLATES.MONTHLY_LOG
		);
		this.addTemplateSetting(
			containerEl,
			"Monthly Tracker Template",
			"Template for monthly tracker. Use {month} for the month name.",
			TEMPLATES.MONTHLY_TRACKER
		);
	}
}
