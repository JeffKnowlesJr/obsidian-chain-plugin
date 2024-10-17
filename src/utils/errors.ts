export class ChainPluginError extends Error {
	constructor(message: string, public readonly code: string) {
		super(message);
		this.name = "ChainPluginError";
	}
}

export enum ErrorCodes {
	FILE_CREATION_FAILED = "FILE_CREATION_FAILED",
	FOLDER_CREATION_FAILED = "FOLDER_CREATION_FAILED",
	TEMPLATE_NOT_FOUND = "TEMPLATE_NOT_FOUND",
	INVALID_DATE = "INVALID_DATE",
	TEMPLATE_GENERATION_FAILED = "TEMPLATE_GENERATION_FAILED",
	// Add more error codes as needed
}
