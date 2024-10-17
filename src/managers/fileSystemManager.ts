import { App, TFile } from "obsidian";
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
			if (!(await this.app.vault.adapter.exists(currentPath))) {
				await this.app.vault.createFolder(currentPath);
				Logger.log(`Created folder: ${currentPath}`);
			}
		}
	}

	async createFile(filePath: string, content: string): Promise<TFile> {
		Logger.log("Creating file: " + filePath);
		return await this.app.vault.create(filePath, content);
	}

	async fileExists(filePath: string): Promise<boolean> {
		return await this.app.vault.adapter.exists(filePath);
	}

	async openFile(file: TFile): Promise<void> {
		const activeLeaf = this.app.workspace.activeLeaf;
		if (activeLeaf) {
			await activeLeaf.openFile(file);
		}
	}

	async openFileInMainPane(file: TFile): Promise<void> {
		const leaf = this.app.workspace.getLeaf(false);
		await leaf.openFile(file, { active: true });
	}
}
