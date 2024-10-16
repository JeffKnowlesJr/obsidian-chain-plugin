import { App, TFile, Vault } from "obsidian";
import { Logger } from "../services/logger";

export class FileSystemManager {
	constructor(private app: App) {}

	async ensureFolderStructure(folderPath: string): Promise<void> {
		console.log("Ensuring folder structure for:", folderPath);
		const folders = folderPath
			.split("/")
			.filter((folder) => folder.length > 0);
		let currentPath = "";

		for (const folder of folders) {
			currentPath += folder + "/";
			try {
				const folderExists = await this.app.vault.adapter.exists(
					currentPath
				);
				if (!folderExists) {
					await this.app.vault.createFolder(currentPath);
				}
			} catch (error) {
				Logger.error(`Failed to create folder: ${currentPath}`, error);
				throw new Error(
					`Failed to create folder structure: ${error.message}`
				);
			}
		}
		console.log("Folder structure created:", folderPath);
	}

	async createFile(filePath: string, content: string): Promise<TFile> {
		console.log("Creating file:", filePath);
		return await this.app.vault.create(filePath, content);
	}

	async fileExists(filePath: string): Promise<boolean> {
		return await this.app.vault.adapter.exists(filePath);
	}

	async openFile(file: TFile): Promise<void> {
		await this.app.workspace.activeLeaf.openFile(file);
	}

	async openFileInMainPane(file: TFile): Promise<void> {
		console.log("Opening file in main pane:", file.path);
		const leaf = this.app.workspace.getLeaf(false);
		await leaf.openFile(file, { active: true });
		console.log("File opened in main pane");
	}
}
