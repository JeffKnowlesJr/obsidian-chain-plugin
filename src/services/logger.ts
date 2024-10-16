// logger.ts
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
