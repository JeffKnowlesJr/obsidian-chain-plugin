import { App, TFile, moment } from "obsidian";
import { SettingsManager } from "./settingsManager";

export class TemplateManager {
	constructor(private app: App, private settingsManager: SettingsManager) {}

	async getTemplateContent(): Promise<string | null> {
		const templatePath = this.settingsManager.getSetting(
			"templateFileLocation"
		);
		if (!templatePath) return null;

		const templateFile = this.app.vault.getAbstractFileByPath(templatePath);
		if (templateFile instanceof TFile) {
			return await this.app.vault.read(templateFile);
		}
		return null;
	}

	replaceDatePlaceholder(content: string, date: moment.Moment): string {
		return content.replace(/{date}/g, date.format("YYYY-MM-DD dddd"));
	}

	getDefaultTemplate(date: moment.Moment): string {
		const formattedDate = date.format("YYYY-MM-DD dddd");
		return `# Journal Entry for ${formattedDate}\n\n## Today's Goals\n\n## Notes\n\n## Reflections\n`;
	}
}
