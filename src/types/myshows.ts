/**
 * Entity type for a show returned from MyShows API
 */
export interface MyShowsUserShow {
    show: Show
    watchStatus: 'finished' | 'watching' | 'later' | 'cancelled'
    rating: number
    watchCount: number
    totalEpisodes: number
    watchedEpisodes: number
    runtime: number
    totalHours: number
    watchedHours: number
}

export interface Show {
    id: number
    title: string
    titleOriginal: string
    status: string
    totalSeasons: number
    genreIds: number[]
    year: number
    watching: number
    voted: number
    rating: number
    images: string[]
    image: string
    imageInfo: {
        width: number
        height: number
        previewUrl: string
        blurhash: string
    }
    onlineCount: number
    promoUrl: string
    category: 'show'
    canRate: boolean
}
