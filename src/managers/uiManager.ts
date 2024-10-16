/*
uiManager.ts: Manages the user interface for the Chain Plugin
- Adds ribbon icons and commands to Obsidian interface
- Creates and manages the settings tab
- Handles user interactions with the plugin UI
*/

import {
	Notice,
	addIcon,
	App,
	PluginSettingTab,
	Setting,
	Modal,
} from "obsidian";
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
				this.plugin.journalManager.createOrUpdateDailyNote();
			},
		});
	}

	addSettingTab() {
		this.plugin.addSettingTab(
			new ChainPluginSettingTab(this.plugin.app, this.plugin)
		);
	}

	private showFutureEntryModal() {
		console.log("Showing future entry modal");
		const modal = new FutureEntryModal(this.plugin.app, (date: Date) => {
			console.log("Future entry modal submitted with date:", date);
			this.plugin.journalManager.createOrUpdateDailyNote(date);
		});
		modal.open();
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
		this.addDateFormatSetting(containerEl);
		this.addNewFileLocationSetting(containerEl);
		this.addTemplateFileLocationSetting(containerEl);
		this.addOpenDailyNoteOnStartupSetting(containerEl);
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

	private addDateFormatSetting(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName("Date format")
			.setDesc(
				"Format for daily note filenames. Use YYYY-MM-DD for reference."
			)
			.addText((text) =>
				text
					.setPlaceholder("YYYY-MM-DD")
					.setValue(
						this.plugin.settingsManager.getSetting("dateFormat")
					)
					.onChange(async (value) => {
						this.plugin.settingsManager.setSetting(
							"dateFormat",
							value
						);
					})
			);
	}

	private addNewFileLocationSetting(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName("New file location")
			.setDesc("Where new daily notes will be placed.")
			.addText((text) =>
				text
					.setPlaceholder("Daily Notes/")
					.setValue(
						this.plugin.settingsManager.getSetting(
							"newFileLocation"
						)
					)
					.onChange(async (value) => {
						this.plugin.settingsManager.setSetting(
							"newFileLocation",
							value
						);
					})
			);
	}

	private addTemplateFileLocationSetting(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName("Template file location")
			.setDesc("Choose a file to use as a template for notes.")
			.addText((text) =>
				text
					.setPlaceholder("Templates/Daily Note Template.md")
					.setValue(
						this.plugin.settingsManager.getSetting(
							"templateFileLocation"
						)
					)
					.onChange(async (value) => {
						this.plugin.settingsManager.setSetting(
							"templateFileLocation",
							value
						);
					})
			);
	}

	private addOpenDailyNoteOnStartupSetting(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName("Open daily note on startup")
			.setDesc(
				"Automatically open a daily note when the app or vault is opened."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(
						this.plugin.settingsManager.getSetting(
							"openDailyNoteOnStartup"
						)
					)
					.onChange(async (value) => {
						this.plugin.settingsManager.setSetting(
							"openDailyNoteOnStartup",
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

	private addDailyNotesFolderOverrideSetting(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName("Daily Notes Folder Override")
			.setDesc(
				"Override the folder set in Daily Notes plugin (leave empty to use Daily Notes plugin setting)"
			)
			.addText((text) =>
				text
					.setPlaceholder("Daily Notes")
					.setValue(
						this.plugin.settingsManager.getSetting(
							SETTINGS.DAILY_NOTES_FOLDER_OVERRIDE
						)
					)
					.onChange(async (value) => {
						this.plugin.settingsManager.setSetting(
							SETTINGS.DAILY_NOTES_FOLDER_OVERRIDE,
							value
						);
					})
			);
	}
}

class FutureEntryModal extends Modal {
	private date: Date;
	private onSubmit: (date: Date) => void;

	constructor(app: App, onSubmit: (date: Date) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.date = new Date();
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h2", { text: "Create Future Entry" });

		new Setting(contentEl).setName("Date").addText((text) =>
			text
				.setPlaceholder("YYYY-MM-DD")
				.setValue(this.formatDate(this.date))
				.then((input) => {
					input.inputEl.type = "date";
					input.inputEl.addEventListener("change", (e) => {
						const target = e.target as HTMLInputElement;
						const newDate = new Date(target.value);
						if (!isNaN(newDate.getTime())) {
							this.date = newDate;
						}
					});
				})
		);

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Create Entry")
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.date);
				})
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	private formatDate(date: Date): string {
		return date.toISOString().split("T")[0];
	}
}
