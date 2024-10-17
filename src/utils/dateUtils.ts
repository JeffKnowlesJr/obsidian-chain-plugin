/*
dateUtils.ts: Provides utility functions for date handling
- Formats dates for journal entries
- Offers helper functions for date-related operations
*/

import { moment } from "obsidian";

export function formatDate(date: moment.Moment): string {
	return date.format("YYYY-MM-DD dddd");
}

export function getYearFolderName(date: moment.Moment): string {
	return date.format("YYYY");
}

export function getMonthFolderName(date: moment.Moment): string {
	return date.format("MM-MMMM");
}

export function getDayFileName(date: moment.Moment): string {
	return `${date.format("YYYY-MM-DD dddd")}.md`;
}
