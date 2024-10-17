# Obsidian Chain Plugin

## Project Overview

The Obsidian Chain Plugin is an advanced journaling system for Obsidian, enhancing its markdown-based structure with features for a streamlined and organized journaling experience.

## Key Features

1. Create and open dated journal entries within a structured yearly and monthly folder system
2. Customizable entry templates for daily and monthly entries
3. Quick access via ribbon icons and command palette
4. Future entry creation with automatic folder structure generation
5. Plugin reload functionality for easy development and troubleshooting
6. Seamless integration with Obsidian's Daily Notes plugin

## Current Implementation

-   Create and open dated journal entries in the format "YYYY-MM-DD dddd.md"
-   Folder structure: /Journal/YYYY/MM-mmmm/
-   Customizable journal folder structure and entry templates
-   Quick access via ribbon icons and command palette
-   Settings management for user preferences
-   Automatic creation of yearly and monthly folders
-   Future entry creation with date picker functionality
-   Plugin reload functionality without closing Obsidian

## Technical Implementation

-   **Plugin Structure**: Utilizes Obsidian's plugin API, implemented in TypeScript
-   **Data Storage**: Leverages Obsidian's file-based system, storing entries as markdown files within a structured folder hierarchy
-   **User Interface**: Custom views using Obsidian's UI components, including ribbon icons for quick access and a date picker for future entries
-   **Error Handling**: Comprehensive error handling for improved stability and user feedback

## Project Structure

obsidian-chain-plugin/
├── src/
│ ├── main.ts
│ ├── constants.ts
│ ├── managers/
│ │ ├── journalManager.ts
│ │ ├── settingsManager.ts
│ │ ├── uiManager.ts
│ │ ├── fileSystemManager.ts
│ │ ├── commandManager.ts
│ │ ├── ribbonManager.ts
│ │ └── pluginManager.ts
│ ├── services/
│ │ └── logger.ts
│ └── modals/
│ └── futureEntryModal.ts
├── manifest.json
├── package.json
└── README.md

## Core Components

1. **Main Entry Point** (`src/main.ts`): Initializes plugin components and manages lifecycle
2. **Settings Manager** (`src/managers/settingsManager.ts`): Handles plugin configuration
3. **UI Manager** (`src/managers/uiManager.ts`): Manages user interface elements, including settings tab
4. **Journal Manager** (`src/managers/journalManager.ts`): Handles journal entry operations and folder structure creation
5. **File System Manager** (`src/managers/fileSystemManager.ts`): Manages file and folder operations
6. **Command Manager** (`src/managers/commandManager.ts`): Handles plugin commands and their execution
7. **Ribbon Manager** (`src/managers/ribbonManager.ts`): Manages ribbon icons for quick access
8. **Plugin Manager** (`src/managers/pluginManager.ts`): Handles plugin reload functionality and Daily Notes plugin integration
9. **Future Entry Modal** (`src/modals/futureEntryModal.ts`): Provides date picker functionality for future entries
10. **Constants** (`src/constants.ts`): Defines shared values and types
11. **Logger** (`src/services/logger.ts`): Provides logging functionality for debugging and error tracking

## Installation and Usage

1. Install the plugin from Obsidian's Community Plugins browser
2. Enable the plugin in Obsidian settings
3. Use ribbon icon or command palette to create/open entries
4. Configure settings in the plugin's settings tab

## Development and Contributing

Contributions are welcome. Please refer to the GitHub repository for guidelines.

## License

This project is licensed under the MIT License.

## Version

Current version: 1.1.0 (as of last update)

## Author

Created by Jeff's Link (https://jeffs.link)

## Support

If you find this plugin helpful, consider supporting the development on [Patreon](https://www.patreon.com/jeffslink).
