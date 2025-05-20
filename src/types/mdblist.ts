interface MdblistList {
    id: number
    user_id: number
    user_name: string
    name: string
    slug: string
    description: string
    mediatype: 'movie' | 'show'
    items: number
    likes: number
    dynamic: boolean
    private: boolean
}

interface MdblistListItem {
    id: number
    rank: number
    adult: number
    title: string
    imdb_id: string
    tvdb_id: number | null
    language: string
    mediatype: 'movie' | 'show'
    release_year: number
    spoken_language: string
}
