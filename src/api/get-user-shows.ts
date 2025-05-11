import axios from 'axios'
import type { MyShowsUserShow } from '../types/myshows.js'

const BASE_URL = 'https://api.myshows.me/v3/rpc/'

const getUserShows = async (username: string): Promise<MyShowsUserShow[]> => {
    const response = await axios.post(BASE_URL, {
        jsonrpc: '2.0',
        id: 9,
        method: 'profile.Shows',
        params: { login: username },
    })
    return response.data.result
}

export default getUserShows
