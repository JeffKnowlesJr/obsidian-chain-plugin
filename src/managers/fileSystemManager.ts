import { App, TFile } from "obsidian";
import { Logger } from "../services/logger";

export class FileSystemManager {
	constructor(private app: App) {}

	async ensureFolderStructure(folderPath: string): Promise<void> {
		Logger.log("Ensuring folder structure for:", folderPath);
		const folders = folderPath
			.split("/")
			.filter((folder) => folder.length > 0);
		let currentPath = "";

		for (const folder of folders) {
			currentPath += folder + "/";
			Logger.log("Checking folder:", currentPath);
			try {
				const folderExists = await this.app.vault.adapter.exists(
					currentPath
				);
				Logger.log("Folder exists:", folderExists);
				if (!folderExists) {
					Logger.log("Creating folder:", currentPath);
					await this.app.vault.createFolder(currentPath);
					Logger.log("Folder created:", currentPath);
				}
			} catch (error) {
				Logger.error(
					`Failed to create folder: ${currentPath}`,
					error as Error
				);
				throw new Error(
					`Failed to create folder structure: ${
						(error as Error).message
					}`
				);
			}
		}
		Logger.log("Folder structure creation completed for:", folderPath);
	}

	async createFile(filePath: string, content: string): Promise<TFile> {
		Logger.log("Creating file:", filePath);
		return await this.app.vault.create(filePath, content);
	}

	async fileExists(filePath: string): Promise<boolean> {
		return await this.app.vault.adapter.exists(filePath);
	}

	async openFile(file: TFile): Promise<void> {
		await this.app.workspace.activeLeaf.openFile(file);
	}

	async openFileInMainPane(file: TFile): Promise<void> {
		Logger.log("Opening file in main pane:", file.path);
		const leaf = this.app.workspace.getLeaf(false);
		await leaf.openFile(file, { active: true });
		Logger.log("File opened in main pane");
	}
}
