import { Args } from 'stremio-addon-sdk'

import { getMetadata } from '../api/get-metadata.js'
import { getUserShows } from '../api/get-user-shows.js'
import {
    getMdblistByUsernameAndListname,
    getMdblistList,
    getMdblistListItems,
    getMdblistListItemsByUsernameAndListname,
} from '../api/mdblist.js'
import { getImdbIdsFromMyShows } from '../handlers/converters/myshows-to-meta.js'

export const mdblistManifestTemplate = {
    id: 'org.myshowsaddon.mdblist',
    logo: 'https://i.postimg.cc/K8PL09wv/mdblist-1.png',
    version: '1.0.0',
    description:
        'Addon for MDBList custom lists that integrates watched shows from MyShows.me so that they can be filtered out from the list',
    name: 'MDBList',
    resources: ['catalog'],
    types: ['series'],
    idPrefixes: ['tt'],
    catalogs: [],
}

const catalogTemplate = {
    type: 'series',
    id: 'mdblist-list',
    extra: [
        {
            name: 'skip',
        },
    ],
    extraSupported: ['skip'],
    name: 'List',
}

export async function getMdblistManifest(
    apiKey: string,
    listId?: string,
    username?: string,
    listname?: string
) {
    const lists = listId
        ? await getMdblistList(listId, apiKey)
        : username && listname
          ? await getMdblistByUsernameAndListname(username, listname, apiKey)
          : []
    const list = lists.find((list) => list.mediatype === 'show')

    if (!list) {
        throw new Error('List not found')
    }

    const manifestClone = {
        ...mdblistManifestTemplate,
        name: list.name,
        id: `com.myshowsaddon.mdblist.${list.slug}`,
        types: ['series'],
        catalogs: [
            {
                ...catalogTemplate,
                name: list.name,
                id: `${list.slug}-series`,
                type: 'series',
            },
        ],
    }

    return manifestClone
}

export async function mdblistListCatalogHandler(
    args: Args,
    apiKey: string,
    myshowsUsername?: string,
    listId?: string,
    username?: string,
    listname?: string
) {
    const { type, extra } = args

    if (type !== 'series') {
        throw new Error('Not supported catalog type')
    }

    const listItems = listId
        ? await getMdblistListItems(listId, apiKey, 100, extra?.skip || 0)
        : username && listname
          ? await getMdblistListItemsByUsernameAndListname(
                username,
                listname,
                apiKey,
                100,
                extra?.skip || 0
            )
          : { movies: [], shows: [] }

    if (!myshowsUsername) {
        const metas = await getMetadata(
            'series',
            listItems.shows.map((show) => show.imdb_id)
        )
        return { metas }
    }

    const myshowsList = await getUserShows(myshowsUsername)

    const myshowsShowsToExclude = myshowsList.filter(
        (show) =>
            show.watchStatus === 'finished' ||
            show.watchStatus === 'cancelled' ||
            show.watchStatus === 'watching'
    )

    const imdbIdsToExclude = (
        await getImdbIdsFromMyShows(myshowsShowsToExclude)
    ).ids

    const shows = listItems.shows.filter(
        (item) => !imdbIdsToExclude.includes(item.imdb_id.toString())
    )

    const metas = await getMetadata(
        'series',
        shows.map((show) => show.imdb_id)
    )

    return { metas }
}
