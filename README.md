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
7. Improved error handling and logging in EntryCreator

## Current Implementation

-   Create and open dated journal entries in the format "YYYY-MM-DD dddd.md"
-   Folder structure: /Journal/YYYY/MM-mmmm/
-   Customizable journal folder structure and entry templates
-   Quick access via ribbon icons and command palette
-   Settings management for user preferences
-   Automatic creation of yearly and monthly folders
-   Future entry creation with date picker functionality
-   Plugin reload functionality without closing Obsidian
-   Enhanced error handling and informational logging in EntryCreator

## Technical Implementation

-   **Plugin Structure**: Utilizes Obsidian's plugin API, implemented in TypeScript
-   **Data Storage**: Leverages Obsidian's file-based system, storing entries as markdown files within a structured folder hierarchy
-   **User Interface**: Custom views using Obsidian's UI components, including ribbon icons for quick access and a date picker for future entries
-   **Error Handling**: Comprehensive error handling for improved stability and user feedback
-   **Logging**: Improved logging system for better debugging and user information

## Project Structure

obsidian-chain-plugin/
├── src/
│ ├── main.ts
│ ├── types/
│ │ └── interfaces.ts
│ ├── config/
│ │ ├── constants.ts
│ │ └── defaultSettings.ts
│ ├── managers/
│ │ ├── journalManager.ts
│ │ ├── settingsManager.ts
│ │ ├── uiManager.ts
│ │ ├── fileSystemManager.ts
│ │ ├── commandManager.ts
│ │ ├── ribbonManager.ts
│ │ ├── pluginManager.ts
│ │ ├── syncManager.ts
│ │ └── templateManager.ts
│ ├── services/
│ │ ├── logger.ts
│ │ └── eventBus.ts
│ ├── ui/
│ │ ├── components/
│ │ │ └── futureEntryModal.ts
│ │ └── settingsTab.ts
│ └── utils/
│ └── errorHandler.ts
├── tests/
│ └── unit/
│ └── managers/
│ └── settingsManager.test.ts
├── manifest.json
├── package.json
└── README.md

## Core Components

1. **Main Entry Point** (`src/main.ts`): Initializes plugin components, manages lifecycle, and coordinates between different managers
2. **Settings Manager** (`src/managers/settingsManager.ts`): Handles plugin configuration, loading, and saving of user preferences
3. **UI Manager** (`src/managers/uiManager.ts`): Manages user interface elements, including settings tab, ribbon icons, and commands
4. **Journal Manager** (`src/managers/journalManager.ts`): Handles journal entry operations, folder structure creation, and daily note management
5. **File System Manager** (`src/managers/fileSystemManager.ts`): Manages file and folder operations within Obsidian's file system
6. **Command Manager** (`src/managers/commandManager.ts`): Handles plugin commands and their execution within Obsidian
7. **Ribbon Manager** (`src/managers/ribbonManager.ts`): Manages ribbon icons for quick access to plugin features
8. **Plugin Manager** (`src/managers/pluginManager.ts`): Handles plugin reload functionality and integration with Obsidian's Daily Notes plugin
9. **Future Entry Modal** (`src/ui/components/futureEntryModal.ts`): Provides date picker functionality for creating future journal entries
10. **Constants** (`src/config/constants.ts`): Defines shared values, types, and default settings for the plugin
11. **Logger** (`src/services/logger.ts`): Provides logging functionality for debugging and error tracking throughout the plugin
12. **Sync Manager** (`src/managers/syncManager.ts`): Handles synchronization of settings between the Chain Plugin and the Daily Notes plugin
13. **Error Handler** (`src/utils/errorHandler.ts`): Provides error handling functionality for improved stability and user feedback
14. **Event Bus** (`src/services/eventBus.ts`): Implements an event bus for loose coupling between plugin components
15. **Template Manager** (`src/managers/templateManager.ts`): Handles the retrieval and processing of note templates
16. **Entry Creator** (`src/managers/entryCreator.ts`): Handles the creation and updating of daily notes with improved error handling and logging

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

Current version: 1.2.1 (as of last update)

## Author

Created by Jeff's Link (https://jeffs.link)

## Support

If you find this plugin helpful, consider supporting the development on [Patreon](https://www.patreon.com/jeffslink).

## Daily Notes Plugin Integration

The Chain Plugin seamlessly integrates with Obsidian's core Daily Notes plugin to ensure consistent settings and behavior. This integration is managed by the SyncManager, which handles:

-   Synchronization of date format settings
-   Matching folder structure for daily notes
-   Consistent use of templates for daily entries
-   Automatic updates to Daily Notes plugin settings when Chain Plugin settings change

Users can manage their daily journaling workflow using either plugin, with settings automatically kept in sync for a smooth experience.

## Recent Changes and Improvements

Recent development has focused on enhancing the EntryCreator component:

-   Improved error handling to provide more informative messages
-   Enhanced logging for better debugging and user feedback
-   Refactored file creation process for improved reliability
-   Better handling of existing files and unexpected file types

## Suggested Refactoring and Optimizations

1. **Code Modularization**: Consider breaking down larger methods in EntryCreator into smaller, more focused functions for improved readability and maintainability.

2. **Error Handling Strategy**: Implement a consistent error handling strategy across all components, possibly using a custom error class.

3. **Asynchronous Operations**: Review and optimize asynchronous operations, particularly in file system interactions, to improve performance.

4. **Template Processing**: Enhance the template processing system to allow for more complex templates and dynamic content insertion.

5. **Caching Mechanism**: Implement a caching system for frequently accessed settings and file paths to reduce redundant operations.

6. **Unit Testing**: Expand unit test coverage, particularly for the EntryCreator and FileSystemManager components.

7. **Performance Profiling**: Conduct performance profiling to identify and optimize any bottlenecks in the plugin's operation.

8. **User Feedback**: Implement a more robust system for providing real-time feedback to users during long-running operations.

9. **Plugin Settings**: Review and potentially expand plugin settings to offer users more customization options.

10. **Integration Enhancements**: Further improve integration with Obsidian's core plugins and API to ensure compatibility with future Obsidian updates.
