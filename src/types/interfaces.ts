// Add type definitions and interfaces here

export interface ChainPluginSettings {
	journalFolder: string;
	defaultTemplate: string;
	dailyNotesFolderOverride: string;
	dateFormat: string;
	newFileLocation: string;
	templateFileLocation: string;
	openDailyNoteOnStartup: boolean;
}
