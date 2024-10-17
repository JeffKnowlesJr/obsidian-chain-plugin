/*
logger.ts: Provides logging functionality for the Chain Plugin
- Offers methods for logging messages and errors
- Centralizes logging format and output
*/

export class Logger {
	static log(message: string, ...args: any[]) {
		console.log(`[Chain Plugin] ${message}`, ...args);
	}

	static info(message: string, ...args: any[]) {
		console.info(`[Chain Plugin] INFO: ${message}`, ...args);
	}

	static warn(message: string, ...args: any[]) {
		console.warn(`[Chain Plugin] WARNING: ${message}`, ...args);
	}

	static error(message: string, error?: Error) {
		console.error(`[Chain Plugin] ERROR: ${message}`, error);
	}

	static debug(message: string, ...args: any[]) {
		console.debug(`[Chain Plugin] DEBUG: ${message}`, ...args);
	}
}
