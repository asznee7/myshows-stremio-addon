declare module 'name-to-imdb' {
    interface Info {
        match: 'imdbFind' | 'metadata'
        meta: {
            id: string
            name: string
            year: number
            type: 'series' | 'movie'
            yearRange: undefined
            image: {
                src: string
                width: number
                height: number
            }
            starring: string
            similarity: number
        }
    }
    export default function nameToImdb(
        options: {
            name: string
            year?: number
            type?: 'series' | 'movie'
        },
        callback: (err: Error | null, imdbId: string, info: Info) => void
    ): void
}
