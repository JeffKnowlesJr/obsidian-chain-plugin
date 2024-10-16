/*
dateUtils.ts: Provides utility functions for date handling
- Formats dates for journal entries
- Offers helper functions for date-related operations
*/

export function formatDate(date: Date): string {
	return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
}

export function getYearFolderName(date: Date): string {
	return `${date.getFullYear()}`;
}

export function getMonthFolderName(date: Date): string {
	const year = date.getFullYear();
	const month = date.toLocaleString("default", { month: "long" });
	const monthNumber = (date.getMonth() + 1).toString().padStart(2, "0");
	return `${year}-${monthNumber} ${month}`;
}

export function getDayFileName(date: Date): string {
	const dayName = date.toLocaleString("default", { weekday: "long" });
	return `${formatDate(date)} ${dayName}.md`;
}
