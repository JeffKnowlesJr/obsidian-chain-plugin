import { FileSystemManager } from "../managers/fileSystemManager";
import { App, TFile, TFolder } from "obsidian";

jest.mock("obsidian");

describe("FileSystemManager", () => {
	let fileSystemManager: FileSystemManager;
	let mockApp: jest.Mocked<App>;

	beforeEach(() => {
		mockApp = new App() as jest.Mocked<App>;
		fileSystemManager = new FileSystemManager(mockApp);
	});

	describe("createFile", () => {
		it("should create a file", async () => {
			const filePath = "/test/file.md";
			const content = "Test content";
			const mockFile = {} as TFile;

			mockApp.vault.create.mockResolvedValue(mockFile);

			const result = await fileSystemManager.createFile(
				filePath,
				content
			);

			expect(mockApp.vault.create).toHaveBeenCalledWith(
				filePath,
				content
			);
			expect(result).toBe(mockFile);
		});
	});

	describe("ensureFolderExists", () => {
		it("should create folder if it does not exist", async () => {
			const folderPath = "/test/folder";
			const mockFolder = {} as TFolder;

			mockApp.vault.getAbstractFileByPath.mockReturnValue(null);
			mockApp.vault.createFolder.mockResolvedValue(mockFolder);

			await fileSystemManager.ensureFolderExists(folderPath);

			expect(mockApp.vault.createFolder).toHaveBeenCalledWith(folderPath);
		});

		it("should not create folder if it already exists", async () => {
			const folderPath = "/test/folder";
			const mockFolder = {} as TFolder;

			mockApp.vault.getAbstractFileByPath.mockReturnValue(mockFolder);

			await fileSystemManager.ensureFolderExists(folderPath);

			expect(mockApp.vault.createFolder).not.toHaveBeenCalled();
		});
	});
});
