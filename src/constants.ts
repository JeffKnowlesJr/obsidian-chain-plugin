// constants.ts
export const COMMANDS = {
	CREATE_ENTRY: "create-journal-entry",
	OPEN_TODAY: "open-today-entry",
};

export const SETTINGS = {
	JOURNAL_FOLDER: "journalFolder",
	DEFAULT_TEMPLATE: "defaultTemplate",
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
