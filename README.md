# Obsidian Chain Plugin

## Project Overview

The Obsidian Chain Plugin is a simple journaling system for Obsidian, enhancing its markdown-based structure with basic features for a streamlined journaling experience.

## Key Features (MVP)

1. Create and open dated journal entries
2. Basic customizable entry template
3. Quick access via ribbon icon and command palette
4. Simple settings for journal folder location

## Current Implementation

-   Create and open dated journal entries
-   Customizable journal folder and entry template
-   Quick access via ribbon icon and command palette
-   Settings management for user preferences

## Technical Implementation

-   **Plugin Structure**: Utilizes Obsidian's plugin API, implemented in TypeScript
-   **Data Storage**: Leverages Obsidian's file-based system, storing entries as markdown files
-   **User Interface**: Custom views using Obsidian's UI components, including a ribbon icon for quick access

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
3. **UI Manager** (`src/managers/uiManager.ts`): Manages user interface elements
4. **Journal Manager** (`src/managers/journalManager.ts`): Handles journal entry operations
5. **Constants and Types** (`src/constants.ts`, `src/types.ts`): Define shared values and types
6. **Utility Functions** (`src/utils/dateUtils.ts`): Provides helper functions

## Next Steps

1. Refine and optimize existing features
2. Improve error handling and user feedback
3. Enhance template customization options
4. Add basic search functionality for journal entries

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
