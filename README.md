# Obsidian Chain Plugin

## Project Overview

The Obsidian Chain Plugin is an advanced journaling system for Obsidian, enhancing its markdown-based structure with features for a streamlined and organized journaling experience.

## Key Features

1. Create and open dated journal entries within a structured yearly and monthly folder system
2. Customizable entry template
3. Quick access via ribbon icon and command palette
4. Future entry creation with automatic folder structure generation
5. Monthly List, Log, and Tracker files

## Current Implementation

-   Create and open dated journal entries in the format "YYYY-MM-DD Day.md"
-   Customizable journal folder structure and entry template
-   Quick access via ribbon icon and command palette
-   Settings management for user preferences
-   Automatic creation of yearly and monthly folders
-   Generation of monthly List, Log, and Tracker files

## Technical Implementation

-   **Plugin Structure**: Utilizes Obsidian's plugin API, implemented in TypeScript
-   **Data Storage**: Leverages Obsidian's file-based system, storing entries as markdown files within a structured folder hierarchy
-   **User Interface**: Custom views using Obsidian's UI components, including a ribbon icon for quick access and a date picker for future entries

## Project Structure

obsidian-chain-plugin/
├── src/
│ ├── main.ts
│ ├── types.ts
│ ├── constants.ts
│ ├── managers/
│ │ ├── journalManager.ts
│ │ ├── settingsManager.ts
│ │ └── uiManager.ts
│ └── utils/
│ └── dateUtils.ts
├── manifest.json
├── package.json
└── README.md

## Core Components

1. **Main Entry Point** (`src/main.ts`): Initializes plugin components and manages lifecycle
2. **Settings Manager** (`src/managers/settingsManager.ts`): Handles plugin configuration
3. **UI Manager** (`src/managers/uiManager.ts`): Manages user interface elements, including the future entry date picker
4. **Journal Manager** (`src/managers/journalManager.ts`): Handles journal entry operations and folder structure creation
5. **Constants and Types** (`src/constants.ts`, `src/types.ts`): Define shared values and types
6. **Utility Functions** (`src/utils/dateUtils.ts`): Provides helper functions for date handling and folder structure generation

## Next Steps

1. Implement future entry creation with date picker
2. Add automatic generation of monthly List, Log, and Tracker files
3. Enhance folder structure creation logic
4. Improve error handling and user feedback
5. Add basic search functionality for journal entries

## Installation and Usage

1. Download the latest release
2. Extract to Obsidian plugins folder
3. Enable plugin in Obsidian settings
4. Use ribbon icon or command palette to create/open entries
5. Configure settings in Obsidian settings panel

## Development and Contributing

Contributions are welcome. Please refer to the GitHub repository for guidelines.

## License

This project is licensed under the MIT License.
