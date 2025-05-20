import axios from 'axios'

const BASE_URL = 'https://api.mdblist.com'

/**
 * Get items from an mdblist list
 * @param listId - The mdblist list ID or slug
 * @param apiKey - Your mdblist API key
 * @param limit - Max number of items to fetch (default 100)
 */
export const getMdblistListItems = async (
    listId: string,
    apiKey: string,
    limit: number = 100,
    offset: number = 0
): Promise<{
    movies: MdblistListItem[]
    shows: MdblistListItem[]
}> => {
    const response = await axios.get(`${BASE_URL}/lists/${listId}/items`, {
        params: {
            limit,
            offset,
            apikey: apiKey,
        },
    })
    return response.data
}

/**
 * Get a list from mdblist
 * @param listId - The mdblist list ID
 * @param apiKey - Your mdblist API key
 */
export const getMdblistList = async (
    listId: string,
    apiKey: string
): Promise<MdblistList[]> => {
    const response = await axios.get(`${BASE_URL}/lists/${listId}`, {
        params: {
            apikey: apiKey,
        },
    })
    return response.data
}
