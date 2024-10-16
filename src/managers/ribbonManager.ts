import { addIcon } from "obsidian";
import ChainPlugin from "../main";
import { ICON_DATA } from "../constants";
import { FutureEntryModal } from "./futureEntryModal";
import moment from "moment";

export class RibbonManager {
	constructor(private plugin: ChainPlugin) {}

	addIcons() {
		addIcon("chain-journal", ICON_DATA);
		this.addFutureEntryIcon();
		this.addReloadIcon();
	}

	private addFutureEntryIcon() {
		this.plugin.addRibbonIcon(
			"chain-journal",
			"Create Future Entry",
			(evt: MouseEvent) => {
				new FutureEntryModal(this.plugin.app, (date: moment.Moment) => {
					this.plugin.journalManager.createOrUpdateDailyNote(date);
				}).open();
			}
		);
	}

	private addReloadIcon() {
		this.plugin.addRibbonIcon(
			"reset",
			"Reload Chain Plugin",
			(evt: MouseEvent) => {
				this.reloadPlugin();
			}
		);
	}

	private reloadPlugin() {
		console.clear();
		(this.plugin.app as any).plugins.disablePlugin("obsidian-chain-plugin");
		setTimeout(() => {
			(this.plugin.app as any).plugins.enablePlugin(
				"obsidian-chain-plugin"
			);
		}, 100);
	}
}
