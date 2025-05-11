import type { Args, MetaDetail } from 'stremio-addon-sdk'

import { getUserShows } from '../api/get-user-shows.js'
import { ECatalogId } from '../types/types.js'
import type { MyShowsUserShow } from '../types/myshows.js'
import { convertMyShowsToStremioMetadata } from './converters/myshows-to-meta.js'

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
    const metas = await convertMyShowsToStremioMetadata(
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

export default catalogHandler
