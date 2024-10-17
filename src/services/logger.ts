/*
logger.ts: Provides logging functionality for the Chain Plugin
- Offers methods for logging messages and errors
- Centralizes logging format and output
*/

export class Logger {
	static log(message: string, ...args: any[]) {
		console.log(`[Chain Plugin] ${message}`, ...args);
	}

	static warn(message: string, ...args: any[]) {
		console.warn(`[Chain Plugin] WARNING: ${message}`, ...args);
	}

	static error(message: string, error?: Error) {
		console.error(`[Chain Plugin] ERROR: ${message}`, error);
	}
}
