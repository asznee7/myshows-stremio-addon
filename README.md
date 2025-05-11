# MyShows Stremio Addon

A Stremio addon that integrates your MyShows profile lists as Stremio catalogs, allowing you to seamlessly access your TV series tracking data within Stremio.

## Features

- Integrates with MyShows.me user profile
- Supports all MyShows profile lists:
    - **Watching**: Series you are currently watching
    - **Later**: Series you plan to watch in the future
    - **Finished**: Series you have completed
    - **Cancelled**: Series you have dropped watching

![MyShows Stremio Addon Background](https://i.postimg.cc/7LQZNv2g/Screenshot-2025-05-10-204249.png)

## Installation

1. Install Stremio from [stremio.com](https://www.stremio.com)
2. Open Stremio
3. Go to the addons section
4. Click on the "Add Addon" button
5. Enter the addon URL: `https://your-addon-url/manifest.json`

## Development

### Prerequisites

- Node.js
- pnpm

### Setup

1. Clone the repository
2. Install dependencies:
    ```bash
    pnpm install
    ```
3. Build the project:
    ```bash
    pnpm build
    ```
4. Start the development server:
    ```bash
    pnpm dev
    ```

### Scripts

- `pnpm build` - Build the project
- `pnpm start` - Start the production server
- `pnpm dev` - Start the development server with hot reload

## License

MIT License - see the [LICENSE](LICENSE) file for details
