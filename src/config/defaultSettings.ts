// Define default settings here

import { ChainPluginSettings } from "../types/interfaces";

export const DEFAULT_SETTINGS: ChainPluginSettings = {
	journalFolder: "Journal",
	defaultTemplate:
		"## Log\n\n### Ideas\n- \n### To Do\n- [ ] \n### Contacts\n- [ ] \n### Events\n- \n\n****\n## Routine Checklist\n\n- [ ] **Daily**\n    - [ ] Morning",
	dailyNotesFolderOverride: "",
	dateFormat: "YYYY-MM-DD dddd",
	newFileLocation: "/Journal/YYYY/MM-mmmm/",
	templateFileLocation: "/Templates/Daily Note Template.md",
	openDailyNoteOnStartup: true,
};
