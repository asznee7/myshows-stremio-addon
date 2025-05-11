import axios from 'axios'
import type { MetaDetail } from 'stremio-addon-sdk'

const chunkSize = 100

/**
 * Get metadata from Cinemeta
 * @param itemType - The type of item to get metadata for ('series' or 'movie')
 * @param itemImdbIds - The IMDB IDs of the items to get metadata for
 */
export async function getMetadata(
    itemType: 'series' | 'movie',
    itemImdbIds: string[]
): Promise<MetaDetail[]> {
    const chunks = []

    // Split IDs into chunks of 100 as this is
    // the maximum number of IDs that can be passed to the API
    for (let i = 0; i < itemImdbIds.length; i += chunkSize) {
        chunks.push(itemImdbIds.slice(i, i + chunkSize))
    }

    const allMetadata: MetaDetail[] = []

    for (const chunk of chunks) {
        const url = `https://v3-cinemeta.strem.io/catalog/${itemType}/last-videos/lastVideosIds=${chunk.join(',')}.json`
        try {
            const response = await axios.get(url)
            allMetadata.push(...response.data.metasDetailed)
        } catch (error) {
            console.error('Error fetching metadata chunk:', error)
        }
    }

    return allMetadata
}
