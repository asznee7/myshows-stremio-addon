import axios from 'axios'
import type { MetaDetail } from 'stremio-addon-sdk'

async function getMetadata(
    itemType: 'series' | 'movie',
    itemImdbIds: string[]
): Promise<MetaDetail[]> {
    const url = `https://v3-cinemeta.strem.io/catalog/${itemType}/last-videos/lastVideosIds=${itemImdbIds.join(',')}.json`
    const response = await axios.get(url)

    return response.data.metasDetailed
}

export default getMetadata
