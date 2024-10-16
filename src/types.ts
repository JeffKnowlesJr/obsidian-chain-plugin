// types.ts
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
