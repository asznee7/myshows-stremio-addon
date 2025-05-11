/**
 * Entity type for a show returned from MyShows API
 */
export interface MyShowsUserShow {
    show: ShowDetails
    watchStatus: 'finished' | 'watching' | 'later' | 'cancelled'
    rating: number
    watchCount: number
    totalEpisodes: number
    watchedEpisodes: number
    runtime: number
    totalHours: number
    watchedHours: number
}

export interface ShowDetails {
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

export interface Show {
    id: number
    title: string
    titleOriginal: string
    description: string
    totalSeasons: number
    status: string
    country: string
    countryTitle: string
    started: string
    ended: string
    year: number
    kinopoiskId: number
    kinopoiskRating: number
    kinopoiskVoted: number
    kinopoiskUrl: string
    tvrageId: number
    imdbId: string
    imdbRating: number
    imdbVoted: number
    imdbUrl: string
    watching: number
    watchingTotal: number
    voted: number
    rating: number
    runtime: number
    runtimeTotal: string
    images: string[]
    image: string
    genreIds: number[]
    network: {
        id: number
        title: string
        country: string
    }
    episodes: null
    onlineLinks: string[]
    onlineLinkExclusive: null
}
