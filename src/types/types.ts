export const ECatalogId = {
    MyShowsWatchList: 'MyShowsWatchList',
    MyShowsLaterList: 'MyShowsLaterList',
    MyShowsCompletedList: 'MyShowsCompletedList',
    MyShowsCancelledList: 'MyShowsCancelledList',
} as const

export type CatalogId = keyof typeof ECatalogId

declare module 'stremio-addon-sdk' {
    interface Args {
        config: {
            username: string
        } & {
            [K in CatalogId]?: 'on'
        }
    }
}
