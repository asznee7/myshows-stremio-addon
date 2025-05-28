import { addonBuilder } from 'stremio-addon-sdk'
import { ECatalogId } from './types/types.js'

const addon = new addonBuilder({
    id: 'org.myshowsaddon',
    name: 'MyShows Lists',
    version: '1.1.0',
    description:
        'Stremio addon that integrates MyShows.me user profile lists as Stremio catalogs.',
    logo: 'https://i.postimg.cc/sDRDm4v0/Screenshot-2025-05-10-204006.png',
    background:
        'https://i.postimg.cc/7LQZNv2g/Screenshot-2025-05-10-204249.png',
    resources: ['catalog'],
    types: ['series'],
    catalogs: [
        {
            type: 'series',
            id: ECatalogId.MyShowsWatchList,
            name: 'MyShows Watch List',
            extra: [
                {
                    name: 'search',
                },
            ],
        },
        {
            type: 'series',
            id: ECatalogId.MyShowsLaterList,
            name: 'MyShows Later List',
            extra: [
                {
                    name: 'search',
                },
            ],
        },
        {
            type: 'series',
            id: ECatalogId.MyShowsCompletedList,
            name: 'MyShows Completed List',
            extra: [
                {
                    name: 'search',
                },
            ],
        },
        {
            type: 'series',
            id: ECatalogId.MyShowsCancelledList,
            name: 'MyShows Cancelled List',
            extra: [
                {
                    name: 'search',
                },
            ],
        },
    ],
    idPrefixes: ['tt'],
    behaviorHints: {
        configurationRequired: true,
        configurable: true,
    },
    config: [
        {
            key: 'username',
            type: 'text',
            title: 'Your MyShows username:',
            required: 'true',
        },
        {
            key: ECatalogId.MyShowsWatchList,
            type: 'checkbox',
            title: 'Show Watching List',
            default: 'checked',
        },
        {
            key: ECatalogId.MyShowsLaterList,
            type: 'checkbox',
            title: 'Show Later List',
            default: 'checked',
        },
        {
            key: ECatalogId.MyShowsCompletedList,
            type: 'checkbox',
            title: 'Show Completed List',
        },
        {
            key: ECatalogId.MyShowsCancelledList,
            type: 'checkbox',
            title: 'Show Cancelled List',
        },
    ],
})

export default addon
