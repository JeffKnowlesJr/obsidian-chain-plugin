/*
dateUtils.ts: Provides utility functions for date handling
- Formats dates for journal entries
- Offers helper functions for date-related operations
*/

export function formatDate(date: Date): string {
	return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
}
