import { App, TFile, Vault } from "obsidian";
import { Logger } from "../services/logger";

export class FileSystemManager {
	constructor(private app: App) {}

	async ensureFolderStructure(folderPath: string): Promise<void> {
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
	}

	async createFile(filePath: string, content: string): Promise<TFile> {
		return await this.app.vault.create(filePath, content);
	}

	async fileExists(filePath: string): Promise<boolean> {
		return await this.app.vault.adapter.exists(filePath);
	}

	async openFile(file: TFile): Promise<void> {
		await this.app.workspace.activeLeaf.openFile(file);
	}

	async openFileInMainPane(file: TFile): Promise<void> {
		const leaf = this.app.workspace.getLeaf(false);
		await leaf.openFile(file, { active: true });
	}
}
