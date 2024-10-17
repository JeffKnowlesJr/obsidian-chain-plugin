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
import moment from "moment";
import { Plugin } from "obsidian";
import { RibbonManager } from "./ribbonManager";
import { CommandManager } from "./commandManager";
import { FutureEntryModal } from "../ui/components/futureEntryModal";
import { SettingsTabManager } from "./settingsTabManager";
import { SettingsTab } from "../ui/settingsTab";

export class UIManager {
	private ribbonManager: RibbonManager;
	private commandManager: CommandManager;
	private settingsTabManager: SettingsTabManager;

	constructor(private plugin: ChainPlugin) {
		this.ribbonManager = new RibbonManager(plugin);
		this.commandManager = new CommandManager(plugin);
		this.settingsTabManager = new SettingsTabManager(plugin.app, plugin);
	}

	initialize() {
		this.addIcons();
		this.ribbonManager.addIcons();
		this.addRibbonIcons();
		this.commandManager.addCommands();
		this.addSettingTab();
	}

	private addSettingTab() {
		this.plugin.addSettingTab(this.settingsTabManager);
	}

	private addIcons() {
		addIcon("chain-journal", ICON_DATA);
	}

	private addRibbonIcons() {
		this.plugin.addRibbonIcon(
			"chain-journal",
			"Create Future Entry",
			(evt: MouseEvent) => {
				new FutureEntryModal(this.plugin.app, (date) => {
					this.plugin.journalManager.createOrUpdateDailyNote(date);
				}).open();
			}
		);
	}
}
