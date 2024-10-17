import { EntryCreator } from "../managers/entryCreator";
import { SettingsManager } from "../managers/settingsManager";
import { FileSystemManager } from "../managers/fileSystemManager";
import { App, TFile } from "obsidian";
import moment from "moment";

// Mock dependencies
jest.mock("../managers/settingsManager");
jest.mock("../managers/fileSystemManager");
jest.mock("obsidian");

describe("EntryCreator", () => {
	let entryCreator: EntryCreator;
	let mockApp: jest.Mocked<App>;
	let mockSettingsManager: jest.Mocked<SettingsManager>;
	let mockFileSystemManager: jest.Mocked<FileSystemManager>;

	beforeEach(() => {
		mockApp = new App() as jest.Mocked<App>;
		mockSettingsManager = new SettingsManager(
			{} as any
		) as jest.Mocked<SettingsManager>;
		mockFileSystemManager = new FileSystemManager(
			{} as any
		) as jest.Mocked<FileSystemManager>;

		entryCreator = new EntryCreator(
			mockApp,
			mockSettingsManager,
			mockFileSystemManager
		);
	});

	describe("getFilePaths", () => {
		it("should generate correct file paths", () => {
			const date = moment("2023-05-15");
			mockSettingsManager.getSetting.mockImplementation((key) => {
				if (key === "journalFolder") return "Journal";
				if (key === "newFileLocation")
					return "/{{journalFolder}}/{{date:YYYY}}/{{date:MM-MMMM}}/";
				return "";
			});

			const result = entryCreator["getFilePaths"](date);

			expect(result.folderPath).toBe("/Journal/2023/05-May/");
			expect(result.filePath).toBe(
				"/Journal/2023/05-May/2023-05-15 Monday.md"
			);
		});
	});

	describe("createNewFile", () => {
		it("should create a new file with correct content", async () => {
			const filePath = "/Journal/2023/05-May/2023-05-15 Monday.md";
			const date = moment("2023-05-15");
			const mockFile = {} as TFile;

			mockFileSystemManager.createFile.mockResolvedValue(mockFile);

			const result = await entryCreator["createNewFile"](filePath, date);

			expect(mockFileSystemManager.createFile).toHaveBeenCalledWith(
				filePath,
				expect.any(String)
			);
			expect(result).toBe(mockFile);
		});
	});
});
