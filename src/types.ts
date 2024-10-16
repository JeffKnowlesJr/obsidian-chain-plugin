// types.ts: Defines types and interfaces for the Chain Plugin
// - Declares interfaces for journal entries
// - Defines types for plugin components
// - Ensures type consistency across the plugin
export interface JournalEntry {
	date: string;
	content: string;
	tags: string[];
}

export interface JournalManager {
	createJournalEntry(): Promise<void>;
	openTodayEntry(): Promise<void>;
	// ...
}
