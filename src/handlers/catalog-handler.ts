import nameToImdb from 'name-to-imdb'
import { promisify } from 'util'
import type { Args, MetaDetail } from 'stremio-addon-sdk'

import getUserShows from '../api/get-user-shows.js'
import getMetadata from '../api/get-metadata.js'
import { ECatalogId } from '../types/types.js'
import type { MyShowsUserShow } from '../types/myshows.js'

async function catalogHandler(args: Args): Promise<{ metas: MetaDetail[] }> {
    const { type, id, extra } = args

    if (type !== 'series') {
        throw new Error('Only series are supported')
    }

    const username = args.config.username

    if (!username) {
        throw new Error('Username is required')
    }

    const userShows = await getUserShows(username)
    const filteredUserShows = userShows.filter((show) => {
        if (!extra.search) return true

        return show.show.titleOriginal
            .toLowerCase()
            .includes(extra.search.toLowerCase())
    })
    const watchStatus = getWatchStatusByCatalogId(id)
    const metas = await convertToMeta(
        filteredUserShows.filter((show) => show.watchStatus === watchStatus)
    )

    return {
        metas,
    }
}

function getWatchStatusByCatalogId(
    catalogId: string
): MyShowsUserShow['watchStatus'] {
    switch (catalogId) {
        case ECatalogId.MyShowsWatchList:
            return 'watching'
        case ECatalogId.MyShowsCompletedList:
            return 'finished'
        case ECatalogId.MyShowsLaterList:
            return 'later'
        case ECatalogId.MyShowsCancelledList:
            return 'cancelled'
        default:
            throw new Error(`Unknown catalog ID: ${catalogId}`)
    }
}

const nameToImdbAsync = promisify(nameToImdb)

async function convertToMeta(
    myShowsEntities: MyShowsUserShow[]
): Promise<MetaDetail[]> {
    const notFoundOnImdbShows: MyShowsUserShow[] = []
    const results = await Promise.allSettled(
        myShowsEntities.map((entity) => {
            return nameToImdbAsync({
                name: entity.show.titleOriginal,
                year: entity.show.year,
                type: 'series',
            }).catch(() => {
                console.log(
                    `Failed to get IMDB ID for: ${entity.show.titleOriginal}`
                )
                notFoundOnImdbShows.push(entity)
            })
        })
    )

    const imdbIds = results.reduce((acc, result) => {
        if (result.status === 'fulfilled' && result.value) {
            acc.push(result.value)
        }

        return acc
    }, [] as string[])

    if (imdbIds.length === 0) {
        return myShowsEntities.map(myShowsEntityToMeta)
    }

    const metas = await getMetadata('series', imdbIds)
    const myshowsMetas = notFoundOnImdbShows.map(myShowsEntityToMeta)

    return [...metas, ...myshowsMetas]
}

function myShowsEntityToMeta(entity: MyShowsUserShow): MetaDetail {
    return {
        id: String(entity.show.id),
        type: 'series',
        name: entity.show.titleOriginal,
        poster: entity.show.image,
    }
}

export default catalogHandler
