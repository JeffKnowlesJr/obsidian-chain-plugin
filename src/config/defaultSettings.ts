// Define default settings here

import { ChainPluginSettings } from "../types/interfaces";
import { DEFAULT_TEMPLATE } from "./defaultTemplate";

export const DEFAULT_SETTINGS: ChainPluginSettings = {
	journalFolder: "Journal",
	defaultTemplate: DEFAULT_TEMPLATE,
	dailyNotesFolderOverride: "",
	dateFormat: "YYYY-MM-DD dddd",
	newFileLocation: "/Journal/{{date:YYYY}}/{{date:MM-MMMM}}/",
	templateFileLocation: "/Templates/Daily Note Template.md",
	openDailyNoteOnStartup: true,
};
