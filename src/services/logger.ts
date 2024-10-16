/*
logger.ts: Provides logging functionality for the Chain Plugin
- Offers methods for logging messages and errors
- Centralizes logging format and output
*/

export class Logger {
	static log(message: string) {
		console.log(`[ChainPlugin] ${message}`);
	}

	static error(error: Error) {
		console.error(`[ChainPlugin] Error: ${error.message}`);
	}
}

// Use in other modules
import { Logger } from "./logger";

try {
	// Some operation
} catch (error) {
	Logger.error(error);
}
