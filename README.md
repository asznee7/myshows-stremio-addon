# MyShows Stremio Addon

A Stremio addon that integrates your MyShows profile lists as Stremio catalogs, allowing you to seamlessly access your TV series tracking data within Stremio.

Installation link: https://d882a1b1dbbf-myshows-stremio-addon.baby-beamup.club/configure

## Features

- Integrates with MyShows.me user profile
- Supports all MyShows profile lists:
    - **Watching**: Series you are currently watching
    - **Later**: Series you plan to watch in the future
    - **Finished**: Series you have completed
    - **Cancelled**: Series you have dropped watching
- Imports mdlist collections as catalogs, with data filtered from MyShows.

![MyShows Stremio Addon Background](https://i.postimg.cc/7LQZNv2g/Screenshot-2025-05-10-204249.png)

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
