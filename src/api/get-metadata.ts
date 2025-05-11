import axios from 'axios'
import type { MetaDetail } from 'stremio-addon-sdk'

/**
 * Get metadata from Cinemeta
 * @param itemType - The type of item to get metadata for ('series' or 'movie')
 * @param itemImdbIds - The IMDB IDs of the items to get metadata for
 */
export async function getMetadata(
    itemType: 'series' | 'movie',
    itemImdbIds: string[]
): Promise<MetaDetail[]> {
    const url = `https://v3-cinemeta.strem.io/catalog/${itemType}/last-videos/lastVideosIds=${itemImdbIds.join(',')}.json`
    const response = await axios.get(url)

    return response.data.metasDetailed
}
