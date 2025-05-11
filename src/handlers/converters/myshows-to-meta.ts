import nameToImdb from 'name-to-imdb'
import { promisify } from 'util'
import type { MetaDetail } from 'stremio-addon-sdk'
import translit from 'translit'
import translitRussianMap from 'translit-russian'

import { getShowsByIds } from '../../api/get-user-shows.js'
import { getMetadata } from '../../api/get-metadata.js'
import type { MyShowsUserShow, Show } from '../../types/myshows.js'

const nameToImdbAsync = promisify(nameToImdb)
const cyrillicRegex = /[\u0400-\u04FF]/u
const imdbIdInUrlRegex = /tt\d+/u

/**
 * Convert MyShows entities to Stremio metadata
 * @param myShowsEntities - The MyShows entities to convert
 */
export async function convertMyShowsToStremioMetadata(
    myShowsEntities: MyShowsUserShow[]
): Promise<MetaDetail[]> {
    // Try to get IMDB IDs from MyShows
    const { ids: idsFromMyShows, showsWithNoIds } =
        await getImdbIdsFromMyShows(myShowsEntities)

    // Try to get IMDB IDs from IMDB search
    const { ids: idsFromImdbSearch, notFoundShows } =
        await resolveImdbIdsByName(showsWithNoIds)

    // Get metadata from Cinemeta
    const metas = await getMetadata('series', [
        ...idsFromMyShows,
        ...idsFromImdbSearch,
    ])

    // Last resort - get partial metadata from original MyShows entities
    const myshowsMetas: MetaDetail[] = notFoundShows.map((show) => ({
        id: String(show.show.id),
        type: 'series',
        name: show.show.titleOriginal,
        poster: show.show.image,
    }))

    return [...metas, ...myshowsMetas]
}

async function getImdbIdsFromMyShows(
    myShowsEntities: MyShowsUserShow[]
): Promise<{
    ids: string[]
    showsWithNoIds: MyShowsUserShow[]
}> {
    const showsWithNoIds: MyShowsUserShow[] = []
    const myshowIds = myShowsEntities.map((entity) => entity.show.id)
    const parsedFromMyShowsImdbIds = (await getShowsByIds(myshowIds)).reduce(
        (acc, show) => {
            const imdbId = getImdbIdFromShow(show)
            console.log(imdbId, show.titleOriginal)
            if (!imdbId) {
                const showWithNoImdbId = myShowsEntities.find(
                    (entity) => entity.show.id === show.id
                )
                if (showWithNoImdbId) {
                    showsWithNoIds.push(showWithNoImdbId)
                }
                return acc
            }
            acc.push(imdbId)
            return acc
        },
        [] as string[]
    )

    return {
        ids: parsedFromMyShowsImdbIds,
        showsWithNoIds,
    }
}

async function resolveImdbIdsByName(shows: MyShowsUserShow[]): Promise<{
    ids: string[]
    notFoundShows: MyShowsUserShow[]
}> {
    const notFoundShows: MyShowsUserShow[] = []
    const ids = (
        await Promise.allSettled(
            shows.map(async (entity) => {
                const title = getEnglishTitle(entity.show.titleOriginal)
                return nameToImdbAsync({
                    name: title,
                    year: entity.show.year,
                    type: 'series',
                }).catch(() => {
                    console.log(`Failed to get IMDB ID for: ${title}`)
                    notFoundShows.push(entity)
                })
            })
        )
    ).reduce((acc, result) => {
        if (result.status === 'fulfilled' && result.value) {
            acc.push(result.value)
        }

        return acc
    }, [] as string[])

    return {
        ids,
        notFoundShows,
    }
}

function getEnglishTitle(title: string): string {
    return title.match(cyrillicRegex)
        ? translit(translitRussianMap)(title)
        : title
}

function getImdbIdFromShow(show: Show): string | null {
    const match = show.imdbUrl.match(imdbIdInUrlRegex)
    return match ? match[0] : show.imdbId ? `tt${show.imdbId}` : null
}
