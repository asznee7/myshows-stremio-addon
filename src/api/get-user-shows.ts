import axios from 'axios'
import NodeCache from 'node-cache'

import type { MyShowsUserShow, Show } from '../types/myshows.js'

const BASE_URL = 'https://api.myshows.me/v3/rpc/'

// Cache for storing show data with 1 hour TTL
const showsCache = new NodeCache({ stdTTL: 3600 })

/**
 * Get user shows from MyShows
 * @param username - The username of the user to get shows for
 */
export const getUserShows = async (
    username: string
): Promise<MyShowsUserShow[]> => {
    const response = await axios.post(BASE_URL, {
        jsonrpc: '2.0',
        id: 9,
        method: 'profile.Shows',
        params: { login: username },
    })
    return response.data.result
}

/**
 * Get shows by their IDs from MyShows
 * @param ids - The IDs of the shows to get
 */
export const getShowsByIds = async (ids: number[]): Promise<Show[]> => {
    const chunkSize = 10
    const chunks = []

    const uncachedIds = ids.filter((id) => !showsCache.has(id))
    const cachedShows = ids
        .filter((id) => showsCache.has(id))
        .map((id) => showsCache.get(id) as Show)

    if (uncachedIds.length === 0) {
        return cachedShows
    }

    // Split IDs into chunks of 10
    for (let i = 0; i < uncachedIds.length; i += chunkSize) {
        chunks.push(uncachedIds.slice(i, i + chunkSize))
    }

    const allShows: Show[] = [...cachedShows]

    // Process each chunk sequentially
    for (const chunk of chunks) {
        const request = chunk.map((id, index) => ({
            jsonrpc: '2.0',
            id: index,
            method: 'shows.GetById',
            params: { showId: id, withEpisodes: false },
        }))

        try {
            const response = await axios.post(BASE_URL, request)
            const shows = response.data.map(
                (response: { result: Show }) => response.result
            )

            shows.forEach((show: Show) => {
                showsCache.set(show.id, show)
            })

            allShows.push(...shows)
        } catch (error) {
            console.error('Error fetching shows chunk:', error)
        }
    }

    return allShows
}
