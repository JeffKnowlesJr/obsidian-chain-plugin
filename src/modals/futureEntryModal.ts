import { App, Modal, Setting } from "obsidian";
import moment from "moment";

export class FutureEntryModal extends Modal {
	private date: moment.Moment;
	private onSubmit: (date: moment.Moment) => void;

	constructor(app: App, onSubmit: (date: moment.Moment) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.date = moment();
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
						const newDate = moment(target.value);
						if (newDate.isValid()) {
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

	private formatDate(date: moment.Moment): string {
		return date.format("YYYY-MM-DD");
	}
}
