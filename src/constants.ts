/*
constants.ts: Defines constant values for the Chain Plugin
- Declares command identifiers
- Defines setting keys
- Stores SVG data for plugin icons
*/

export const COMMANDS = {
	CREATE_FUTURE_ENTRY: "create-future-journal-entry",
	OPEN_TODAY: "open-today-entry",
};

export const SETTINGS = {
	JOURNAL_FOLDER: "journalFolder",
	DEFAULT_TEMPLATE: "defaultTemplate",
	DAILY_NOTES_FOLDER_OVERRIDE: "dailyNotesFolderOverride",
};

export const ICON_DATA = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor">
  <!-- Notebook -->
  <rect x="20" y="10" width="60" height="80" rx="5" ry="5" stroke="currentColor" stroke-width="5" fill="none"/>
  <line x1="30" y1="10" x2="30" y2="90" stroke="currentColor" stroke-width="3"/>
  
  <!-- Lines representing text -->
  <line x1="40" y1="30" x2="70" y2="30" stroke="currentColor" stroke-width="3"/>
  <line x1="40" y1="50" x2="70" y2="50" stroke="currentColor" stroke-width="3"/>
  <line x1="40" y1="70" x2="70" y2="70" stroke="currentColor" stroke-width="3"/>
  
  <!-- Chain link -->
  <path d="M75 40 Q85 40 85 50 Q85 60 75 60 Q65 60 65 50 Q65 40 75 40 Z" stroke="currentColor" stroke-width="3" fill="none"/>
  <path d="M65 50 Q65 60 75 60 Q85 60 85 70 Q85 80 75 80 Q65 80 65 70" stroke="currentColor" stroke-width="3" fill="none"/>
</svg>
`;

export const MONTHLY_FILES = [
	"{month} List.md",
	"{month} Log.md",
	"{month} Tracker.md",
];

export const TEMPLATES = {
	DAILY: "dailyTemplate",
	MONTHLY_LIST: "monthlyListTemplate",
	MONTHLY_LOG: "monthlyLogTemplate",
	MONTHLY_TRACKER: "monthlyTrackerTemplate",
};

interface ChainPluginSettings {
	[SETTINGS.JOURNAL_FOLDER]: string;
	[SETTINGS.DEFAULT_TEMPLATE]: string;
	[TEMPLATES.DAILY]: string;
	[TEMPLATES.MONTHLY_LIST]: string;
	[TEMPLATES.MONTHLY_LOG]: string;
	[TEMPLATES.MONTHLY_TRACKER]: string;
}

const DEFAULT_SETTINGS: ChainPluginSettings = {
	[SETTINGS.JOURNAL_FOLDER]: "Journal",
	[SETTINGS.DEFAULT_TEMPLATE]:
		"# Journal Entry for {date}\n\n## Today's Goals\n\n## Notes\n\n## Reflections\n",
	[TEMPLATES.DAILY]:
		"# Daily Entry - {date}\n\n## Tasks\n- [ ] \n\n## Notes\n\n## Reflection\n",
	[TEMPLATES.MONTHLY_LIST]:
		"# {month} List\n\n## Goals\n- [ ] \n\n## Projects\n- \n\n## Ideas\n- ",
	[TEMPLATES.MONTHLY_LOG]:
		"# {month} Log\n\n| Date | Event |\n|------|-------|\n| ",
	[TEMPLATES.MONTHLY_TRACKER]:
		"# {month} Tracker\n\n| Date | Habit 1 | Habit 2 | Habit 3 |\n|------|---------|---------|---------|\n| ",
};
