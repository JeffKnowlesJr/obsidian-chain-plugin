import ChainPlugin from "../main";
import { COMMANDS } from "../constants";
import { FutureEntryModal } from "./futureEntryModal";

export class CommandManager {
	constructor(private plugin: ChainPlugin) {}

	addCommands() {
		this.addCreateFutureEntryCommand();
		this.addOpenTodayEntryCommand();
	}

	private addCreateFutureEntryCommand() {
		this.plugin.addCommand({
			id: COMMANDS.CREATE_FUTURE_ENTRY,
			name: "Create Future Entry",
			callback: () => {
				new FutureEntryModal(this.plugin.app, (date: moment.Moment) => {
					this.plugin.journalManager.createOrUpdateDailyNote(date);
				}).open();
			},
		});
	}

	private addOpenTodayEntryCommand() {
		this.plugin.addCommand({
			id: COMMANDS.OPEN_TODAY,
			name: "Open Today's Entry",
			callback: () => {
				this.plugin.journalManager.createOrUpdateDailyNote();
			},
		});
	}
}
